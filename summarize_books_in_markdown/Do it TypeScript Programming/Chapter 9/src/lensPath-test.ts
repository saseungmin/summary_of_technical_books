import * as R from 'ramda';

import { getter, setter, setterUsingFunc } from './lens';
import { IPerson, makeRandomIPerson } from './model/person';

const longitudeLens = R.lensPath(['location', 'coordinates', 'longitude']);
const getLongitude = getter(longitudeLens);
const setLongitude = setter(longitudeLens);
const setLongitudeUsingFunc = setterUsingFunc(longitudeLens);

const person: IPerson = makeRandomIPerson();

const longitude = getLongitude(person);
const newPerson = setLongitude(0.1234567)(person);
const anotherPerson = setLongitudeUsingFunc(R.add(0.1234567))(person);

console.log(
  longitude, getLongitude(newPerson), getLongitude(anotherPerson),
);
// 91.00362 0.1234567 91.1270767
