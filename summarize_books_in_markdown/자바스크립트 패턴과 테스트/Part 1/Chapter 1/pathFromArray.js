import rj3 from './rj.js';

import pathFromFunction from './pathFromFunction.js';

const arrayData = [
  [10, 130],
  [100, 60],
  [190, 160],
  [280, 10],
];

const lineGenerator = rj3.svg.line();
const path = lineGenerator(arrayData);

document.getElementById('pathFromArrays').setAttribute('d', path);
pathFromFunction();
