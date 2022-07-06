import React, { useEffect, useRef, useState, useMemo } from "react";
import ReactDOM from "react-dom"
import { useHistory } from "react-router-dom";
import debounce from 'lodash.debounce';
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapFilters from "./Filters";
import Results from "./Results";
import Sidebar from "./Sidebar";
import BoundsFilter from "./BoundsFilter";
import MapboxPopup from "./Popup";
import { getListingIds, getListings } from "lib/api/map";
import drops from "sections/Home/components/MapBox/layers/drops";
import highlight from "sections/Home/components/MapBox/layers/highlight";

// eslint-disable-next-line import/no-webpack-loader-syntax
(mapboxgl as any).workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

interface Props {
  type: "main" | "item" | "marker";
  markerPos?: Pick<mapboxgl.LngLat, "lng" | "lat"> | null;
  onMarkerPosChange?: (pos: mapboxgl.LngLat) => void;
}

const MapboxMap: React.FC<Props> = ({ type, markerPos, onMarkerPosChange }) => {
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
      const b = filtersRef.current && filtersRef.current.bounds ? filtersRef.current.bounds : null;
      const bounds = b && filterBoundsRef.current ? b : null;
      const ids = await getListingIds({ ...filters, bounds });
      setActiveIds(ids);
      const results = await getListings({ ...filters, bounds });
      setResults(results)
      filtersRef.current = { ...filtersRef.current, ...filters };
    }, 200)
  ), []);

  useEffect(() => {
    if (filtersRef.current) {
      onFiltersChange(filtersRef.current);
    }
  }, [onFiltersChange, filterBounds]);

  useEffect(() => {
    if (map && styleLoaded && type === "main") {
      const layer = { source: highlight.sourceId, sourceLayer: 'provider' };
      map.removeFeatureState(layer);
      if (activeIds) activeIds.forEach(id => map.setFeatureState({ ...layer, id }, { filtered: true }));
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
      const marker = new mapboxgl.Marker({ draggable: type === 'marker', color: "#40a9ff" }).setLngLat(markerPos ? markerPos : [0, 0]);

      if (type === "main") {

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

        map.on("zoomend", mapMoveHandler);
        map.on('moveend', mapMoveHandler);

      }

      if (["marker", "item"].includes(type)) {
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
        <>
          <Sidebar
            filters={<MapFilters onChange={onFiltersChange} />}
            results={<Results map={map} results={results} />}
          />
          <BoundsFilter filterBoundsState={[filterBounds, setFilterBounds]} />
        </>
      )}
    </div>
  );
}

export default MapboxMap;
