import { IApply } from './IApply';

export interface IChain<T> extends IApply<T> {
  chain<U>(fn: (T) => U);
}
