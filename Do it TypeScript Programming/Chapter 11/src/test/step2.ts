import { IO } from '../classes/IO';

const result = IO.of((a1) => {
  console.log('io started', a1);
  return a1;
})
.map((a2) => {
  console.log('first map called', a2);
  return a2 + 1;
})
.runIO(1);

console.log(result); // 2