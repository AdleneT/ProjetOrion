import { Queue } from 'bullmq';

const globalForQueue = global as unknown as { queue: Queue };

export const jobQueue = globalForQueue.queue || new Queue('ugc-video-jobs', {
    connection: {
        url: process.env.REDIS_URL || 'redis://localhost:6379'
    }
});

if (process.env.NODE_ENV !== 'production') globalForQueue.queue = jobQueue;
