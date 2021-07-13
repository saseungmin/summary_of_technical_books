/* eslint-disable no-restricted-syntax */
import { readFileGenerator } from '../fileApi';

for (const value of readFileGenerator('data/fake-10000.csv')) {
  console.log('<line>', value, '</line>');
  break;
}

// <line> name,email,profession,birthday,sentence </line>
