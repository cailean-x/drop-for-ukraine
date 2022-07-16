import React, { useEffect, useRef, useState, useMemo } from "react";
import ReactDOM from "react-dom"
import { useHistory } from "react-router-dom";
import debounce from 'lodash.debounce';
import mapboxgl from "mapbox-gl";
import styled, { createGlobalStyle } from "styled-components";
import MapFilters from "sections/Home/components/MapBox/Sidebar/Filters";
import Results from "sections/Home/components/MapBox/Sidebar/Results";
import Sidebar from "sections/Home/components/MapBox/Sidebar";
import BoundsFilter from "sections/Home/components/MapBox/Sidebar/Filters/BoundsFilter";
import MapControls from "sections/Home/components/MapBox/Controls";
import MapboxPopup from "sections/Home/components/MapBox/Popup";
import Marker from "sections/Home/components/MapBox/Marker";
import { drops, dropsPoint } from "sections/Home/components/MapBox/layers/drops";
import { highlight, highlightPoint } from "sections/Home/components/MapBox/layers/highlight";
import { hover, hoverPoint } from "sections/Home/components/MapBox/layers/hover";
import { renderAreaRadius } from "sections/Home/components/MapBox/layers/area";
import { transformFilters, loadImage } from "lib/utils/map";
import { getListingIds, getListings } from "lib/api/map";
import { geocode } from "lib/api/map";
import "mapbox-gl/dist/mapbox-gl.css";
import MarkerPointBluetIcon from "sections/Home/components/MapBox/icons/marker_point_blue.svg";
import MarkerPointYellowtIcon from "sections/Home/components/MapBox/icons/marker_point_yellow.svg";
import MarkerPointGreentIcon from "sections/Home/components/MapBox/icons/marker_point_green.svg";
import MarkerBluetIcon from "sections/Home/components/MapBox/icons/marker_blue.svg";
import MarkerYellowtIcon from "sections/Home/components/MapBox/icons/marker_yellow.svg";
import MarkerGreentIcon from "sections/Home/components/MapBox/icons/marker_green.svg";


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
      const layer = { source: drops.sourceId!, sourceLayer: 'provider' };
      map.removeFeatureState(layer);
      const filter = (activeIds || []).map(id => ['==', ['id'], id]);
      const negativeFilter = (activeIds || []).map(id => ['!=', ['id'], id]);

      [drops.id, dropsPoint.id].forEach(id => map.setFilter(id, type === "items" ? false : ['all', ...negativeFilter]));
      [hover.id, hoverPoint.id].forEach(id => map.setFilter(id, type === "items" ? ['any', ...filter] : true));
      [highlight.id, highlightPoint.id].forEach(id => map.setFilter(id, ['any', ...filter]));

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
              map.fitBounds(bounds as any, { duration: 0 });
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
      style: "mapbox://styles/mokiienko/cl4pb8ays000i14sim6vj5zkd/draft",
      minZoom: 2,
      maxZoom: 22,
      projection: { name: "mercator" },
      zoom: 3.6,
      center,
    });

    setMap(mapboxMap);
    (window as any).map = mapboxMap;

    return () => {
      mapboxMap.remove();
    };
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!map) return;
    
    map.on("style.load", async () => {  

      const markerNode = document.createElement("div");
      ReactDOM.render(<Marker />, markerNode);
      const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, maxWidth: "300px" });
      const marker = new mapboxgl.Marker(markerNode, { draggable: type === 'marker', color: "#40a9ff" })
      const layers = ["drops-layer", "drops-highlight-layer"];
      const pointLayers = ["drops-point-layer", "drops-highlight-point-layer"];

      await loadImage(map, "marker-point-blue", MarkerPointBluetIcon);
      await loadImage(map, "marker-point-yellow", MarkerPointYellowtIcon);
      await loadImage(map, "marker-point-green", MarkerPointGreentIcon);
      await loadImage(map, "marker-blue", MarkerBluetIcon);
      await loadImage(map, "marker-yellow", MarkerYellowtIcon);
      await loadImage(map, "marker-green", MarkerGreentIcon);

      if (type === "main" || type === "items") {

        const mapMoveHandler = () => {
          filtersRef.current = { ...filtersRef.current, bounds: map.getBounds() as any };
          if (filterBoundsRef.current) {
            onFiltersChange(filtersRef.current);
          }
        }

        map.addSource(drops.sourceId!, drops.source!);
        map.addLayer(highlight.layer);
        map.addLayer(drops.layer);
        map.addLayer(hover.layer);
        map.addLayer(highlightPoint.layer);
        map.addLayer(dropsPoint.layer);
        map.addLayer(hoverPoint.layer);

        map.on("mouseenter", [...layers, ...pointLayers], e => {
          const feature = e.features && e.features[0];
          if (feature) {
            const coords = (feature.geometry as any).coordinates;
            const props = (feature.properties || {}) as Map.DropsLayerProperties;
            const popupNode = document.createElement("div");
            ReactDOM.render(<MapboxPopup properties={props}/>, popupNode);
            popup.setLngLat(coords).setDOMContent(popupNode).addTo(map);
            map.setFeatureState({ source: drops.sourceId!, sourceLayer: "provider", id: feature.id }, { hovered: true });
            map.getCanvas().style.cursor = "pointer";
            setActiveItem(props.object_id);
          }
        });
  
        map.on("mouseleave", [...layers, ...pointLayers], () => {
          setActiveItem(null);
          popup.remove();
          map.removeFeatureState({ source: drops.sourceId!, sourceLayer: "provider" });
          map.getCanvas().style.cursor = "";
        });
  
        map.on("click", [...layers, ...pointLayers], () => {
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
    <MapContainer>
      <PopoverStyles />
      <SelectStyles />
      <MapWrapper>
        {type === "main" && (
          <>
            <Sidebar
              filters={<MapFilters map={map} onChange={onFiltersChange} filterBounds={filterBounds} />}
              results={<Results map={map} results={results} />}
              />
            <BoundsFilter filterBoundsState={[filterBounds, setFilterBounds]} />
          </>
        )}
        <Map ref={mapNode} />
        {map && <MapControls map={map} />}
      </MapWrapper>
    </MapContainer>
  );
}

const MapContainer = styled.div`
  width: 100%;
  max-height: calc(100vh - 150px);
  position: relative;
  overflow: hidden;
  background: #FFFFFF;
  border: 1px solid #F2F2F2;
  border-radius: 20px;
  font-family: 'Rubik';

  &::before {
    float: left;
    padding-top: 100%;
    content: "";
  }

  &::after {
    display: block;
    content: "";
    clear: both;
  }

  & .mapboxgl-ctrl-bottom-left,
  & .mapboxgl-ctrl.mapboxgl-ctrl-attrib {
    display: none;
  }

  & .mapboxgl-popup-content {
    padding: 0;
    background: transparent;
    border-radius: 10px;
    overflow: hidden;
  }

  & .mapboxgl-popup-tip {
    position: relative;
    border-color: transparent;

    &:before, &::after {
      content: '';
      display: none;
      position: absolute;
      background-color: #f4f4f4;
    }

    &:before {
      width: 16px;
      height: 16px;
      border: 2px solid rgb(122 181 232 / 69%);
      transform: rotate(45deg);
    }

  }

  & .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip,
  & .mapboxgl-popup-anchor-right .mapboxgl-popup-tip {
    &::before, &::after {
      display: block;
    }
  }

  & .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
    border-top-color: #f4f4f4 !important;
    top: -2px;

    &:before {
      top: -18px;
      left: -8px;
    }

    &:after {
      width: 25px;
      height: 11px;
      top: -21px;
      left: -12px;
    }

  }

  & .mapboxgl-popup-anchor-top .mapboxgl-popup-tip {
    border-bottom-color: #f4f4f4 !important;
    bottom: -2px;
  }

  & .mapboxgl-popup-anchor-left .mapboxgl-popup-tip {
    border-right-color: #f4f4f4 !important;
    right: -2px;
  }

  & .mapboxgl-popup-anchor-right .mapboxgl-popup-tip {
    border-left-color: #f4f4f4 !important;
    left: -2px;

    &:before {
      top: -8px;
      left: -18px;
    }

    &:after {
      width: 11px;
      height: 25px;
      top: -12px;
      left: -21px;
    }
  }

  & .mapboxgl-ctrl-geocoder {
    display: none;
  }

  & .os-scrollbar > .os-scrollbar-track > .os-scrollbar-handle {
    background: #e2e2e2;
  }

  & .os-scrollbar > .os-scrollbar-track > .os-scrollbar-handle:hover:not(.active) {
    background: #d3d3d3 !important;
  }

  & .os-scrollbar > .os-scrollbar-track > .os-scrollbar-handle.active {
    background: #c9c9c9 !important;
  }

`;

const MapWrapper = styled.div`
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
  overflow: hidden;
  position: absolute;
  border-radius: 20px;
  display: flex;
`;

const Map = styled.div`
  flex-grow: 1;
`;

const PopoverStyles = createGlobalStyle`
  .map-popover {
    .ant-popover-inner-content {
      background: #757575;
      border-radius: 4px;
      padding: 6px 15px;
      font-family: 'Rubik';
      font-weight: 500;
      font-size: 14px;
      color: #FFFFFF;
    }
    &.ant-popover-placement-left .ant-popover-arrow {
      border-top-color: #757575;
      border-right-color: #757575;
    }
    &.ant-popover-placement-right .ant-popover-arrow {
      border-bottom-color: #757575;
      border-left-color: #757575;
    }
  }
`;

const SelectStyles = createGlobalStyle`
  .map-dropdown .os-content .ant-select-dropdown-menu,
  .map-dropdown .os-content > div {
    overflow: inherit !important;
  }

  .map-dropdown {
    box-shadow: 0px 13px 10px rgb(50 50 71 / 5%), 0px 22px 28px rgb(50 50 71 / 5%);
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
  }

  .map-dropdown .ant-select-dropdown-menu {
    max-height: 300px;
    font-family: 'Rubik';
    font-weight: 400;
    font-size: 14px;
    color: #757575;
  }

  .map-dropdown .ant-select-dropdown-menu-item {
    border-radius: 10px;
    margin: 2px 4px;
  }

  .map-dropdown .ant-select-dropdown-menu-item:hover:not(.ant-select-dropdown-menu-item-disabled) {
    background-color: #EDF5FC;
    
  }

  .ant-select-dropdown-menu-item-active:not(.ant-select-dropdown-menu-item-disabled) {
    background-color: #EDF5FC;
    color: #4095DA;
  }
`;

export default MapboxMap;
