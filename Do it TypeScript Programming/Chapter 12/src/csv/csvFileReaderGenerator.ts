/* eslint-disable no-restricted-syntax */
import { readFileGenerator } from '../fileApi';
import { zip } from '../utils';

export function* csvFileReaderGenerator(filename: string, delim: string = ',') {
  let header = [];

  for (const line of readFileGenerator(filename)) {
    if (!header.length) {
      header = line.split(delim);
    } else {
      yield zip(header, line.split(delim));
    }
  }
}
