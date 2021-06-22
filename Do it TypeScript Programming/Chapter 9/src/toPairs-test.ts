import * as R from 'ramda';

import { IPerson, makeRandomIPerson } from './model/person';

const person: IPerson = makeRandomIPerson();
const pairs: [string, any][] = R.toPairs(person);

console.log('pairs', pairs);
// pairs [
//   [ 'name', 'Delia Kim' ],
//   [ 'age', 28 ],
//   [ 'title', 'Service Manager' ],
//   [
//     'location',
//     {
//       country: 'RW',
//       city: 'Tulnulhan',
//       address: '26 Evebu Extension',
//       coordinates: [Object]
//     }
//   ]
// ]
