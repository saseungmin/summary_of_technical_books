import * as R from 'ramda';

const input: number[] = R.range(1, 10 + 1);
const halfVale = input[input.length / 2]; // 6

const subtractOrAdd = R.pipe(
  R.map(R.ifElse(
    R.lte(halfVale), // 조건 서술자: x => half <= x,
    R.inc, // true 일 때 실행할 함수
    R.dec, // false 일 때 실행할 함수
  )),
  R.tap(a => console.log(a)), // [0, 1, 2, 3, 4, 7, 8, 9, 10, 11]
);

export const result = subtractOrAdd(input);
