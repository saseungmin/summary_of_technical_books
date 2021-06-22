import { appendFile } from '../fileApi/appendFile';
import { mkdir } from '../fileApi/mkdir';

const appendTest = async (filename: string, data: any) => {
  const result = await appendFile(filename, data);
  console.log(`append ${result} to ${filename}`);
};

mkdir('./data')
  .then(() => appendTest('./data/hello.txt', 'Hi there!'))
  .catch((e: Error) => console.log(e.message));
