import { readFileSync, readFile } from "fs";

// 동기 방식으로 읽기
const buffer: Buffer = readFileSync('./package.json');
console.log(buffer.toString());

// 비동기 방식으로 읽기
readFile('./package.json', (error: Error, buffer: Buffer) => {
  console.log(buffer.toString());
});

// Promise와 async/await 구문을 사용한 예
const readFilePromise = (filename: string): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    readFile(filename, (error: Error, buffer: Buffer) => {
      if(error) {
        reject(error);
      } else {
        resolve(buffer.toString());
      }
    });
  });

(async () => {
  const content = await readFilePromise('./package.json');
  console.log(content);
})();
