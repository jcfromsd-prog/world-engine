/* ==========================================================================
   TEAM CHALLENGE REGISTRY: Squad-Based Learning Missions
   Collaborative activities aligned with NY/CA standards and NACE skills
   ========================================================================== */

import type { MasteryTier, SkillCategory } from "../engine/types";

export type ChallengeType =
    | "COLLABORATIVE"    // All members work together simultaneously
    | "RELAY"            // Sequential - each member completes their part
    | "SPECIALIZATION"   // Each member handles their strength area
    | "COMPETITION";     // Friendly competition within squad

export type ChallengeDifficulty = "EASY" | "MEDIUM" | "HARD" | "LEGENDARY";

export interface RoleRequirement {
    role: "tank" | "dps" | "support" | "strategist" | "any";
    minLevel: number;
    skill?: SkillCategory;
}

export interface TeamChallenge {
    id: string;
    title: string;
    description: string;
    briefing: string;                // Story context for the challenge
    type: ChallengeType;
    difficulty: ChallengeDifficulty;

    // Requirements
    minSquadSize: number;
    maxSquadSize: number;
    roleRequirements: RoleRequirement[];
    minAverageLevel: number;

    // Content alignment
    subjects: string[];              // Primary subjects involved
    standardRefs: string[];          // Standards covered
    gradeBand: string;               // Target grade band

    // Time & Progress
    estimatedMinutes: number;
    checkpoints: number;             // Save points
    phases: {
        name: string;
        description: string;
        assignedRole: "tank" | "dps" | "support" | "strategist" | "all";
        xpReward: number;
    }[];

    // Rewards
    rewards: {
        xpPerMember: number;
        gpPerMember: number;
        squadXp: number;
        bonusBadge?: string;
        unlocks?: string[];
    };

    // Engagement
    tags: string[];
    realWorldConnection: string;     // How this connects to real impact
}

export const TEAM_CHALLENGES: TeamChallenge[] = [
    // ═══════════════════════════════════════════════════════════════════════════
    // ELEMENTARY TEAM CHALLENGES (Grades 3-5)
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: "tc_eco_garden",
        title: "Eco-Garden Architects",
        description: "Design a sustainable school garden as a team!",
        briefing: "Your school wants to create a garden that produces food, attracts pollinators, and teaches students about ecosystems. Work together to design the perfect garden!",
        type: "SPECIALIZATION",
        difficulty: "EASY",
        minSquadSize: 3,
        maxSquadSize: 4,
        roleRequirements: [
            { role: "any", minLevel: 3 }
        ],
        minAverageLevel: 3,
        subjects: ["SCIENCE", "MATH"],
        standardRefs: ["NGSS-3-5-LS2", "CCSS-MATH-3-5-MD"],
        gradeBand: "3-5",
        estimatedMinutes: 45,
        checkpoints: 3,
        phases: [
            { name: "Research", description: "Research native plants and pollinators", assignedRole: "support", xpReward: 50 },
            { name: "Design", description: "Draw the garden layout with measurements", assignedRole: "strategist", xpReward: 60 },
            { name: "Calculate", description: "Calculate area, soil needed, and costs", assignedRole: "dps", xpReward: 70 },
            { name: "Present", description: "Create a presentation for the school", assignedRole: "all", xpReward: 80 }
        ],
        rewards: {
            xpPerMember: 300,
            gpPerMember: 60,
            squadXp: 200,
            bonusBadge: "eco_guardian",
            unlocks: ["advanced_ecosystem_missions"]
        },
        tags: ["Nature", "Design", "Teamwork", "Math"],
        realWorldConnection: "Real schools are building gardens just like this to teach sustainability and grow healthy food for their communities!"
    },
    {
        id: "tc_story_relay",
        title: "Story Relay Race",
        description: "Create an epic story together, one chapter at a time!",
        briefing: "Each squad member will write one chapter of an adventure story. The catch? Each chapter must continue logically from the last while adding new conflicts and characters!",
        type: "RELAY",
        difficulty: "EASY",
        minSquadSize: 3,
        maxSquadSize: 5,
        roleRequirements: [
            { role: "any", minLevel: 2 }
        ],
        minAverageLevel: 2,
        subjects: ["ELA"],
        standardRefs: ["NY-ELA-3-5-Writing", "CA-ELA-4-W"],
        gradeBand: "3-5",
        estimatedMinutes: 40,
        checkpoints: 4,
        phases: [
            { name: "Opening", description: "Write the opening chapter with setting and characters", assignedRole: "tank", xpReward: 40 },
            { name: "Rising Action", description: "Introduce the main conflict", assignedRole: "dps", xpReward: 50 },
            { name: "Climax", description: "Write the most exciting part of the story", assignedRole: "strategist", xpReward: 60 },
            { name: "Resolution", description: "Wrap up the story with a satisfying ending", assignedRole: "support", xpReward: 50 }
        ],
        rewards: {
            xpPerMember: 250,
            gpPerMember: 50,
            squadXp: 150,
            bonusBadge: "storytellers_guild"
        },
        tags: ["Writing", "Creativity", "Collaboration"],
        realWorldConnection: "Professional authors often collaborate on stories. Some of the best books and TV shows are written by teams of writers!"
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // MIDDLE SCHOOL TEAM CHALLENGES (Grades 6-8)
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: "tc_climate_action",
        title: "Climate Action Coalition",
        description: "Develop a climate action plan for your community!",
        briefing: "Your town council has asked for student input on reducing carbon emissions. Your squad must research, analyze data, and present a comprehensive action plan.",
        type: "COLLABORATIVE",
        difficulty: "MEDIUM",
        minSquadSize: 4,
        maxSquadSize: 5,
        roleRequirements: [
            { role: "strategist", minLevel: 8, skill: "logic" },
            { role: "support", minLevel: 6, skill: "social" },
            { role: "any", minLevel: 5 }
        ],
        minAverageLevel: 6,
        subjects: ["SCIENCE", "HISTORY", "MATH"],
        standardRefs: ["NGSS-MS-ESS3", "NY-HSS-6-8-Civics", "NY-MATH-6-8-Stats"],
        gradeBand: "6-8",
        estimatedMinutes: 75,
        checkpoints: 5,
        phases: [
            { name: "Data Collection", description: "Research local carbon emissions and sources", assignedRole: "dps", xpReward: 80 },
            { name: "Analysis", description: "Analyze data and identify key areas for reduction", assignedRole: "strategist", xpReward: 100 },
            { name: "Solution Design", description: "Brainstorm and evaluate potential solutions", assignedRole: "all", xpReward: 90 },
            { name: "Impact Modeling", description: "Calculate the projected impact of solutions", assignedRole: "tank", xpReward: 110 },
            { name: "Presentation", description: "Create and deliver the action plan presentation", assignedRole: "support", xpReward: 120 }
        ],
        rewards: {
            xpPerMember: 500,
            gpPerMember: 100,
            squadXp: 400,
            bonusBadge: "climate_champions",
            unlocks: ["real_world_impact_missions"]
        },
        tags: ["Climate", "Civics", "Data", "Presentation"],
        realWorldConnection: "Youth climate activists around the world are making real changes in their communities. Your ideas could inspire actual policy changes!"
    },
    {
        id: "tc_mock_trial",
        title: "Supreme Court Simulation",
        description: "Argue a landmark case before the Supreme Court!",
        briefing: "A controversial case has reached the Supreme Court. Your squad will research, prepare arguments, and present both sides of the case in a full simulation.",
        type: "SPECIALIZATION",
        difficulty: "MEDIUM",
        minSquadSize: 4,
        maxSquadSize: 6,
        roleRequirements: [
            { role: "tank", minLevel: 7, skill: "logic" },
            { role: "support", minLevel: 6, skill: "social" },
            { role: "any", minLevel: 5 }
        ],
        minAverageLevel: 6,
        subjects: ["HISTORY", "ELA"],
        standardRefs: ["NY-HSS-6-8-Civics", "CA-ELA-6-8", "NY-ELA-7-W"],
        gradeBand: "6-8",
        estimatedMinutes: 60,
        checkpoints: 4,
        phases: [
            { name: "Research", description: "Research the case and relevant precedents", assignedRole: "all", xpReward: 70 },
            { name: "Prosecution", description: "Build the case for one side", assignedRole: "tank", xpReward: 90 },
            { name: "Defense", description: "Build the case for the opposing side", assignedRole: "dps", xpReward: 90 },
            { name: "Deliberation", description: "Argue and reach a verdict as justices", assignedRole: "all", xpReward: 100 }
        ],
        rewards: {
            xpPerMember: 450,
            gpPerMember: 90,
            squadXp: 350,
            bonusBadge: "legal_eagles"
        },
        tags: ["Law", "Debate", "Critical Thinking", "History"],
        realWorldConnection: "Understanding how the legal system works helps you become an informed citizen who can participate in democracy effectively."
    },
    {
        id: "tc_science_fair",
        title: "Virtual Science Fair",
        description: "Design and conduct a team research experiment!",
        briefing: "Your squad has been selected for the district science fair. You must design an experiment, collect data, analyze results, and present your findings.",
        type: "COLLABORATIVE",
        difficulty: "HARD",
        minSquadSize: 3,
        maxSquadSize: 4,
        roleRequirements: [
            { role: "dps", minLevel: 8, skill: "logic" },
            { role: "any", minLevel: 6 }
        ],
        minAverageLevel: 7,
        subjects: ["SCIENCE", "MATH"],
        standardRefs: ["NGSS-MS-PS1", "NY-MATH-6-8-Stats", "NGSS-MS-ETS1"],
        gradeBand: "6-8",
        estimatedMinutes: 90,
        checkpoints: 5,
        phases: [
            { name: "Hypothesis", description: "Develop a testable hypothesis", assignedRole: "strategist", xpReward: 60 },
            { name: "Design", description: "Design the experimental procedure", assignedRole: "tank", xpReward: 80 },
            { name: "Data Collection", description: "Conduct the experiment and collect data", assignedRole: "dps", xpReward: 100 },
            { name: "Analysis", description: "Analyze data using statistical methods", assignedRole: "all", xpReward: 120 },
            { name: "Presentation", description: "Create poster and present findings", assignedRole: "support", xpReward: 90 }
        ],
        rewards: {
            xpPerMember: 600,
            gpPerMember: 120,
            squadXp: 500,
            bonusBadge: "research_scientists",
            unlocks: ["advanced_lab_access"]
        },
        tags: ["Research", "Experiment", "Data", "Science"],
        realWorldConnection: "Real scientists work in teams just like this. Many major discoveries are made by collaborative research groups!"
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // HIGH SCHOOL TEAM CHALLENGES (Grades 9-12)
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: "tc_startup_weekend",
        title: "Startup Weekend Challenge",
        description: "Build a tech startup from idea to pitch in 48 virtual hours!",
        briefing: "You have 48 hours to identify a problem, design a solution, build a prototype, and pitch to investors. This is how real startups begin!",
        type: "SPECIALIZATION",
        difficulty: "HARD",
        minSquadSize: 4,
        maxSquadSize: 5,
        roleRequirements: [
            { role: "strategist", minLevel: 12, skill: "leadership" },
            { role: "dps", minLevel: 10, skill: "engineering" },
            { role: "support", minLevel: 10, skill: "social" },
            { role: "any", minLevel: 8 }
        ],
        minAverageLevel: 10,
        subjects: ["CAREER", "MATH", "ELA"],
        standardRefs: ["NACE-Leadership", "NACE-Technology", "NACE-Communication"],
        gradeBand: "9-12",
        estimatedMinutes: 120,
        checkpoints: 6,
        phases: [
            { name: "Ideation", description: "Identify a problem worth solving", assignedRole: "all", xpReward: 100 },
            { name: "Research", description: "Validate the market and competition", assignedRole: "support", xpReward: 120 },
            { name: "Design", description: "Create wireframes and user experience", assignedRole: "dps", xpReward: 140 },
            { name: "Prototype", description: "Build a working demo", assignedRole: "tank", xpReward: 180 },
            { name: "Business Model", description: "Develop revenue and growth strategy", assignedRole: "strategist", xpReward: 150 },
            { name: "Pitch", description: "Present to investor panel", assignedRole: "all", xpReward: 200 }
        ],
        rewards: {
            xpPerMember: 800,
            gpPerMember: 200,
            squadXp: 700,
            bonusBadge: "startup_founders",
            unlocks: ["entrepreneur_track"]
        },
        tags: ["Entrepreneurship", "Technology", "Business", "Pitch"],
        realWorldConnection: "Companies like Instagram, Airbnb, and Slack started at events just like this. Your next big idea could change the world!"
    },
    {
        id: "tc_un_simulation",
        title: "Model United Nations",
        description: "Represent a nation and negotiate global solutions!",
        briefing: "Each squad member represents a different country at the UN. You must research your nation's positions, debate resolutions, and build coalitions to pass meaningful policy.",
        type: "COMPETITION",
        difficulty: "HARD",
        minSquadSize: 5,
        maxSquadSize: 6,
        roleRequirements: [
            { role: "strategist", minLevel: 11, skill: "leadership" },
            { role: "support", minLevel: 10, skill: "social" },
            { role: "any", minLevel: 9 }
        ],
        minAverageLevel: 10,
        subjects: ["HISTORY", "ELA"],
        standardRefs: ["NY-Regents-Global-II", "CA-ELA-11-12-SL", "NY-HSS-9-12"],
        gradeBand: "9-12",
        estimatedMinutes: 90,
        checkpoints: 5,
        phases: [
            { name: "Country Research", description: "Research your assigned nation's history and positions", assignedRole: "all", xpReward: 80 },
            { name: "Position Paper", description: "Write your country's official position", assignedRole: "all", xpReward: 100 },
            { name: "Opening Speeches", description: "Deliver opening position speeches", assignedRole: "all", xpReward: 90 },
            { name: "Caucus & Debate", description: "Negotiate and form alliances", assignedRole: "all", xpReward: 140 },
            { name: "Resolution Vote", description: "Final debate and voting", assignedRole: "all", xpReward: 120 }
        ],
        rewards: {
            xpPerMember: 650,
            gpPerMember: 130,
            squadXp: 550,
            bonusBadge: "global_diplomats"
        },
        tags: ["Diplomacy", "Global Issues", "Debate", "Negotiation"],
        realWorldConnection: "Model UN alumni include world leaders, diplomats, and policy makers. These skills translate directly to real global impact."
    },
    {
        id: "tc_hackathon",
        title: "Impact Hackathon",
        description: "Build a solution to a real community problem in 24 hours!",
        briefing: "A local nonprofit needs a tech solution to serve their community better. Your squad will work through the night to design, build, and deploy a working solution.",
        type: "COLLABORATIVE",
        difficulty: "LEGENDARY",
        minSquadSize: 4,
        maxSquadSize: 5,
        roleRequirements: [
            { role: "tank", minLevel: 15, skill: "engineering" },
            { role: "dps", minLevel: 12, skill: "logic" },
            { role: "support", minLevel: 10, skill: "creativity" },
            { role: "strategist", minLevel: 12, skill: "leadership" }
        ],
        minAverageLevel: 12,
        subjects: ["CAREER", "SCIENCE"],
        standardRefs: ["NACE-Technology", "NACE-Teamwork", "NGSS-HS-ETS1"],
        gradeBand: "9-12",
        estimatedMinutes: 180,
        checkpoints: 8,
        phases: [
            { name: "Problem Discovery", description: "Interview stakeholders and define the problem", assignedRole: "support", xpReward: 100 },
            { name: "Ideation", description: "Brainstorm and select best approach", assignedRole: "all", xpReward: 80 },
            { name: "Architecture", description: "Design the technical solution", assignedRole: "tank", xpReward: 150 },
            { name: "Sprint 1", description: "Build core functionality", assignedRole: "dps", xpReward: 200 },
            { name: "Sprint 2", description: "Add features and polish", assignedRole: "all", xpReward: 180 },
            { name: "Testing", description: "Test and fix bugs", assignedRole: "all", xpReward: 120 },
            { name: "Documentation", description: "Write user guides and handoff docs", assignedRole: "support", xpReward: 100 },
            { name: "Demo Day", description: "Present to the nonprofit and judges", assignedRole: "all", xpReward: 250 }
        ],
        rewards: {
            xpPerMember: 1200,
            gpPerMember: 300,
            squadXp: 1000,
            bonusBadge: "hackathon_heroes",
            unlocks: ["real_client_missions", "verified_solver_track"]
        },
        tags: ["Coding", "Social Good", "Teamwork", "Real Impact"],
        realWorldConnection: "This is exactly how professional hackathons work. Winners often see their projects deployed and used by real people!"
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // COLLEGE/CAREER TEAM CHALLENGES
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: "tc_consulting",
        title: "Management Consulting Case",
        description: "Solve a real business problem for a Fortune 500 company!",
        briefing: "A major company is facing a strategic challenge. Your squad will analyze the situation, develop recommendations, and present to the executive team.",
        type: "SPECIALIZATION",
        difficulty: "LEGENDARY",
        minSquadSize: 4,
        maxSquadSize: 5,
        roleRequirements: [
            { role: "strategist", minLevel: 20, skill: "leadership" },
            { role: "tank", minLevel: 18, skill: "logic" },
            { role: "dps", minLevel: 16, skill: "engineering" },
            { role: "support", minLevel: 16, skill: "social" }
        ],
        minAverageLevel: 18,
        subjects: ["CAREER"],
        standardRefs: ["NACE-Critical-Thinking", "NACE-Leadership", "NACE-Communication"],
        gradeBand: "College",
        estimatedMinutes: 150,
        checkpoints: 6,
        phases: [
            { name: "Industry Analysis", description: "Research the company and competitive landscape", assignedRole: "support", xpReward: 150 },
            { name: "Problem Framing", description: "Structure the problem into solvable components", assignedRole: "strategist", xpReward: 200 },
            { name: "Data Analysis", description: "Analyze quantitative and qualitative data", assignedRole: "tank", xpReward: 250 },
            { name: "Solution Development", description: "Develop and evaluate strategic options", assignedRole: "dps", xpReward: 200 },
            { name: "Recommendation", description: "Synthesize into actionable recommendations", assignedRole: "all", xpReward: 180 },
            { name: "Executive Presentation", description: "Present to executive panel", assignedRole: "all", xpReward: 300 }
        ],
        rewards: {
            xpPerMember: 1500,
            gpPerMember: 400,
            squadXp: 1200,
            bonusBadge: "consulting_elite",
            unlocks: ["premium_client_access"]
        },
        tags: ["Strategy", "Business", "Analysis", "Leadership"],
        realWorldConnection: "This is exactly how top consulting firms work. Skills developed here are directly applicable to careers at McKinsey, BCG, and Bain."
    }
];

/**
 * Get challenges by difficulty
 */
export function getChallengesByDifficulty(difficulty: ChallengeDifficulty): TeamChallenge[] {
    return TEAM_CHALLENGES.filter(c => c.difficulty === difficulty);
}

/**
 * Get challenges by grade band
 */
export function getChallengesByGradeBand(gradeBand: string): TeamChallenge[] {
    return TEAM_CHALLENGES.filter(c => c.gradeBand === gradeBand);
}

/**
 * Get challenges a squad qualifies for
 */
export function getEligibleChallenges(
    squadSize: number,
    averageLevel: number,
    memberRoles: string[]
): TeamChallenge[] {
    return TEAM_CHALLENGES.filter(challenge => {
        // Check squad size
        if (squadSize < challenge.minSquadSize || squadSize > challenge.maxSquadSize) {
            return false;
        }

        // Check average level
        if (averageLevel < challenge.minAverageLevel) {
            return false;
        }

        // Check role requirements (simplified)
        const hasRequiredRoles = challenge.roleRequirements.every(req => {
            if (req.role === "any") return true;
            return memberRoles.includes(req.role);
        });

        return hasRequiredRoles;
    });
}

/**
 * Calculate challenge completion rewards for a squad
 */
export function calculateChallengeRewards(
    challenge: TeamChallenge,
    squadSize: number,
    completionPercentage: number,
    bonusMultiplier: number = 1.0
): {
    totalXp: number;
    totalGp: number;
    perMemberXp: number;
    perMemberGp: number;
    squadXp: number;
} {
    const completionFactor = completionPercentage / 100;

    const perMemberXp = Math.round(challenge.rewards.xpPerMember * completionFactor * bonusMultiplier);
    const perMemberGp = Math.round(challenge.rewards.gpPerMember * completionFactor * bonusMultiplier);
    const squadXp = Math.round(challenge.rewards.squadXp * completionFactor * bonusMultiplier);

    return {
        totalXp: perMemberXp * squadSize + squadXp,
        totalGp: perMemberGp * squadSize,
        perMemberXp,
        perMemberGp,
        squadXp
    };
}

export default TEAM_CHALLENGES;
