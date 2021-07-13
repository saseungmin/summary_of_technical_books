/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
import { getFileNameAndNumber } from './utils';
import { csvFileReaderGenerator } from './csv/csvFileReaderGenerator';

const [filename] = getFileNameAndNumber('./data/fake-1.csv', 1);

let line = 1;

for (const object of csvFileReaderGenerator(filename)) {
  console.log(`[${line++}] ${JSON.stringify(object)}`);
}

console.log('\n read complete.');
