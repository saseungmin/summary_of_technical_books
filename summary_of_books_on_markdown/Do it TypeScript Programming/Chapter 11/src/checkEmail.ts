import { Validation } from './classes/Validation';
import { checkEmailAddress } from './utils/checkEmailAddress';

export const checkEmail = (o): [object, string[]] => {
  const result = Validation.of(a => o)
    .ap(checkEmailAddress(o));
    
  return result.isSuccess ? [result.value, undefined] : [undefined, result.value];
};
