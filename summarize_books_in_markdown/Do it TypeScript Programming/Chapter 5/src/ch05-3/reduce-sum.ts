import { range } from "./range";

let reduceSum: number = range(1, 100 + 1)
  .reduce((result: number, value: number) => result + value, 0);

console.log(reduceSum); // 5050