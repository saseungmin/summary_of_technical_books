import * as R from 'ramda';

import { IPerson, makeRandomIPerson } from './model/person';
import { displayPersons } from './displayPersons';

const persons: IPerson[] = R.range(1, 4 + 1).map(makeRandomIPerson);
const nameSortedPersons = R.sortBy(R.prop('name'))(persons);
const ageSortedPersons = R.sortBy(R.prop('age'))(persons);

displayPersons('sorted by name: ')(nameSortedPersons);
displayPersons('sorted by age: ')(ageSortedPersons);

// sorted by name:  [
//   { name: 'Annie Harris', age: 60 },
//   { name: 'Billy Smith', age: 64 },
//   { name: 'Christine Ortiz', age: 50 },
//   { name: 'Johnny Pittman', age: 35 }
// ]
// sorted by age:  [
//   { name: 'Johnny Pittman', age: 35 },
//   { name: 'Christine Ortiz', age: 50 },
//   { name: 'Annie Harris', age: 60 },
//   { name: 'Billy Smith', age: 64 }
// ]
