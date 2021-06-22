import { getJokeAsMaybe, IMaybe } from '../getJokeAsMaybe';

(async() => {
  const joke: IMaybe<string> = await getJokeAsMaybe();
  console.log(joke.getOrElse('something wrong'));
})();
