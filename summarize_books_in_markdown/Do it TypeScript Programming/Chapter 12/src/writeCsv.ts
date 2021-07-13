import { getFileNameAndNumber } from './utils/getFileNameAndNumber';
import { writeCsvFormatFakeData } from './fake/writeCsvFormatFakeData';

const [filename, numberOfFakeData] = getFileNameAndNumber('./data/fake', 1);
const csvFilename = `${filename}-${numberOfFakeData}.csv`;

writeCsvFormatFakeData(csvFilename, numberOfFakeData)
  .then((result) => console.log(result))
  .catch((e: Error) => console.log(e.message));
