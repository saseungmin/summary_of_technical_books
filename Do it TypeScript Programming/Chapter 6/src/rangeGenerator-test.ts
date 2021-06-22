import { rangeGenerator } from "./rangeGenerator";

let iterator = rangeGenerator(1, 3 + 1);

export const testGenerator = () => {
  while (1) {
    const { value, done } = iterator.next();
  
    if (done) {
      break;
    }
  
    console.log(value); // 1 2 3
  }
  
  for (const value of rangeGenerator(4, 6 + 1)) {
    console.log(value); // 4 5 6
  }
}
