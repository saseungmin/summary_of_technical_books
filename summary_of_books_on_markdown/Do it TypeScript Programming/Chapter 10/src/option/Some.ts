import { IValuable } from './IValuable';
import { IFunctor } from './IFunctor';

export class Some<T> implements IValuable<T>, IFunctor<T> {
  constructor(private value: T) {}

  getOrElse(defaultValue: T) {
    return this.value ?? defaultValue;
  }
  map<U>(fn: (T) => U) {
    return new Some<U>(fn(this.value));
  }
}
