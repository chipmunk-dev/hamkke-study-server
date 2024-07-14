import express from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerSpec from './swagger';
import rootRouter from './route';
import AppDataSource from './db/db';
import redisClient from './db/redis';
import { env } from './const/env';

const app = express();
const port = env.SERVER_PORT;

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', rootRouter);

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

export default app;
