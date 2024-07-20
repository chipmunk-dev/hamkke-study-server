import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import swaggerSpec from './swagger';
import rootRouter from './route';
import AppDataSource from './db/db';
import redisClient from './db/redis';
import { env } from './const/env';

const app = express();
const port = env.SERVER_PORT;

app.use(morgan(env.MORGAN_PRESET));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', rootRouter);

async function start() {
  await AppDataSource.initialize().then(() => {
    console.log('Connected Database...');
  });

  await redisClient.once('connect', () => {
    console.log('Connected Cache...');
  });

  await app.listen(port, () => {
    console.log(`Connected Server...`);
  });
}

start();

export default app;
