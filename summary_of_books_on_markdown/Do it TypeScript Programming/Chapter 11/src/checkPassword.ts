import { Validation } from './classes/Validation';
import { checkNull } from './utils/checkNull';
import { checkLength } from './utils/checkLength';

export const checkPassword = (o): [object, string[]] => {
  const result = Validation.of(a => b => o)
    .ap(checkNull(o))
    .ap(checkLength(o));

  return result.isSuccess ? [result.value, undefined] : [undefined, result.value];
};
