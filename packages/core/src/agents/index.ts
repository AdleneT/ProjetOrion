import { LLMProvider } from '../providers';
import { ProductIntelOutputSchema, UGCStrategyOutputSchema, CreativeDirectorOutputSchema, HumanizeQAOutputSchema } from '../schemas';

// Mock implementations for now to ensure type safety in the worker
// In a real app, these would inject the LLMProvider and use the prompts from DB

export const runProductIntel = async (llm: LLMProvider, input: any) => {
    // Mock return matching ProductIntelOutputSchema
    return {
        analysis: {
            sellingPoints: ["Fast results", "Easy to use"],
            targetAudience: ["Gen Z", "Young Adults"],
            hooks: ["You won't believe this", "Game changer"],
            painPoints: ["Slow alternatives", "Expensive options"]
        },
        valid: true
    };
};

export const runUGCStrategy = async (llm: LLMProvider, analysis: any) => {
    return {
        concepts: [
            { title: "Concept 1", angle: "Humor", description: "Funny skit" },
            { title: "Concept 2", angle: "Educational", description: "How-to guide" },
            { title: "Concept 3", angle: "Testimonial", description: "User review" }
        ]
    };
};

export const runCreativeDirector = async (llm: LLMProvider, concepts: any) => {
    return {
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
    };
};

export const runHumanizeQA = async (llm: LLMProvider, scripts: any) => {
    return {
        selectedScript: scripts.scripts[0],
        score: 0.9,
        improvements: ["Added more pauses", "More natural tone"],
        finalScriptText: "Hey guys! Check this out. It's amazing."
    };
};
