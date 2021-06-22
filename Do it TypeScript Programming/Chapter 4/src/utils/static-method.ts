export class C {
  static whoAreYou(): string {
    return `I'm class C`;
  }
}

export class D {
  static whoAreYou(): string {
    return `I'm class D`;
  }
}

console.log(C.whoAreYou()); // I'm class C
console.log(D.whoAreYou()); // I'm class D