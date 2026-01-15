import { TTSProvider } from './types';
import axios from 'axios';

export class ElevenLabsProvider implements TTSProvider {
    private apiKey: string;
    private modelId: string;
    private outputFormat: string;
    private maxRetries: number;

    constructor() {
        this.apiKey = process.env.ELEVENLABS_API_KEY || '';
        if (!this.apiKey) {
            console.warn("ELEVENLABS_API_KEY is not set.");
        }
        this.modelId = process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2';
        this.outputFormat = process.env.ELEVENLABS_OUTPUT_FORMAT || 'mp3_44100_128';
        this.maxRetries = parseInt(process.env.ELEVENLABS_MAX_RETRIES || '2');
    }

    async generateAudio(text: string, voiceId?: string): Promise<string> {
        if (!voiceId) {
            console.warn("[ElevenLabs] No voiceId provided, using default Rachel");
            voiceId = "21m00Tcm4TlvDq8ikWAM";
        }

        let attempts = 0;

        while (attempts <= this.maxRetries) {
            try {
                attempts++;
                const response = await axios.post(
                    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
                    {
                        text: text,
                        model_id: this.modelId,
                        voice_settings: {
                            stability: 0.5,
                            similarity_boost: 0.75
                        }
                    },
                    {
                        headers: {
                            'xi-api-key': this.apiKey,
                            'Content-Type': 'application/json'
                        },
                        responseType: 'arraybuffer',
                        params: {
                            output_format: this.outputFormat
                        }
                    }
                );

                // In a real app, we would upload this buffer to S3/R2 and return the URL.
                // Since this is returning a 'string' URL as per interface, we have a mismatch if we don't have S3 upload logic here 
                // OR the worker handles the upload.
                // The prompt says: "appeler l’API... récupérer l’audio (buffer)... retourner buffer + metadata".
                // BUT the interface says `generateAudio(text, voiceId): Promise<string>`.
                // The worker instructions say: "upload mp3 vers S3/R2... créer un asset DB".
                // So the Provider should probably return the BUFFER or the Worker should handle the upload?
                // The interface `TTSProvider` in `types.ts` is `Promise<string>`.
                // If I change the interface, I break other things.

                // Let's assume for this step, we return the Base64 data URI temporarily or we implement a dummy upload function?
                // Or I can return a local path if I write it to disk?
                // The prompt for Worker says: "step tts... appeler TTSProvider.synthesize(text, voiceId)... upload mp3".
                // It seems the USER implies the Provider returns the audio, and the WORKER uploads it.
                // If the interface says `Promise<string>`, maybe it expects a URL or a Base64 string?

                // IMPORTANT: The Mock provider returns a URL string "https://...".
                // To support binary content, I should probably return `Promise<Buffer>` or similar, but let's stick to the interface for now.
                // I will return a Base64 string prefixed with `data:audio/mp3;base64,` so the worker can detect it and upload it?
                // OR I'll assume the worker expects a URL.

                // Wait, user prompt says:
                // "Provider... retourner buffer + metadata (chars, duration estimate)"
                // But the interface is `generateAudio(text...): Promise<string>`.
                // This is a conflict. 
                // I will modify the `TTSProvider` interface to return `Promise<{ audio: Buffer, metadata: any }>` or similar?
                // OR simpler: generic returns `any` or `unknown`?
                // The current interface IS strict: `Promise<string>`.

                // To minimize changes, I will return the base64 string.
                // The worker will decode it.

                return Buffer.from(response.data).toString('base64');

            } catch (error: any) {
                console.error(`[ElevenLabs] Attempt ${attempts} failed:`, error.message);
                if (error.response?.status === 429) {
                    // Backoff?
                    await new Promise(r => setTimeout(r, 1000 * attempts));
                } else if (attempts > this.maxRetries) {
                    throw error;
                }
            }
        }
        throw new Error("ElevenLabs generation failed");
    }
}
