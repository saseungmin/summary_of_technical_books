export function* gen() {
  let count = 5;
  let select = 0;

  while(count--) {
    select = yield `you select ${select}`;
  }
}

export const random = (max, min = 0) => Math.round(Math.random() * (max - min)) + min;
