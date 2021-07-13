import * as R from 'ramda';

const numbers: number[] = R.range(1, 9 + 1);

export const rangeTap = R.tap(n => console.log(n))(numbers);
 