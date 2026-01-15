import { OpenAIProvider } from '../src/providers/openai';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config(); // Load env from root if possible, or assume calling env has it

async function main() {
    console.log("Testing OpenAIProvider...");

    if (!process.env.OPENAI_API_KEY) {
        console.error("Skipping test: OPENAI_API_KEY not set.");
        return;
    }

    const provider = new OpenAIProvider();
    const TestSchema = z.object({
        message: z.string(),
        sentiment: z.enum(['positive', 'neutral', 'negative'])
    });

    try {
        const result = await provider.generateJson({
            system: "You are a helpful assistant.",
            user: "Say hello and tell me you are happy."
        }, TestSchema);

        console.log("Result:", result);
        console.log("Validation passed!");
    } catch (error: any) {
        console.error("Test failed:", error.message);
        process.exit(1);
    }
}

main();
