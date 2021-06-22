import * as R from 'ramda';

import { IPerson, makeRandomIPerson } from './model/person';
import { makeLens, getter, setter, setterUsingFunc } from './lens';

const nameLens = makeLens('name');
const getName = getter(nameLens);
const setName = setter(nameLens);
const setNameUsingFunc = setterUsingFunc(nameLens);

const person: IPerson = makeRandomIPerson();

const name = getName(person); // 랜덤 생성 이름
const newPerson = setName('Seungmin')(person);
const anotherPerson = setNameUsingFunc(name => `'Mr. ${name}'`)(person);
const capitalPerson = setNameUsingFunc(R.toUpper)(person);

console.log(
  name, getName(newPerson), getName(anotherPerson), getName(capitalPerson),
);
// Sally Griffith Seungmin 'Mr. Sally Griffith' SALLY GRIFFITH
