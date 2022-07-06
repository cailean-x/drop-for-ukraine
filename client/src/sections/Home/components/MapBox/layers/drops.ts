const drops: Map.Layer = {
  id: "drops-layer",
  sourceId: "drops-source",
  source: {
    type: "vector",
    tiles: [`/map/tile/{z}/{x}/{y}?fields=object_id,image,title,country,state,city,address,capacity,type`],
  },
  layer: {
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
        ["boolean", ["feature-state", "hovered"], false], "green", "#40a9ff"
      ]
    },
  }
}

export default drops;
