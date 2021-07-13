import * as fs from 'fs';

import { fileExists } from './fileExists';

export const deleteFile = (
  filename: string,
): Promise<string> => new Promise<any>(async (resolve, reject) => {
  const alreadyExists = await fileExists(filename);

  if (!alreadyExists) {
    resolve(filename);
    return;
  }

  fs.unlink(filename, (error) => (error ? reject(error) : resolve(filename)));
});
