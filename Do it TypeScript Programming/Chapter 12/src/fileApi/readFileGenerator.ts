/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import * as fs from 'fs';

function readLine(fd: any, buffer: Buffer, bufferSize: number, position: number): [string, number] {
  let line = '';
  let readSize;
  const crSize = '\n'.length;

  while (true) {
    readSize = fs.readSync(fd, buffer, 0, bufferSize, position);

    if (readSize > 0) {
      const temp = buffer.toString('utf8', 0, readSize);
      const index = temp.indexOf('\n');

      if (index > -1) {
        line += temp.substr(0, index);
        position += index + crSize;
        break;
      } else {
        line += temp;
        position += temp.length;
      }
    } else {
      position = -1; // end of file
      break;
    }
  }

  return [line.trim(), position];
}

export function* readFileGenerator(filename: string): any {
  let fd: any;

  try {
    fd = fs.openSync(filename, 'rs');

    const stats = fs.fstatSync(fd);
    const bufferSize = Math.min(stats.size, 1024);
    const buffer = Buffer.alloc(bufferSize + 4);
    let filepos = 0;
    let line;

    while (filepos > -1) {
      [line, filepos] = readLine(fd, buffer, bufferSize, filepos);

      if (filepos > -1) {
        yield line;
      }
    }

    yield buffer.toString(); // 마지막 줄
  } catch (error) {
    console.log('readLine: ', error.message);
  } finally {
    fd && fs.closeSync(fd);
  }
}
