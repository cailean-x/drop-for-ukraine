import React, { useEffect, useRef } from "react";
import { useHistory } from 'react-router-dom';
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import data from './data';

const MapboxMap = () => {
  const history = useHistory();
  const [map, setMap] = React.useState<mapboxgl.Map>();
  const [activeItem, setActiveItem] = React.useState<string | null>();
  const activeItemRef = useRef(activeItem);
  const mapNode = React.useRef<HTMLDivElement>(null);

  useEffect(() => { activeItemRef.current = activeItem }, [activeItem]);

  useEffect(() => {
    if (!mapNode.current) return;

    const mapboxMap = new mapboxgl.Map({
      container: mapNode.current,
      accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
      style: "mapbox://styles/mapbox/light-v10",
      center: [14.10, 48.31],
      zoom: 3.6,
    });

    mapboxMap.addControl(new mapboxgl.NavigationControl());
    setMap(mapboxMap);

    return () => {
      mapboxMap.remove();
    };
  }, []);

  useEffect(() => {
    if (!map) return;
    
    map.on("style.load", () => {

      const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, maxWidth: '300px' });

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
            "properties": ['_id', 'image', 'title', 'country', 'admin', 'city', 'address', 'price', 'type']
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
      
    });
  }, [map, history]);

  return (
    <div className="map-wrapper">
      <div ref={mapNode} className="map" />
    </div>
  );
}

export default MapboxMap;
