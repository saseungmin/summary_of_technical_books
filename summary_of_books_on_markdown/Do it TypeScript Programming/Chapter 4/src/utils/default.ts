export type Person = {
  name: string, age: number
}

export const makePerson = (name: string, age: number = 10): Person => {
  const person = { name, age };
  return person;
}

console.log(makePerson('Jack')); // { name: 'Jack', age: 10 }
