// config/redis.js
import { createClient } from 'redis';
import { promisify } from 'util';

const redisClient = createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// Promisify Redis methods
redisClient.getAsync = promisify(redisClient.get).bind(redisClient);
redisClient.setexAsync = promisify(redisClient.setex).bind(redisClient);
redisClient.delAsync = promisify(redisClient.del).bind(redisClient);

export default redisClient;