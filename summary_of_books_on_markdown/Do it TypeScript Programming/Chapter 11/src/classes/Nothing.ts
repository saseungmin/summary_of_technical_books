import { _IMaybe } from './_IMaybe';
import { IMonad } from '../interfaces/IMonad';

export class Nothing implements _IMaybe<null>, IMonad<null> {
  // IApplicative
  static of<T>(value: T = null): Nothing { return new Nothing; }

  // IMaybe
  isJust() { return false; }
  isNothing() { return true; }
  getOrElse<U>(defaultValue: U) { return defaultValue; }

  // IFunctor
  map<U, V>(fn: (x) => U): Nothing { return new Nothing }

  // IApply
  ap<U>(b: U) {
    return new Nothing;
  }

  // IChain
  chain<U>(fn: (T) => U): Nothing { return new Nothing; }
}
