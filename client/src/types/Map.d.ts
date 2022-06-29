declare module Map {

  interface Filter {
    country: string;
    type: string;
    capacity: [number, number];
  }

  interface MapBounds {
    _sw: { lng: number; lat: number; };
    _ne: { lng: number; lat: number; };
  }

  namespace Request {

    interface Filter {
      country?: string;
      type?: string;
      capacity?: [number, number];
      bounds?: MapBounds;
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