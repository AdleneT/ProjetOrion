import { z } from 'zod';

export const InfluencerPersonaSchema = z.object({
    style: z.string(),
    vocab: z.array(z.string()),
    do: z.array(z.string()),
    dont: z.array(z.string()),
    pacing: z.string().optional(),
    energy: z.string().optional(),
    banned_words: z.array(z.string()).optional(),
    authenticity_rules: z.array(z.string()).optional()
});

export type InfluencerPersona = z.infer<typeof InfluencerPersonaSchema>;

export function buildPersonaPromptBlock(influencerName: string, personaJson: any): string {
    // Validate or at least try to cast safely
    const parsed = InfluencerPersonaSchema.safeParse(personaJson);
    if (!parsed.success) {
        console.warn(`Invalid persona JSON for ${influencerName}`, parsed.error);
        return ""; // Fallback to empty if invalid
    }
    const p = parsed.data;

    const block = `
--- INFLUENCER PERSONA: ${influencerName} ---
SPEAKING STYLE: ${p.style}
VOCABULARY: ${p.vocab.join(', ')}
ENERGY: ${p.energy || 'medium'} | PACING: ${p.pacing || 'normal'}

DO:
${p.do.map(d => `- ${d}`).join('\n')}

DON'T:
${p.dont.map(d => `- ${d}`).join('\n')}

BANNED WORDS: ${p.banned_words?.join(', ') || 'None'}
${p.authenticity_rules ? `AUTHENTICITY: ${p.authenticity_rules.join(', ')}` : ''}
---------------------------------------------
`;
    return block.trim();
}
