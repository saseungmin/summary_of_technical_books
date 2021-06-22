import * as fs from 'fs';
import * as R from 'ramda';

import { IO } from '../classes/IO';

const work1 = () => fs.readFileSync('package.json');
const work2 = (json1) => () => {
  const json2 = fs.readFileSync('tsconfig.json');
  return [json1, json2];
};

const result = IO.of(work1)
  .chain(json1 => IO.of(work2(json1)))
  .map(R.map(JSON.parse))
  .map(R.reduce((result: object, obj: object) => ({ ...result, ...obj }), {}))
  .runIO()

console.log(result); // package.json과 tsconfig.json 파일 내용 출력
