import { A } from "./utils/A";
import { add, NumberToNumberFunc } from "./utils/add";
import { B } from "./utils/B";
import { makeObject } from "./utils/indexable-key";
import { init } from "./utils/init";
import { calc } from "./utils/nested";
import { fn } from "./utils/optional-arg";

fn('hello', 1); // arg: 1
fn('hello'); // arg: undefined

init(() => console.log('custom initialization finished.'));

calc(30, (result: number) => console.log(`result is ${result}`));

let fn1: NumberToNumberFunc = add(1);
console.log(fn1);
let result = fn1(2);
console.log(result);
console.log(add(1)(2));

console.log(makeObject('name','Jack'));

let a: A = new A;
a.method(); // value: 1

let b: B = new B(2);
b.method(); // value: 2