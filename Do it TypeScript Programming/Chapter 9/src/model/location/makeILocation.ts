import { ILocation } from "./ILocation";
import { ICoordinates } from "../coordinates";

// NOTE - ILocation 타입 객체를 생성하는 makeILocation
export const makeILocation = (
  country: string,
  city: string,
  address: string,
  coordinates: ICoordinates,
): ILocation => ({ country, city, address, coordinates });
