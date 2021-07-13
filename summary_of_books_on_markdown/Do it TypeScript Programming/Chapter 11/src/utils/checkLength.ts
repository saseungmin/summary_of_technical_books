import { Failure } from '../classes/Failure';
import { Success } from '../classes/Success';

export const checkLength = (o: { password?: string }, minLength: number = 6) => {
  const { password } = o;

  return (!password || password.length < minLength) ?
    new Failure(['Password must have more than 6 characters']) : new Success(o);
};
