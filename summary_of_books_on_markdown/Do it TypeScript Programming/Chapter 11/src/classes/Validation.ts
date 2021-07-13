import { Success } from './Success';
import { Failure } from './Failure';

export class Validation {
  static Success = Success;
  static Failure = Failure;
  static of<T>(fn: T): Success<T> {
    return this.Success.of<T>(fn);
  }
}

export { Success, Failure };
