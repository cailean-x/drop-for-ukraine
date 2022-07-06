export const isLayerExist = (map: mapboxgl.Map, layerId: string) => {
  const layer = map.getStyle().layers.find(layer => layer.id === layerId);
  return !!layer;
};
