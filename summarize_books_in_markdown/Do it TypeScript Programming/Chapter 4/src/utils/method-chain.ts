export class Calculator {
  constructor(public value: number = 0) {}

  add(value: number) {
    this.value += value;
    return this;
  }

  multiply(value: number) {
    this.value *= value;
    return this;
  }
}