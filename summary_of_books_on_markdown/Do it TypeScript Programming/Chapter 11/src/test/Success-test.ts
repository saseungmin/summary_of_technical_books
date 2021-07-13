import { Success } from '../classes/Success';

const checkSuccess = <T>(a: Success<T>) => (b: Success<T>): boolean =>
  [a, b].filter(({ isFailure }) => isFailure === true).length === 0;

console.log(
  Success.of(checkSuccess)
    .ap(Success.of(1))
    .ap(Success.of(2))
);
