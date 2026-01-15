import { PrismaClient, AgentName } from '@repo/db';
import { LLMProvider } from '../providers';
import { ProductIntelOutputSchema, UGCStrategyOutputSchema, CreativeDirectorOutputSchema, HumanizeQAOutputSchema } from '../schemas';

export const runProductIntel = async (llm: LLMProvider, input: any, prisma: PrismaClient, runId?: string, personaBlock?: string) => {
    const promptRecord = await prisma.promptVersion.findFirst({
        where: { agentName: AgentName.product_intel, isActive: true },
        orderBy: { version: 'desc' }
    });
    if (!promptRecord) throw new Error("No active prompt for product_intel");

    // Construct User Prompt (can be more sophisticated)
    const userPrompt = `${personaBlock ? personaBlock + "\n\n" : ""}User Input:\n${JSON.stringify(input)}`;

    return await llm.generateJson({
        system: promptRecord.prompt,
        user: userPrompt,
        runId
    }, ProductIntelOutputSchema);
};

export const runUGCStrategy = async (llm: LLMProvider, analysis: any, prisma: PrismaClient, runId?: string, personaBlock?: string) => {
    const promptRecord = await prisma.promptVersion.findFirst({
        where: { agentName: AgentName.ugc_strategist, isActive: true },
        orderBy: { version: 'desc' }
    });
    if (!promptRecord) throw new Error("No active prompt for ugc_strategist");

    const userPrompt = `${personaBlock ? personaBlock + "\n\n" : ""}Analysis:\n${JSON.stringify(analysis)}`;

    return await llm.generateJson({
        system: promptRecord.prompt,
        user: userPrompt,
        runId
    }, UGCStrategyOutputSchema);
};

export const runCreativeDirector = async (llm: LLMProvider, concepts: any, prisma: PrismaClient, runId?: string, personaBlock?: string) => {
    const promptRecord = await prisma.promptVersion.findFirst({
        where: { agentName: AgentName.creative_director, isActive: true },
        orderBy: { version: 'desc' }
    });
    if (!promptRecord) throw new Error("No active prompt for creative_director");

    const userPrompt = `${personaBlock ? personaBlock + "\n\n" : ""}Concepts:\n${JSON.stringify(concepts)}`;

    return await llm.generateJson({
        system: promptRecord.prompt,
        user: userPrompt,
        runId
    }, CreativeDirectorOutputSchema);
};

export const runHumanizeQA = async (llm: LLMProvider, scripts: any, prisma: PrismaClient, runId?: string, personaBlock?: string) => {
    const promptRecord = await prisma.promptVersion.findFirst({
        where: { agentName: AgentName.humanize_qa, isActive: true },
        orderBy: { version: 'desc' }
    });
    if (!promptRecord) throw new Error("No active prompt for humanize_qa");

    const userPrompt = `${personaBlock ? personaBlock + "\n\n" : ""}Scripts and Guidelines:\n${JSON.stringify(scripts)}`;

    return await llm.generateJson({
        system: promptRecord.prompt,
        user: userPrompt,
        runId
    }, HumanizeQAOutputSchema);
};

