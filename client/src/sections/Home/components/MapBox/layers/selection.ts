import mapboxgl from "mapbox-gl";

const selection = (feature: mapboxgl.MapboxGeoJSONFeature): mapboxgl.AnyLayer => ({
  id: "drops-layer-selected",
  source: {
    type: "geojson",
    data: {
      type: "Feature",
      properties: null,
      geometry: {
        type: "Point",
        coordinates: (feature as any).geometry.coordinates.slice(),
      },
    },
  },
  type: "circle",
  paint: {
    "circle-stroke-width": 2,
    "circle-stroke-color": "#fff",
    "circle-radius": ["interpolate", ["linear"], ["zoom"], 1, 5, 16, 20],
    "circle-opacity": ["interpolate", ["linear"], ["zoom"], 1, 0.7, 16, 1],
    "circle-color": "green",
  },
});

export default selection;