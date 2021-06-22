import * as R from 'ramda';

const always = a => b => a;
const flip = cb => a => b => cb(b)(a);

const first = <T>(a: T) => (b: T): T => always(a)(b);
const second = <T>(a: T) => (b: T): T => flip(always)(a)(b);

console.log(first(1)(2), second(1)(2)); // 1 2