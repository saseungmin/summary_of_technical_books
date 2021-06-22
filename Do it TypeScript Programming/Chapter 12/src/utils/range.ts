/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
export function* range(max: number, min: number = 0) {
  while (min < max) {
    yield min++;
  }
}
