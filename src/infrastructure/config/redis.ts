import { createClient, RedisClientType } from "redis";
import logger from "../utils/logger/DevLogger";

let redisClient: RedisClientType;

export const connectRedis = async (): Promise<void> => {
    try {
        redisClient = createClient({
            url: process.env.REDIS_URL
        });
        
        redisClient.on("error", (err: Error) => {
            logger.error("Redis Client Error", err);
        });

        await redisClient.connect();
        logger.info("Successfully connected to Redis");
    } catch (error) {
        logger.error("Error in connect to redis", error);
        process.exit(1);
    }
};

export const getRedisClient = (): RedisClientType => {
    if (!redisClient) {
        throw new Error("Redis client is not connected");
    }
    return redisClient;
};
