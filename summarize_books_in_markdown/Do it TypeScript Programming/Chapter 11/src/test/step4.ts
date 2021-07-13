import { IO } from '../classes/IO';

const chainCB = a2 => IO.of(() => {
  console.log('first chain called');
  return a2 + 1;
});

const result = IO.of((a1) => {
  console.log('io started', a1);
  return a1;
})
.chain(chainCB)
.runIO(1);

console.log(result); // 2
