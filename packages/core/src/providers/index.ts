import { TTSProvider, LLMProvider } from './types';
import { MockLLMProvider, MockTTSProvider } from './mocks';
import { OpenAIProvider } from './openai';
import { ElevenLabsProvider } from './elevenlabs';

export * from './types';
export * from './mocks';
export * from './openai';
export * from './elevenlabs';

export function createLLMProvider(): LLMProvider {
    const providerType = process.env.LLM_PROVIDER || 'mock';
    console.log(`[LLMFactory] Using provider: ${providerType}`);

    if (providerType === 'openai') {
        return new OpenAIProvider();
    }
    return new MockLLMProvider();
}

export function createTTSProvider(): TTSProvider {
    const providerType = process.env.TTS_PROVIDER || 'mock';
    console.log(`[TTSFactory] Using provider: ${providerType}`);

    if (providerType === 'elevenlabs') {
        return new ElevenLabsProvider();
    }
    return new MockTTSProvider();
}

export * from './mocks';
export * from './openai';
export * from './elevenlabs';
