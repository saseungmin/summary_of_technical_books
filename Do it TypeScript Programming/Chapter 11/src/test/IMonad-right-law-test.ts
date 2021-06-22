import { Identity } from '../classes/Identity';

const m = Identity.of(1);

console.log(
  m.chain(Identity.of).equals(m),
);
