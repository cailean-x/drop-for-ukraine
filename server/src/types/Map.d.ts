declare module Map {

  type IListing = import("/lib/types").Listing;

  interface MapBounds {
    _sw: { lng: number; lat: number; };
    _ne: { lng: number; lat: number; };
  }

  interface Filters {
    country?: string;
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
        type?: string;
        capacity?: string;
        bounds?: string;
        limit?: string;
        offset?: string;
      }

    }

    namespace Body {

      type ListingPost = IListing[];

    }

  }

  namespace Response {
    
    type TileGet = Buffer;
    type ListingGet = IListing[];
    type ListingIdsGet = number[];

    interface FilterGet {
      countries: string[];
      types: string[];
      capacity: { min: number; max: number; };
    }

  }

  namespace Result {

    interface Listing {
      fields_json: IListing[];
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

  }

}
