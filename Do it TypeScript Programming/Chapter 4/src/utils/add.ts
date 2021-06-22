export type NumberToNumberFunc = (number) => number

export const add = (a: number): NumberToNumberFunc => {
  const _add: NumberToNumberFunc = (b: number): number => {
    return a + b; // 클로저
  }
  return _add;
}