import { fetchJokes } from '../fetchJokes';

fetchJokes()
  .then(result => console.log(result))
  .catch((e: Error) => console.log(e));
