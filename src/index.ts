import express, { Request, Response } from 'express';
import AppDataSource from './db';
import redisClient from './redis';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  return res.send('Hello, TypeScript with Express!');
});

async function start() {
  await AppDataSource.initialize().then(() => {
    console.log('Connected Database...');
  });

  await redisClient.once('connect', () => {
    console.log('Connected Redis...');
  });

  await app.listen(port, () => {
    console.log(`Connected Server...`);
  });
}

start();
