// =============================================================================
// SOULBOUND PROGRESSION ENGINE - Core Types & Interfaces
// =============================================================================
// This file defines the "Memory" of MyBestPurpose - the living student record
// that tracks skills, progress, and economic status across the platform.

// ----------------- SKILL SYSTEM -----------------

export type SkillCategory =
    | 'logic'      // Math, Programming, Problem Solving
    | 'creativity' // Art, Design, Writing
    | 'engineering'// Building, Hardware, Physics
    | 'leadership' // Team Management, Communication
    | 'nature'     // Biology, Ecology, Environmental Science
    | 'social';    // Collaboration, Empathy, Networking

export type MasteryTier = 'novice' | 'apprentice' | 'journeyman' | 'expert' | 'master';

export interface Skill {
    category: SkillCategory;
    level: number;           // 1-100
    xp: number;              // Current XP in this level
    xpToNext: number;        // XP needed for next level
    tier: MasteryTier;       // Unlocks at specific thresholds
    lastPracticed: number;   // Timestamp for decay calculation
    streak: number;          // Consecutive days practiced
}

export interface SkillGraph {
    skills: Record<SkillCategory, Skill>;
    totalXP: number;
    dominantSkill: SkillCategory;
    weakestSkill: SkillCategory;
}

// ----------------- COMPLETED NODES (Learning Progress) -----------------

export interface CompletedNode {
    id: string;
    title: string;
    category: SkillCategory;
    completedAt: number;
    xpEarned: number;
    timeSpent: number;       // In seconds
    accuracy: number;        // 0-100%
    attempts: number;
}

// ----------------- SOULBOUND PROFILE (The "Memory") -----------------

export interface SoulboundProfile {
    // Identity
    userId: string;
    displayName: string;
    archetype: string;       // Engineer, Architect, Creator, Commander
    sector: string;          // Nature, Tech, People
    avatarUrl?: string;
    createdAt: number;
    lastActiveAt: number;
    gradeLevel?: number; // Added for refined recommendations

    // Progression
    skillGraph: SkillGraph;
    completedNodes: CompletedNode[];
    currentMission?: string; // ID of active mission
    resumePoint?: {          // "Welcome back" save state
        missionId: string;
        progress: number;    // 0-100%
        lastPosition: object; // State snapshot
    };

    // Social
    squadId?: string;
    squadRole?: 'tank' | 'dps' | 'support' | 'strategist';
    reputation: number;      // 0-1000 (affects client trust)
    collaborationScore: number;

    // Economy
    genesisPoints: number;   // Play money (GP)
    realBalance: number;     // Actual USD earned
    pendingPayout: number;   // In escrow awaiting verification
    lifetimeEarnings: number;
    verifiedSolverBadge: boolean;

    // Streaks & Engagement
    dailyStreak: number;
    longestStreak: number;
    lastLoginDate: string;   // YYYY-MM-DD for streak calculation
}

// ----------------- SQUAD SYSTEM -----------------

export interface SquadMember {
    userId: string;
    displayName: string;
    archetype: string;
    role: 'tank' | 'dps' | 'support' | 'strategist';
    contribution: number;    // Percentage of work done
    skills: SkillGraph;
}

export interface Squad {
    id: string;
    name: string;
    members: SquadMember[];
    combinedPower: number;   // Sum of relevant skill levels
    formedAt: number;
    missionsCompleted: number;
    totalEarnings: number;
    isActive: boolean;
}

// ----------------- MISSION SYSTEM -----------------

export type MissionDifficulty = 'tutorial' | 'easy' | 'medium' | 'hard' | 'expert' | 'legendary';
export type MissionType = 'solo' | 'squad' | 'client' | 'simulation';

export interface MissionRequirements {
    minLevel: number;
    requiredSkills: Partial<Record<SkillCategory, number>>;
    squadRequired: boolean;
    minSquadSize?: number;
    verifiedBadgeRequired: boolean;
}

export interface MissionReward {
    xp: Record<SkillCategory, number>;
    genesisPoints: number;
    realMoney?: number;      // Only for client missions
    unlocks?: string[];      // IDs of content unlocked
}

export interface Mission {
    id: string;
    title: string;
    description: string;
    type: MissionType;
    difficulty: MissionDifficulty;
    requirements: MissionRequirements;
    rewards: MissionReward;

    // Adaptive content
    educationalTags: string[];  // e.g., ["fractions", "4th-grade-math"]
    slipInContent?: {           // Hidden educational objectives
        subject: string;
        gradeLevel: string;
        standard: string;       // Common Core / State Standard ID
    };

    // Progress
    estimatedTime: number;      // Minutes
    checkpoints: number;        // Save points within mission
}

// ----------------- ECONOMY SYSTEM -----------------

export type TransactionType =
    | 'mission_reward'
    | 'squad_split'
    | 'client_payment'
    | 'platform_fee'
    | 'withdrawal'
    | 'bonus';

export interface Transaction {
    id: string;
    userId: string;
    type: TransactionType;
    amount: number;
    currency: 'GP' | 'USD';
    timestamp: number;
    description: string;
    relatedMissionId?: string;
    relatedSquadId?: string;
}

export interface EconomyConfig {
    // Stage transitions
    simulationCapLevel: number;     // Max level in simulation mode
    verificationThreshold: number;  // XP needed for verification tasks
    payoutUnlockLevel: number;      // Level to access real bounties

    // Splits
    userShare: number;              // e.g., 0.90 (90%)
    squadShare: number;             // e.g., 0.05 (5%)
    platformShare: number;          // e.g., 0.05 (5%)

    // Minimums
    minPayout: number;              // Minimum USD for withdrawal
    escrowDays: number;             // Days held before release
}

// ----------------- SAGE AI DIRECTOR -----------------

export interface SageDirective {
    type: 'adapt_difficulty' | 'slip_in_content' | 'suggest_squad' | 'unlock_bounty';
    priority: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    action: object;
    triggeredBy: string;     // What condition triggered this
}

export interface SageAnalysis {
    userId: string;
    timestamp: number;

    // Current state assessment
    skillGaps: Partial<Record<SkillCategory, number>>;  // Negative = deficit
    recommendedContent: string[];                        // Mission IDs
    squadCompatibility: string[];                        // User IDs who complement

    // Educational alignment
    academicNeeds: {
        subject: string;
        gradeLevel: string;
        proficiencyGap: number;  // How far behind standard
    }[];

    // Next steps
    directives: SageDirective[];
}

// ----------------- DEFAULTS & HELPERS -----------------

export const DEFAULT_SKILL: Skill = {
    category: 'logic',
    level: 1,
    xp: 0,
    xpToNext: 100,
    tier: 'novice',
    lastPracticed: Date.now(),
    streak: 0
};

export const createDefaultSkillGraph = (): SkillGraph => ({
    skills: {
        logic: { ...DEFAULT_SKILL, category: 'logic' },
        creativity: { ...DEFAULT_SKILL, category: 'creativity' },
        engineering: { ...DEFAULT_SKILL, category: 'engineering' },
        leadership: { ...DEFAULT_SKILL, category: 'leadership' },
        nature: { ...DEFAULT_SKILL, category: 'nature' },
        social: { ...DEFAULT_SKILL, category: 'social' }
    },
    totalXP: 0,
    dominantSkill: 'logic',
    weakestSkill: 'social'
});

export const createDefaultProfile = (userId: string, name: string, archetype: string, sector: string): SoulboundProfile => ({
    userId,
    displayName: name,
    archetype,
    sector,
    createdAt: Date.now(),
    lastActiveAt: Date.now(),

    skillGraph: createDefaultSkillGraph(),
    completedNodes: [],

    reputation: 100,
    collaborationScore: 0,

    genesisPoints: 0,
    realBalance: 0,
    pendingPayout: 0,
    lifetimeEarnings: 0,
    verifiedSolverBadge: false,

    dailyStreak: 0,
    longestStreak: 0,
    lastLoginDate: new Date().toISOString().split('T')[0],
    gradeLevel: 10 // Default to Sophomore/Grade 10
});

export const ECONOMY_CONFIG: EconomyConfig = {
    simulationCapLevel: 5,
    verificationThreshold: 5000,
    payoutUnlockLevel: 10,

    userShare: 0.90,
    squadShare: 0.05,
    platformShare: 0.05,

    minPayout: 25,
    escrowDays: 7
};

// Tier thresholds
export const TIER_THRESHOLDS: Record<MasteryTier, number> = {
    novice: 0,
    apprentice: 10,
    journeyman: 25,
    expert: 50,
    master: 80
};

// XP required per level (exponential curve)
export const xpForLevel = (level: number): number => {
    return Math.floor(100 * Math.pow(1.15, level - 1));
};

// Calculate tier from level
export const getTierFromLevel = (level: number): MasteryTier => {
    if (level >= 80) return 'master';
    if (level >= 50) return 'expert';
    if (level >= 25) return 'journeyman';
    if (level >= 10) return 'apprentice';
    return 'novice';
};
