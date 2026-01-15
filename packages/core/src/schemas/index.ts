import { z } from 'zod';

export const JobInputSchema = z.object({
    platform: z.enum(['tiktok_ads', 'tiktok_shop', 'meta_ads']),
    influencerId: z.string().optional(),
    brief: z.object({
        productName: z.string(),
        productUrl: z.string().url().optional(),
        price: z.string().optional(),
        usp: z.string().optional(),
        tone: z.string().optional(),
        duration: z.string().optional(),
        language: z.string().default('fr'),
    }),
});

export const ProductIntelOutputSchema = z.object({
    analysis: z.object({
        sellingPoints: z.array(z.string()),
        targetAudience: z.array(z.string()),
        hooks: z.array(z.string()),
        painPoints: z.array(z.string()),
    }),
    valid: z.boolean(),
});

export const UGCStrategyOutputSchema = z.object({
    concepts: z.array(z.object({
        title: z.string(),
        angle: z.string(),
        description: z.string(),
    })).length(3),
});

export const CreativeDirectorOutputSchema = z.object({
    scripts: z.array(z.object({
        title: z.string(),
        content: z.array(z.object({
            speaker: z.string(),
            text: z.string(),
            visual: z.string(),
        })),
    })).length(3),
});

export const HumanizeQAOutputSchema = z.object({
    selectedScript: z.any(), // Refine based on CreativeDirectorOutput
    score: z.number().min(0).max(1),
    improvements: z.array(z.string()),
    finalScriptText: z.string(),
});

export type JobInput = z.infer<typeof JobInputSchema>;
export type ProductIntelOutput = z.infer<typeof ProductIntelOutputSchema>;
export type UGCStrategyOutput = z.infer<typeof UGCStrategyOutputSchema>;
export type CreativeDirectorOutput = z.infer<typeof CreativeDirectorOutputSchema>;
export type HumanizeQAOutput = z.infer<typeof HumanizeQAOutputSchema>;
