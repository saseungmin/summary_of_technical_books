import * as R from 'ramda';

import { IPerson, makeRandomIPerson } from './model/person';

const originalPerson: IPerson = makeRandomIPerson();
const keys: string[] = R.keys(originalPerson);
const values: any[] = R.values(originalPerson);
const zippedPerson: IPerson = R.zipObj(keys, values) as IPerson;

console.log(
  'originalPerson: ', originalPerson,
  'zippedPerson: ', zippedPerson,
);
// originalPerson:  {
//   name: 'Lester Watson',
//   age: 35,
//   title: 'Sports Event Manager',
//   location: {
//     country: 'MC',
//     city: 'Uzwene',
//     address: '1224 Dilje Place',
//     coordinates: { latitude: -12.42406, longitude: 11.30348 }
//   }
// } 
// zippedPerson:  {
//   name: 'Lester Watson',
//   age: 35,
//   title: 'Sports Event Manager',
//   location: {
//     country: 'MC',
//     city: 'Uzwene',
//     address: '1224 Dilje Place',
//     coordinates: { latitude: -12.42406, longitude: 11.30348 }
//   }
// }
