import mongoose from 'mongoose';
import Redis from "ioredis";
import dotenv from "dotenv"
dotenv.config()



console.log("redisclient at congig",process.env.REDIS_URL)

let redisClient;
export async function connectRedis() {
  try {
   
      redisClient = new Redis(process.env.REDIS_URL, {
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });

    redisClient.on("connect", () => {
      console.log("Redis connected successfully ✅");
    });

    redisClient.on("error", (err) => {
      console.error("Redis connection error:", err);
    });

    // Wait until the connection is ready
    await redisClient.ping();
    return redisClient;
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
    throw err;
  }
}


export function getRedisClient() {
  if (!redisClient) {
    throw new Error("Redis client not initialized. Call connectRedis first.");
  }
  return redisClient;
}



export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    console.log('MongoDB connected successfully ✅');

    // Optional: Listen to connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected ❌');
    });

    return mongoose.connection;
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    throw err;
  }
}
