import { makeRandomNumber } from "../utils/makeRandomNumber";
import IPerson from "./IPerson";


export default class Person implements IPerson {
  constructor(public name: string, public age: number = makeRandomNumber()) {};
}

export const makePerson = 
  ( name: string, age: number = makeRandomNumber()): IPerson => ({ name, age });