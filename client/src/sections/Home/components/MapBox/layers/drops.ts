
const drops: Map.Layer = {
  id: "drops-layer",
  sourceId: "drops-source",
  source: {
    type: "vector",
    tiles: [`/map/tile/{z}/{x}/{y}?fields=object_id,image,title,country,state,city,address,capacity,type`],
  },
  layer: {
    "id": "drops-layer",
    "type": "symbol",
    "source": "drops-source",
    "source-layer": "provider",
    minzoom: 10,
    paint: {
      'icon-opacity': [
        "case",
        ["boolean", ["feature-state", "hovered"], false], 0, 1
      ],
    },
    layout: {
      'icon-image': 'marker-blue',
      'icon-size': 1,
      'icon-anchor': 'bottom',
      "icon-ignore-placement": true,
    },
  }
}

const dropsPoint: Map.Layer = {
  id: "drops-point-layer",
  layer: {
    "id": "drops-point-layer",
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
      'icon-image': 'marker-point-blue',
      'icon-anchor': 'center',
      "icon-ignore-placement": true,
    },
  }
}

export default drops;
export { drops, dropsPoint };
