import { IO } from '../classes/IO';

const result = IO.of((a1) => {
  console.log('io started', a1);
  return a1;
})
.runIO(1);

console.log(result);