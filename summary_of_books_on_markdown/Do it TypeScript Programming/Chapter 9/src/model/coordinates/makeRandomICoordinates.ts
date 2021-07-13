import Chance from 'chance';

import { ICoordinates } from "./ICoordinates";
import { makeICoordinates } from './makeICoordinates';

const c = new Chance;

// NOTE - chance 패키지를 사용해 makeRandomICoordinates 함수
export const makeRandomICoordinates = (): ICoordinates => 
  makeICoordinates(c.latitude(), c.longitude());
