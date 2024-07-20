import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from '../const/env';
import { join } from 'path';

type DatabaseType = 'mysql' | 'postgres' | 'mongodb';

const AppDataSource = new DataSource({
  type: env.DB_TYPE as DatabaseType,
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  entities: [join(__dirname, '../**/*.entity.{ts,js}')],
  synchronize: true,
  logging: false,
});

export default AppDataSource;
