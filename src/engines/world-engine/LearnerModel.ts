
// ============================================================================
// WORLD ENGINE: LEARNER MODEL (v9.3 — Identity Over Points)
// ============================================================================
// The "Brain" that tracks WHO a person is becoming, not just what they scored.
// 
// SOUL CONSTRAINTS:
// - NO genesisPoints, XP, or fake currency in this model.
// - Tracks: Traits (persistent identity attributes) + Verified Competencies.
// - Tracks: Cognitive State for adaptive difficulty.
// - Tracks: Mastery Map for spaced repetition.
// ============================================================================

import type { SpiralTier } from './KnowledgeGraph';

export type GradeLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type SubjectDomain =
    | 'literacy'   // ELA, Reading, Writing
    | 'numeracy'   // Math, Logic
    | 'science'    // Bio, Chem, Physics, Nature
    | 'social'     // History, Civics, Economics
    | 'sel'        // Social Emotional Learning
    | 'career';    // CTE, Professional Skills

// ============================================================================
// MASTERY TRACKING (Unchanged — this is honest measurement)
// ============================================================================

export interface MasteryRecord {
    nodeId: string;       // ID of the specific concept (e.g., "phonemic_awareness_1")
    masteryScore: number; // 0.0 to 1.0
    attempts: number;
    lastReviewed: number; // Timestamp
    strength: number;     // calculated decay based on Ebbinghaus curve
}

// ============================================================================
// COGNITIVE STATE (Unchanged — this is honest measurement)
// ============================================================================

export interface CognitiveState {
    focusLevel: number;        // 0-100 (Current attention span)
    frustrationLevel: number;  // 0-100 (Trigger for intervention)
    energyLevel: number;       // 0-100 (Trigger for breaks)
    currentZPD: number;        // Zone of Proximal Development adjustment factor
}

// ============================================================================
// IDENTITY SYSTEM (v9.3 — Replaces Points/Badges)
// ============================================================================

/**
 * A Trait is a persistent identity attribute that grows through demonstrated behavior.
 * NOT a reward. NOT a badge. It is a measurement of who the learner IS.
 * 
 * Example Traits:
 * - Resilience: "Completed 3 tasks after initial failure without assistance"
 * - Systems Thinking: "Connected concepts across 2+ domains in a single session"
 * - Curiosity: "Voluntarily explored 5+ nodes beyond the assigned path"
 * - Precision: "Achieved >90% accuracy on first attempt across 10+ tasks"
 */
export interface TraitRecord {
    traitId: string;          // e.g., "resilience", "systems_thinking", "curiosity"
    label: string;            // Human-readable: "Resilience"
    strength: number;         // 0.0 to 1.0 — how strongly this trait is demonstrated
    evidence: string[];       // Specific actions that contributed (audit trail)
    firstObserved: number;    // Timestamp
    lastReinforced: number;   // Timestamp
}

/**
 * A Verified Competency is proof that the learner CAN DO something.
 * It is NOT a "badge" or "achievement". It is a verifiable skill record.
 * 
 * Example:
 * - "Can decode CVC words with 95% accuracy" (Tier: SPROUTS, SDI: 0)
 * - "Can model force diagrams for static structures" (Tier: BUILDERS, SDI: 1)
 * - "Can isolate variables in a controlled experiment" (Tier: TRAILBLAZERS, SDI: 2)
 */
export interface VerifiedCompetency {
    competencyId: string;     // e.g., "ela.g1.cvc_decoding"
    title: string;            // "CVC Word Decoding"
    domain: SubjectDomain;
    tier: SpiralTier;
    sdi: number;              // 0-4
    verifiedAt: number;       // Timestamp of verification
    masteryScore: number;     // The score at time of verification (must be >= 0.8)
    evidence: string;         // What proved this — e.g., "10/10 correct on CVC assessment"
    standardRef?: string;     // Optional: CCSS/NGSS standard this maps to
}

// ============================================================================
// LEARNER PROFILE (v9.3 — The Living Identity Record)
// ============================================================================

export interface LearnerProfile {
    id: string;
    name: string;
    currentGrade: GradeLevel;

    // The developmental tier this learner is operating in
    currentTier: SpiralTier;

    // The "Knowledge Map" - granular tracking of every concept
    masteryMap: Map<string, MasteryRecord>;

    // High-level stats per domain
    domainLevels: Record<SubjectDomain, number>; // e.g., Math: 4.5 (Grade 4, halfway)

    // Psychological Profile
    cognitiveState: CognitiveState;
    interests: string[];      // e.g., "Dinosaurs", "Space", "Minecraft"

    // Metacognition
    learningStyle: 'visual' | 'verbal' | 'kinesthetic' | 'mixed';
    goals: string[];          // e.g., "Become an Astronaut"

    // ══════════════════════════════════════════════════════════
    // IDENTITY TRACKING (v9.3 — Replaces genesisPoints / XP)
    // ══════════════════════════════════════════════════════════

    /** Persistent identity traits observed through behavior */
    traits: Map<string, TraitRecord>;

    /** Skills proven through assessment — the "diploma fragments" */
    verifiedCompetencies: VerifiedCompetency[];

    // Progress Tracking
    completedMissions: string[];
    activeContracts: string[]; // Market jobs currently in progress
    totalEarnings: number; // Real value generated (USD equivalent)

    // Assessment Engine
    calibrationScore: number; // 0-100: How confident the system is in this student's placement
}

// ============================================================================
// LEARNER MODEL CLASS
// ============================================================================

export class LearnerModel {
    private profile: LearnerProfile;

    constructor(initialProfile: LearnerProfile) {
        this.profile = initialProfile;
    }

    /**
     * Updates the mastery score for a specific node after an interaction.
     * Implements "Mastery Learning" - we don't move on until mastery > 0.8
     */
    public updateMastery(nodeId: string, success: boolean, _timeSpent: number): void {
        const record = this.profile.masteryMap.get(nodeId) || {
            nodeId,
            masteryScore: 0,
            attempts: 0,
            lastReviewed: 0,
            strength: 0
        };

        // Simple mastery update logic (placeholder for Bayesian update)
        if (success) {
            record.masteryScore = Math.min(1.0, record.masteryScore + 0.15);
            record.strength = Math.min(1.0, record.strength + 0.1);
        } else {
            // Failure allows us to diagnose, doesn't drop mastery drastically
            // but indicates need for reinforcement
            record.masteryScore = Math.max(0, record.masteryScore - 0.05);
        }

        record.attempts++;
        record.lastReviewed = Date.now();
        this.profile.masteryMap.set(nodeId, record);
    }

    /**
     * Record or reinforce a Trait observation.
     * Called when the system detects a behavioral pattern.
     * 
     * Pedagogical Why: Traits are not "earned" — they are OBSERVED.
     * The system notices resilience, curiosity, precision, etc. and records it.
     */
    public recordTrait(traitId: string, label: string, evidenceAction: string): void {
        const existing = this.profile.traits.get(traitId);
        if (existing) {
            // Reinforce — cap at 1.0
            existing.strength = Math.min(1.0, existing.strength + 0.05);
            existing.evidence.push(evidenceAction);
            existing.lastReinforced = Date.now();
        } else {
            // First observation
            this.profile.traits.set(traitId, {
                traitId,
                label,
                strength: 0.1,
                evidence: [evidenceAction],
                firstObserved: Date.now(),
                lastReinforced: Date.now()
            });
        }
    }

    /**
     * Add a Verified Competency when mastery >= 0.8 on a node.
     * This is the "proof of skill" — the real reward.
     * 
     * Pedagogical Why: We sell competence and the proof of it.
     * A Verified Competency is a portable, auditable skill record.
     */
    public addVerifiedCompetency(competency: VerifiedCompetency): void {
        // Prevent duplicates
        const exists = this.profile.verifiedCompetencies.find(
            c => c.competencyId === competency.competencyId
        );
        if (!exists) {
            this.profile.verifiedCompetencies.push(competency);
        }
    }

    /**
     * Decay Calculation (Ebbinghaus Forgetting Curve)
     * Reduces "strength" over time to trigger Spaced Repetition
     */
    public applyDecay(): void {
        const now = Date.now();
        const DAY_IN_MS = 86400000;

        this.profile.masteryMap.forEach((record) => {
            const daysSinceReview = (now - record.lastReviewed) / DAY_IN_MS;
            if (daysSinceReview > 1) {
                // Decay factor: 0.95 per day
                record.strength *= Math.pow(0.95, daysSinceReview);
            }
        });
    }

    public getProfile(): LearnerProfile {
        return this.profile;
    }

    public getDomainLevel(domain: SubjectDomain): number {
        return this.profile.domainLevels[domain];
    }

    public getTraits(): Map<string, TraitRecord> {
        return this.profile.traits;
    }

    public getVerifiedCompetencies(): VerifiedCompetency[] {
        return this.profile.verifiedCompetencies;
    }
}
