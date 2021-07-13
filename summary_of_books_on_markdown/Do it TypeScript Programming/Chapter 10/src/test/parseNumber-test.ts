import { parseNumber } from '../option/parseNumber';

let value = parseNumber('1')
  .map((value) => value + 1) // 2
  .map((value) => value * 2) // 4
  .getOrElse(0);

console.log(value);

value = parseNumber('hello world')
  .map((value) => value + 1) // 콜백 함수가 호출되지 않는다
  .map((value) => value * 2) // 콜백 함수가 호출되지 않는다
  .getOrElse(0); // 0

console.log(value); // 0
