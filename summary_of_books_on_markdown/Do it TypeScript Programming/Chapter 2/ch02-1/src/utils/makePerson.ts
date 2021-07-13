export function makePerson(name: string, age: number) {
  return { 
    name: name, 
    age: age,
  };
}

export function testMakePerson() {
  console.log(
    makePerson('Jane', 22),
    makePerson('Jack', 33),
  );
}