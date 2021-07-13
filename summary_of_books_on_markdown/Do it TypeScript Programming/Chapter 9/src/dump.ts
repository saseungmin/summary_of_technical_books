import * as R from 'ramda';

const dump = R.pipe(R.tap(n => console.log(n)));

export const dumpTest = dump(R.range(1, 10));
