import { writeFile } from '../fileApi/writeFile';
import { mkdir } from '../fileApi/mkdir';

const writeTest = async (filename: string, data: any) => {
  const result = await writeFile(filename, data);
  console.log(`write ${result} to ${filename}`);
};

mkdir('./data')
  .then(() => writeTest('./data/hello.txt', 'hello world'))
  .then(() => writeTest('./data/test.json', JSON.stringify({ name: 'Jack', age: 32 }, null, 2)))
  .catch((e: Error) => console.log(e.message));
