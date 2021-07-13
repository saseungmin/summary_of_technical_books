import { ICoordinates } from "../coordinates";

// NOTE -  어떤 사람의 주소, country만 필수 속성
export type ILocation = {
  country: string;
  city?: string;
  address?: string;
  coordinates?: ICoordinates;
};
