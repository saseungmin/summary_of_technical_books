import { IValuable } from './IValuable';
import { IFunctor } from './IFunctor';
import { Option } from './Option';

export const parseJson = <T>(json: string): IValuable<T> & IFunctor<T> => {
  try {
    const value = JSON.parse(json);
    return Option.Some<T>(value);
  } catch (error) {
    return Option.None;
  }
}
