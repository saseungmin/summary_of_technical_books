import mkdirp from 'mkdirp';

import { fileExists } from './fileExists';

export const mkdir = (dirname: string): Promise<string> => new Promise(async (resolve, reject) => {
  const alreadyExists = await fileExists(dirname);

  if (alreadyExists) {
    resolve(dirname);
    return;
  }

  mkdirp(dirname)
    .then(() => resolve(dirname))
    .catch((error) => reject(error));
});
