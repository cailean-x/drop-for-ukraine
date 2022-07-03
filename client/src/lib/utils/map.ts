export const getFilters = async () => {
  const result = await fetch(`map/filter`);
  const data = await result.json() as Map.Response.Filter;
  return data;
}

export const getListingIds = async (filters: Map.Request.Filter) => {
  const transform = ([k, v]: any) => typeof v === 'object' ? [k,JSON.stringify(v)] : [k,v];
  const f = Object.fromEntries(Object.entries(filters).map(transform));
  const search = new URLSearchParams(f);
  const result = await fetch(`map/listing/ids?${search}`);
  const data = await result.json() as number[] | null;
  return data;
}

export const getListings = async (filters: Map.Request.Filter) => {
  const transform = ([k, v]: any) => typeof v === 'object' ? [k,JSON.stringify(v)] : [k,v];
  const f = Object.fromEntries(Object.entries(filters).map(transform));
  const search = new URLSearchParams(f);
  const result = await fetch(`map/listing?${search}`);
  const data = await result.json() as Map.MapListing[] | null;
  return data;
}