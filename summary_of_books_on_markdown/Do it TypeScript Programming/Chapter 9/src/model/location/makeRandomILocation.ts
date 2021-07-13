import Chance from 'chance';

import { ILocation } from "./ILocation";
import { makeILocation } from './makeILocation';
import { makeRandomICoordinates } from '../coordinates';

const c = new Chance;

// NOTE - ILocation의 각 속성값을 설정
export const makeRandomILocation = (): ILocation =>
  makeILocation(c.country(), c.city(), c.address(), makeRandomICoordinates());
