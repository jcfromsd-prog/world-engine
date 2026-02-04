
export interface Mission {
    id: string;
    title: string;
    price: string;
    desc: string;
    tags: string[];
    type: 'PATTERN' | 'MATH_ARRAYS' | 'ALGEBRA' | 'PHYSICS' | 'CODE_FIX'; // Maps to internal game components
    curriculum: string; // The hidden educational standard
    locked: boolean;
}

// The "Stealth Education" Database
// Maps User Level (1-10) to "Disguised" Academic Standards
const CURRICULUM_DATABASE: Record<number, Mission[]> = {
    // LEVEL 1: KINDERGARTEN (Shapes & Recognition)
    1: [
        {
            id: "m1_1",
            title: "Security Calibration",
            price: "$15.00",
            desc: "Match the cryptographic keys to the correct slots to secure the perimeter.",
            tags: ["PATTERN", "SEC_OPS"],
            type: "PATTERN",
            curriculum: "Kindergarten: Identify Shapes (Square, Circle, Triangle)",
            locked: false
        },
        {
            id: "m1_2",
            title: "Visual Anomaly Detection",
            price: "$20.00",
            desc: "Identify the irregular shape in the data stream.",
            tags: ["VISUAL", "DATA_CLEAN"],
            type: "PATTERN",
            curriculum: "Kindergarten: Analyze, Compare and Classify Shapes",
            locked: false
        },
        // NEW: Nature / Visual Specific (Forest Ranger)
        {
            id: "m1_3_nature",
            title: "Track Identification",
            price: "$15.00",
            desc: "Match the animal footprints to the correct species.",
            tags: ["NATURE", "BIO_SURVEY"],
            type: "PATTERN",
            curriculum: "Kindergarten: Matching & Classification",
            locked: false
        }
    ],

    // LEVEL 2: 3RD GRADE (Basic Math & Arrays)
    2: [
        {
            id: "m2_1",
            title: "Supply Chain Optimization",
            price: "$25.00",
            desc: "Calculate total units for grid shipments to maximize cargo efficiency.",
            tags: ["LOGISTICS", "MATH_CORE"],
            type: "MATH_ARRAYS",
            curriculum: "Grade 3: Multiplication (Arrays & Area Models)",
            locked: false
        }
    ],

    // LEVEL 3: 8TH GRADE (Algebra)
    3: [
        {
            id: "m3_1",
            title: "Algorithm Variable Fix",
            price: "$45.00",
            desc: "Find the missing variable 'X' to balance the server load equations.",
            tags: ["ALGORITHMS", "DEBUG_L2"],
            type: "ALGEBRA",
            curriculum: "Grade 8: Solve Linear Equations in One Variable",
            locked: true // Locked for L1 users
        }
    ],

    // LEVEL 4: HIGH SCHOOL (Physics)
    4: [
        {
            id: "m4_1",
            title: "Drone Pathing Logic",
            price: "$75.00",
            desc: "Program the flight velocity and trajectory to avoid sector obstacles.",
            tags: ["PHYSICS", "AERO_DYNAMICS"],
            type: "PHYSICS",
            curriculum: "HS Physics: Velocity, Acceleration, and Vectors",
            locked: true
        }
    ],

    // LEVEL 5: COLLEGE (CS 101)
    5: [
        {
            id: "m5_1",
            title: "Bug Bounty: Infinite Loop",
            price: "$150.00",
            desc: "Analyze the source code and terminate the runaway process.",
            tags: ["CODE", "VULNERABILITY"],
            type: "CODE_FIX",
            curriculum: "CS 101: Control Flow & Algorithmic Complexity",
            locked: true
        }
    ]
};

// HELPER: Generate missions relative to the user's current level
export function generateMissionsForUser(userLevel: number): Mission[] {
    // Always fetch missions for the user's CURRENT level
    const currentMissions = CURRICULUM_DATABASE[userLevel] || [];

    // Fetch ONE "Reach" mission (Next Level) to show progression (Locked)
    const nextLevel = userLevel + 1;
    const reachMissions = CURRICULUM_DATABASE[nextLevel] || [];
    const previewMission = reachMissions.length > 0 ? { ...reachMissions[0], locked: true } : null;

    // Combine them
    return previewMission ? [...currentMissions, previewMission] : currentMissions;
}
