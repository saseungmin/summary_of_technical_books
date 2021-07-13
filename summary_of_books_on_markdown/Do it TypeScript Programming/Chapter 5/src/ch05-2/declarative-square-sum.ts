import { range } from "./range";
import { fold } from './fold';
import { map } from './map';

let numbers: number[] = range(1, 100 + 1);
let result = fold(
  map(numbers, value => value * value),
  (result, value) => result + value, 
  0
)

console.log(result); // 338350