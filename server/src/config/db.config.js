import mongoose from 'mongoose';
import Redis from "ioredis";

let redisClient;
let Mongo_Url='mongodb+srv://vikas:WgrhqNeXhGjrNElr@cluster0.ns0yviu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
let REDIS_URL="rediss://default:Afd5AAIncDE0ZDNmYmUxZjY5NDk0ZDAyOGZiNTI3YjdmMzQwYmM2NXAxNjMzNTM@ideal-koala-63353.upstash.io:6379"



export async function connectRedis() {
  try {
    redisClient = new Redis(REDIS_URL);

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
    await mongoose.connect(Mongo_Url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

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
