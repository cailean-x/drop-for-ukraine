import React, { useEffect, useRef, useState } from "react";
import { Card, Button, Popover } from 'antd';
import { useHistory } from 'react-router-dom';
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapFilters, { Filters } from './MapFilters';
import data from './data';

// eslint-disable-next-line import/no-webpack-loader-syntax
(mapboxgl as any).workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

interface Props {
  type: 'main' | 'item' | 'marker';
  data?: typeof data;
  markerPos?: mapboxgl.LngLatLike | null;
  onMarkerPosChange?: (pos: mapboxgl.LngLat) => void;
}

const MapboxMap: React.FC<Props> = ({ type, data, markerPos, onMarkerPosChange }) => {
  const history = useHistory();
  const [map, setMap] = useState<mapboxgl.Map>();
  const [activeItem, setActiveItem] = useState<string | null>();
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState('0');
  const [visible, setVisible] = useState(false);
  const activeItemRef = useRef(activeItem);
  const mapNode = useRef<HTMLDivElement>(null);
  const sidebarNode = useRef<HTMLDivElement>(null);

  const onFiltersChange = (filters: Filters) => {
    if (type === 'main' && map) {
      const a = filters.country ? ['==', ['get', 'country'], filters.country] : null;
      const b = filters.type ? ['==', ['get', 'type'], filters.type] : null;
      const c = ['>=', ['get', 'capacity'], filters.capacity[0]];
      const d = ['<=', ['get', 'capacity'], filters.capacity[1]];
      const e = ['all', c, d];
      const f = ['all', a, b, e].filter(Boolean);
      map.setFilter('drops-layer', f);
    }
  }

  useEffect(() => { activeItemRef.current = activeItem }, [activeItem]);

  useEffect(() => {
    if (!sidebarNode.current) return;
    const handler = () => {
      setSidebarWidth(getComputedStyle(sidebarNode.current!).width!);
    }
    handler();
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('resize', handler);
    }
  }, []);

  useEffect(() => {
    if (map && marker && markerPos) {
      const pos = marker.getLngLat();
      if (JSON.stringify(pos) !== JSON.stringify(markerPos)) {
        marker.setLngLat(markerPos);
        map.flyTo({ center: markerPos });
      }
    }
  }, [map, markerPos]); // eslint-disable-line

  useEffect(() => {
    if (!mapNode.current) return;

    const center = (() => {
      if (type === "item" && data && data[0]) {
        return [data[0].geometry.lng, data[0].geometry.lat] as mapboxgl.LngLatLike;
      }
      if (type === "marker" && markerPos) {
        return markerPos;
      }
      return [14.10, 48.31] as mapboxgl.LngLatLike;
    })();

    const mapboxMap = new mapboxgl.Map({
      container: mapNode.current,
      accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
      style: "mapbox://styles/mapbox/light-v10",
      zoom: 3.6,
      center,
    });

    mapboxMap.addControl(new mapboxgl.NavigationControl());
    setMap(mapboxMap);

    return () => {
      mapboxMap.remove();
    };
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!map) return;
    
    map.on("style.load", () => {

      const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, maxWidth: '300px' });
      const marker = new mapboxgl.Marker({ draggable: true }).setLngLat(markerPos ? markerPos : [0, 0]);

      if (data && data.length) {
        map.addSource('drops-source', {
          'type': 'geojson',
          'data': {
            type: 'FeatureCollection',
            'features': data.map(d => ({
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": [d.geometry.lng, d.geometry.lat],
              },
              "properties": ['_id', 'image', 'title', 'country', 'admin', 'city', 'address', 'capacity', 'type']
                .reduce((acc, item) => {
                  acc[item] = (d as any)[item];
                  return acc;
                }, {} as any),
            })),
          }
        });
        
        map.addLayer({
          'id': 'drops-layer',
          'type': 'circle',
          'source': 'drops-source',
          'paint': {
            'circle-radius': 8,
            'circle-stroke-width': 2,
            'circle-color': 'blue',
            'circle-stroke-color': 'white'
          }
        });
      }

      if (type === 'marker') {
        setMarker(marker);
        marker.addTo(map);
        marker.on('dragend', () => onMarkerPosChange && onMarkerPosChange(marker.getLngLat()));
      }

      if (type === 'main') {
        map.on('mouseenter', 'drops-layer', e => {
          const feature = e.features && e.features[0];
          if (feature) {
            const coords = (feature.geometry as any).coordinates;
            const props = feature.properties || {};
  
            const description = Object.keys(props).filter(p => p !== '_id').reduce((acc, key) => {
              if (key === 'image') {
                acc += `<div><image src=${props[key]}></div>`;
              } else {
                acc += `<div><strong>${key}</strong>: ${props[key]}</div>`;
              }
              return acc;
            }, '');
  
            setActiveItem(props._id);
            popup.setLngLat(coords).setHTML(description).addTo(map);
            map.getCanvas().style.cursor = 'pointer';
          }
        });
  
        map.on('mouseleave', 'drops-layer', () => {
          setActiveItem(null);
          popup.remove();
          map.getCanvas().style.cursor = '';
        });
  
        map.on('click', 'drops-layer', () => {
          if(activeItemRef.current) {
            history.push(`/listing/${activeItemRef.current}`);
          }
        });
      }
      
    });
  }, [map, history]); // eslint-disable-line

  return (
    <div className="map-container">
      <div ref={mapNode} className="map" />
      {type === 'main' && (
        <>
          <div className="map-filters-open">
          <Popover content={<span>Show filters</span>} placement="right">
            <Button type="default" icon="filter" onClick={() => setVisible(true)}></Button>
          </Popover>
          </div>
          <div
            ref={sidebarNode}
            className="map-filters"
            style={{ left: visible ? '0' : '-' + sidebarWidth }}
          >
            <Card 
              title="Filters"
              className="map-filters-inner"
              bordered={false}
              extra={
                <Button type="default" icon="close" onClick={() => setVisible(false)}></Button>
              }
            >
              <MapFilters
                onChange={onFiltersChange}
                countries={[''].concat(Array.from(new Set([...data!.map(i => i.country)])))}
                types={[''].concat(Array.from(new Set([...data!.map(i => i.type)])))}
                capacity={{
                  min: Math.min(...Array.from(new Set([...data!.map(r => r.capacity)]))),
                  max: Math.max(...Array.from(new Set([...data!.map(r => r.capacity)]))),
                }}
              />
            </Card>
          </div>
        </>
      )}
    </div>
  );
}


export default MapboxMap;
