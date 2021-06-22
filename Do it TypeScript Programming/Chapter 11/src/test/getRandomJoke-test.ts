import * as R from 'ramda';

import { getRandomJoke, JokeType } from '../getRandomJoke';

getRandomJoke()
  .then((JockItem: JokeType) => {
    const joke = R.view(R.lensProp('joke'), JockItem);
    console.log(joke);
  })
  .catch((e: Error) => console.log(e.message));
