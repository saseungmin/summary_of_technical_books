/* eslint-disable import/no-unresolved */
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

export const runServer = (mongodb) => {
  const app = express();
  const port = 4000;

  app
    .use(bodyParser.urlencoded({ extended: true }))
    .use(cors())
    .get('/', (req, res) => res.json({ message: 'Hello world!' }))
    .get('/users/:skip/:limit', async (req, res) => {
      const { skip, limit } = req.params;

      const usersCollection = await mongodb.collection('users');
      const cursor = await usersCollection
        .find({})
        .sort({ name: 1 })
        .skip(parseInt(skip, 10))
        .limit(parseInt(limit, 10));

      const result = await cursor.toArray();

      res.json(result);
    })
    .listen(port, () => console.log(`http://localhost:${port} started...`));
};
