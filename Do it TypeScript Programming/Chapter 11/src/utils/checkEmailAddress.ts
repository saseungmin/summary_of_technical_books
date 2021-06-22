import { Success } from '../classes/Success';
import { Failure } from '../classes/Failure';

export const checkEmailAddress = (o: { email?: string }) => {
  const { email } = o;

  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(email) ? new Success(email) : new Failure(['invalid email address']);
};
