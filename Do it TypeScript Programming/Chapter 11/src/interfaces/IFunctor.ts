export interface IFunctor<T> {
  map<U>(fn: (x: T) => U);
}
