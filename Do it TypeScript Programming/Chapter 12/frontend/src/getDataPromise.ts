import { IUser } from './IUser';

type GetDataPromiseCallback = (a: IUser[]) => void;

export const getDataPromise =  (fn: GetDataPromiseCallback) => (
  skip: number,
  limit: number,
) => fetch(`http://localhost:4000/users/${skip}/${limit}`)
      .then((res) => res.json())
      .then(fn);
