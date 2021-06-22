import * as R from 'ramda';

const sum  = (...numbers: number[]): number =>
  numbers.reduce((result: number, sum: number) => result + sum, 0);

export const curriedSum = R.curryN(4, sum);