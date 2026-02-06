// =============================================================================
// SOULBOUND PROGRESSION ENGINE - Core Logic & State Management
// =============================================================================
// This is the "Brain" that powers skill progression, XP calculations,
// streak tracking, and the "Welcome Back" resume system.

import type {
    SoulboundProfile,
    SkillGraph,
    Skill,
    SkillCategory,
    CompletedNode,
    MasteryTier
} from './types';

import {
    xpForLevel,
    getTierFromLevel,
    createDefaultProfile,
    ECONOMY_CONFIG
} from './types';

// ----------------- XP & LEVELING ENGINE -----------------

/**
 * Add XP to a specific skill and handle level-ups
 */
export const addSkillXP = (
    skill: Skill,
    xpGained: number
): { skill: Skill; leveledUp: boolean; newTier: MasteryTier | null } => {
    let { level, xp, xpToNext, tier, lastPracticed } = skill;
    let leveledUp = false;
    let newTier: MasteryTier | null = null;

    // Add XP
    xp += xpGained;

    // Check for level ups (can level multiple times)
    while (xp >= xpToNext && level < 100) {
        xp -= xpToNext;
        level++;
        xpToNext = xpForLevel(level);
        leveledUp = true;

        // Check for tier upgrade
        const calculatedTier = getTierFromLevel(level);
        if (calculatedTier !== tier) {
            tier = calculatedTier;
            newTier = tier;
        }
    }

    // Update practice timestamp for decay calculation
    lastPracticed = Date.now();

    return {
        skill: { ...skill, level, xp, xpToNext, tier, lastPracticed },
        leveledUp,
        newTier
    };
};

/**
 * Calculate skill decay (lose XP if not practiced recently)
 * Decay starts after 7 days of inactivity
 */
export const calculateSkillDecay = (skill: Skill): Skill => {
    const daysSinceLastPractice = Math.floor(
        (Date.now() - skill.lastPracticed) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastPractice <= 7) return skill;

    // Lose 1% of current level XP per day after 7 days (max 10% total)
    const decayDays = Math.min(daysSinceLastPractice - 7, 10);
    const decayAmount = Math.floor(skill.xp * 0.01 * decayDays);

    return {
        ...skill,
        xp: Math.max(0, skill.xp - decayAmount)
    };
};

/**
 * Update entire skill graph with XP rewards
 */
export const updateSkillGraph = (
    graph: SkillGraph,
    rewards: Partial<Record<SkillCategory, number>>
): { graph: SkillGraph; events: string[] } => {
    const events: string[] = [];
    const updatedSkills = { ...graph.skills };
    let totalXP = graph.totalXP;

    Object.entries(rewards).forEach(([category, xp]) => {
        if (xp && xp > 0) {
            const skillCategory = category as SkillCategory;
            const result = addSkillXP(updatedSkills[skillCategory], xp);
            updatedSkills[skillCategory] = result.skill;
            totalXP += xp;

            if (result.leveledUp) {
                events.push(`⬆️ ${skillCategory.toUpperCase()} leveled up to ${result.skill.level}!`);
            }
            if (result.newTier) {
                events.push(`🎖️ Achieved ${result.newTier.toUpperCase()} tier in ${skillCategory}!`);
            }
        }
    });

    // Recalculate dominant/weakest skills
    const skillLevels = Object.entries(updatedSkills).map(([cat, skill]) => ({
        category: cat as SkillCategory,
        level: skill.level
    }));

    skillLevels.sort((a, b) => b.level - a.level);
    const dominantSkill = skillLevels[0].category;
    const weakestSkill = skillLevels[skillLevels.length - 1].category;

    return {
        graph: { skills: updatedSkills, totalXP, dominantSkill, weakestSkill },
        events
    };
};

// ----------------- STREAK SYSTEM -----------------

/**
 * Update daily streak based on login
 */
export const updateStreak = (
    profile: SoulboundProfile,
    todayDate: string // YYYY-MM-DD format
): { profile: SoulboundProfile; streakBroken: boolean; streakBonus: number } => {
    const lastLogin = profile.lastLoginDate;
    let { dailyStreak, longestStreak } = profile;
    let streakBroken = false;
    let streakBonus = 0;

    if (lastLogin === todayDate) {
        // Already logged in today, no change
        return { profile, streakBroken: false, streakBonus: 0 };
    }

    // Calculate days since last login
    const last = new Date(lastLogin);
    const today = new Date(todayDate);
    const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
        // Consecutive day - extend streak
        dailyStreak++;
        if (dailyStreak > longestStreak) {
            longestStreak = dailyStreak;
        }

        // Streak bonuses at milestones
        if (dailyStreak % 7 === 0) streakBonus = 50;      // Weekly bonus
        else if (dailyStreak % 30 === 0) streakBonus = 250; // Monthly bonus
        else streakBonus = 10; // Daily bonus

    } else if (diffDays > 1) {
        // Streak broken
        streakBroken = true;
        dailyStreak = 1; // Reset to 1 (today counts)
    }

    return {
        profile: {
            ...profile,
            dailyStreak,
            longestStreak,
            lastLoginDate: todayDate,
            lastActiveAt: Date.now()
        },
        streakBroken,
        streakBonus
    };
};

// ----------------- RESUME SYSTEM ("Welcome Back") -----------------

/**
 * Save current mission progress for resume
 */
export const saveResumePoint = (
    profile: SoulboundProfile,
    missionId: string,
    progress: number,
    stateSnapshot: object
): SoulboundProfile => {
    return {
        ...profile,
        currentMission: missionId,
        resumePoint: {
            missionId,
            progress,
            lastPosition: stateSnapshot
        }
    };
};

/**
 * Clear resume point when mission is completed
 */
export const clearResumePoint = (profile: SoulboundProfile): SoulboundProfile => {
    return {
        ...profile,
        currentMission: undefined,
        resumePoint: undefined
    };
};

/**
 * Get welcome back message
 */
export const getWelcomeBackMessage = (profile: SoulboundProfile): string | null => {
    if (!profile.resumePoint) return null;

    const { progress } = profile.resumePoint;
    return `Welcome back, ${profile?.displayName || 'Legend'}! You were ${progress}% through your last mission. Resume?`;
};

// ----------------- NODE COMPLETION -----------------

/**
 * Record a completed learning node
 */
export const completeNode = (
    profile: SoulboundProfile,
    node: Omit<CompletedNode, 'completedAt'>
): SoulboundProfile => {
    const completedNode: CompletedNode = {
        ...node,
        completedAt: Date.now()
    };

    return {
        ...profile,
        completedNodes: [...profile.completedNodes, completedNode]
    };
};

/**
 * Check if a node has been completed
 */
export const hasCompletedNode = (profile: SoulboundProfile, nodeId: string): boolean => {
    return profile.completedNodes.some(node => node.id === nodeId);
};

// ----------------- ECONOMY FUNCTIONS -----------------

/**
 * Add Genesis Points (play money)
 */
export const addGenesisPoints = (
    profile: SoulboundProfile,
    amount: number,
    description: string
): { profile: SoulboundProfile; transaction: object } => {
    return {
        profile: {
            ...profile,
            genesisPoints: profile.genesisPoints + amount
        },
        transaction: {
            type: 'mission_reward',
            amount,
            currency: 'GP',
            description,
            timestamp: Date.now()
        }
    };
};

/**
 * Process real money payment (client mission)
 */
export const processClientPayment = (
    profile: SoulboundProfile,
    grossAmount: number,
    squadId?: string
): {
    profile: SoulboundProfile;
    userPayout: number;
    squadPayout: number;
    platformFee: number;
} => {
    const userPayout = grossAmount * ECONOMY_CONFIG.userShare;
    const squadPayout = squadId ? grossAmount * ECONOMY_CONFIG.squadShare : 0;
    const platformFee = grossAmount * ECONOMY_CONFIG.platformShare + (squadId ? 0 : grossAmount * ECONOMY_CONFIG.squadShare);

    return {
        profile: {
            ...profile,
            pendingPayout: profile.pendingPayout + userPayout,
            lifetimeEarnings: profile.lifetimeEarnings + userPayout
        },
        userPayout,
        squadPayout,
        platformFee
    };
};

/**
 * Check if user can access real bounties
 */
export const canAccessBounties = (profile: SoulboundProfile): {
    canAccess: boolean;
    reason: string;
    progress: number;
} => {
    if (!profile.verifiedSolverBadge) {
        return {
            canAccess: false,
            reason: 'Complete verification tasks to earn your Verified Solver Badge',
            progress: (profile.skillGraph.totalXP / ECONOMY_CONFIG.verificationThreshold) * 100
        };
    }

    const avgLevel = Object.values(profile.skillGraph.skills)
        .reduce((sum, s) => sum + s.level, 0) / 6;

    if (avgLevel < ECONOMY_CONFIG.payoutUnlockLevel) {
        return {
            canAccess: false,
            reason: `Reach average skill level ${ECONOMY_CONFIG.payoutUnlockLevel} to unlock bounties`,
            progress: (avgLevel / ECONOMY_CONFIG.payoutUnlockLevel) * 100
        };
    }

    return {
        canAccess: true,
        reason: 'Bounty Board unlocked!',
        progress: 100
    };
};

// ----------------- SQUAD GATING -----------------

/**
 * Check if user has hit the "solo cap" and needs a squad
 */
export const checkSoloCap = (profile: SoulboundProfile): {
    hitCap: boolean;
    suggestSquad: boolean;
    message: string;
} => {
    const maxSoloLevel = ECONOMY_CONFIG.simulationCapLevel;
    const avgLevel = Object.values(profile.skillGraph.skills)
        .reduce((sum, s) => sum + s.level, 0) / 6;

    if (avgLevel >= maxSoloLevel && !profile.squadId) {
        return {
            hitCap: true,
            suggestSquad: true,
            message: `You've reached Level ${maxSoloLevel}! To continue growing, join a Squad. Teamwork unlocks advanced missions.`
        };
    }

    return {
        hitCap: false,
        suggestSquad: false,
        message: ''
    };
};

// ----------------- PROFILE PERSISTENCE (localStorage for now) -----------------

const STORAGE_KEY = 'mbp_soulbound_profile';

/**
 * Save profile to localStorage
 */
export const saveProfile = (profile: SoulboundProfile): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
};

/**
 * Load profile from localStorage
 */
export const loadProfile = (): SoulboundProfile | null => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
};

/**
 * Create or load profile
 */
export const initializeProfile = (
    userId: string,
    name: string,
    archetype: string,
    sector: string,
    gradeLevel?: number
): SoulboundProfile => {
    const existing = loadProfile();
    if (existing && existing.userId === userId) {
        return existing;
    }

    const newProfile = createDefaultProfile(userId, name, archetype, sector);
    if (gradeLevel) newProfile.gradeLevel = gradeLevel;
    saveProfile(newProfile);
    return newProfile;
};
