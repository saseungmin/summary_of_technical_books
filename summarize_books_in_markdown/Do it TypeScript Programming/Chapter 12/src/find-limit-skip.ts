import { connect } from './mongodb/connect';
import { IFake } from './fake/IFake';

const findLimitSkip = async () => {
  let connection;

  try {
    connection = await connect();
    const db = await connection.db('ch12-2');
    const usersCollection = db.collection('users');

    const cursor = await usersCollection.find({})
      .sort({ birthday: -1, name: 1 })
      .skip(100)
      .limit(5);

    const result = await cursor.toArray();

    console.log(result.map((user: IFake) => ({
      name: user.name,
      birthday: user.birthday,
    })));
  } catch (error) {
    console.log(error.message);
  } finally {
    connection.close();
  }
};

findLimitSkip();
