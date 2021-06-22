export class A {
  value: number = 1;
  method: () => void = function(): void {
    console.log(`value: ${this.value}`);
  }
}