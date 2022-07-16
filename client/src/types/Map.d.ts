declare module Map {

  type IListing = import("lib/graphql/queries/Listing/__generated__/Listing").Listing_listing;

  interface MapListing  extends Omit<IListing, "geometry" | "price" | "admin" | "host"> {
    capacity: number;
    state: string;
    user_object_id: string;
    object_id: string;
    country: string;
    geometry: {
      lat: number;
      lng: number;
    }
  }

  interface Filter {
    country?: string | null;
    city?: string | null;
    type?: string;
    capacity?: [number, number];
    bounds?: MapBounds | null;
    center?: [number, number] | null;
    radius?: number;
  }

  interface ItemsFilter {
    country?: string | null;
    city?: string | null;
  }

  interface MapBounds {
    _sw: { lng: number; lat: number; };
    _ne: { lng: number; lat: number; };
  }

  interface DropsLayerProperties {
    object_id: string;
    title: string;
    address: string;
    city: string;
    country: string;
    state: string;
    capacity: number;
    image: string;
    type: string;
  }

  interface Layer {
    id: string;
    sourceId?: string;
    source?: mapboxgl.AnySourceData;
    layer: mapboxgl. AnyLayer;
  }

  interface AddressFilterItem {
    text: string;
    value: string;
  }

  interface AddressFilterValue {
    center: [number, number];
    query: string;
    text: string;
  }

  interface GeocodeResult {
    status: string;
    results: {
      place_id: string;
      types: string[];
      formatted_address: string;
      geometry: {
        location_type: string;
        location: {
          lat: number;
          lng: number;
        };
        bounds: {
          northeast: {
            lat: number;
            lng: number;
          },
          southwest: {
            lat: number;
            lng: number;
          }
        };
        viewport: {
          northeast: {
            lat: number;
            lng: number;
          },
          southwest: {
            lat: number;
            lng: number;
          }
        };
      }
      address_components: {
        long_name: string;
        short_name: string;
        types: string[];
      }[];
    }[];
  }

  type TerritoryResult = {
    display_name: string;
    category: string;
    importance: number;
    lat: number;
    lon: string;
    place_id: number;
    type: string;
    geojson: Required<mapboxgl.GeoJSONSourceOptions>["data"];
  }[];

  namespace Response {

    interface Filter {
      countries: string[];
      types: string[];
      capacity: { min: number; max: number; };
    }

  }

}