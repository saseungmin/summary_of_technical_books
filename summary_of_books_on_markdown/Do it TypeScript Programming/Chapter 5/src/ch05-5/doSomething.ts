import { ResultType } from "./ResultType";

export const doSomething = (): ResultType => {
  try {
    throw new Error('Some error occurs...');
  } catch (e) {
    return [false, e.message];
  }
}