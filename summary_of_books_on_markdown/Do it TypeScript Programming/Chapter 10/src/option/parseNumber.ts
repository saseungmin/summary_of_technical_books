import { IFunctor } from "./IFunctor";
import { IValuable } from "./IValuable";
import { Option } from "./Option";

export const parseNumber = (n: string): IFunctor<number> & IValuable<number> => {
  const value = parseInt(n);
  return isNaN(value) ? Option.None : Option.Some(value);
}
