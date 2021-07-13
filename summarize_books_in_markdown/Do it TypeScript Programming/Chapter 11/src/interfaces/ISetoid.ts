import { IValuable } from './IValuable';

export interface ISetoid<T> extends IValuable<T> {
  equals<U>(value: U): boolean;
};
