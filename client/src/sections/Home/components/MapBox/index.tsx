﻿import React, { useEffect, useRef, useState, useMemo } from "react";
import ReactDOM from "react-dom"
import { useHistory } from "react-router-dom";
import debounce from 'lodash.debounce';
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapFilters from "sections/Home/components/MapBox/Sidebar/Filters";
import Results from "sections/Home/components/MapBox/Sidebar/Results";
import Sidebar from "sections/Home/components/MapBox/Sidebar";
import BoundsFilter from "sections/Home/components/MapBox/Sidebar/Filters/BoundsFilter";
import MapboxPopup from "sections/Home/components/MapBox/Popup";
import { getListingIds, getListings } from "lib/api/map";
import drops from "sections/Home/components/MapBox/layers/drops";
import highlight from "sections/Home/components/MapBox/layers/highlight";
import { renderAreaRadius } from "sections/Home/components/MapBox/layers/area";
import { transformFilters } from "lib/utils/map";
import { geocode } from "lib/api/map";

// eslint-disable-next-line import/no-webpack-loader-syntax
(mapboxgl as any).workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

interface Props {
  type: "main" | "item" | "items" | "marker";
  markerPos?: Pick<mapboxgl.LngLat, "lng" | "lat"> | null;
  itemsFilter?: Map.ItemsFilter; 
  onMarkerPosChange?: (pos: mapboxgl.LngLat) => void;
}

const MapboxMap: React.FC<Props> = ({ type, markerPos, itemsFilter, onMarkerPosChange }) => {
  const history = useHistory();
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [styleLoaded, setStyleLoaded] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>();
  const [activeIds, setActiveIds] = useState<number[] | null>(null);
  const [results, setResults] = useState<Map.MapListing[] | null>(null);
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);
  const [filterBounds, setFilterBounds] = useState(false);
  const activeItemRef = useRef(activeItem);
  const filtersRef = useRef<Map.Filter | null>();
  const filterBoundsRef = useRef(false);
  const mapNode = useRef<HTMLDivElement>(null);

  useEffect(() => { activeItemRef.current = activeItem }, [activeItem]);
  useEffect(() => { filterBoundsRef.current = filterBounds }, [filterBounds]);

  const onFiltersChange = useMemo(() => (
    debounce(async (filters: Map.Filter) => {
      if (map) {
        filtersRef.current = { ...filtersRef.current, ...filters };
        renderAreaRadius(map, filters.center, filters.radius);
        const f = transformFilters(filtersRef.current, filterBoundsRef.current);
        const ids = await getListingIds(f);
        setActiveIds(ids);
        const results = await getListings(f);
        setResults(results);
      }
    }, 200)
  ), [map]);

  useEffect(() => {
    if (!map || !itemsFilter || type !== "items") return;
    const { country, city } = itemsFilter;
    onFiltersChange({ country, city });
  }, [map, itemsFilter, onFiltersChange]); // eslint-disable-line

  useEffect(() => {
    if (filtersRef.current) {
      onFiltersChange(filtersRef.current);
    }
  }, [onFiltersChange, filterBounds]);

  useEffect(() => {
    if (map && styleLoaded && (type === "main" || type === "items")) {
      const layer = { source: highlight.sourceId, sourceLayer: 'provider' };
      map.removeFeatureState(layer);
      if (activeIds) {
        map.setLayoutProperty(drops.id, "visibility", "visible");
        map.setLayoutProperty(highlight.id, "visibility", "visible");
        activeIds.forEach(id => map.setFeatureState({ ...layer, id }, { filtered: true }));
        if (type === "items") {
          const filters = activeIds.map(id => ['==', ['id'], id]);
          map.setFilter(drops.id, ['any', ...filters]);
        }
      } else if (type === 'items') {
        map.setLayoutProperty(drops.id, "visibility", "none");
        map.setLayoutProperty(highlight.id, "visibility", "none");
      }
      (async () => {
        if (type === "items" && filtersRef.current) {
          const { country, city } = filtersRef.current;
          if (country || city) {
            const address = `${city ? city + ', ' : ''}${country}`;
            const g = await geocode(address);
            const result = g.results[0];
            if (result) {
              const b = result.geometry.viewport;
              const bounds = [b.southwest.lng, b.southwest.lat, b.northeast.lng, b.northeast.lat];
              map.fitBounds(bounds as any);
            }
          }
        }
      })();
    }
  }, [map, styleLoaded, activeIds]); // eslint-disable-line

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
      if (["marker", "item"].includes(type) && markerPos) {
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

    mapboxMap.addControl(new mapboxgl.NavigationControl(), "bottom-right");
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
      const marker = new mapboxgl.Marker({ draggable: type === 'marker', color: "#40a9ff" })

      if (type === "main" || type === "items") {

        const mapMoveHandler = () => {
          filtersRef.current = { ...filtersRef.current, bounds: map.getBounds() as any };
          if (filterBoundsRef.current) {
            onFiltersChange(filtersRef.current);
          }
        }

        map.addSource(drops.sourceId, drops.source);
        map.addSource(highlight.sourceId, highlight.source);
        map.addLayer(highlight.layer);
        map.addLayer(drops.layer);

        map.on("mouseenter", "drops-layer", e => {
          const feature = e.features && e.features[0];
          if (feature) {
            const coords = (feature.geometry as any).coordinates;
            const props = (feature.properties || {}) as Map.DropsLayerProperties;
            const popupNode = document.createElement("div");
            ReactDOM.render(<MapboxPopup properties={props}/>, popupNode);
            popup.setLngLat(coords).setDOMContent(popupNode).addTo(map);
            map.setFeatureState({ source: drops.sourceId, sourceLayer: "provider", id: feature.id }, { hovered: true });
            map.getCanvas().style.cursor = "pointer";
            setActiveItem(props.object_id);
          }
        });
  
        map.on("mouseleave", "drops-layer", () => {
          setActiveItem(null);
          popup.remove();
          map.removeFeatureState({ source: drops.sourceId, sourceLayer: "provider" });
          map.getCanvas().style.cursor = "";
        });
  
        map.on("click", "drops-layer", () => {
          if(activeItemRef.current) {
            history.push(`/listing/${activeItemRef.current}`);
          }
        });

        if (type === "main") {
          map.on("zoomend", mapMoveHandler);
          map.on('moveend', mapMoveHandler);
        }

      }

      if (["marker", "item"].includes(type)) {
        setMarker(marker);
        marker.on("dragend", () => onMarkerPosChange && onMarkerPosChange(marker.getLngLat()));
        if (markerPos) {
          marker.setLngLat(markerPos);
          marker.addTo(map);
        }
      }
      
      setStyleLoaded(true);
    });
  }, [map, history]); // eslint-disable-line

  return (
    <div className="map-container">
      <div ref={mapNode} className="map" />
      {type === "main" && (
        <>
          <Sidebar
            filters={<MapFilters map={map} onChange={onFiltersChange} filterBounds={filterBounds} />}
            results={<Results map={map} results={results} />}
          />
          <BoundsFilter filterBoundsState={[filterBounds, setFilterBounds]} />
        </>
      )}
    </div>
  );
}

export default MapboxMap;
