import { OpenAI } from 'openai';
import { z } from 'zod';
import { LLMProvider } from './types';

export class OpenAIProvider implements LLMProvider {
    private client: OpenAI;
    private model: string;
    private temperature: number;
    private maxRetries: number;

    constructor() {
        if (!process.env.OPENAI_API_KEY) {
            console.warn("OPENAI_API_KEY is not set, but OpenAIProvider is being initialized.");
        }
        this.client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        this.model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
        this.temperature = parseFloat(process.env.OPENAI_TEMPERATURE || '0.7');
        this.maxRetries = parseInt(process.env.OPENAI_MAX_RETRIES || '2');
    }

    async generate<T>(prompt: string, schema: z.ZodType<T>): Promise<T> {
        let attempts = 0;
        let lastError: any;

        while (attempts <= this.maxRetries) {
            try {
                attempts++;
                const completion = await this.client.chat.completions.create({
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant designed to output JSON.' },
                        { role: 'user', content: prompt }
                    ],
                    model: this.model,
                    temperature: this.temperature,
                    response_format: { type: 'json_object' },
                });

                const content = completion.choices[0].message.content;
                if (!content) {
                    throw new Error("Empty response from OpenAI");
                }

                // Strict parsing
                let parsed: any;
                try {
                    parsed = JSON.parse(content);
                } catch (e: any) {
                    throw new Error("Failed to parse JSON response: " + e.message);
                }

                // Zod validation
                // Since we request json_object, we might need to prompt for specific keys or wrap generated logic
                // For now, valid against schema.
                const validated = schema.parse(parsed);

                console.log(JSON.stringify({
                    runId: 'TODO-pass-runId', // We need to update interface to accept runId or context
                    attempt: attempts,
                    success: true
                }));

                return validated;

            } catch (error: any) {
                lastError = error;
                console.error(JSON.stringify({
                    attempt: attempts,
                    errorMessage: error.message,
                    errorStack: error.stack
                }));
                // Wait briefly before retry if needed? For now just loop
            }
        }

        throw new Error(`OpenAI generation failed after ${attempts} attempts. Last error: ${lastError?.message}`);
    }

    async generateText(prompt: string): Promise<string> {
        const completion = await this.client.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: this.model,
            temperature: this.temperature,
        });
        return completion.choices[0].message.content || '';
    }

    // Helper specifically for JSON generation with more context if needed
    async generateJson<T>(params: { system: string; user: string; runId?: string }, schema: z.ZodType<T>): Promise<T> {
        let attempts = 0;
        let lastError: any;

        while (attempts <= this.maxRetries) {
            try {
                attempts++;
                const completion = await this.client.chat.completions.create({
                    messages: [
                        { role: 'system', content: params.system + "\nReply with ONLY valid JSON." },
                        { role: 'user', content: params.user }
                    ],
                    model: this.model,
                    temperature: this.temperature,
                    response_format: { type: 'json_object' },
                });

                const content = completion.choices[0].message.content;
                if (!content) throw new Error("Empty content");

                const parsed = JSON.parse(content);
                const validated = schema.parse(parsed);

                console.log(JSON.stringify({
                    runId: params.runId,
                    attempt: attempts,
                    status: 'success'
                }));

                return validated;

            } catch (error: any) {
                lastError = error;
                console.error(JSON.stringify({
                    runId: params.runId,
                    attempt: attempts,
                    errorMessage: error.message
                }));
            }
        }
        throw lastError;
    }
}
