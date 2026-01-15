import dotenv from 'dotenv';
import { Worker } from 'bullmq';
import { PrismaClient, JobStatus, JobStepName, StepStatus } from '@repo/db';
import {
    JobInputSchema,
    runProductIntel,
    runUGCStrategy,
    runCreativeDirector,
    runHumanizeQA,
    MockLLMProvider,
    MockVideoProvider,
    MockTTSProvider
} from '@repo/core';

dotenv.config();

const prisma = new PrismaClient();
const connection = {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
};

const llmProvider = new MockLLMProvider();
const videoProvider = new MockVideoProvider();
const ttsProvider = new MockTTSProvider();

async function processJob(job: any) {
    const { jobId, runId } = job.data;
    console.log(`[Worker] Starting job ${jobId} (RunID: ${runId})`);

    try {
        // 1. Update Job Status to RUNNING
        await prisma.job.update({
            where: { id: jobId },
            data: { status: JobStatus.RUNNING, startedAt: new Date() }
        });

        const jobRecord = await prisma.job.findUnique({ where: { id: jobId } });
        if (!jobRecord) throw new Error("Job not found");

        const input = jobRecord.input; // Typed as Json in Prisma, but we know it matches JobInputSchema

        // --- EXECUTE STEPS ---

        // Step 1: Product Intelligence
        await executeStep(jobId, JobStepName.product_intel, async () => {
            return await runProductIntel(llmProvider, input);
        });

        // Fetch output of previous step
        const productIntelStep = await prisma.jobStep.findFirst({
            where: { jobId, step: JobStepName.product_intel }
        });
        const productIntelOutput = productIntelStep?.output;


        // Step 2: UGC Strategy
        await executeStep(jobId, JobStepName.ugc_strategy, async () => {
            return await runUGCStrategy(llmProvider, productIntelOutput);
        });

        const ugcStrategyStep = await prisma.jobStep.findFirst({
            where: { jobId, step: JobStepName.ugc_strategy }
        });
        const ugcStrategyOutput = ugcStrategyStep?.output;


        // Step 3: Creative Director
        await executeStep(jobId, JobStepName.creative, async () => {
            return await runCreativeDirector(llmProvider, ugcStrategyOutput);
        });

        const creativeStep = await prisma.jobStep.findFirst({
            where: { jobId, step: JobStepName.creative }
        });
        const creativeOutput = creativeStep?.output;


        // Step 4: Humanize & QA
        await executeStep(jobId, JobStepName.humanize_qa, async () => {
            return await runHumanizeQA(llmProvider, creativeOutput);
        });

        // Step 5: TTS (Mock)
        await executeStep(jobId, JobStepName.tts, async () => {
            // In reality, map over scripts and generate audio
            return { audioUrl: await ttsProvider.generateAudio("Mock Text") };
        });

        // Step 6: Video Gen (Mock)
        await executeStep(jobId, JobStepName.video_gen, async () => {
            return { videoUrl: await videoProvider.generateVideo("Mock Script", "Mock Audio") };
        });

        // Step 7: Assemble (Mock - FFmpeg would go here)
        await executeStep(jobId, JobStepName.assemble, async () => {
            return { finalVideoUrl: "https://example.com/final-video.mp4" };
        });

        // Step 8: Deliver
        await executeStep(jobId, JobStepName.deliver, async () => {
            // Upload to S3/R2 would happen here or in previous steps
            // Notify n8n
            console.log(`[Worker] Notifying n8n for job ${jobId}`);
            return { delivered: true };
        });


        // 3. Mark Job as SUCCEEDED
        await prisma.job.update({
            where: { id: jobId },
            data: { status: JobStatus.SUCCEEDED, finishedAt: new Date() }
        });

        console.log(`[Worker] Job ${jobId} completed successfully.`);

    } catch (error: any) {
        console.error(`[Worker] Job ${jobId} failed:`, error);
        await prisma.job.update({
            where: { id: jobId },
            data: { status: JobStatus.FAILED, error: error.message, finishedAt: new Date() }
        });
        // Notify n8n failure
    }
}

async function executeStep(jobId: string, stepName: JobStepName, action: () => Promise<any>) {
    console.log(`[Worker] Executing step: ${stepName}`);

    // Create or Update Step record
    // We treat this as "Starting" the step
    let stepRecord = await prisma.jobStep.findFirst({ where: { jobId, step: stepName } });

    if (!stepRecord) {
        stepRecord = await prisma.jobStep.create({
            data: {
                jobId,
                step: stepName,
                status: StepStatus.running,
                startedAt: new Date()
            }
        });
    } else {
        await prisma.jobStep.update({
            where: { id: stepRecord.id },
            data: { status: StepStatus.running, startedAt: new Date() }
        });
    }

    try {
        const output = await action();

        await prisma.jobStep.update({
            where: { id: stepRecord.id },
            data: {
                status: StepStatus.succeeded,
                finishedAt: new Date(),
                output: output // Prisma handles Json type
            }
        });
        console.log(`[Worker] Step ${stepName} succeeded.`);
    } catch (e: any) {
        console.error(`[Worker] Step ${stepName} failed:`, e);
        await prisma.jobStep.update({
            where: { id: stepRecord.id },
            data: {
                status: StepStatus.failed,
                finishedAt: new Date(),
                error: e.message
            }
        });
        throw e; // Re-throw to fail the job
    }
}


const worker = new Worker('ugc-video-jobs', processJob, {
    connection,
    concurrency: parseInt(process.env.WORKER_CONCURRENCY || '1')
});

console.log('Worker started, listening for jobs...');
