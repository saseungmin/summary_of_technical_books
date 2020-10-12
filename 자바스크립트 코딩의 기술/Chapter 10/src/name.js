import * as utils from './util.js';

function greet(name) {
  return `Hello, ${utils.capitalize(name)}`;
}

console.log(greet('seungmin'));

export { greet }; 