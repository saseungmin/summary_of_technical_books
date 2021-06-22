import * as R from 'ramda';

import { IPerson, makeRandomIPerson } from './model/person';
import { ILocation, makeRandomILocation } from './model/location';
import { ICoordinates, makeRandomICoordinates } from './model/coordinates';

const person: IPerson = makeRandomIPerson();
const location: ILocation = makeRandomILocation();
const coordinates: ICoordinates = makeRandomICoordinates();

const newLocation = R.mergeDeepRight(location, { coordinates });
const newPerson = R.mergeDeepRight(person, { location: newLocation });

console.log('person: ', person);
console.log('newPerson: ', newPerson);

// person:  {
//   name: 'Luke Tucker',
//   age: 25,
//   title: 'Fashion Events Manager',
//   location: {
//     country: 'IN',
//     city: 'Sikunfuz',
//     address: '718 Kasow Lane',
//     coordinates: { latitude: -52.50551, longitude: 163.47631 }
//   }
// }
// newPerson:  {
//   name: 'Luke Tucker',
//   age: 25,
//   title: 'Fashion Events Manager',
//   location: {
//     country: 'BZ',
//     city: 'Gocowzu',
//     address: '1382 Nezsez Avenue',
//     coordinates: { latitude: 77.93522, longitude: -39.51324 }
//   }
// }
