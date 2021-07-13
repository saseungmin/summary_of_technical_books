import { IO } from '../classes/IO';

const result = IO.of((a1) => {
  console.log('io started', a1);
  return a1;
})
.chain((a2) => {
  return IO.of(() => {
    console.log('first chain called', a2);
    return a2 + 1;
  })
})
.runIO(1);

console.log(result); // 2