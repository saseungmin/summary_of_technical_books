import { getFileNameAndNumber } from '../utils/getFileNameAndNumber';

const [filename, numberOfFakeItems] = getFileNameAndNumber('data/fake.csv', 100000);

console.log(filename, numberOfFakeItems);
// data/fake.csv 100000
