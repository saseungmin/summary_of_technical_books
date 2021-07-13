class Person2 {
  constructor(public name: string, public age?: number) {};
}

let jack2: Person2 = new Person2('Jack', 32);
console.log(jack2);