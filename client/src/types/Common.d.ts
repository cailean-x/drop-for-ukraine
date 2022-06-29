declare module Common {

  export interface GeocodeResult {
    status: string;
    results: {
      geometry: {
        location: {
          lat: number;
          lng: number;
        }
      }
    }[];
  }
  
  export type ReactState<T> = [T, React.Dispatch<React.SetStateAction<T>>];

}