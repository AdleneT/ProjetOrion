import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const globalForQueue = global as unknown as { queue: Queue };

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
});

export const jobQueue = globalForQueue.queue || new Queue('ugc-video-jobs', {
    connection
});

if (process.env.NODE_ENV !== 'production') globalForQueue.queue = jobQueue;
