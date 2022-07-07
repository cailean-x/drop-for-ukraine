export const isLayerExist = (map: mapboxgl.Map, layerId: string) => {
  const layer = map.getStyle().layers.find(layer => layer.id === layerId);
  return !!layer;
};

export const transformFilters = (filters: Map.Filter, filterBounds: boolean): Record<string, string> => {
  const transform = ([k, v]: any) => typeof v === "object" ? [k, JSON.stringify(v)] : [k, v];
  return Object.fromEntries(Object.entries(filters).filter(([k, v]) => {
    const key = k as keyof Map.Filter;
    if (v == null) return false;
    if (v === "") return false;
    if (!filterBounds && key === "bounds") return false;
    if (filterBounds && key === "country") return false;
    if (filterBounds && key === "city") return false;
    if (filterBounds && key === "center") return false;
    if (filterBounds && key === "radius") return false;
    if (!filters["center"] && key === "radius") return false;
    return true;
  }).map(transform));
}
