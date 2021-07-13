import { Failure } from '../classes/Failure';
import { Success } from '../classes/Success';

export const checkNull = <S, F>(o: { password?: string }) => {
  const { password } = o;

  return (password === undefined || typeof password !== 'string') ?
    new Failure(['Password can not be null']) : new Success(o);
};
