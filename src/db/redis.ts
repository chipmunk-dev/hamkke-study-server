import Redis from 'ioredis';
import { env } from '../const/env';

const redisClient = new Redis(env.REDIS_HOST);

redisClient.on('connect', () => {
  console.log('Connected Redis...');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

export default redisClient;
