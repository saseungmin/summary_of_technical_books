export function* generator() {
  console.log('start');
  let value = 1;

  while (value < 4) {
    yield value++;
  }

  console.log('finish');
}
