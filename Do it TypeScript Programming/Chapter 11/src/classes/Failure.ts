import { IApply } from '../interfaces/IApply';
import { IFunctor } from '../interfaces/IFunctor';
import { IValidation } from '../interfaces/IValidation';

export class Failure<T> implements IValidation<T>, IFunctor<T>, IApply<T> {
  constructor(public value: T[], public isSuccess = false, public isFailure = true) {}

  // IApplicative
  static of<U>(value: U[]): Failure<U> {
    return new Failure<U>(value);
  }

  // IFunctor
  map(fn) {
    return new Failure<T>(fn(this.value));
  }

  // IApply
  ap(b) {
    return b.isFailure ? new Failure<T>([...this.value, ...b.value]) : this;
  }
}
