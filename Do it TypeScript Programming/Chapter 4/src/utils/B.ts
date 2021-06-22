export class B {
  constructor(public value: number = 1) {}
  method(): void {
    console.log(`value: ${this.value}`);
  }
}