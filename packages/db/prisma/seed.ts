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
        await prisma.promptVersion.upsert({
            where: { id: `seed-${p.agentName}` }, // Hacky but we don't use id check here mostly
            update: {
                prompt: p.prompt
            },
            create: {
                agentName: p.agentName,
                version: p.version,
                prompt: p.prompt,
                isActive: true,
            }
        }).catch(async (e) => {
            // Fallback if ID-based upsert fails or isn't possible (PromptVersion doesn't have unique generic ID for seeding easily without hardcoded UUIDs, so we just create if not exists logically)
            // Actually, simplest is just create and ignore if duplicate logic, 
            // but here we just rely on existing loop which was `.create`.
            // I'll keep .create for prompts as logic was separate versions.
            await prisma.promptVersion.create({
                data: {
                    agentName: p.agentName,
                    version: p.version,
                    prompt: p.prompt,
                    isActive: true,
                }
            })
        })
    }

    console.log('Seeding influencers...')

    const influencers = [
        {
            id: 'emma_ugc',
            name: 'Emma',
            language: 'fr',
            elevenlabsVoiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel
            persona: {
                style: 'Authentique, Calme, "Comme une amie"',
                vocab: ['Franchement', 'J\'adore', 'Petite astuce', 'Dinguerie'],
                do: ['Parler face caméra', 'Sourire naturellement', 'Être rassurante'],
                dont: ['Être trop vendeuse', 'Crier', 'Utiliser du jargon marketing'],
                pacing: 'medium',
                energy: 'medium',
                banned_words: ['Achetez maintenant', 'Promotion exceptionnelle']
            }
        },
        {
            id: 'lucas_tech',
            name: 'Lucas',
            language: 'fr',
            elevenlabsVoiceId: 'AZnzlk1XvdvUeBnXmlld', // Domi
            persona: {
                style: 'Rationnel, Direct, Tech Reviewer',
                vocab: ['Concrètement', 'Performance', 'Efficace', 'Specs'],
                do: ['Aller droit au but', 'Montrer le produit en action', 'Être objectif'],
                dont: ['En faire des caisses', 'Faire des blagues lourdes'],
                pacing: 'fast',
                energy: 'medium',
                banned_words: ['Incroyable', 'Magique', 'Révolutionnaire']
            }
        },
        {
            id: 'sarah_lifestyle',
            name: 'Sarah',
            language: 'fr',
            elevenlabsVoiceId: 'EXAVITQu4vr4xnSDxMaL', // Bella
            persona: {
                style: 'Énergique, Premium, Beauty/Lifestyle',
                vocab: ['Glow up', 'Routine', 'Must-have', 'Pépite'],
                do: ['Être dynamique', 'Mettre en valeur l\'esthétique', 'Avoir un ton enjoué'],
                dont: ['Être monotone', 'Négliger le visuel'],
                pacing: 'normal',
                energy: 'high',
                banned_words: ['Pas cher', 'Bas de gamme']
            }
        }
    ]

    for (const inf of influencers) {
        await prisma.influencer.upsert({
            where: { id: inf.id },
            update: {
                name: inf.name,
                language: inf.language,
                elevenlabsVoiceId: inf.elevenlabsVoiceId,
                persona: inf.persona
            },
            create: {
                id: inf.id,
                name: inf.name,
                language: inf.language,
                elevenlabsVoiceId: inf.elevenlabsVoiceId,
                persona: inf.persona,
                isActive: true
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
