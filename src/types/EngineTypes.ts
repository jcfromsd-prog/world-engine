/* ==========================================================================
   ENGINE TYPES: The Core Data Contracts (v9.3)
   K-16 Mastery Protocol with IRT + Bloom's Taxonomy + Spiral Framework
   ========================================================================== */

import type { SpiralTier, SDI } from '../engines/world-engine/KnowledgeGraph';

export type BloomLevel = "REMEMBER" | "UNDERSTAND" | "APPLY" | "ANALYZE" | "EVALUATE" | "CREATE";
export type Subject = "ELA" | "MATH" | "SCIENCE" | "HISTORY" | "CAREER";
export type EngagementState = "FLOW" | "BORED" | "FRUSTRATED" | "DISCONNECTED";

/**
 * USER PROFILE
 * Represents a learner's current state in the system.
 * skillTheta: IRT ability parameter ranging from -3.0 (novice) to +3.0 (master)
 */
export interface UserProfile {
    id: string;
    name: string;
    archetype: string; // e.g., "Builder", "Explorer", "Analyst", "Innovator"
    passion: string;   // PRIMARY PASSION (Coding, Science, Creative) 
    skillTheta: number; // -3.0 to +3.0 (IRT ability parameter)
    gradeLevel: number; // 0=PreK, 1-12=K-12, 13-16=College
    interests: string[];
    competencies: Record<string, number>; // e.g., { "CriticalThinking": 0.75 }
}

/**
 * CONTENT NODE
 * Represents a single learning activity / mission in the curriculum database.
 * difficulty: IRT item difficulty parameter (same scale as skillTheta)
 */
export interface ContentNode {
    id: string;
    title: string;
    description: string;
    subject: Subject;
    bloomLevel: BloomLevel;
    difficulty: number; // IRT difficulty parameter
    minGrade: number;
    maxGrade: number;
    tags: string[]; // For interest matching: ["Civics", "Geometry", "NACE-Communication"]
    standardRef?: string; // Standards reference: "NY-ELA-9-12", "NGSS-MS-PS1", etc.
    estimatedMinutes?: number;

    // ══════════════════════════════════════════════════════════
    // SPIRAL FRAMEWORK (v9.3) — Identity Over Points
    // ══════════════════════════════════════════════════════════

    /** Developmental tier: SPROUTS → VOYAGERS */
    tier?: SpiralTier;

    /** Spiral Depth Index: 0=Concrete → 4=Systems */
    sdi?: SDI;

    /** Real-world phenomenon that anchors this task */
    phenomenon?: string;

    /** Why this task exists pedagogically */
    pedagogicalWhy?: string;

    /** If true, standard alignment must be RAG-verified */
    ragRequired?: boolean;
}

/**
 * FLASHCARD SIGNAL
 * Records user interaction with a learning item for spaced repetition.
 */
export interface FlashcardSignal {
    itemId: string;
    success: boolean;
    timestamp: number;
    responseTimeMs?: number;
}

/**
 * RECOMMENDATION RESULT
 * Wraps a ContentNode with additional metadata about why it was chosen.
 */
export interface RecommendationResult {
    node: ContentNode;
    successProbability: number;
    interestScore: number;
    reason: string;
}

/**
 * SIMULATION PERSONA
 * Pre-defined user profiles for testing the engine.
 */
export interface SimulationPersona extends UserProfile {
    description: string;
    expectedPath: string[];
}

/**
 * BLOOM LEVEL WEIGHTS
 * Higher Bloom levels are weighted more heavily for skill progression.
 */
export const BLOOM_WEIGHTS: Record<BloomLevel, number> = {
    REMEMBER: 0.1,
    UNDERSTAND: 0.15,
    APPLY: 0.2,
    ANALYZE: 0.25,
    EVALUATE: 0.3,
    CREATE: 0.35,
};

/**
 * GRADE LEVEL NAMES
 * Human-readable labels for grade levels.
 */
export const GRADE_LABELS: Record<number, string> = {
    0: "Pre-K",
    1: "1st Grade", 2: "2nd Grade", 3: "3rd Grade", 4: "4th Grade", 5: "5th Grade",
    6: "6th Grade", 7: "7th Grade", 8: "8th Grade",
    9: "9th Grade (Freshman)", 10: "10th Grade (Sophomore)", 11: "11th Grade (Junior)", 12: "12th Grade (Senior)",
    13: "College Freshman", 14: "College Sophomore", 15: "College Junior", 16: "College Senior",
};

/* ==========================================================================
   SIMULATION ENGINE v1.1 — BATCH ORCHESTRATION TYPES
   ========================================================================== */

export type SimulationStepName = "IDENTITY" | "CONNECT" | "LEARN" | "SOLVE" | "EARN" | "COMPLETE";

export type StressVector = "ADVERSARIAL" | "RAGE_QUIT" | "SLOW_NETWORK" | "REFRESH_MID_FLOW" | "NONE";

export type AgentOutcome = "PASS" | "FAIL" | "ABORT" | "CRASH";

/**
 * SIMULATION BATCH CONFIG
 * Defines the parameters for a full autonomous batch run.
 */
export interface SimulationBatchConfig {
    /** Total number of agents to simulate */
    agentCount: number;
    /** Target system under test (e.g., "Onboarding", "Marketplace") */
    target: string;
    /** Stress vectors to apply across the cohort */
    stressVectors: StressVector[];
    /** Persona distribution — keys from USER_PERSONAS, values = count */
    personaDistribution?: Record<string, number>;
    /** AbortController signal for emergency stop */
    signal?: AbortSignal;
    /** Simulated delay per step in ms (lower = faster runs). Default 200 */
    stepDelayMs?: number;
}

/**
 * SIMULATION PROGRESS
 * Real-time progress state emitted during a batch run.
 */
export interface SimulationProgress {
    /** Current agent index (1-based) */
    currentAgent: number;
    /** Total agents in the batch */
    totalAgents: number;
    /** Current agent's persona name */
    agentName: string;
    /** Current step the agent is on */
    currentStep: SimulationStepName;
    /** Overall batch progress 0.0 to 1.0 */
    progressPercent: number;
    /** Estimated time remaining in ms */
    estimatedRemainingMs: number;
    /** Agents completed so far */
    completedCount: number;
    /** Agents passed so far */
    passedCount: number;
    /** Agents failed so far */
    failedCount: number;
    /** Whether the batch is still running */
    isRunning: boolean;
    /** Whether the batch was aborted */
    wasAborted: boolean;
    /** Timestamp when batch started */
    startedAt: number;
}

/**
 * Individual agent simulation result
 */
export interface SimulationAgentResult {
    agentIndex: number;
    personaKey: string;
    personaName: string;
    outcome: AgentOutcome;
    steps: SimulationStepName[];
    failedAtStep?: SimulationStepName;
    durationMs: number;
    finalTheta: number;
    logs: string[];
}

/**
 * SIMULATION BATCH REPORT
 * Final summary after a batch completes or is aborted.
 */
export interface SimulationBatchReport {
    config: SimulationBatchConfig;
    results: SimulationAgentResult[];
    totalDurationMs: number;
    passRate: number;
    failRate: number;
    abortRate: number;
    wasAborted: boolean;
    completedAt: number;
}
