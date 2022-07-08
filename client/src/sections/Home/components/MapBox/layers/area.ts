import mapboxgl from 'mapbox-gl';
import { lineString } from '@turf/helpers';
import turfCircle from '@turf/circle';
import drops from "sections/Home/components/MapBox/layers/drops";

export const renderAreaRadius = (() => {
  let lastState = "";
  return (map: mapboxgl.Map, center?: [number, number] | null, radius = 25) => {
    const state = JSON.stringify({ center, radius });

    if (center && lastState === state) return;
  
    if (map.getSource('area-radius-fill')) {
      map.removeLayer('area-radius-fill');
      map.removeLayer('area-radius-stroke');
      map.removeSource('area-radius-fill');
      map.removeSource('area-radius-stroke');
    }
  
    if (!center) {
      lastState = "";
      return;
    };
  
    const circle = turfCircle(center, radius, { steps: 50, units: "kilometers" });
    const line = lineString(circle.geometry.coordinates.flat());
  
    map.addLayer({
      id: 'area-radius-fill',
      type: 'fill',
      source: {
        type: 'geojson',
        data: circle,
      },
      paint: {
        'fill-color': '#40a9ff',
        'fill-opacity': 0.2,
        'fill-outline-color': 'rgba(253, 178, 109, 0)'
      }
    }, drops.id);
  
    map.addLayer({
      id: 'area-radius-stroke',
      type: 'line',
      source: {
        type: 'geojson',
        data: line
      },
      paint: {
        'line-color': '#40a9ff',
        'line-width': 3,
        'line-opacity': 0.3,
      }
    }, drops.id);

    const bounds = new mapboxgl.LngLatBounds();
    line.geometry.coordinates.forEach(c => bounds.extend(c as [number, number]));
    map.fitBounds(bounds, { padding: 100 });
    lastState = state;
  };
})();
