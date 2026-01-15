import { z } from 'zod';

export interface LLMProvider {
    generate<T>(prompt: string, schema: z.ZodType<T>): Promise<T>;
    generateText(prompt: string): Promise<string>;
    generateJson<T>(params: { system: string; user: string; runId?: string }, schema: z.ZodType<T>): Promise<T>;
}

export interface VideoProvider {
    generateVideo(script: string, audioUrl: string): Promise<string>;
}

export interface TTSProvider {
    generateAudio(text: string, voiceId?: string): Promise<string>;
}
