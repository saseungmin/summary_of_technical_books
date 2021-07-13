import { Identity } from '../classes/Identity';

type IPerson = {
  name: string,
  age: number,
};

const jack = Identity.of(['Jack', 32]);

console.log(
  jack
    .map(([name, age]) => ({ name, age }))
    .chain((p: IPerson) => Identity.of(p))
    .map(({ name, age }) => [name, age])
    .value()[0] === jack.value()[0] // true
);
