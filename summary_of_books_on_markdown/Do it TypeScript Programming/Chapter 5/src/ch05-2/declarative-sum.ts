import { range } from "./range";
import { fold } from './fold';

// 입력 데이터 생성
let numbers: number[] = range(1, 100 + 1);

// 입력 데이터 가공
let result = fold(numbers, (result, value) => result + value, 0);
console.log(result); // 5050