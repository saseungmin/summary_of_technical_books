import * as R from 'ramda';

const array = [1, 2, 3];

R.pipe(
  R.chain(n => [n, n]),
  R.tap(n => console.log(n)), // [1, 1, 2, 2, 3, 3]
)(array);

R.pipe(
  R.chain(R.append, R.head),
  R.tap(n => console.log(n)), // [1, 2, 3, 1]
)(array);
