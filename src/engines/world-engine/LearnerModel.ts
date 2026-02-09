
// ============================================================================
// WORLD ENGINE: LEARNER MODEL
// ============================================================================
// The "Brain" that tracks the student's cognitive state, academic progress,
// and psychological engagement.
// Based on: docs/ARCHITECTURE_2026.md
// ============================================================================

export type GradeLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type SubjectDomain =
    | 'literacy'   // ELA, Reading, Writing
    | 'numeracy'   // Math, Logic
    | 'science'    // Bio, Chem, Physics, Nature
    | 'social'     // History, Civics, Economics
    | 'sel'        // Social Emotional Learning
    | 'career';    // CTE, Professional Skills

export interface MasteryRecord {
    nodeId: string;       // ID of the specific concept (e.g., "phonemic_awareness_1")
    masteryScore: number; // 0.0 to 1.0
    attempts: number;
    lastReviewed: number; // Timestamp
    strength: number;     // calculated decay based on Ebbinghaus curve
}

export interface CognitiveState {
    focusLevel: number;        // 0-100 (Current attention span)
    frustrationLevel: number;  // 0-100 (Trigger for intervention)
    energyLevel: number;       // 0-100 (Trigger for breaks)
    currentZPD: number;        // Zone of Proximal Development adjustment factor
}

export interface LearnerProfile {
    id: string;
    name: string;
    currentGrade: GradeLevel;

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

    // Calibrated Identity
    isCalibrated: boolean;
    confidence: number;       // 0-100 (Trust score)
    unlockedTasks: string[];   // Specific contract/bounty IDs unlocked
    version: number;          // For optimistic locking

    // Progress Tracking
    completedMissions: string[];
    genesisPoints: number;
}

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
     * Decay Calculation (Ebbinghaus Forgetting Curve)
     * Reduces "strength" over time to trigger Spaced Repetition
     */
    public applyDecay(): void {
        const now = Date.now();
        const DAY_IN_MS = 86400000;

        this.profile.masteryMap.forEach((record) => {
            const daysSinceReview = (now - record.lastReviewed) / DAY_IN_MS;
            if (daysSinceReview > 1) {
                // Decay factor: 0.9 per day roughly
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
}
