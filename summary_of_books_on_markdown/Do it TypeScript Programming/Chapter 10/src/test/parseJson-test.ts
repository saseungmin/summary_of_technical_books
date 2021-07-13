import { parseJson } from '../option/parseJson';

const json = JSON.stringify({
  name: 'Jack',
  age: 32,
});

let value = parseJson(json).getOrElse({});
console.log(value); // { name: 'Jack', age: 32 }

value = parseJson('hello world').getOrElse({});
console.log(value); // {}
