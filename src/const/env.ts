import dotenv from 'dotenv';

dotenv.config();

export const env = {
  REDIS_HOST: `${process.env.REDIS_HOST}`,
  DB_TYPE: `${process.env.DB_TYPE}`,
  DB_HOST: `${process.env.DB_HOST}`,
  DB_PORT: Number(process.env.DB_HOST),
  DB_USERNAME: `${process.env.DB_USER}`,
  DB_PASSWORD: `${process.env.DB_PASSWORD}`,
  DB_DATABASE: `${process.env.DB_DATABASE}`,
};
