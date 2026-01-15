import { PrismaClient, AgentName } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding initial prompts...')

    const prompts = [
        {
            agentName: AgentName.product_intel,
            version: '1.0.0',
            prompt: 'You are an expert product intelligence analyst. Analyze the provided product information and extract key selling points, target audience, and hooks.',
        },
        {
            agentName: AgentName.ugc_strategist,
            version: '1.0.0',
            prompt: 'You are a UGC strategist for TikTok and Meta. Create 3 distinct video concepts based on the product analysis.',
        },
        {
            agentName: AgentName.creative_director,
            version: '1.0.0',
            prompt: 'You are a creative director. Write 3 full scripts based on the provided UGC concepts. Include visual cues and spoken audio.',
        },
        {
            agentName: AgentName.humanize_qa,
            version: '1.0.0',
            prompt: 'You are a QA specialist and script doctor. Review the scripts for natural language and engagement. Rate them and improve them slightly.',
        }
    ]

    for (const p of prompts) {
        await prisma.promptVersion.create({
            data: {
                agentName: p.agentName,
                version: p.version,
                prompt: p.prompt,
                isActive: true,
            }
        })
    }

    console.log('Seeding completed.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
