import { fetchJokes } from './fetchJokes';

const random = (max: number) => Math.floor(Math.random() * max);

export type JokeType = {
  id: number,
  joke: string,
  category: string[],
};

export type FetchResult = {
  type: string,
  value: JokeType[],
};

export const getRandomJoke = () => new Promise<JokeType>((resolve, reject) => {
  fetchJokes<FetchResult>()
    .then((result: FetchResult) => {
      let array: JokeType[] = result.value;
      resolve(array[random(array.length)]);
    })
    .catch((e: Error) => reject(e));
});
