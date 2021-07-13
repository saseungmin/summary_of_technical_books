import { personArray } from "./ch05-1/array-type";
import { join } from "./ch05-1/join";
import { split } from './ch05-1/split';

console.log(personArray);

console.log(
  split('hello'),
  split('h_e_l_l_o', '_'),
);

console.log(
  join(['h', 'e', 'l', 'l', 'o']),
  join(['h', 'e', 'l', 'l', 'o'], '_'),
);