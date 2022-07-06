declare module Map {

  type IListing = import("/lib/types").Listing;

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

  interface MapBounds {
    _sw: { lng: number; lat: number; };
    _ne: { lng: number; lat: number; };
  }

  interface Filters {
    country?: string;
    city?: string;
    type?: string;
    capacity?: [number, number];
    bounds?: MapBounds;
  }

  namespace Request {

    namespace Query {

      interface TileGet {
        fields?: string;
      }

      interface ListingGet {
        country?: string;
        city?: string;
        type?: string;
        capacity?: string;
        bounds?: string;
        limit?: string;
        offset?: string;
      }

      interface FilterCityGet {
        country: string;
      }

    }

    namespace Body {

      type ListingPost = MapListing;

    }

  }

  namespace Response {
    
    type TileGet = Buffer;
    type ListingGet = MapListing[] | null;
    type ListingIdsGet = number[] | null;
    type FilterCityGet = string[] | null;

    interface FilterGet {
      countries: string[];
      types: string[];
      capacity: { min: number; max: number; };
    }

  }

  namespace Result {

    interface Listing {
      fields_json: MapListing[];
    }

    interface ListingId {
      fields_json: number[];
    }

    interface Tile {
      geodata: Buffer;
    }

    interface FilterCountry {
      fields_json: { id: string; name: string; count: number }[];
    }

    interface FilterType {
      fields_json: { id: string; name: string; count: number }[];
    }

    interface FilterCapacity {
      fields_json: { min_value: number; max_value: number };
    }
    
    interface FilterCity {
      fields_json: { id: string; name: string; count: number }[];
    }

  }

}
