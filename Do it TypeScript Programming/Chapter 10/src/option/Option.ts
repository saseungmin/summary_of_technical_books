import { Some } from './Some';
import { None } from './None';

export class Option {
  private constructor() {}
  static Some<T>(value: T) { return new Some<T>(value); }
  static None = new None();
}

export { Some, None };
