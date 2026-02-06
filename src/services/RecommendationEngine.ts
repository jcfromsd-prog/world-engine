/* ==========================================================================
   RECOMMENDATION ENGINE: The Adaptive Brain
   Uses IRT (Item Response Theory) + Interest Matching + History Filtering
   ========================================================================== */

import type { UserProfile, FlashcardSignal, RecommendationResult } from "../types/EngineTypes";
import { CONTENT_DB } from "../data/Curriculum";

// Grade level constants for recommendation logic
export const GradeBand = {
    SECOND: 2,
    FIFTH: 5,
    SOPHOMORE: 10,
    ADULT: 18
} as const;

/**
 * RECOMMENDATION ENGINE
 * The core adaptive learning algorithm that selects optimal content for each user.
 * 
 * Key Principles:
 * 1. COGNITIVE SAFETY: Never show content above user's grade + stretch zone
 * 2. FLOW STATE: Target 70-80% success probability (Vygotsky's ZPD)
 * 3. INTEREST ALIGNMENT: Weight content that matches user interests
 * 4. VARIETY: Avoid recently completed content
 */
export const RecommendationEngine = {
    // ═══════════════════════════════════════════════════════════════════════════
    // CORE IRT FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Calculate success probability using the Rasch Model (1PL IRT)
     * P(success) = 1 / (1 + e^(-a(θ - b)))
     * where θ = user ability, b = item difficulty, a = discrimination (1.7 standard)
     */
    calculateProbability(theta: number, difficulty: number): number {
        const discrimination = 1.7; // Standard discrimination parameter
        return 1 / (1 + Math.exp(-discrimination * (theta - difficulty)));
    },

    /**
     * Calculate interest score (0-1) based on tag overlap
     */
    calculateInterestScore(userInterests: string[], contentTags: string[]): number {
        if (userInterests.length === 0 || contentTags.length === 0) return 0.5;

        const lowerInterests = userInterests.map(i => i.toLowerCase());
        const lowerTags = contentTags.map(t => t.toLowerCase());

        let matches = 0;
        for (const interest of lowerInterests) {
            for (const tag of lowerTags) {
                if (tag.includes(interest) || interest.includes(tag)) {
                    matches++;
                }
            }
        }

        return Math.min(1, matches / Math.max(lowerInterests.length, 1));
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // MAIN RECOMMENDATION FUNCTION
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Recommend the optimal next learning activity for a user.
     * 
     * @param user - The learner's profile
     * @param history - Past flashcard signals (for avoiding repetition)
     * @param options - Configuration options
     * @returns The best content node with metadata, or null if none found
     */
    recommendNext(
        user: UserProfile,
        history: FlashcardSignal[] = [],
        options: {
            targetProbability?: number; // Default: 0.75 (75% success)
            stretchZone?: number; // How many grades above to allow
            excludeSubjects?: string[];
            preferSubjects?: string[];
        } = {}
    ): RecommendationResult | null {
        const {
            targetProbability = 0.75,
            stretchZone = user.skillTheta > 1.0 ? 2 : 1,
            excludeSubjects = [],
            preferSubjects = [],
        } = options;

        // 1. COGNITIVE SAFETY FILTER
        // Only allow content appropriate for user's grade + stretch zone
        const allowedMaxGrade = user.gradeLevel + stretchZone;

        const candidates = CONTENT_DB.filter(node => {
            // Grade check
            if (node.minGrade > user.gradeLevel) return false;
            if (node.maxGrade > allowedMaxGrade) return false;

            // Subject exclusion
            if (excludeSubjects.includes(node.subject)) return false;

            return true;
        });

        if (candidates.length === 0) return null;

        // 2. EXCLUDE RECENTLY COMPLETED (within last 10 activities)
        const recentIds = new Set(
            history.slice(-10).map(h => h.itemId)
        );

        const freshCandidates = candidates.filter(
            node => !recentIds.has(node.id)
        );

        // Fall back to all candidates if all are recent
        const pool = freshCandidates.length > 0 ? freshCandidates : candidates;

        // 3. SCORE EACH CANDIDATE
        const scored = pool.map(node => {
            const successProb = this.calculateProbability(user.skillTheta, node.difficulty);
            const interestScore = this.calculateInterestScore(user.interests, node.tags);

            // How close to target probability (optimal challenge)
            const flowScore = 1 - Math.abs(successProb - targetProbability);

            // Subject preference bonus
            const subjectBonus = preferSubjects.includes(node.subject) ? 0.2 : 0;

            // Combined score (weighted)
            const totalScore = (flowScore * 0.5) + (interestScore * 0.35) + subjectBonus + 0.15;

            return {
                node,
                successProbability: successProb,
                interestScore,
                totalScore,
            };
        });

        // 4. SORT BY TOTAL SCORE AND SELECT BEST
        scored.sort((a, b) => b.totalScore - a.totalScore);
        const best = scored[0];

        // 5. GENERATE REASON STRING
        let reason = "";
        if (best.interestScore > 0.5) {
            reason = `Matches your interest in ${user.interests[0] || "learning"}`;
        } else if (Math.abs(best.successProbability - targetProbability) < 0.1) {
            reason = "Perfect challenge level for flow state";
        } else if (best.successProbability > 0.9) {
            reason = "Consolidation exercise for mastery";
        } else {
            reason = "Optimal next step in your learning path";
        }

        return {
            node: best.node,
            successProbability: best.successProbability,
            interestScore: best.interestScore,
            reason,
        };
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // BATCH RECOMMENDATIONS
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Get multiple recommendations for a learning session
     */
    recommendBatch(
        user: UserProfile,
        count: number = 3,
        history: FlashcardSignal[] = []
    ): RecommendationResult[] {
        const results: RecommendationResult[] = [];
        const tempHistory = [...history];

        for (let i = 0; i < count; i++) {
            const rec = this.recommendNext(user, tempHistory);
            if (rec) {
                results.push(rec);
                // Add to temp history to avoid duplicates in batch
                tempHistory.push({
                    itemId: rec.node.id,
                    success: true,
                    timestamp: Date.now(),
                });
            }
        }

        return results;
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SKILL UPDATE FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Update user's skillTheta based on performance
     * Uses simplified ELO-like adjustment
     */
    updateSkillTheta(
        currentTheta: number,
        difficulty: number,
        success: boolean
    ): number {
        const expected = this.calculateProbability(currentTheta, difficulty);
        const actual = success ? 1 : 0;
        const k = 0.3; // Learning rate

        // New theta = old theta + k * (actual - expected)
        const newTheta = currentTheta + k * (actual - expected);

        // Clamp to valid range
        return Math.max(-3.0, Math.min(3.0, newTheta));
    },

    /**
     * Get a human-readable skill level description
     */
    getSkillLevelDescription(theta: number): string {
        if (theta < -2.0) return "Beginner";
        if (theta < -1.0) return "Foundation";
        if (theta < 0.0) return "Developing";
        if (theta < 1.0) return "Proficient";
        if (theta < 2.0) return "Advanced";
        return "Master";
    },
};

export default RecommendationEngine;
