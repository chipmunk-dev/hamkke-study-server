import dotenv from 'dotenv';

dotenv.config();

export const env = {
  SERVER_PORT: Number(process.env.SERVER_PORT),
  REDIS_HOST: `${process.env.REDIS_HOST}`,
  DB_TYPE: `${process.env.DB_TYPE}`,
  DB_HOST: `${process.env.DB_HOST}`,
  DB_PORT: Number(process.env.DB_HOST),
  DB_USERNAME: `${process.env.DB_USER}`,
  DB_PASSWORD: `${process.env.DB_PASSWORD}`,
  DB_DATABASE: `${process.env.DB_DATABASE}`,
  JWT_SECRET: `${process.env.JWT_SECRET}`,
  BC_SALT_ROUNDS: Number(process.env.BC_SALT_ROUNDS),
};
