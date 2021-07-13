import { test } from './createRangeIterable-test';
import { testGenerator } from './rangeGenerator-test';
import { iterableGeneratorTest } from './IterableUsingGenerator-test';

import { generator } from './generator';
import { gen, random } from './yield-return';
import { RangeIterable } from './RangeIterable';
import { StringIterable } from './StringIterable';

test();

const iterator = new RangeIterable(1, 3 + 1);

for (const value of iterator) {
  console.log(value);
}

for (let value of new StringIterable(['hello', 'world', '!'])) {
  console.log(value); // hello world !
}

for (const value of generator()) {
  console.log(value);
}

testGenerator();

iterableGeneratorTest();

const iter = gen();

while(true) {
  const { value, done } = iter.next(random(10, 1));

  if(done) {
    break;
  }

  console.log(value);
}
