import { checkEmail } from '../checkEmail';

[
  { email: 'abc@efg.com' },
  { email: 'abcefg' },
].forEach((target, index) => {
  const [ value, failureReason ] = checkEmail(target);

  if (failureReason) {
    console.log(index, 'validation fail.', JSON.stringify(failureReason));
  } else {
    console.log(index, 'validation ok.', JSON.stringify(value));
  }
});
