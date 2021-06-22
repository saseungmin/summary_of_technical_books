// NOTE - IPerson 타입을 선언, name과 age 속성 외에는 모두 선택 속성
import { ILocation } from "../location";

export type IPerson = {
  name: string;
  age: number;
  title?: string;
  location?: ILocation;
};

export { ILocation };
