// =============================================================================
// SAGE AI - The Mission Director
// =============================================================================
// Sage is not just a chatbot - it's the AI that analyzes skill gaps,
// injects educational content into games, and guides users to mastery.

import type {
    SoulboundProfile,
    SkillCategory,
    SageDirective,
    SageAnalysis,
    MissionDifficulty
} from './types';

// ----------------- SKILL GAP ANALYSIS -----------------

interface AcademicStandard {
    id: string;
    subject: string;
    gradeLevel: string;
    description: string;
    requiredSkills: Partial<Record<SkillCategory, number>>;
}

// Sample academic standards (would come from database in production)
const ACADEMIC_STANDARDS: AcademicStandard[] = [
    {
        id: 'MATH.4.NF.1',
        subject: 'Math',
        gradeLevel: '4th',
        description: 'Understand equivalent fractions',
        requiredSkills: { logic: 15 }
    },
    {
        id: 'MATH.5.NF.3',
        subject: 'Math',
        gradeLevel: '5th',
        description: 'Interpret fractions as division',
        requiredSkills: { logic: 20 }
    },
    {
        id: 'SCI.4.LS.1',
        subject: 'Science',
        gradeLevel: '4th',
        description: 'Understand plant and animal structures',
        requiredSkills: { nature: 15, logic: 10 }
    },
    {
        id: 'ELA.5.W.1',
        subject: 'English',
        gradeLevel: '5th',
        description: 'Write opinion pieces on topics',
        requiredSkills: { creativity: 15, leadership: 10 }
    },
    {
        id: 'CS.6.AP.1',
        subject: 'Computer Science',
        gradeLevel: '6th',
        description: 'Develop algorithms using sequences',
        requiredSkills: { logic: 25, engineering: 15 }
    }
];

/**
 * Analyze user's skill gaps against academic standards
 */
export const analyzeSkillGaps = (
    profile: SoulboundProfile,
    targetGradeLevel: string = '4th'
): SageAnalysis['academicNeeds'] => {
    const relevantStandards = ACADEMIC_STANDARDS.filter(
        s => s.gradeLevel === targetGradeLevel
    );

    const gaps: SageAnalysis['academicNeeds'] = [];

    relevantStandards.forEach(standard => {
        let maxGap = 0;

        Object.entries(standard.requiredSkills).forEach(([skill, required]) => {
            const current = profile.skillGraph.skills[skill as SkillCategory].level;
            const gap = (required || 0) - current;
            if (gap > maxGap) maxGap = gap;
        });

        if (maxGap > 0) {
            gaps.push({
                subject: standard.subject,
                gradeLevel: standard.gradeLevel,
                proficiencyGap: maxGap
            });
        }
    });

    return gaps.sort((a, b) => b.proficiencyGap - a.proficiencyGap);
};

// ----------------- THE "SLIP-IN" METHOD -----------------

interface SlipInContent {
    originalObjective: string;
    modifiedObjective: string;
    educationalContent: {
        subject: string;
        concept: string;
        problem: string;
        hint: string;
    };
}

/**
 * Generate a "slip-in" educational modifier for a mission
 * This is the core "learning without realizing it" mechanic
 */
export const generateSlipIn = (
    profile: SoulboundProfile,
    missionContext: string // e.g., "Forest Ranger: Find the sick tree"
): SlipInContent | null => {
    const gaps = analyzeSkillGaps(profile);

    if (gaps.length === 0) return null;

    const primaryGap = gaps[0];

    // Generate contextual slip-in based on subject and mission
    const slipIns: Record<string, SlipInContent> = {
        'Math': {
            originalObjective: missionContext,
            modifiedObjective: missionContext.replace(
                'Find',
                'Mix the medicine. Combine fractions of ingredients, then find'
            ),
            educationalContent: {
                subject: 'Math',
                concept: 'Fractions',
                problem: 'Combine 1/2 cup of red serum with 1/4 cup of blue serum. How much total medicine do you have?',
                hint: 'Find a common denominator first!'
            }
        },
        'Science': {
            originalObjective: missionContext,
            modifiedObjective: missionContext.replace(
                'Find',
                'Analyze the leaf structure to identify, then find'
            ),
            educationalContent: {
                subject: 'Science',
                concept: 'Plant Biology',
                problem: 'Count the veins on each leaf. Which pattern indicates the sick tree?',
                hint: 'Look for irregular vein patterns!'
            }
        },
        'English': {
            originalObjective: missionContext,
            modifiedObjective: missionContext + ' Then write a field report.',
            educationalContent: {
                subject: 'English',
                concept: 'Expository Writing',
                problem: 'Write a 3-sentence report describing what you found and why it matters.',
                hint: 'Use descriptive words and state your opinion!'
            }
        },
        'Computer Science': {
            originalObjective: missionContext,
            modifiedObjective: missionContext.replace(
                'Find',
                'Program the scanner drone to find'
            ),
            educationalContent: {
                subject: 'Computer Science',
                concept: 'Algorithms',
                problem: 'Create a sequence of commands: SCAN, MOVE_LEFT, SCAN, MOVE_RIGHT, ANALYZE',
                hint: 'Think step by step!'
            }
        }
    };

    return slipIns[primaryGap.subject] || null;
};

// ----------------- DIFFICULTY CALIBRATION -----------------

/**
 * Dynamically adjust mission difficulty based on user performance
 */
export const calibrateDifficulty = (
    _profile: SoulboundProfile,
    recentAccuracy: number, // 0-100% from last few missions
    recentCompletionTime: number, // Percentage of estimated time used
    currentDifficulty: MissionDifficulty
): {
    recommendedDifficulty: MissionDifficulty;
    reason: string;
    adjustment: 'easier' | 'same' | 'harder';
} => {
    const difficulties: MissionDifficulty[] = [
        'tutorial', 'easy', 'medium', 'hard', 'expert', 'legendary'
    ];
    const currentIndex = difficulties.indexOf(currentDifficulty);

    // If struggling (low accuracy, taking too long)
    if (recentAccuracy < 60 || recentCompletionTime > 150) {
        if (currentIndex > 0) {
            return {
                recommendedDifficulty: difficulties[currentIndex - 1],
                reason: 'Adjusting to build confidence. Mastery comes with practice!',
                adjustment: 'easier'
            };
        }
    }

    // If breeezing through (high accuracy, finishing quickly)
    if (recentAccuracy > 90 && recentCompletionTime < 50) {
        if (currentIndex < difficulties.length - 1) {
            return {
                recommendedDifficulty: difficulties[currentIndex + 1],
                reason: 'You\'re crushing it! Ready for a bigger challenge?',
                adjustment: 'harder'
            };
        }
    }

    return {
        recommendedDifficulty: currentDifficulty,
        reason: 'Perfect difficulty level. Keep going!',
        adjustment: 'same'
    };
};

// ----------------- SQUAD RECOMMENDATIONS -----------------

interface SquadCandidate {
    userId: string;
    displayName: string;
    archetype: string;
    complementScore: number; // How well they complement the user
    sharedInterests: string[];
}

/**
 * Find squad members who complement the user's weaknesses
 */
export const findSquadCandidates = (
    profile: SoulboundProfile,
    availableUsers: SoulboundProfile[] // Would come from database
): SquadCandidate[] => {
    const userWeakest = profile.skillGraph.weakestSkill;

    return availableUsers
        .filter(u => u.userId !== profile.userId)
        .map(candidate => {
            // Higher score if candidate is strong where user is weak
            const complementScore =
                candidate.skillGraph.skills[userWeakest].level * 2 +
                (candidate.archetype !== profile.archetype ? 20 : 0) + // Diversity bonus
                (candidate.sector === profile.sector ? 10 : 0); // Shared interest

            return {
                userId: candidate.userId,
                displayName: candidate.displayName,
                archetype: candidate.archetype,
                complementScore,
                sharedInterests: candidate.sector === profile.sector ? [profile.sector] : []
            };
        })
        .sort((a, b) => b.complementScore - a.complementScore)
        .slice(0, 5); // Top 5 matches
};

// ----------------- SAGE DIRECTIVE GENERATOR -----------------

/**
 * Generate Sage's guidance directives for the user
 */
export const generateSageDirectives = (
    profile: SoulboundProfile,
    _currentMissionId?: string
): SageDirective[] => {
    const directives: SageDirective[] = [];

    // Check for skill decay
    Object.entries(profile.skillGraph.skills).forEach(([category, skill]) => {
        const daysSinceLastPractice = Math.floor(
            (Date.now() - skill.lastPracticed) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceLastPractice > 5) {
            directives.push({
                type: 'adapt_difficulty',
                priority: 'medium',
                message: `Your ${category} skills haven't been practiced in ${daysSinceLastPractice} days. Consider a refresher mission!`,
                action: { suggestMissionType: category },
                triggeredBy: 'skill_decay_warning'
            });
        }
    });

    // Check for solo cap
    const avgLevel = Object.values(profile.skillGraph.skills)
        .reduce((sum, s) => sum + s.level, 0) / 6;

    if (avgLevel >= 5 && !profile.squadId) {
        directives.push({
            type: 'suggest_squad',
            priority: 'high',
            message: 'You\'ve reached the solo limit! Joining a Squad will unlock advanced missions and real bounties.',
            action: { showSquadFinder: true },
            triggeredBy: 'solo_cap_reached'
        });
    }

    // Check for bounty unlock
    if (profile.verifiedSolverStatus && !profile.squadId) {
        directives.push({
            type: 'unlock_bounty',
            priority: 'high',
            message: 'You\'ve earned Verified Solver status. The Bounty Board awaits!',
            action: { showBountyBoard: true },
            triggeredBy: 'verification_complete'
        });
    }

    // Streak encouragement
    if (profile.dailyStreak >= 7) {
        directives.push({
            type: 'adapt_difficulty',
            priority: 'low',
            message: `🔥 ${profile.dailyStreak}-day streak! Keep the momentum going for bonus rewards.`,
            action: { streakBonus: profile.dailyStreak * 5 },
            triggeredBy: 'streak_milestone'
        });
    }

    return directives.sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
};

// ----------------- FULL SAGE ANALYSIS -----------------

/**
 * Generate a complete Sage analysis for the user
 */
export const generateFullAnalysis = (
    profile: SoulboundProfile,
    availableUsers: SoulboundProfile[] = []
): SageAnalysis => {
    // Calculate skill gaps
    const skillGaps: Partial<Record<SkillCategory, number>> = {};
    const avgLevel = Object.values(profile.skillGraph.skills)
        .reduce((sum, s) => sum + s.level, 0) / 6;

    Object.entries(profile.skillGraph.skills).forEach(([cat, skill]) => {
        const gap = skill.level - avgLevel;
        if (gap < -2) { // Significantly below average
            skillGaps[cat as SkillCategory] = gap;
        }
    });

    return {
        userId: profile.userId,
        timestamp: Date.now(),
        skillGaps,
        recommendedContent: [], // Would be populated from mission database
        squadCompatibility: findSquadCandidates(profile, availableUsers).map(c => c.userId),
        academicNeeds: analyzeSkillGaps(profile),
        directives: generateSageDirectives(profile)
    };
};

// ----------------- SAGE CHAT RESPONSES -----------------

/**
 * Generate contextual Sage responses (for chat interface)
 */
export const getSageResponse = (
    profile: SoulboundProfile,
    context: 'welcome' | 'mission_complete' | 'struggling' | 'idle' | 'achievement'
): string => {
    const name = profile.displayName;
    const tier = profile.skillGraph.skills[profile.skillGraph.dominantSkill].tier;

    const responses: Record<string, string[]> = {
        welcome: [
            `Welcome back, ${name}. Your journey continues.`,
            `Good to see you, ${name}. Ready to level up?`,
            `${name}, your skills await. Let's make progress.`
        ],
        mission_complete: [
            `Excellent work, ${name}. Your ${profile.skillGraph.dominantSkill} grows stronger.`,
            `Mission accomplished. You're one step closer to mastery.`,
            `Well done. The path to ${tier} status continues.`
        ],
        struggling: [
            `Everyone struggles, ${name}. That's how we grow.`,
            `Try breaking this down into smaller steps.`,
            `Would you like me to adjust the difficulty?`
        ],
        idle: [
            `Your skills are waiting, ${name}. Shall we begin a mission?`,
            `The path to mastery requires consistent practice.`,
            `Ready when you are, ${name}.`
        ],
        achievement: [
            `Outstanding, ${name}! You've unlocked a new milestone.`,
            `Your dedication is paying off. Keep pushing forward!`,
            `This achievement will open new doors.`
        ]
    };

    const options = responses[context] || responses['welcome'];
    return options[Math.floor(Math.random() * options.length)];
};
