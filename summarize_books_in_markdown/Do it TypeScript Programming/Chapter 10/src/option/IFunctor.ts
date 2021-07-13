export interface IFunctor<T> {
  map<U>(fn: (value: T) => U)
}
