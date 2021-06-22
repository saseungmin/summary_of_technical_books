import rimraf from 'rimraf';

import { fileExists } from './fileExists';

export const rmdir = (dirname: string): Promise<string> => new Promise(async (resolve, reject) => {
  const alreadyExists = await fileExists(dirname);

  if (!alreadyExists) {
    resolve(dirname);
    return;
  }

  rimraf(dirname, (error) => (error ? reject(error) : resolve(dirname)));
});
