import { LLMProvider, VideoProvider, TTSProvider } from './types';
import { z } from 'zod';

export class MockLLMProvider implements LLMProvider {
    async generate<T>(prompt: string, schema: z.ZodType<T>): Promise<T> {
        console.log('[MockLLM] Generating for prompt:', prompt.substring(0, 50) + '...');
        // Return mock data based on schema type names or structure if possible, 
        // but for now we'll return a generic "valid" object if we can, or just mock specific responses in the agents.
        // In a real mock, we might inspect the schema.
        return {} as T;
    }

    async generateText(prompt: string): Promise<string> {
        console.log('[MockLLM] Generating text for prompt:', prompt.substring(0, 50) + '...');
        return "This is a mock LLM response.";
    }

    async generateJson<T>(params: { system: string; user: string; runId?: string }, schema: z.ZodType<T>): Promise<T> {
        console.log(`[MockLLM] generateJson (RunID: ${params.runId || 'N/A'})`);
        console.log(`[MockLLM] System: ${params.system.substring(0, 50)}...`);
        console.log(`[MockLLM] User: ${params.user.substring(0, 50)}...`);

        // We return a promise that resolves to "any" casted as T. 
        // The checking logic in Agents will ensure it matches the schema, 
        // but since this is a mock, we rely on the agent mock implementation 
        // (which usually short-circuits before calling this if strictly mocked like currently in agent/index.ts).
        // However, with the new agent implementation, we WILL call this.
        // So we need to return valid mock data for valid schemas.
        // It's hard to generically return valid data schema-compliant without a library like zod-mock.
        // For now, we will return an empty object and hope the agent mocks handle the return value specifically,
        // OR we rely on the fact that existing agents had their OWN mocks inside the function body.
        // Wait, the existing agent implementation I saw earlier:
        /*
        export const runProductIntel = async (llm: LLMProvider, input: any) => {
            // Mock return matching ProductIntelOutputSchema
            return { ... }
        };
        */
        // It didn't ALREADY call `llm.generate`. It just returned an object. 
        // So the MockLLMProvider wasn't even acting!
        // Now I am changing the AGENT to call the provider.
        // So `MockLLMProvider` MUST return valid data if I use it.
        // Since I don't have `zod-mock` and installing it is extra, 
        // I will make `MockLLMProvider` smart enough for the 4 known schemas or just fail gracefully?
        // Actually, if I am in 'mock' mode, maybe I should keep the OLD logic of hardcoded returns in agents?
        // But the prompt says "Les agents existants... Doivent appeler le provider LLM réel à la place du mock".
        // It implies the agent logic ITSELF changes to call LLM.
        // So if I run in MOCK mode, the agent calls `llm.generateJson`, and the mock provider must return something valid.

        // I'll implement a basic switch/case based on prompt content keywords if needed, 
        // or - strictly for this PR - I will just return an empty object casting to T, 
        // and acknowledge mock might be broken for complex schemas unless I put more effort.
        // BUT better strategy:
        // In `agents/index.ts`, I can have logic:
        // if (process.env.LLM_PROVIDER === 'mock') return { ...hardcoded... }
        // else ... fetch prompt, call llm...
        // This keeps mock stable without making MockLLMProvider super complex.

        // However, the prompt says "Router provider (switch via env)... Dans le provider factory".
        // Use MockLLMProvider if not openai.

        // Let's make `MockLLMProvider` return hardcoded responses for known schemas if possible?
        // Or simply `return {} as T` and accept that `zod.parse` might fail?
        // No, `schema.parse` is called by caller.

        // I will assume for now I should try to return something at least slightly valid or just minimal.
        // The most robust way is to put the "Mock Logic" into `MockLLMProvider.generateJson` 
        // by detecting the "System Prompt" to guess which agent it is.

        if (params.system.includes("Product Intelligence")) return {
            analysis: {
                sellingPoints: ["Fast results", "Easy to use"],
                targetAudience: ["Gen Z", "Young Adults"],
                hooks: ["You won't believe this", "Game changer"],
                painPoints: ["Slow alternatives", "Expensive options"]
            },
            valid: true
        } as unknown as T;

        if (params.system.includes("UGC Strategist")) return {
            concepts: [
                { title: "Concept 1", angle: "Humor", description: "Funny skit" },
                { title: "Concept 2", angle: "Educational", description: "How-to guide" },
                { title: "Concept 3", angle: "Testimonial", description: "User review" }
            ]
        } as unknown as T;

        if (params.system.includes("Creative Director")) return {
            scripts: [
                {
                    title: "Script 1",
                    content: [
                        { speaker: "Host", text: "Hey guys!", visual: "Face to camera" },
                        { speaker: "Host", text: "Check this out.", visual: "Product close up" }
                    ]
                },
                {
                    title: "Script 2",
                    content: [
                        { speaker: "Host", text: "Stop scrolling!", visual: "Surprised face" },
                        { speaker: "Host", text: "You need this.", visual: "Product demo" }
                    ]
                },
                {
                    title: "Script 3",
                    content: [
                        { speaker: "Host", text: "Day in my life.", visual: "Vlog style" },
                        { speaker: "Host", text: "Using this product.", visual: "Product usage" }
                    ]
                }
            ]
        } as unknown as T;

        if (params.system.includes("Humanize")) return {
            selectedScript: { title: "Script 1", content: [] },
            score: 0.9,
            improvements: ["Added more pauses", "More natural tone"],
            finalScriptText: "Hey guys! Check this out. It's amazing."
        } as unknown as T;

        return {} as T;
    }
}

export class MockVideoProvider implements VideoProvider {
    async generateVideo(script: string, audioUrl: string): Promise<string> {
        console.log('[MockVideo] Generating video...');
        return "https://example.com/mock-video.mp4";
    }
}

export class MockTTSProvider implements TTSProvider {
    async generateAudio(text: string, voiceId?: string): Promise<string> {
        console.log('[MockTTS] Generating audio...');
        return "https://example.com/mock-audio.mp3";
    }
}
