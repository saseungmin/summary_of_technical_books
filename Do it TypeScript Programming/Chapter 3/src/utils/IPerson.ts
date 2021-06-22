interface IPerson {
  name: string;
  age: number;
}

let good: IPerson = { name: 'Jack', age: 32 };

// 인터페이스 조건을 벗어나는 예
// let bad1: IPerson = { name: 'Jack' };
// let bad2: IPerson = { age: 32 };
// let bad3: IPerson = {};
// let bad4: IPerson = { name: 'Jack', age: 32, etc: true };

// 선택 속성
interface IPerson2 {
  name: string;
  age: number;
  etc?: boolean; // optional property
}

let good1: IPerson2 = { name: 'Jack', age: 32 };
let good2: IPerson2 = { name: 'Jack', age: 32, etc: true };
