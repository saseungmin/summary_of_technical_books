import { Chance } from 'chance';
import { IPerson, makeIPerson } from './makeIPerson';
import { makeRandomILocation } from '../location';

const c = new Chance;

export const makeRandomIPerson = (): IPerson =>
  makeIPerson(c.name(), c.age(), c.profession(), makeRandomILocation());
