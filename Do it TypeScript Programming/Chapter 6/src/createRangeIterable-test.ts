import { createRangeIterable } from './createRangeIterable';

const iterator = createRangeIterable(1, 3 + 1); // 반복기는 현재 동작하지 않는다.

export const test = () => {
  while (true) {
    const { value, done } = iterator.next();
  
    if (done) {
      break;
    }
  
    console.log(value);
  }
}
