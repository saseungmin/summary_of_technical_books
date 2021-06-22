interface IPerson4 {
  name: string;
  age?: number;
}

class Person4 implements IPerson4 {
  constructor(public name: string, public age?: number) {};
}

export let jack4: IPerson4 = new Person4('Jack', 32);
