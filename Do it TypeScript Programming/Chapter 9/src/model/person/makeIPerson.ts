// NOTE - IPerson 타입 객체를 생성하는 makeIPerson
import { ILocation, IPerson } from "./IPerson";

export const makeIPerson = (
  name: string,
  age: number,
  title?: string,
  location?: ILocation,
): IPerson => ({ name, age, title, location });

export { IPerson, ILocation };
