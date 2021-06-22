import { deleteFile } from '../fileApi/deleteFile';
import { rmdir } from '../fileApi/rmdir';

const deleteTest = async (filename: string) => {
  const result = await deleteFile(filename);
  console.log(`delete ${result} file.`);
};

Promise.all([deleteTest('./data/hello.txt'), deleteTest('./data/test.json')])
  .then(() => rmdir('./data'))
  .then((dirname) => console.log(`delete ${dirname} dir`))
  .catch((e: Error) => console.log(e.message));
