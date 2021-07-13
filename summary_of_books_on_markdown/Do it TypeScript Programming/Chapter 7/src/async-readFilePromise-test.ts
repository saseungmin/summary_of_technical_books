import { readFilePromise } from "./readFilePromise"

const readFilesAll = async (fileNames: string[]) => {
  return await Promise.all(
    fileNames.map(fileNames => readFilePromise(fileNames))
  );
}

readFilesAll(['./package.json', './tsconfig.json'])
  .then(([packageJson, tsConfigJson]: string[]) => {
    console.log(packageJson);
    console.log(tsConfigJson);
  })
  .catch(err => console.log(err))
