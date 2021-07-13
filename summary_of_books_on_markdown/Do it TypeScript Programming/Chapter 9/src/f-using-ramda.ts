import * as R from 'ramda';

type NumberToNumberFunc = (number) => number;

//const f = (a: number, b: number, c: number): NumberToNumberFunc =>
//  (x: number): number => a * x ** 2 + b * x + c;

// 람다 함수 사용
const exp = (N: number) => (x: number) => x ** N;
const square = exp(2);

export const f = (a: number, b: number, c: number): NumberToNumberFunc =>
  (x: number): number => R.add(
    R.add(
      R.multiply(a)(square(x))
    )(R.multiply(b)(x)),
    c
  );
