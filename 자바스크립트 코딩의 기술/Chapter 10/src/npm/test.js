import { capitalize, roundToDecimalPlace } from './util.js';

function giveTotal(name, total) {
  return `${capitalize(name)}님, 합계는 ${roundToDecimalPlace(total)} 입니다.`;
}

console.log(giveTotal('sara', 10.3333333));

export { giveTotal };