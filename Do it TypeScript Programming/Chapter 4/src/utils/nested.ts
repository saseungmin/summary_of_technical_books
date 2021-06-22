export const calc = (value: number, cb: (number) => void): void => {
  let add = (a, b) => a + b;
  function multiply(a, b) {
    return a * b;
  }

  let result = multiply(add(1, 2), value);
  cb(result);
}
