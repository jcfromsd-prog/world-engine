/* ==========================================================================
   BADGE REGISTRY: Achievement System for Recognition & Motivation
   Aligned with NY/CA Standards + NACE Career Competencies
   ========================================================================== */

export type BadgeCategory =
    | "ACADEMIC"      // Subject mastery badges
    | "SKILL"         // Core competency badges (NACE-aligned)
    | "SOCIAL"        // Team & collaboration badges
    | "PROGRESSION"   // Milestone badges
    | "SPECIAL";      // Limited edition / seasonal

export type BadgeRarity = "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY";

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;                    // Emoji or icon reference
    category: BadgeCategory;
    rarity: BadgeRarity;

    // Unlock conditions
    requirement: {
        type: "XP_THRESHOLD" | "LEVEL_REACHED" | "MISSIONS_COMPLETED" | "STREAK" |
        "SUBJECT_MASTERY" | "SKILL_TIER" | "SQUAD_ACHIEVEMENT" | "CUSTOM";
        target: number | string;     // Target value or custom condition ID
        subject?: string;            // For subject-specific badges
        skill?: string;              // For skill-specific badges
    };

    // Rewards for unlocking
    reward: {
        xp: number;
        gp: number;
        unlocks?: string[];          // Content IDs unlocked
    };

    // Display
    gradeBand?: string;              // e.g., "K-2", "3-5", "6-8", "9-12", "College"
    standard?: string;               // Related standard (e.g., "NY-ELA-9-12")
}

export const BADGE_REGISTRY: Badge[] = [
    // ═══════════════════════════════════════════════════════════════════════════
    // ACADEMIC BADGES (Subject Mastery)
    // ═══════════════════════════════════════════════════════════════════════════

    // ELA Badges
    {
        id: "ela_first_words",
        name: "First Words",
        description: "Complete your first ELA activity!",
        icon: "📖",
        category: "ACADEMIC",
        rarity: "COMMON",
        requirement: { type: "MISSIONS_COMPLETED", target: 1, subject: "ELA" },
        reward: { xp: 50, gp: 10 },
        gradeBand: "K-2",
        standard: "NY-ELA-K-1"
    },
    {
        id: "ela_storyteller",
        name: "Storyteller",
        description: "Write 5 narratives with proper structure.",
        icon: "✍️",
        category: "ACADEMIC",
        rarity: "UNCOMMON",
        requirement: { type: "MISSIONS_COMPLETED", target: 5, subject: "ELA" },
        reward: { xp: 150, gp: 30 },
        gradeBand: "3-5",
        standard: "NY-ELA-3-5-Writing"
    },
    {
        id: "ela_researcher",
        name: "Source Slayer",
        description: "Evaluate 10 sources for credibility.",
        icon: "🔍",
        category: "ACADEMIC",
        rarity: "RARE",
        requirement: { type: "MISSIONS_COMPLETED", target: 10, subject: "ELA" },
        reward: { xp: 300, gp: 60 },
        gradeBand: "6-8",
        standard: "CA-ELA-6-8"
    },
    {
        id: "ela_rhetorician",
        name: "Rhetorician",
        description: "Master persuasive writing and argumentation.",
        icon: "🎭",
        category: "ACADEMIC",
        rarity: "EPIC",
        requirement: { type: "SUBJECT_MASTERY", target: 50, subject: "ELA" },
        reward: { xp: 500, gp: 100 },
        gradeBand: "9-12",
        standard: "NY-ELA-9-12-Rhetoric"
    },

    // Math Badges
    {
        id: "math_shape_master",
        name: "Shape Master",
        description: "Identify all basic geometric shapes.",
        icon: "🔷",
        category: "ACADEMIC",
        rarity: "COMMON",
        requirement: { type: "MISSIONS_COMPLETED", target: 1, subject: "MATH" },
        reward: { xp: 50, gp: 10 },
        gradeBand: "K-2",
        standard: "NY-CA-MATH-K-2"
    },
    {
        id: "math_fraction_hero",
        name: "Fraction Hero",
        description: "Master fraction operations.",
        icon: "🍕",
        category: "ACADEMIC",
        rarity: "UNCOMMON",
        requirement: { type: "MISSIONS_COMPLETED", target: 5, subject: "MATH" },
        reward: { xp: 175, gp: 35 },
        gradeBand: "3-5",
        standard: "CCSS-MATH-3-5-NF"
    },
    {
        id: "math_data_detective",
        name: "Data Detective",
        description: "Analyze 10 data sets using statistics.",
        icon: "📊",
        category: "ACADEMIC",
        rarity: "RARE",
        requirement: { type: "MISSIONS_COMPLETED", target: 10, subject: "MATH" },
        reward: { xp: 350, gp: 70 },
        gradeBand: "6-8",
        standard: "NY-MATH-6-8-Stats"
    },
    {
        id: "math_model_master",
        name: "Model Master",
        description: "Create mathematical models for real-world problems.",
        icon: "📐",
        category: "ACADEMIC",
        rarity: "EPIC",
        requirement: { type: "SUBJECT_MASTERY", target: 50, subject: "MATH" },
        reward: { xp: 600, gp: 120 },
        gradeBand: "9-12",
        standard: "CCSS-MATH-HS-Modeling"
    },
    {
        id: "math_regents_ready",
        name: "Regents Ready",
        description: "Pass a simulated NY Regents Algebra exam.",
        icon: "🏆",
        category: "ACADEMIC",
        rarity: "LEGENDARY",
        requirement: { type: "CUSTOM", target: "regents_algebra_pass" },
        reward: { xp: 1000, gp: 200 },
        gradeBand: "9-12",
        standard: "NY-Regents-Algebra"
    },

    // Science Badges
    {
        id: "sci_weather_watcher",
        name: "Weather Watcher",
        description: "Track weather patterns for a week.",
        icon: "🌤️",
        category: "ACADEMIC",
        rarity: "COMMON",
        requirement: { type: "MISSIONS_COMPLETED", target: 1, subject: "SCIENCE" },
        reward: { xp: 60, gp: 12 },
        gradeBand: "K-2",
        standard: "NGSS-K-2-Earth"
    },
    {
        id: "sci_ecosystem_architect",
        name: "Ecosystem Architect",
        description: "Design balanced ecosystems 5 times.",
        icon: "🌿",
        category: "ACADEMIC",
        rarity: "UNCOMMON",
        requirement: { type: "MISSIONS_COMPLETED", target: 5, subject: "SCIENCE" },
        reward: { xp: 200, gp: 40 },
        gradeBand: "3-5",
        standard: "NGSS-3-5-LS2"
    },
    {
        id: "sci_lab_master",
        name: "Lab Master",
        description: "Complete 10 virtual lab experiments.",
        icon: "🧪",
        category: "ACADEMIC",
        rarity: "RARE",
        requirement: { type: "MISSIONS_COMPLETED", target: 10, subject: "SCIENCE" },
        reward: { xp: 400, gp: 80 },
        gradeBand: "6-8",
        standard: "NGSS-MS-PS1"
    },
    {
        id: "sci_ethics_scholar",
        name: "Ethics Scholar",
        description: "Analyze ethical implications of scientific advances.",
        icon: "⚖️",
        category: "ACADEMIC",
        rarity: "EPIC",
        requirement: { type: "SUBJECT_MASTERY", target: 50, subject: "SCIENCE" },
        reward: { xp: 550, gp: 110 },
        gradeBand: "9-12",
        standard: "NGSS-HS-LS3"
    },

    // History/Civics Badges
    {
        id: "hist_community_explorer",
        name: "Community Explorer",
        description: "Learn about your community's history.",
        icon: "🏘️",
        category: "ACADEMIC",
        rarity: "COMMON",
        requirement: { type: "MISSIONS_COMPLETED", target: 1, subject: "HISTORY" },
        reward: { xp: 50, gp: 10 },
        gradeBand: "K-2",
        standard: "CA-HSS-K-2"
    },
    {
        id: "hist_time_traveler",
        name: "Time Traveler",
        description: "Complete activities across 3 historical periods.",
        icon: "⏳",
        category: "ACADEMIC",
        rarity: "UNCOMMON",
        requirement: { type: "MISSIONS_COMPLETED", target: 5, subject: "HISTORY" },
        reward: { xp: 175, gp: 35 },
        gradeBand: "3-5",
        standard: "NY-HSS-3-5"
    },
    {
        id: "hist_civic_champion",
        name: "Civic Champion",
        description: "Participate in 10 civic simulations.",
        icon: "🗳️",
        category: "ACADEMIC",
        rarity: "RARE",
        requirement: { type: "MISSIONS_COMPLETED", target: 10, subject: "HISTORY" },
        reward: { xp: 350, gp: 70 },
        gradeBand: "6-8",
        standard: "NY-HSS-6-8-Civics"
    },
    {
        id: "hist_primary_scholar",
        name: "Primary Source Scholar",
        description: "Analyze 20 primary historical documents.",
        icon: "📜",
        category: "ACADEMIC",
        rarity: "EPIC",
        requirement: { type: "SUBJECT_MASTERY", target: 50, subject: "HISTORY" },
        reward: { xp: 500, gp: 100 },
        gradeBand: "9-12",
        standard: "CA-HSS-9-12"
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SKILL BADGES (NACE Career Competencies)
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: "nace_communicator",
        name: "Clear Communicator",
        description: "Demonstrate effective written and oral communication.",
        icon: "💬",
        category: "SKILL",
        rarity: "UNCOMMON",
        requirement: { type: "SKILL_TIER", target: "apprentice", skill: "social" },
        reward: { xp: 200, gp: 50 },
        standard: "NACE-Communication"
    },
    {
        id: "nace_thinker",
        name: "Critical Thinker",
        description: "Solve 25 complex analytical problems.",
        icon: "🧠",
        category: "SKILL",
        rarity: "RARE",
        requirement: { type: "SKILL_TIER", target: "journeyman", skill: "logic" },
        reward: { xp: 400, gp: 100 },
        standard: "NACE-Critical-Thinking"
    },
    {
        id: "nace_team_player",
        name: "Team Player",
        description: "Complete 10 squad missions successfully.",
        icon: "🤝",
        category: "SKILL",
        rarity: "RARE",
        requirement: { type: "SQUAD_ACHIEVEMENT", target: 10 },
        reward: { xp: 350, gp: 75 },
        standard: "NACE-Teamwork"
    },
    {
        id: "nace_leader",
        name: "Emerging Leader",
        description: "Lead a squad to complete 5 missions.",
        icon: "👑",
        category: "SKILL",
        rarity: "EPIC",
        requirement: { type: "SKILL_TIER", target: "expert", skill: "leadership" },
        reward: { xp: 600, gp: 150 },
        standard: "NACE-Leadership"
    },
    {
        id: "nace_tech_savvy",
        name: "Tech Savvy",
        description: "Master digital tools and technology adaptability.",
        icon: "💻",
        category: "SKILL",
        rarity: "UNCOMMON",
        requirement: { type: "SKILL_TIER", target: "apprentice", skill: "engineering" },
        reward: { xp: 250, gp: 60 },
        standard: "NACE-Technology"
    },
    {
        id: "nace_professional",
        name: "Professional Presence",
        description: "Demonstrate professionalism in 20 activities.",
        icon: "👔",
        category: "SKILL",
        rarity: "RARE",
        requirement: { type: "CUSTOM", target: "professionalism_score_80" },
        reward: { xp: 400, gp: 100 },
        standard: "NACE-Professionalism"
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SOCIAL BADGES (Collaboration & Community)
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: "social_first_squad",
        name: "Squad Up!",
        description: "Join your first squad.",
        icon: "👥",
        category: "SOCIAL",
        rarity: "COMMON",
        requirement: { type: "CUSTOM", target: "joined_squad" },
        reward: { xp: 100, gp: 25 }
    },
    {
        id: "social_helper",
        name: "Helping Hand",
        description: "Help 5 squadmates with their missions.",
        icon: "🙌",
        category: "SOCIAL",
        rarity: "UNCOMMON",
        requirement: { type: "SQUAD_ACHIEVEMENT", target: 5 },
        reward: { xp: 200, gp: 50 }
    },
    {
        id: "social_mentor",
        name: "Mentor",
        description: "Guide 3 new users through their first missions.",
        icon: "🎓",
        category: "SOCIAL",
        rarity: "RARE",
        requirement: { type: "CUSTOM", target: "mentored_3_users" },
        reward: { xp: 400, gp: 100 }
    },
    {
        id: "social_squad_victory",
        name: "Squad Victory",
        description: "Complete a legendary squad mission.",
        icon: "🏅",
        category: "SOCIAL",
        rarity: "EPIC",
        requirement: { type: "SQUAD_ACHIEVEMENT", target: 1, skill: "legendary" },
        reward: { xp: 750, gp: 200 }
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // PROGRESSION BADGES (Milestones)
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: "prog_first_step",
        name: "First Step",
        description: "Complete your very first activity.",
        icon: "👣",
        category: "PROGRESSION",
        rarity: "COMMON",
        requirement: { type: "MISSIONS_COMPLETED", target: 1 },
        reward: { xp: 50, gp: 10 }
    },
    {
        id: "prog_getting_started",
        name: "Getting Started",
        description: "Complete 10 activities.",
        icon: "🚀",
        category: "PROGRESSION",
        rarity: "COMMON",
        requirement: { type: "MISSIONS_COMPLETED", target: 10 },
        reward: { xp: 150, gp: 30 }
    },
    {
        id: "prog_dedicated",
        name: "Dedicated Learner",
        description: "Complete 50 activities.",
        icon: "📚",
        category: "PROGRESSION",
        rarity: "UNCOMMON",
        requirement: { type: "MISSIONS_COMPLETED", target: 50 },
        reward: { xp: 400, gp: 80 }
    },
    {
        id: "prog_scholar",
        name: "Rising Scholar",
        description: "Complete 100 activities.",
        icon: "🎖️",
        category: "PROGRESSION",
        rarity: "RARE",
        requirement: { type: "MISSIONS_COMPLETED", target: 100 },
        reward: { xp: 800, gp: 160 }
    },
    {
        id: "prog_legend",
        name: "Legend Status",
        description: "Complete 500 activities.",
        icon: "🏆",
        category: "PROGRESSION",
        rarity: "LEGENDARY",
        requirement: { type: "MISSIONS_COMPLETED", target: 500 },
        reward: { xp: 2500, gp: 500 }
    },
    {
        id: "prog_streak_7",
        name: "Week Warrior",
        description: "Maintain a 7-day learning streak.",
        icon: "🔥",
        category: "PROGRESSION",
        rarity: "COMMON",
        requirement: { type: "STREAK", target: 7 },
        reward: { xp: 100, gp: 25 }
    },
    {
        id: "prog_streak_30",
        name: "Month Master",
        description: "Maintain a 30-day learning streak.",
        icon: "🌟",
        category: "PROGRESSION",
        rarity: "RARE",
        requirement: { type: "STREAK", target: 30 },
        reward: { xp: 500, gp: 125 }
    },
    {
        id: "prog_streak_100",
        name: "Century Streak",
        description: "Maintain a 100-day learning streak.",
        icon: "💎",
        category: "PROGRESSION",
        rarity: "LEGENDARY",
        requirement: { type: "STREAK", target: 100 },
        reward: { xp: 2000, gp: 500 }
    },
    {
        id: "prog_first_payout",
        name: "First Earnings",
        description: "Earn your first real-world payout.",
        icon: "💵",
        category: "PROGRESSION",
        rarity: "EPIC",
        requirement: { type: "CUSTOM", target: "first_real_payout" },
        reward: { xp: 1000, gp: 0 }
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SPECIAL BADGES (Limited Edition)
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: "special_founder",
        name: "Founding Legend",
        description: "Joined during the founding phase of MyBestPurpose.",
        icon: "⭐",
        category: "SPECIAL",
        rarity: "LEGENDARY",
        requirement: { type: "CUSTOM", target: "founding_member" },
        reward: { xp: 500, gp: 100 }
    },
    {
        id: "special_beta_tester",
        name: "Beta Pioneer",
        description: "Participated in beta testing.",
        icon: "🧪",
        category: "SPECIAL",
        rarity: "EPIC",
        requirement: { type: "CUSTOM", target: "beta_tester" },
        reward: { xp: 250, gp: 50 }
    },
    {
        id: "special_impact_maker",
        name: "Impact Maker",
        description: "Contributed to a real-world impact project.",
        icon: "🌍",
        category: "SPECIAL",
        rarity: "LEGENDARY",
        requirement: { type: "CUSTOM", target: "real_impact_project" },
        reward: { xp: 2000, gp: 500 }
    }
];

/**
 * Get badges by category
 */
export function getBadgesByCategory(category: BadgeCategory): Badge[] {
    return BADGE_REGISTRY.filter(b => b.category === category);
}

/**
 * Get badges by grade band
 */
export function getBadgesByGradeBand(gradeBand: string): Badge[] {
    return BADGE_REGISTRY.filter(b => b.gradeBand === gradeBand);
}

/**
 * Get badge by ID
 */
export function getBadgeById(id: string): Badge | undefined {
    return BADGE_REGISTRY.find(b => b.id === id);
}

/**
 * Check if user qualifies for a badge (simplified check)
 */
export function checkBadgeEligibility(
    badge: Badge,
    userStats: {
        missionsCompleted: number;
        missionsPerSubject: Record<string, number>;
        currentStreak: number;
        skillTiers: Record<string, string>;
        squadMissionsCompleted: number;
        customAchievements: string[];
    }
): boolean {
    const { requirement } = badge;

    switch (requirement.type) {
        case "MISSIONS_COMPLETED":
            if (requirement.subject) {
                return (userStats.missionsPerSubject[requirement.subject] || 0) >= (requirement.target as number);
            }
            return userStats.missionsCompleted >= (requirement.target as number);

        case "STREAK":
            return userStats.currentStreak >= (requirement.target as number);

        case "SKILL_TIER": {
            const skill = requirement.skill || "";
            const currentTier = userStats.skillTiers[skill] || "novice";
            const tierOrder = ["novice", "apprentice", "journeyman", "expert", "master"];
            return tierOrder.indexOf(currentTier) >= tierOrder.indexOf(requirement.target as string);
        }

        case "SQUAD_ACHIEVEMENT":
            return userStats.squadMissionsCompleted >= (requirement.target as number);

        case "CUSTOM":
            return userStats.customAchievements.includes(requirement.target as string);

        case "SUBJECT_MASTERY":
            // Check if user has completed enough missions in a subject
            if (requirement.subject) {
                return (userStats.missionsPerSubject[requirement.subject] || 0) >= (requirement.target as number);
            }
            return false;

        default:
            return false;
    }
}

export default BADGE_REGISTRY;
