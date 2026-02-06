/* ==========================================================================
   CURRICULUM DATABASE: NY/CA K-16 Standards-Aligned Content
   Real-World Learning Activities Mapped to Bloom's Taxonomy + IRT Difficulty
   ========================================================================== */

import type { ContentNode } from "../types/EngineTypes";

/**
 * MASTER CURRICULUM DATABASE
 * Each node is calibrated with:
 * - IRT difficulty (-3.0 to +3.0, matching user skillTheta scale)
 * - Bloom's Taxonomy level (REMEMBER → CREATE)
 * - Grade appropriateness (minGrade, maxGrade)
 * - Interest tags for personalization
 * - State standards references (NY, CA, NGSS, NACE)
 */
export const CONTENT_DB: ContentNode[] = [
    // ═══════════════════════════════════════════════════════════════════════════
    // PRE-K to GRADE 2 (Foundations) - Difficulty: -3.0 to -1.5
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: "math_k_shapes",
        title: "Shape Sorter Challenge",
        description: "Distinguish between squares, circles, and triangles in the environment.",
        subject: "MATH",
        bloomLevel: "REMEMBER",
        difficulty: -2.5,
        minGrade: 0,
        maxGrade: 2,
        tags: ["Geometry", "Visual", "Games"],
        standardRef: "NY-CA-MATH-K-2",
        estimatedMinutes: 10,
        xpReward: 50,
        gpReward: 5,
    },
    {
        id: "sci_k_weather",
        title: "Weather Watcher Journal",
        description: "Observe and record local weather patterns for a week using symbols.",
        subject: "SCIENCE",
        bloomLevel: "APPLY",
        difficulty: -2.0,
        minGrade: 1,
        maxGrade: 2,
        tags: ["Observation", "Nature", "Journal"],
        standardRef: "NGSS-K-2-Earth",
        estimatedMinutes: 15,
        xpReward: 75,
        gpReward: 10,
    },
    {
        id: "ela_k_phonics",
        title: "Letter Sound Safari",
        description: "Match animals to their starting letter sounds in an interactive game.",
        subject: "ELA",
        bloomLevel: "UNDERSTAND",
        difficulty: -2.8,
        minGrade: 0,
        maxGrade: 1,
        tags: ["Reading", "Phonics", "Animals"],
        standardRef: "NY-ELA-K-1",
        estimatedMinutes: 8,
        xpReward: 40,
        gpReward: 5,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // GRADE 3-5 (Core Concepts) - Difficulty: -1.5 to 0.0
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: "ela_3_5_narrative",
        title: "Hero's Narrative",
        description: "Write a short story with dialogue, character development, and a clear sequence of events.",
        subject: "ELA",
        bloomLevel: "CREATE",
        difficulty: -1.0,
        minGrade: 3,
        maxGrade: 5,
        tags: ["Writing", "Creativity", "Storytelling"],
        standardRef: "NY-ELA-3-5-Writing",
        estimatedMinutes: 30,
        xpReward: 150,
        gpReward: 25,
    },
    {
        id: "hist_3_5_sim",
        title: "Economic Village Sim",
        description: "Manage resources in a simulation to understand needs vs. wants and basic trade.",
        subject: "HISTORY",
        bloomLevel: "ANALYZE",
        difficulty: -0.5,
        minGrade: 3,
        maxGrade: 5,
        tags: ["Economics", "Strategy", "Simulation"],
        standardRef: "CA-HSS-3-5",
        estimatedMinutes: 25,
        xpReward: 125,
        gpReward: 20,
    },
    {
        id: "math_3_5_fractions",
        title: "Pizza Fraction Factory",
        description: "Divide pizzas into equal parts to master fraction concepts visually.",
        subject: "MATH",
        bloomLevel: "APPLY",
        difficulty: -1.2,
        minGrade: 3,
        maxGrade: 5,
        tags: ["Fractions", "Visual", "Food"],
        standardRef: "CCSS-MATH-3-5-NF",
        estimatedMinutes: 20,
        xpReward: 100,
        gpReward: 15,
    },
    {
        id: "sci_3_5_ecosystem",
        title: "Ecosystem Architect",
        description: "Design a balanced ecosystem with producers, consumers, and decomposers.",
        subject: "SCIENCE",
        bloomLevel: "CREATE",
        difficulty: -0.8,
        minGrade: 4,
        maxGrade: 5,
        tags: ["Biology", "Nature", "Design"],
        standardRef: "NGSS-3-5-LS2",
        estimatedMinutes: 35,
        xpReward: 175,
        gpReward: 30,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // GRADE 6-8 (Inquiry & Analysis) - Difficulty: 0.0 to 1.0
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: "sci_6_8_chem",
        title: "Reaction Lab",
        description: "Predict and test chemical reactions using a virtual lab with real compound data.",
        subject: "SCIENCE",
        bloomLevel: "ANALYZE",
        difficulty: 0.0,
        minGrade: 6,
        maxGrade: 8,
        tags: ["Chemistry", "Logic", "Virtual Lab"],
        standardRef: "NGSS-MS-PS1",
        estimatedMinutes: 30,
        xpReward: 200,
        gpReward: 40,
    },
    {
        id: "math_6_8_stats",
        title: "Data Detective",
        description: "Use scatter plots to determine if height correlates with jump distance in athletes.",
        subject: "MATH",
        bloomLevel: "EVALUATE",
        difficulty: 0.5,
        minGrade: 6,
        maxGrade: 8,
        tags: ["Statistics", "Data", "Sports"],
        standardRef: "NY-MATH-6-8-Stats",
        estimatedMinutes: 25,
        xpReward: 175,
        gpReward: 35,
    },
    {
        id: "ela_6_8_research",
        title: "Source Sleuth",
        description: "Evaluate the credibility of multiple sources on a controversial topic.",
        subject: "ELA",
        bloomLevel: "EVALUATE",
        difficulty: 0.3,
        minGrade: 6,
        maxGrade: 8,
        tags: ["Research", "Critical Thinking", "Media Literacy"],
        standardRef: "CA-ELA-6-8",
        estimatedMinutes: 35,
        xpReward: 200,
        gpReward: 40,
    },
    {
        id: "hist_6_8_civics",
        title: "Mock Congress",
        description: "Propose, debate, and vote on a bill in a simulated legislative session.",
        subject: "HISTORY",
        bloomLevel: "CREATE",
        difficulty: 0.8,
        minGrade: 7,
        maxGrade: 8,
        tags: ["Civics", "Government", "Debate"],
        standardRef: "NY-HSS-6-8-Civics",
        estimatedMinutes: 45,
        xpReward: 250,
        gpReward: 50,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // GRADE 9-12 (Synthesis & Rhetoric) - Difficulty: 1.0 to 2.0
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: "ela_9_12_rhetoric",
        title: "Policy Debate: Climate Action",
        description: "Research complex rhetoric and present a persuasive argument on climate policy.",
        subject: "ELA",
        bloomLevel: "EVALUATE",
        difficulty: 1.5,
        minGrade: 9,
        maxGrade: 12,
        tags: ["Public Speaking", "Civics", "Environment"],
        standardRef: "NY-ELA-9-12-Rhetoric",
        estimatedMinutes: 60,
        xpReward: 350,
        gpReward: 75,
    },
    {
        id: "math_9_12_model",
        title: "Bridge Engineering",
        description: "Use trigonometric functions to model the stress loads on a bridge design.",
        subject: "MATH",
        bloomLevel: "CREATE",
        difficulty: 2.0,
        minGrade: 10,
        maxGrade: 12,
        tags: ["Calculus", "Physics", "Engineering"],
        standardRef: "CCSS-MATH-HS-Modeling",
        estimatedMinutes: 50,
        xpReward: 400,
        gpReward: 80,
    },
    {
        id: "sci_9_12_genetics",
        title: "CRISPR Ethics Panel",
        description: "Analyze the ethical implications of gene editing technology in a simulated panel.",
        subject: "SCIENCE",
        bloomLevel: "EVALUATE",
        difficulty: 1.8,
        minGrade: 10,
        maxGrade: 12,
        tags: ["Biology", "Ethics", "Technology"],
        standardRef: "NGSS-HS-LS3",
        estimatedMinutes: 55,
        xpReward: 375,
        gpReward: 70,
    },
    {
        id: "hist_9_12_primary",
        title: "Primary Source Deep Dive",
        description: "Analyze primary documents from a historical event to construct an original thesis.",
        subject: "HISTORY",
        bloomLevel: "ANALYZE",
        difficulty: 1.3,
        minGrade: 9,
        maxGrade: 12,
        tags: ["Research", "History", "Writing"],
        standardRef: "CA-HSS-9-12",
        estimatedMinutes: 45,
        xpReward: 300,
        gpReward: 60,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // COLLEGE / CAREER (Professional Mastery) - Difficulty: 2.0 to 3.0
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: "col_capstone",
        title: "Venture Capstone",
        description: "Develop and pitch a full business plan for a sustainable startup to a panel of investors.",
        subject: "CAREER",
        bloomLevel: "CREATE",
        difficulty: 3.0,
        minGrade: 13,
        maxGrade: 16,
        tags: ["NACE-Leadership", "Entrepreneurship", "Business"],
        standardRef: "NACE-Career-Readiness",
        estimatedMinutes: 120,
        xpReward: 1000,
        gpReward: 250,
    },
    {
        id: "col_internship",
        title: "Virtual Internship: AI Dev",
        description: "Complete a ticket queue for a simulated open-source AI software project.",
        subject: "CAREER",
        bloomLevel: "APPLY",
        difficulty: 2.5,
        minGrade: 13,
        maxGrade: 16,
        tags: ["NACE-Technology", "Programming", "Collaboration"],
        standardRef: "NACE-Tech",
        estimatedMinutes: 90,
        xpReward: 750,
        gpReward: 175,
    },
    {
        id: "col_research",
        title: "Academic Research Paper",
        description: "Conduct original research with literature review, methodology, and conclusions.",
        subject: "CAREER",
        bloomLevel: "CREATE",
        difficulty: 2.8,
        minGrade: 14,
        maxGrade: 16,
        tags: ["NACE-Critical-Thinking", "Research", "Writing"],
        standardRef: "NACE-Academic",
        estimatedMinutes: 180,
        xpReward: 1200,
        gpReward: 300,
    },
    {
        id: "col_portfolio",
        title: "Professional Portfolio Review",
        description: "Curate and present a portfolio of work demonstrating mastery in your chosen field.",
        subject: "CAREER",
        bloomLevel: "EVALUATE",
        difficulty: 2.3,
        minGrade: 13,
        maxGrade: 16,
        tags: ["NACE-Professionalism", "Career", "Presentation"],
        standardRef: "NACE-Prof",
        estimatedMinutes: 60,
        xpReward: 500,
        gpReward: 100,
    },
];

/**
 * Get content filtered by subject
 */
export function getContentBySubject(subject: string): ContentNode[] {
    return CONTENT_DB.filter(node => node.subject === subject);
}

/**
 * Get content filtered by grade level
 */
export function getContentByGrade(grade: number): ContentNode[] {
    return CONTENT_DB.filter(node => node.minGrade <= grade && node.maxGrade >= grade);
}

/**
 * Get content by Bloom's level
 */
export function getContentByBloomLevel(level: string): ContentNode[] {
    return CONTENT_DB.filter(node => node.bloomLevel === level);
}

/**
 * Get random content node for testing
 */
export function getRandomContent(): ContentNode {
    return CONTENT_DB[Math.floor(Math.random() * CONTENT_DB.length)];
}
