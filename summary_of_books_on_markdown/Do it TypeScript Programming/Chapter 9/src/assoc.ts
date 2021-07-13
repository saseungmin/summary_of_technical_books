import * as R from 'ramda';

import { IPerson, makeRandomIPerson } from './model/person';

const getName = R.pipe(R.prop('name'), R.tap(name => console.log(name)));

const person: IPerson = makeRandomIPerson();
const originalName = getName(person); // 랜덤 생성된 이름

const modifiedPerson = R.assoc('name', 'Seungmin')(person);
const modifiedName = getName(modifiedPerson); // Seungmin

console.log(originalName, modifiedName);
// Micheal Bates Seungmin