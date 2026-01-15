import { LLMProvider, VideoProvider, TTSProvider } from './index';
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
