import INameable from './INameable';

let obj: object = { name: 'Jack' };

let name1 = (<INameable>obj).name;
let name2 = (obj as INameable).name;

export const result = {
  name1,
  name2,
}