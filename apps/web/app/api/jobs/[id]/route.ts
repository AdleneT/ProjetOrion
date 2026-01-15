import { NextResponse } from 'next/server';
import { PrismaClient } from '@repo/db';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const job = await prisma.job.findUnique({
            where: { id: params.id },
            include: {
                steps: { orderBy: { startedAt: 'asc' } },
                assets: true,
            }
        });

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        return NextResponse.json(job);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
