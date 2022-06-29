﻿import React, { useEffect, useRef, useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import debounce from 'lodash.debounce';
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapFilters from "./Filters";
import Sidebar from "./Sidebar";
import data from "./data";
import { getListingIds } from "lib/utils/map";

// eslint-disable-next-line import/no-webpack-loader-syntax
(mapboxgl as any).workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

interface Props {
  type: "main" | "item" | "marker";
  data?: typeof data;
  markerPos?: Pick<mapboxgl.LngLat, "lng" | "lat"> | null;
  onMarkerPosChange?: (pos: mapboxgl.LngLat) => void;
}

const MapboxMap: React.FC<Props> = ({ type, data, markerPos, onMarkerPosChange }) => {
  const history = useHistory();
  const [map, setMap] = useState<mapboxgl.Map>();
  const [styleLoaded, setStyleLoaded] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>();
  const [activeIds, setActiveIds] = useState<number[]>([]);
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);
  const activeItemRef = useRef(activeItem);
  const mapNode = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (map && styleLoaded && type === "main") {
      const layer = { source: 'drops-source-highlight', sourceLayer: 'provider' };
      map.removeFeatureState(layer);
      activeIds.forEach(id => map.setFeatureState({ ...layer, id }, { filtered: true }));
    }
  }, [map, styleLoaded, activeIds]);

  const onFiltersChange = useMemo(() => (
    debounce(async (filters: Map.Filter) => {
      const ids = await getListingIds(filters);
      setActiveIds(ids);
    }, 200)
  ), []);

  useEffect(() => { activeItemRef.current = activeItem }, [activeItem]);

  useEffect(() => {
    if (map && marker) {
      const pos = marker.getLngLat();
      if (JSON.stringify(pos) !== JSON.stringify(markerPos)) {
        if (markerPos) {
          marker.setLngLat(markerPos);
          marker.addTo(map);
          map.flyTo({ center: markerPos });
        } else {
          marker.remove();
        }
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
      minZoom: 2,
      zoom: 3.6,
      center,
    });

    mapboxMap.addControl(new mapboxgl.NavigationControl());
    setMap(mapboxMap);
    (window as any).map = mapboxMap;

    return () => {
      mapboxMap.remove();
    };
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!map) return;
    
    map.on("style.load", () => {

      const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, maxWidth: "300px" });
      const marker = new mapboxgl.Marker({ draggable: true }).setLngLat(markerPos ? markerPos : [0, 0]);

      if (type === "main") {

        map.addSource("drops-source", {
          type: "vector",
          tiles: [`/map/tile/{z}/{x}/{y}?fields=object_id,image,title,country,state,city,address,capacity,type`]
        });

        map.addSource("drops-source-highlight", {
          type: "vector",
          tiles: [`/map/tile/{z}/{x}/{y}`]
        });

        map.addLayer({
          "id": "drops-layer-highlight",
          "type": "circle",
          "source": "drops-source-highlight",
          "source-layer": "provider",
          "paint": {
            "circle-radius": ["interpolate", ["linear"], ["zoom"], 1, 12, 16, 40],
            "circle-color": "blue",
            "circle-opacity": [
              "case",
              ["boolean", ["feature-state", "filtered"], false], 0.1, 0
            ]
          },
        });

        map.addLayer({
          "id": "drops-layer",
          "type": "circle",
          "source": "drops-source",
          "source-layer": "provider",
          "paint": {
            "circle-stroke-width": 2,
            "circle-stroke-color": "#fff",
            "circle-radius": ["interpolate", ["linear"], ["zoom"], 1, 5, 16, 20],
            "circle-opacity": ["interpolate", ["linear"], ["zoom"], 1, 0.7, 16, 1],
            "circle-color": [
              "case",
              ["boolean", ["feature-state", "hovered"], false], "green", "blue"
            ]
          },
        });

        map.on("mouseenter", "drops-layer", e => {
          const feature = e.features && e.features[0];
          if (feature) {
            const coords = (feature.geometry as any).coordinates;
            const props = feature.properties || {};
  
            const description = Object.keys(props).filter(p => p !== "object_id").reduce((acc, key) => {
              if (key === "image") {
                acc += `<div><image src=${props[key]}></div>`;
              } else {
                acc += `<div><strong>${key}</strong>: ${props[key]}</div>`;
              }
              return acc;
            }, "");
  
            setActiveItem(props.object_id);
            popup.setLngLat(coords).setHTML(description).addTo(map);
            map.setFeatureState({ source: "drops-source", sourceLayer: "provider", id: feature.id }, { hovered: true });
            map.getCanvas().style.cursor = "pointer";
          }
        });
  
        map.on("mouseleave", "drops-layer", () => {
          setActiveItem(null);
          popup.remove();
          map.removeFeatureState({ source: "drops-source", sourceLayer: "provider" });
          map.getCanvas().style.cursor = "";
        });
  
        map.on("click", "drops-layer", () => {
          if(activeItemRef.current) {
            history.push(`/listing/${activeItemRef.current}`);
          }
        });

      }

      if (type === "marker") {
        setMarker(marker);
        marker.addTo(map);
        marker.on("dragend", () => onMarkerPosChange && onMarkerPosChange(marker.getLngLat()));
      }
      
      setStyleLoaded(true);
    });
  }, [map, history]); // eslint-disable-line

  return (
    <div className="map-container">
      <div ref={mapNode} className="map" />
      {type === "main" && (
        <Sidebar>
          <MapFilters onChange={onFiltersChange} />
        </Sidebar>
      )}
    </div>
  );
}


export default MapboxMap;
