import mapboxgl from 'mapbox-gl';
import highlight from "sections/Home/components/MapBox/layers/highlight";

export const renderTerritory = (() => {
  let lastState = "";
  return (map: mapboxgl.Map, polygon?: mapboxgl.GeoJSONSourceOptions["data"] | null) => {
    const state = JSON.stringify(polygon);

    if (lastState === state) return;
  
    if (map.getSource('territory-fill')) {
      map.removeLayer('territory-fill');
      map.removeSource('territory-fill');
    }
  
    if (!polygon) {
      lastState = "";
      return;
    };
  
    map.addLayer({
      id: 'territory-fill',
      type: 'fill',
      source: {
        type: 'geojson',
        data: polygon,
      },
      paint: {
        'fill-color': 'red',
        'fill-outline-color': 'red',
        'fill-opacity': 0.05,
      }
    }, highlight.id);
  
    lastState = state;
  };
})();
