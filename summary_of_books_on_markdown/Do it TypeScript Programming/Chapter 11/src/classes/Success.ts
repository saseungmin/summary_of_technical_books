import { IApply } from '../interfaces/IApply';
import { IFunctor } from '../interfaces/IFunctor';
import { IValidation } from '../interfaces/IValidation';

export class Success<T> implements IValidation<T>, IFunctor<T>, IApply<T> {
  constructor(public value: T, public isSuccess = true, public isFailure = false) {}

  // IApplicative
  static of<U>(value: U): Success<U> {
    return new Success<U>(value);
  }

  // IFunctor
  map<U>(fn: (x: T) => U) {
    return new Success<U>(fn(this.value));
  }

  // IApply
  ap(b) {
    return b.isFailure ? b : b.map(this.value);
  }
}