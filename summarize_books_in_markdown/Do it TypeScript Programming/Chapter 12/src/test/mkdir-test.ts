import { mkdir } from '../fileApi/mkdir';

const makeDataDir = async (dirname: string) => {
  const result = await mkdir(dirname);

  console.log(`${result} dir created`);
};

makeDataDir('./data/today');
