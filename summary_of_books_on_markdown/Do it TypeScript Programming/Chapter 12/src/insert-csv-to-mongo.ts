/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { connect } from './mongodb/connect';
import { csvFileReaderGenerator } from './csv/csvFileReaderGenerator';
import { getFileNameAndNumber } from './utils';

const insertCsvToMongo = async (csvFilename, collectionName, index) => {
  let connection;

  try {
    connection = await connect();
    const db = await connection.db('ch12-2');
    const collection = db.collection(collectionName);
    await collection.deleteMany({});
    await collection.createIndex(index);

    let line = 1;

    for (const object of csvFileReaderGenerator(csvFilename)) {
      await collection.insertOne(object);
      console.log(`${line++} inserted.`);
    }

    console.log('\n insertion complete.');
  } catch (error) {
    console.log(error.message);
  } finally {
    connection.close();
  }
};

const [filename] = getFileNameAndNumber('./data/fake-1000.csv', 1);
insertCsvToMongo(filename, 'users', { birthday: -1, name: 1 });
