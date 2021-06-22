import * as R from 'ramda';

import { JokeType, getRandomJoke } from './getRandomJoke';
import { IMaybe, Maybe } from './classes/Maybe';

const _getJokeAsMaybe = async() => {
  const jockItem: JokeType = await getRandomJoke();
  const jock = R.view(R.lensProp('joke'), jockItem);
  return jock;
}

export const getJokeAsMaybe = () => new Promise<IMaybe<string>>((resolve, reject) => {
  _getJokeAsMaybe()
    .then((jock: string) => resolve(Maybe.Just(jock)))
    .catch(e => resolve(Maybe.Nothing));
});

export { IMaybe, Maybe };
