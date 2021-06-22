import { IFake, makeFakeData } from '../fake/makeFakeData';

const data: IFake = makeFakeData();
const keys = Object.keys(data);

console.log('keys: ', keys);

const values = Object.values(data);

console.log('values: ', values);

// keys:  [ 'name', 'email', 'profession', 'birthday', 'sentence' ]
// values:  [
//   'Mittie Norton',
//   'dalhemjik@do.gp',
//   'Radiology Manager',
//   1985-02-27T14:22:51.182Z,
//   'Zuwwiz ubwemneb wejed solemi jet sorduhwo otezilur atsa ew mujaw ic uho da.'
// ]
