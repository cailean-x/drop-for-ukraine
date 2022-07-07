export const getFilters = async () => {
  const result = await fetch(`map/filter`);
  const data = await result.json() as Map.Response.Filter;
  return data;
}

export const getFilterCities = async (country: string) => {
  const search = new URLSearchParams({ country });
  const result = await fetch(`map/filter/city?${search}`);
  const data = await result.json() as string [] | null;
  return data;
}

export const getListingIds = async (filters: Record<string, string>) => {
  const search = new URLSearchParams(filters);
  const result = await fetch(`map/listing/ids?${search}`);
  const data = await result.json() as number[] | null;
  return data;
}

export const getListings = async (filters: Record<string, string>) => {
  const search = new URLSearchParams(filters);
  const result = await fetch(`map/listing?${search}`);
  const data = await result.json() as Map.MapListing[] | null;
  return data;
}

export const geocode = async (address: string): Promise<Map.GeocodeResult> => {
  const URL = "https://maps.googleapis.com/maps/api/geocode/json";
  const KEY = process.env.REACT_APP_GOOGLEMAPS_API_KEY;
  const result = await fetch(`${URL}?address=${encodeURIComponent(address)}&key=${KEY}`);
  return result.json();
}
