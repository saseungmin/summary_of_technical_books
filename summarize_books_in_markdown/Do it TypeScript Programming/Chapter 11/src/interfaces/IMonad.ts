import { IChain } from './IChain';
import { IApplicative } from './IApplicative';

export interface IMonad<T> extends IChain<T>, IApplicative<T> {};
