declare module '*.jpg';
declare module '*.png';
declare module '*.svg';

declare module Common {

  type ReactState<T> = [T, React.Dispatch<React.SetStateAction<T>>];

}