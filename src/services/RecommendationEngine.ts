/* =========================================================
   1. TYPES & CONSTANTS
   File: src/services/RecommendationEngine.ts
========================================================= */

export type BloomLevel = "REMEMBER" | "UNDERSTAND" | "APPLY" | "ANALYZE" | "EVALUATE" | "CREATE";

export const BLOOM_LEVELS: BloomLevel[] = ["REMEMBER", "UNDERSTAND", "APPLY", "ANALYZE", "EVALUATE", "CREATE"];

// Use const object instead of enum for erasableSyntaxOnly compatibility
export const GradeBand = {
    SECOND: 2,
    FIFTH: 5,
    SOPHOMORE: 10,
    ADULT: 13,
} as const;

export type GradeBand = typeof GradeBand[keyof typeof GradeBand];

export interface UserProfile {
    id: string;
    archetype?: string;
    skillTheta: number; // IRT Ability (-3.0 to +3.0)
    gradeLevel: number; // Matches GradeBand or specific year
}

export interface ContentNode {
    id: string;
    title: string;
    difficulty: number; // IRT Difficulty (-3.0 to +3.0)
    bloomLevel: BloomLevel;
    minGradeLevel?: number; // Inclusive
    maxGradeLevel?: number; // Inclusive
    tags?: string[];
}

export interface FlashcardSignal {
    itemId: string;
    bloomLevel: BloomLevel;
    success: boolean;
    timestamp: number;
}

export interface RecommendationResult {
    nextItem?: ContentNode;
    targetBloom: BloomLevel;
    probability: number;
    updatedTheta: number;
    reason: string;
}

/* =========================================================
   2. REFINED RECOMMENDATION LOGIC
========================================================= */

export const RecommendationEngine = {
    calculateProbability(theta: number, difficulty: number): number {
        const k = 1.7;
        return 1 / (1 + Math.exp(-k * (theta - difficulty)));
    },

    analyzeUserSignals(history: FlashcardSignal[]) {
        if (!history || history.length === 0) {
            return { bloomIndex: 0, theta: -2.0, reason: "New User - Bootstrap" };
        }
        const last = history[history.length - 1];
        let bloomIndex = Math.max(0, BLOOM_LEVELS.indexOf(last.bloomLevel));

        const successRate = history.filter(h => h.success).length / history.length;
        const theta = -3 + successRate * 6; // Normalize [-3, +3]

        if (last.success) {
            bloomIndex = Math.min(bloomIndex + 1, BLOOM_LEVELS.length - 1);
        } else {
            bloomIndex = Math.max(bloomIndex - 1, 0);
        }

        return {
            bloomIndex,
            theta,
            reason: last.success ? "User advancing" : "User needs reinforcement",
        };
    },

    /**
     * Legacy recommendNext wrapper for backward compatibility with existing calls
     * that might pass different arguments.
     */
    recommendNextLegacy(_user: UserProfile, history: FlashcardSignal[], curriculum: ContentNode[]): RecommendationResult {
        const analysis = this.analyzeUserSignals(history);
        const targetBloom = BLOOM_LEVELS[analysis.bloomIndex];

        // Use the new logic but adapted for the legacy return type
        const nextNode = recommendNext(
            { ..._user, skillTheta: analysis.theta },
            curriculum,
            targetBloom
        );

        return {
            nextItem: nextNode || undefined,
            targetBloom,
            updatedTheta: analysis.theta,
            probability: nextNode ? this.calculateProbability(analysis.theta, nextNode.difficulty) : 0,
            reason: analysis.reason
        };
    }
};

export function recommendNext(
    user: UserProfile,
    curriculum: ContentNode[],
    targetBloom: BloomLevel
): ContentNode | null {
    // Step 1: Filter by Grade Appropriateness AND Bloom Level
    const candidates = curriculum.filter((node) => {
        // Check Bloom Taxonomy Stage
        const isCorrectBloom = node.bloomLevel === targetBloom;

        // Check Grade Level (Age Appropriateness)
        // Default to strict bounds if min/max are missing (0 to 100)
        const min = node.minGradeLevel ?? 0;
        const max = node.maxGradeLevel ?? 100;
        const isAgeAppropriate = user.gradeLevel >= min && user.gradeLevel <= max;

        return isCorrectBloom && isAgeAppropriate;
    });

    if (candidates.length === 0) {
        console.warn(`No content found for Grade ${user.gradeLevel} at Bloom Level ${targetBloom}`);
        return null; // Logic for fallback (e.g., try previous Bloom level) would go here
    }

    // Step 2: IRT Adaptive Matching (The "Brain")
    // Sort candidates by the difference between User Skill and Content Difficulty.
    // We want the smallest 'delta' (closest match).
    candidates.sort((a, b) => {
        const deltaA = Math.abs(user.skillTheta - a.difficulty);
        const deltaB = Math.abs(user.skillTheta - b.difficulty);
        return deltaA - deltaB;
    });

    // Return the best match (closest difficulty)
    return candidates[0];
}
