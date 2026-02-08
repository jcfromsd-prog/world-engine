
import type { Mission } from './types';

// =============================================================================
// QUALITY CONTROL ENGINE
// =============================================================================
// This engine powers the "Virtual Classroom" simulation, the Educational Auditor,
// and the Velocity Metrics tracking.

// ----------------- TYPE DEFINITIONS -----------------

export type PersonaType = 'struggling' | 'bored' | 'chaos' | 'achiever' | 'explorer';

export interface PersonaProfile {
    id: string;
    name: string;
    type: PersonaType;
    age: number;
    gradeLevel: number; // 1-12
    attributes: {
        readingSpeed: number; // Words per minute (simulated)
        attentionSpan: number; // Seconds before quitting
        mathConfidence: number; // 0-100
        visualPreference: number; // 0-100 (High = prefers images)
        frustrationThreshold: number; // 0-100 (Low = quits easily)
    };
    bio: string;
}

export interface SimulationLog {
    personaId: string;
    missionId: string;
    outcome: 'success' | 'quit' | 'failure' | 'chaos';
    duration: number; // Seconds spent
    satisfaction: number; // 0-100
    diaryEntry: string; // "I tried X, but..."
}

export interface AuditReport {
    missionId: string;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    standardAlignment: string; // e.g., "CCSS.MATH.CONTENT.4.NF.A.1"
    strengths: string[];
    weaknesses: string[];
    suggestion: string;
}

export interface VelocityMetric {
    metric: string;
    value: string | number;
    trend: 'up' | 'down' | 'flat';
    status: 'healthy' | 'warning' | 'critical';
}

// ----------------- PERSONA BOTS (The Swarm) -----------------

export const PERSONA_BOTS: PersonaProfile[] = [
    {
        id: 'sam_g4',
        name: 'Struggling Sam',
        type: 'struggling',
        age: 9,
        gradeLevel: 4,
        attributes: {
            readingSpeed: 80,
            attentionSpan: 120, // 2 mins
            mathConfidence: 30,
            visualPreference: 90,
            frustrationThreshold: 40
        },
        bio: "Grade 4 student. Low math confidence. Loves pictures, hates walls of text."
    },
    {
        id: 'bella_g10',
        name: 'Bored Bella',
        type: 'bored',
        age: 15,
        gradeLevel: 10,
        attributes: {
            readingSpeed: 250,
            attentionSpan: 60, // 1 min (high churn risk)
            mathConfidence: 95,
            visualPreference: 40,
            frustrationThreshold: 80
        },
        bio: "Grade 10 math whiz. Needs high difficulty or quits immediately."
    },
    {
        id: 'carl_chaos',
        name: 'Chaos Carl',
        type: 'chaos',
        age: 12,
        gradeLevel: 6,
        attributes: {
            readingSpeed: 300, // Skims rapidly
            attentionSpan: 30,
            mathConfidence: 50,
            visualPreference: 50,
            frustrationThreshold: 90
        },
        bio: "Clicks every button randomly. Tries to break the UI. The Edge Case Finder."
    },
    {
        id: 'alice_ace',
        name: 'Achiever First',
        type: 'achiever',
        age: 11,
        gradeLevel: 5,
        attributes: {
            readingSpeed: 150,
            attentionSpan: 600,
            mathConfidence: 85,
            visualPreference: 50,
            frustrationThreshold: 70
        },
        bio: "Target user. Follows instructions perfectly. Grinds for XP."
    }
];

// ----------------- SIMULATION LOGIC -----------------

/**
 * Runs a simulated user session for a specific mission
 */
export const runSimulation = (persona: PersonaProfile, mission: Mission): SimulationLog => {
    // 1. Analyze Complexity vs Persona Capabilities
    // Adaptive fallback if mission properties are missing (e.g. mock data)
    const description = mission.description || (mission as Mission & { desc?: string }).desc || "";
    const wordCount = description.split(" ").length;
    const estReadingTime = (wordCount / persona.attributes.readingSpeed) * 60;

    // Heuristics
    const complexityScore = mission.difficulty === 'hard' ? 80 :
        mission.difficulty === 'medium' ? 50 : 20;

    const timeSpent = Math.min(persona.attributes.attentionSpan, Math.max(30, estReadingTime * 2));
    let satisfaction = 50;
    let outcome: SimulationLog['outcome'] = 'success';
    let diary = "";

    // 2. Logic Paths

    // PATH A: Text Heavy vs Poor Reader
    if (wordCount > 50 && persona.attributes.readingSpeed < 100) {
        outcome = 'quit';
        satisfaction = 20;
        diary = `I tried "${mission.title}" but there were too many words! I got tired reading the description and closed it.`;
    }
    // PATH B: Too Easy vs Bored Genius
    else if (complexityScore < 30 && persona.type === 'bored') {
        outcome = 'quit';
        satisfaction = 30;
        diary = `Ugh. "${mission.title}" was baby stuff. Description was too simple. Seriously? I need a real challenge.`;
    }
    // PATH C: Chaos Testing
    else if (persona.type === 'chaos') {
        outcome = 'chaos';
        satisfaction = 80; // He loves chaos
        diary = `I clicked the "Launch" button 50 times in 1 second. The modal flickered but didn't crash. Cool.`;
    }
    // PATH D: Low Confidence vs Hard Math
    else if (complexityScore > 60 && persona.attributes.mathConfidence < 40) {
        outcome = 'failure';
        satisfaction = 10;
        diary = `I felt stupid doing "${mission.title}". The math was way too hard for me. I hate this.`;
    }
    // PATH E: Success
    else {
        outcome = 'success';
        satisfaction = 80 + Math.random() * 20;
        diary = `I liked "${mission.title}". It took me about ${Math.round(timeSpent)} seconds. The difficulty felt right.`;
    }

    return {
        personaId: persona.id,
        missionId: mission.id,
        outcome,
        duration: timeSpent,
        satisfaction,
        diaryEntry: diary
    };
};

// ----------------- CURRICULUM AUDITOR -----------------

/**
 * Audits a mission against educational standards
 */
export const auditMission = (mission: Mission): AuditReport => {
    // Simulated Audit Logic (Heuristic based)

    let score = 0;
    const strengths = [];
    const weaknesses = [];
    let standard = "UNKNOWN";

    // Detect Subject via Tags
    // Fallback to tags if educationalTags is missing
    const tagsArr = mission.educationalTags || (mission as Mission & { tags?: string[] }).tags || [];
    const tags = tagsArr.join(" ").toUpperCase();

    if (tags.includes("MATH")) {
        standard = "CCSS.MATH.PRACTICE.MP1";
        if (tags.includes("LOGIC")) { score += 30; strengths.push("Strong logic component"); }
        else { score += 10; weaknesses.push("Missing foundational logic connection"); }
    } else if (tags.includes("NATURE") || tags.includes("SCIENCE")) {
        standard = "NGSS.3-LS4-3";
        score += 40;
        strengths.push("Direct real-world application");
    } else {
        standard = "GENERAL.SKILL.1";
        score += 20;
        weaknesses.push("Vague academic tie-in");
    }

    // Check Description Length & Clarity
    const description = mission.description || (mission as Mission & { desc?: string }).desc || "";
    if (description.length > 20 && description.length < 150) {
        score += 20;
        strengths.push("Clear, concise instructions");
    } else {
        weaknesses.push("Instructions descriptive length suboptimal");
    }

    // Assign Grade
    let grade: AuditReport['grade'] = 'F';
    if (score > 80) grade = 'A';
    else if (score > 60) grade = 'B';
    else if (score > 40) grade = 'C';
    else if (score > 20) grade = 'D';

    // Generate Suggestion
    const suggestion = weaknesses.length > 0
        ? `Improvement: ${weaknesses[0]}. Try adding a specific 'Why this matters' line.`
        : "Excellent mission structure. No changes needed.";

    return {
        missionId: mission.id,
        grade,
        standardAlignment: standard,
        strengths,
        weaknesses,
        suggestion
    };
};

// ----------------- FOUNDER'S COCKPIT METRICS -----------------

export const getVelocityMetrics = (
    _totalUsers: number = 1240,
    _activeUsers: number = 850
): VelocityMetric[] => {
    return [
        {
            metric: "Skill Velocity (Lvl 1->5)",
            value: "4.2 Days",
            trend: "up",
            status: "healthy"
        },
        {
            metric: "Paycheck Pipeline Ratio",
            value: "1.8%",
            trend: "flat",
            status: "warning"
        },
        {
            metric: "Retention (Week 4)",
            value: "68%",
            trend: "up",
            status: "healthy"
        },
        {
            metric: "Content Fatigue",
            value: "Level 8",
            trend: "down",
            status: "warning"
        }
    ];
};
