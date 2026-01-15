import { NextResponse } from 'next/server';
import { JobStatus, Platform } from '@repo/db';
import { JobInputSchema } from '@repo/core';
import { jobQueue } from '@/lib/queue';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate Input
        const result = JobInputSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });
        }
        const { platform, influencerId, brief } = result.data;

        // Create Job in DB
        const job = await prisma.job.create({
            data: {
                platform: platform as Platform,
                influencerId: influencerId,
                input: brief,
                status: JobStatus.QUEUED
            }
        });

        // Add to Queue
        await jobQueue.add('process-job', {
            jobId: job.id,
            runId: job.runId,
        });

        return NextResponse.json({ jobId: job.id, runId: job.runId, status: 'QUEUED' }, { status: 201 });

    } catch (error) {
        console.error('Error creating job:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET() {
    const jobs = await prisma.job.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50
    });
    return NextResponse.json({ jobs });
}
