import { IterableUsingGenerator } from './IterableUsingGenerator';

export const iterableGeneratorTest = () => {
  for (const item of new IterableUsingGenerator([1, 2, 3])) {
    console.log(item);
  }
  
  for (const item of new IterableUsingGenerator(['hello', 'world', '!'])) {
    console.log(item);
  }
}
