const hover: Map.Layer = {
  id: "drops-hover-layer",
  layer: {
    "id": "drops-hover-layer",
    "type": "symbol",
    "source": "drops-source",
    "source-layer": "provider",
    "minzoom": 10,
    paint: {
      'icon-opacity': [
        "case",
        ["boolean", ["feature-state", "hovered"], false], 1, 0
      ],
    },
    layout: {
      'icon-image': 'marker-green',
      'icon-size': 1,
      'icon-anchor': 'bottom',
      "icon-ignore-placement": true,
    },
  }
}

const hoverPoint: Map.Layer = {
  id: "drops-hover-point-layer",
  layer: {
    "id": "drops-hover-point-layer",
    "type": "symbol",
    "source": "drops-source",
    "source-layer": "provider",
    "maxzoom": 10,
    paint: {
      'icon-opacity': [
        "case",
        ["boolean", ["feature-state", "hovered"], false], 1, 0
      ],
    },
    layout: {
      'icon-image': 'marker-point-green',
      'icon-anchor': 'center',
      "icon-ignore-placement": true,
    },
  }
}

export default hover;
export { hover, hoverPoint };
