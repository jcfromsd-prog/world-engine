
import { z } from 'zod';

// ============================================================
// STATE MACHINE SCHEMAS (Zod Validation)
// ============================================================

export const GoalSchema = z.object({
    id: z.string().uuid(),
    tier: z.enum(['Sprouts', 'Builders', 'Trailblazers', 'Explorers', 'Voyagers']),
    type: z.enum(['learning', 'creation', 'debugging', 'optimization']),
    description: z.string().max(200),
    cognitiveLoad: z.number().min(1).max(10),
    prerequisites: z.array(z.string().uuid()).optional(),
    estimatedDuration: z.number().min(1), // minutes
    createdAt: z.date(),
});

export const ActionSchema = z.object({
    id: z.string().uuid(),
    goalId: z.string().uuid(),
    userId: z.string().uuid(),
    type: z.enum(['tap', 'drag', 'sequence', 'code', 'text-input']),
    payload: z.record(z.unknown()),
    timestamp: z.date(),
    deviceContext: z.object({
        userAgent: z.string(),
        screenSize: z.object({ width: z.number(), height: z.number() }),
        inputMethod: z.enum(['touch', 'mouse', 'keyboard']),
    }),
});

export const CheckSchema = z.object({
    id: z.string().uuid(),
    actionId: z.string().uuid(),
    validations: z.array(z.object({
        rule: z.string(),
        passed: z.boolean(),
        errorMessage: z.string().optional(),
    })),
    overallResult: z.enum(['pass', 'fail', 'partial']),
    computedAt: z.date(),
});

export const PayoffSchema = z.object({
    id: z.string().uuid(),
    checkId: z.string().uuid(),
    tier: z.enum(['Sprouts', 'Builders', 'Trailblazers', 'Explorers', 'Voyagers']),
    type: z.discriminatedUnion('tier', [
        z.object({
            tier: z.literal('Sprouts'),
            reward: z.object({
                animation: z.string(),
                sound: z.string(),
                voiceEncouragement: z.string(),
            }),
        }),
        z.object({
            tier: z.literal('Builders'),
            reward: z.object({
                badge: z.string(),
                unlockedCapability: z.string().optional(),
            }),
        }),
        z.object({
            tier: z.literal('Trailblazers'),
            reward: z.object({
                achievement: z.string(),
                digitalAsset: z.string().optional(),
            }),
        }),
        z.object({
            tier: z.literal('Explorers'),
            reward: z.object({
                credential: z.string(),
                portfolioItem: z.string(),
            }),
        }),
        z.object({
            tier: z.literal('Voyagers'),
            reward: z.object({
                professionalCredit: z.string(),
                assetOwnership: z.string(),
            }),
        }),
    ]),
    issuedAt: z.date(),
});

// ============================================================
// EVENT SOURCING TYPES
// ============================================================

export type LogicLinkEvent =
    | { type: 'GOAL_CREATED'; data: z.infer<typeof GoalSchema> }
    | { type: 'ACTION_EXECUTED'; data: z.infer<typeof ActionSchema> }
    | { type: 'CHECK_COMPLETED'; data: z.infer<typeof CheckSchema> }
    | { type: 'PAYOFF_ISSUED'; data: z.infer<typeof PayoffSchema> };
