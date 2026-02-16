import { ConnectionOptions } from "bullmq";

export const queueConnection:ConnectionOptions = {
    url: process.env.REDIS_UR,
    maxRetriesPerRequest: null
}