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
    country?: string;
    city?: string;
    type?: string;
    capacity?: [number, number];
    bounds?: MapBounds | null;
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

  namespace Request {

    interface Filter {
      country?: string;
      city?: string;
      type?: string;
      capacity?: [number, number];
      bounds?: MapBounds | null;
    }

  }

  namespace Response {

    interface Filter {
      countries: string[];
      types: string[];
      capacity: { min: number; max: number; };
    }

  }

}