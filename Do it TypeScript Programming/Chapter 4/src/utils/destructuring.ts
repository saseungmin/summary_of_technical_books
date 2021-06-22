export type Person = {
  name: string, age: number
}

export const makePerson = ({name, age}: Person): void => 
  console.log(`name: ${name}, age: ${age}`);

console.log(makePerson({ name: 'Jack', age: 10} )); // { name: 'Jack', age: 10 }
