declare module Common {

  type ReactState<T> = [T, React.Dispatch<React.SetStateAction<T>>];

}