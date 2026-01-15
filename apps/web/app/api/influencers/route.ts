import { NextResponse } from 'next/server';
import { PrismaClient } from '@repo/db';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const influencers = await prisma.influencer.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                language: true,
                persona: true,
                // We do NOT expose elevenlabsVoiceId here for security/privacy if desired, 
                // though usually public in client-side app isn't a HUGE risk if scoped, but let's hide it as requested.
            }
        });
        return NextResponse.json(influencers);
    } catch (error) {
        console.error('Error fetching influencers:', error);
        return NextResponse.json({ error: 'Failed to fetch influencers' }, { status: 500 });
    }
}
