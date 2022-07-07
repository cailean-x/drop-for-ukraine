export const transformFilters = (filters: Map.Request.Query.ListingGet): Map.Filters => {
  const filter = ([k, v]: any) => v != null && k !== "limit" && k !== "offset"; 
  return Object.fromEntries(Object.entries(filters).filter(filter).map(([k, v]) => {
    const key = k as keyof Map.Request.Query.ListingGet;
    if (key === "capacity" || key === "bounds" || key === "center") return [k, JSON.parse(v)];
    if (key === "radius" ) return [k, parseInt(v)];
    return [k, v];
  }));
}

export const transformLimits = (filters: Map.Request.Query.ListingGet): Map.Limit => {
  const filter = ([k, v]: any) => v != null && (k === "limit" || k === "offset"); 
  return Object.fromEntries(Object.entries(filters).filter(filter).map(([k, v]) => {
    const key = k as keyof Map.Request.Query.ListingGet;
    if (key === "limit" || key === "offset") return [k, parseInt(v)];
    return [k, v];
  }));
}
