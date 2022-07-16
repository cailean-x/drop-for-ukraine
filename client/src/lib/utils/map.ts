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

export const getRoundedCapacity = (n: number, type: "min" | "max") => {
  if (type === "min") return Math.floor(n / 10 ** ((n + '').length - 1)) * 10 ** ((n + '').length - 1);
  return Math.ceil(n / 10 ** ((n + '').length - 1)) * 10 ** ((n + '').length - 1);
}

export const formatNumber = (n: number) => {
  if (n / 10e5 >= 1) return ((n / 10e5) % 1 === 0 ? (n / 10e5) : (n / 10e5).toFixed(1)) + "m";
  if (n / 10e2 >= 1) return ((n / 10e2) % 1 === 0 ? (n / 10e2) : (n / 10e2).toFixed(1)) + "k";
  return n + "";
}

export const loadImage = async (map: mapboxgl.Map, id: string, source: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(map.addImage(id, img));
    img.onerror = e => reject(e);
    img.src = source;
  });
}
