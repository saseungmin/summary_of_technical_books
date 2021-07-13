import { printMe } from "./utils/anonymousInterface";
import { Person1 } from "./utils/Person1";
import { jack4 } from "./utils/Person4";
import { jack5 } from "./utils/Person5";
import { detail } from "./utils/rest";
import { initVal } from './utils/static';
import { merged } from './utils/spreed';
import INameable from './utils/INameable';
import { result } from './utils/type-assertion';

// 익명 인터페이스
let ai: {
  name: string,
  age: number,
  etc?: boolean,
} = { name: 'Jack', age: 32 };

printMe(ai);

// class
let jack1: Person1 = new Person1();
jack1.name = 'Jack';
jack1.age = 32;
console.log(jack1);

console.log(jack4); // Person4 { name: 'Jack', age: 32 }

console.log(jack5); // Person5 { name: 'Jack', age: 32 }

console.log(initVal);

console.log(detail);

console.log(merged); // { name: 'jane', age: 22, city: 'Seoul', country: 'Kr' }

console.log(result); // Jack Jack