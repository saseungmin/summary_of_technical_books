import { ICoordinates } from "./ICoordinates";

// NOTE - ICoordinates 객체를 쉽게 만들어 주는 makeICoordinates 함수
export const makeICoordinates = (latitude: number, longitude: number):
  ICoordinates => ({ latitude, longitude });
