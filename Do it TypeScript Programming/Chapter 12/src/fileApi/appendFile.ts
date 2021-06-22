import * as fs from 'fs';

export const appendFile = (
  filename: string, data: any,
): Promise<any> => new Promise((resolve, reject) => {
  fs.appendFile(filename, data, 'utf8', (error: Error) => {
    if (error) {
      reject(error);
      return;
    }

    resolve(data);
  });
});
