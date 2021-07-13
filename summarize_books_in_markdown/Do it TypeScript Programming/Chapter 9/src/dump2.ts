import * as R from 'ramda';

export const dump = <T>(array: T[]): T[] => R.pipe(
  R.tap(n => console.log(n))
)(array) as T[];
