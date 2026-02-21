/* ==========================================================================
   SAGE AI TUTOR: Adaptive Hint & Guidance System
   Provides scaffolded hints, evaluates responses, and ensures learning outcomes
   ========================================================================== */

import { z } from "zod";
import { getGeminiModel } from "./GeminiService";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { StructuredOutputParser } from "langchain/output_parsers";
import type { ContentNode, BloomLevel } from "../types/EngineTypes";

export type HintLevel = "NUDGE" | "SCAFFOLD" | "DIRECT" | "SOLUTION";
export type ResponseQuality = "EXCELLENT" | "GOOD" | "PARTIAL" | "INCORRECT" | "STUCK";

export interface HintConfig {
    contentId: string;
    subject: string;
    bloomLevel: BloomLevel;
    gradeLevel: number;
    currentAttempt: number;
    timeSpentSeconds: number;
    previousHintsGiven: string[];
}

export interface HintResult {
    level: HintLevel;
    message: string;
    encouragement: string;
    nextSteps: string[];
    relatedConcepts?: string[];
    visualAid?: string;          // URL or description of visual helper
    audioEnabled?: boolean;       // For younger learners (K-2)
}

export interface EvaluationResult {
    quality: ResponseQuality;
    score: number;               // 0-100
    feedback: string;
    correctParts: string[];
    improvementAreas: string[];
    masteryProgress: number;     // 0-100, toward mastery
    shouldAdvance: boolean;
    recommendedReview?: string;  // Content ID for review if needed
}

/**
 * SAGE AI TUTOR
 * The intelligent tutoring system that provides personalized guidance
 */
export const SageAITutor = {
    // ═══════════════════════════════════════════════════════════════════════════
    // HINT GENERATION
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Generate an appropriate hint based on user's current state
     */
    generateHint(config: HintConfig): HintResult {
        const { currentAttempt, timeSpentSeconds, bloomLevel, gradeLevel, previousHintsGiven } = config;

        // Determine hint level based on attempts and time
        let level: HintLevel = "NUDGE";
        if (currentAttempt >= 4 || timeSpentSeconds > 300) {
            level = "SOLUTION";
        } else if (currentAttempt >= 3 || timeSpentSeconds > 180) {
            level = "DIRECT";
        } else if (currentAttempt >= 2 || timeSpentSeconds > 90) {
            level = "SCAFFOLD";
        }

        // Adjust for grade level (younger students get more direct help)
        if (gradeLevel <= 2 && level === "NUDGE") {
            level = "SCAFFOLD";
        }

        // Generate hint message based on level
        const hint = this.buildHintMessage(level, bloomLevel, gradeLevel, previousHintsGiven);

        return hint;
    },

    /**
     * Generate an AI-powered hint using Gemini 3.1 Pro
     * Falls back to deterministic logic if API key is missing or error occurs.
     */
    async generateAIHint(config: HintConfig): Promise<HintResult> {
        try {
            const model = getGeminiModel(0.4); // Lower temperature for more precise hints
            if (!model) {
                return this.generateHint(config);
            }

            // Define Schema
            const parser = StructuredOutputParser.fromZodSchema(
                z.object({
                    level: z.enum(["NUDGE", "SCAFFOLD", "DIRECT", "SOLUTION"]),
                    message: z.string(),
                    encouragement: z.string(),
                    nextSteps: z.array(z.string()),
                    relatedConcepts: z.array(z.string()).optional(),
                    visualAid: z.string().optional(),
                    audioEnabled: z.boolean().optional()
                })
            );

            const formatInstructions = parser.getFormatInstructions();

            const systemPrompt = `
            You are SAGE, an expert AI Tutor.
            Your goal is to provide a helpful hint to a student based on their struggle context.
            
            RULES:
            1. Adapt to their Grade Level (${config.gradeLevel}).
            2. Respect the Bloom's Taxonomy Level (${config.bloomLevel}).
            3. Do NOT give the answer unless the hint level is SOLUTION.
            4. Be encouraging but precise.
            
            RESPONSE FORMAT:
            ${formatInstructions}
            `;

            const userPrompt = `
            Context:
            - Subject: ${config.subject}
            - Current Attempt: ${config.currentAttempt}
            - Time Spent: ${config.timeSpentSeconds} seconds
            - Previous Hints: ${JSON.stringify(config.previousHintsGiven)}
            `;

            const response = await model.invoke([
                new SystemMessage(systemPrompt),
                new HumanMessage(userPrompt)
            ]);

            const parsedResult = await parser.parse(response.content as string);
            return parsedResult as HintResult;

        } catch (error) {
            console.error("SageAI Hint Generation Failed:", error);
            return this.generateHint(config); // Fallback
        }
    },

    /**
     * Build the actual hint message
     */
    buildHintMessage(
        level: HintLevel,
        bloomLevel: BloomLevel,
        gradeLevel: number,
        _previousHints: string[]
    ): HintResult {
        // Base encouragement messages by age group
        const encouragements = this.getAgeAppropriateEncouragement(gradeLevel);

        // Get Bloom-specific scaffolding
        const scaffolds = this.getBloomScaffolds(bloomLevel);

        switch (level) {
            case "NUDGE":
                return {
                    level,
                    message: scaffolds.NUDGE,
                    encouragement: encouragements.NUDGE,
                    nextSteps: [
                        "Take a moment to re-read the question.",
                        "What do you already know about this topic?",
                        "Try breaking the problem into smaller parts."
                    ],
                    audioEnabled: gradeLevel <= 2
                };

            case "SCAFFOLD":
                return {
                    level,
                    message: scaffolds.SCAFFOLD,
                    encouragement: encouragements.SCAFFOLD,
                    nextSteps: [
                        "Here's a hint to get you started...",
                        "Think about similar problems you've solved.",
                        "What's the first step you should take?"
                    ],
                    relatedConcepts: this.getRelatedConcepts(bloomLevel),
                    audioEnabled: gradeLevel <= 2
                };

            case "DIRECT":
                return {
                    level,
                    message: scaffolds.DIRECT,
                    encouragement: encouragements.DIRECT,
                    nextSteps: [
                        "Let me show you how to approach this...",
                        "Here's a worked example to follow.",
                        "Try using this strategy..."
                    ],
                    relatedConcepts: this.getRelatedConcepts(bloomLevel),
                    visualAid: "concept_diagram",
                    audioEnabled: gradeLevel <= 3
                };

            case "SOLUTION":
                return {
                    level,
                    message: scaffolds.SOLUTION,
                    encouragement: encouragements.SOLUTION,
                    nextSteps: [
                        "Here's the complete solution breakdown.",
                        "Let's walk through each step together.",
                        "Next time, try starting with..."
                    ],
                    relatedConcepts: this.getRelatedConcepts(bloomLevel),
                    visualAid: "step_by_step_walkthrough"
                };
        }
    },

    /**
     * Get age-appropriate encouragement messages
     */
    getAgeAppropriateEncouragement(gradeLevel: number): Record<HintLevel, string> {
        if (gradeLevel <= 2) {
            return {
                NUDGE: "You're doing great! 🌟 Let's try again!",
                SCAFFOLD: "Awesome try! Here's a little help! 🎈",
                DIRECT: "No worries! Let's figure this out together! 🤝",
                SOLUTION: "Amazing effort! Here's how it works! 🎉"
            };
        } else if (gradeLevel <= 5) {
            return {
                NUDGE: "Solid start! Keep thinking... 💪",
                SCAFFOLD: "Good thinking! Here's a boost! 🚀",
                DIRECT: "Let me help you unlock this! 🔓",
                SOLUTION: "Great persistence! Here's the key! 🗝️"
            };
        } else if (gradeLevel <= 8) {
            return {
                NUDGE: "You've got this. Take another angle.",
                SCAFFOLD: "Strong effort. Here's a strategic hint.",
                DIRECT: "Let's break this down systematically.",
                SOLUTION: "Persistence is key. Here's the full breakdown."
            };
        } else {
            return {
                NUDGE: "Consider the underlying principles.",
                SCAFFOLD: "Strategic hint: review the core concept.",
                DIRECT: "Let's approach this methodically.",
                SOLUTION: "Mastery comes through understanding. Here's the solution."
            };
        }
    },

    /**
     * Get Bloom's Taxonomy-specific scaffolding prompts
     */
    getBloomScaffolds(bloomLevel: BloomLevel): Record<HintLevel, string> {
        const scaffolds: Record<BloomLevel, Record<HintLevel, string>> = {
            REMEMBER: {
                NUDGE: "Try to recall the key facts. What do you remember?",
                SCAFFOLD: "Think about the definition. What are the main parts?",
                DIRECT: "The key fact is... Remember that...",
                SOLUTION: "Here's the answer. The correct term/fact is..."
            },
            UNDERSTAND: {
                NUDGE: "Can you explain it in your own words?",
                SCAFFOLD: "What's the main idea? How would you summarize it?",
                DIRECT: "This concept means... Think of it like...",
                SOLUTION: "Here's the explanation. This works because..."
            },
            APPLY: {
                NUDGE: "How can you use what you know here?",
                SCAFFOLD: "What formula or method applies? What's step one?",
                DIRECT: "Apply this method: First... then... finally...",
                SOLUTION: "Here's the worked solution. Step 1:..."
            },
            ANALYZE: {
                NUDGE: "What patterns do you see? What are the parts?",
                SCAFFOLD: "Break it down. What connects to what?",
                DIRECT: "The key relationship is... Notice that...",
                SOLUTION: "Here's the analysis. The components are..."
            },
            EVALUATE: {
                NUDGE: "What criteria are you using to judge this?",
                SCAFFOLD: "Consider the evidence. What's strong? What's weak?",
                DIRECT: "Evaluate using these criteria:... The strengths are...",
                SOLUTION: "Here's my evaluation. Based on the evidence..."
            },
            CREATE: {
                NUDGE: "What's your unique approach? Start brainstorming.",
                SCAFFOLD: "Combine ideas. What's your vision?",
                DIRECT: "Here's a framework to build from...",
                SOLUTION: "Here's one possible creation. You could also try..."
            }
        };

        return scaffolds[bloomLevel];
    },

    /**
     * Get related concepts for deeper learning
     */
    getRelatedConcepts(bloomLevel: BloomLevel): string[] {
        const concepts: Record<BloomLevel, string[]> = {
            REMEMBER: ["definitions", "key terms", "basic facts"],
            UNDERSTAND: ["main ideas", "summaries", "explanations"],
            APPLY: ["procedures", "methods", "techniques"],
            ANALYZE: ["relationships", "patterns", "structures"],
            EVALUATE: ["criteria", "evidence", "judgment"],
            CREATE: ["synthesis", "design", "innovation"]
        };
        return concepts[bloomLevel];
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // RESPONSE EVALUATION
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Evaluate a student's response and provide feedback
     */
    evaluateResponse(
        response: string,
        expectedConcepts: string[],
        bloomLevel: BloomLevel,
        gradeLevel: number,
        _rubric?: { criteria: string; weight: number }[]
    ): EvaluationResult {
        // Simplified evaluation logic (in production, this would use NLP/AI)
        const normalizedResponse = response.toLowerCase().trim();
        const matchedConcepts: string[] = [];
        const missedConcepts: string[] = [];

        // Check for key concept matches
        for (const concept of expectedConcepts) {
            if (normalizedResponse.includes(concept.toLowerCase())) {
                matchedConcepts.push(concept);
            } else {
                missedConcepts.push(concept);
            }
        }

        // Calculate score
        const conceptMatchRate = expectedConcepts.length > 0
            ? matchedConcepts.length / expectedConcepts.length
            : 0;

        // Adjust for response length and quality indicators
        const lengthScore = Math.min(1, normalizedResponse.length / 50);
        const effortScore = response.split(' ').length > 5 ? 1 : 0.5;

        const rawScore = (conceptMatchRate * 0.6) + (lengthScore * 0.2) + (effortScore * 0.2);
        const score = Math.round(rawScore * 100);

        // Determine quality
        let quality: ResponseQuality;
        if (score >= 90) quality = "EXCELLENT";
        else if (score >= 70) quality = "GOOD";
        else if (score >= 50) quality = "PARTIAL";
        else if (score >= 20) quality = "INCORRECT";
        else quality = "STUCK";

        // Generate feedback
        const feedback = this.generateFeedback(quality, matchedConcepts, missedConcepts, gradeLevel);

        return {
            quality,
            score,
            feedback: feedback.main,
            correctParts: matchedConcepts.map(c => `✓ Addressed: ${c}`),
            improvementAreas: missedConcepts.map(c => `Consider: ${c}`),
            masteryProgress: Math.min(100, score + 10), // Slight boost for attempt
            shouldAdvance: score >= 65,
            recommendedReview: score < 50 ? this.getReviewContent(bloomLevel) : undefined
        };
    },

    /**
     * Generate constructive feedback based on response quality
     */
    generateFeedback(
        quality: ResponseQuality,
        correct: string[],
        missed: string[],
        gradeLevel: number
    ): { main: string; details: string[] } {
        const isYoung = gradeLevel <= 5;

        switch (quality) {
            case "EXCELLENT":
                return {
                    main: isYoung
                        ? "🌟 WOW! That's amazing! You really understand this!"
                        : "Outstanding work. Your response demonstrates deep understanding.",
                    details: ["All key concepts addressed", "Clear explanation", "Ready for next level"]
                };

            case "GOOD":
                return {
                    main: isYoung
                        ? "👏 Great job! You got most of it right!"
                        : "Solid response. You've captured the main ideas well.",
                    details: [`Strong points: ${correct.join(", ")}`, `To strengthen: ${missed.join(", ")}`]
                };

            case "PARTIAL":
                return {
                    main: isYoung
                        ? "🌱 Good try! Let's build on what you know!"
                        : "Partial understanding demonstrated. Let's strengthen your grasp.",
                    details: [`Correct: ${correct.join(", ")}`, `Needs work: ${missed.join(", ")}`]
                };

            case "INCORRECT":
                return {
                    main: isYoung
                        ? "💪 Nice effort! Let's learn this together!"
                        : "This needs revision. Review the core concepts and try again.",
                    details: [`Missing key concepts: ${missed.join(", ")}`, "Use the hints provided"]
                };

            case "STUCK":
                return {
                    main: isYoung
                        ? "🤗 That's OK! Let me help you! Everyone needs help sometimes!"
                        : "Let's take a step back and rebuild from fundamentals.",
                    details: ["Review prerequisite material", "Use available hints", "Try breaking it into smaller steps"]
                };
        }
    },

    /**
     * Get recommended review content based on struggle area
     */
    getReviewContent(bloomLevel: BloomLevel): string {
        // In production, this would query the curriculum database
        const reviewMap: Record<BloomLevel, string> = {
            REMEMBER: "review_basic_facts",
            UNDERSTAND: "review_concepts",
            APPLY: "review_procedures",
            ANALYZE: "review_analysis_skills",
            EVALUATE: "review_evaluation_criteria",
            CREATE: "review_synthesis_techniques"
        };
        return reviewMap[bloomLevel];
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // LEARNING PATH SUGGESTIONS
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Suggest next learning activities based on current performance
     */
    suggestNextSteps(
        currentNode: ContentNode,
        _evaluationResult: EvaluationResult,
        _historyLength: number
    ): { immediate: string; shortTerm: string[]; longTerm: string } {
        const { shouldAdvance } = _evaluationResult;

        if (shouldAdvance) {
            return {
                immediate: "Great progress! Move to the next challenge.",
                shortTerm: [
                    "Try a similar problem at higher difficulty",
                    "Explore related concepts",
                    "Help a squadmate with this topic"
                ],
                longTerm: `Continue building toward mastery in ${currentNode.subject}`
            };
        } else {
            return {
                immediate: "Let's reinforce this concept before moving on.",
                shortTerm: [
                    "Review the hints and try again",
                    "Practice with an easier problem first",
                    "Watch a concept video or tutorial"
                ],
                longTerm: `Focus on strengthening ${currentNode.subject} fundamentals`
            };
        }
    },

    /**
     * Detect if user might be frustrated and need intervention
     */
    detectFrustration(
        attempts: number,
        timeSpent: number,
        recentScores: number[]
    ): { frustrated: boolean; intervention: string } {
        const avgRecentScore = recentScores.length > 0
            ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length
            : 100;

        const isFrustrated = (
            attempts >= 5 ||
            (timeSpent > 600 && attempts >= 3) ||
            (avgRecentScore < 40 && recentScores.length >= 3)
        );

        if (isFrustrated) {
            return {
                frustrated: true,
                intervention: "Take a break! You've been working hard. Try a fun activity or come back fresh tomorrow. Your brain needs rest to consolidate learning! 🌈"
            };
        }

        return { frustrated: false, intervention: "" };
    }
};

export default SageAITutor;
