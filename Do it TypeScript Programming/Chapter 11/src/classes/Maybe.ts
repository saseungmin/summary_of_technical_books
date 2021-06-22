import { Just } from './Just';
import { Nothing } from './Nothing';
import { _IMaybe } from './_IMaybe';
import { IMonad } from '../interfaces/IMonad';

export class Maybe<T> {
  static Just<U>(value: U) {
    return new Just<U>(value);
  }
  static Nothing = new Nothing;
}

export type IMaybe<T> = _IMaybe<T> & IMonad<T>;
