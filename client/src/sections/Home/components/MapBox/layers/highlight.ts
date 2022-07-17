const highlight: Map.Layer = {
  id: "drops-highlight-layer",
  layer: {
    "id": "drops-highlight-layer",
    "type": "symbol",
    "source": "drops-source",
    "source-layer": "provider",
    "minzoom": 10,
    paint: {
      'icon-opacity': [
        "case",
        ["boolean", ["feature-state", "hovered"], false], 0, 1
      ],
    },
    layout: {
      'icon-image': 'marker-yellow',
      'icon-size': 1,
      'icon-anchor': 'bottom',
      "icon-ignore-placement": true,
    },
  }
}

const highlightPoint: Map.Layer = {
  id: "drops-highlight-point-layer",
  layer: {
    "id": "drops-highlight-point-layer",
    "type": "symbol",
    "source": "drops-source",
    "source-layer": "provider",
    "maxzoom": 10,
    paint: {
      'icon-opacity': [
        "case",
        ["boolean", ["feature-state", "hovered"], false], 0, 1
      ],
    },
    layout: {
      'icon-image': 'marker-point-yellow',
      'icon-anchor': 'center',
      "icon-ignore-placement": true,
    },
  }
}

export default highlight;
export { highlight, highlightPoint };
