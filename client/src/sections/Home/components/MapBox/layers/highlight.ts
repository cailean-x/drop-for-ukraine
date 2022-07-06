const highlight: Map.Layer = {
  id: "drops-highlight-layer",
  sourceId: "drops-highlight-source",
  source: {
    type: "vector",
    tiles: [`/map/tile/{z}/{x}/{y}`],
  },
  layer: {
    "id": "drops-highlight-layer",
    "type": "circle",
    "source": "drops-highlight-source",
    "source-layer": "provider",
    "paint": {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 1, 12, 16, 40],
      "circle-color": "#40a9ff",
      "circle-opacity": [
        "case",
        ["boolean", ["feature-state", "filtered"], false], 0.3, 0
      ]
    },
  }
}

export default highlight;
