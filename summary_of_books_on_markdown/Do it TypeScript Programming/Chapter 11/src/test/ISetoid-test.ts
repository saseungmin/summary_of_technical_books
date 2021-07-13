import { Identity } from '../classes/Identity';

const one = new Identity(1);
const anotherOne = new Identity(1);
const two = new Identity(2);

console.log(
  one.equals(anotherOne), // true
  one.equals(two), // false
  one.equals(1), // false
  one.equals(null), // false
  one.equals([1]), // false
);
