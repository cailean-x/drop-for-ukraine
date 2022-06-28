export interface Viewer {
  id: string | null;
  token: string | null;
  avatar: string | null;
  hasWallet: boolean | null;
  didRequest: boolean;
}
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