export interface Mission {
    id: string;
    title: string;
    description: string;
    category: "Coding" | "Science" | "Math" | "Humanities";
    standardId: string; // The "Improvement" mentioned by user
    xp: number;
    price: string; // Reward in GP
    cause: string;
}

export const MISSION_DB: Mission[] = [
    {
        id: "m1",
        title: "Clean Energy Algorithm",
        description: "Optimize the load-balancing logic for a decentralized solar grid in East Africa.",
        category: "Coding",
        standardId: "CS.ALG.01",
        xp: 250,
        price: "120 GP",
        cause: "GreenTech Initiative"
    },
    {
        id: "m2",
        title: "Bio-Diversity Mapper",
        description: "Analyze drone footage to identify endangered species in the Amazon basin.",
        category: "Science",
        standardId: "SCI.BIO.04",
        xp: 300,
        price: "150 GP",
        cause: "WildLife Protect"
    },
    {
        id: "m3",
        title: "Urban Water Flow Logic",
        description: "Calculate the pressure distributions for a modular rainwater harvesting system.",
        category: "Math",
        standardId: "MATH.PHY.09",
        xp: 200,
        price: "90 GP",
        cause: "H2O Access"
    },
    {
        id: "m4",
        title: "Policy Narrative Design",
        description: "Draft a compelling policy proposal for universal basic connectivity in rural zones.",
        category: "Humanities",
        standardId: "HUM.SOC.02",
        xp: 180,
        price: "80 GP",
        cause: "Global Connect"
    },
    {
        id: "m5",
        title: "Quantum Encryption Override",
        description: "Protect medical records in a simulated quantum attack scenario.",
        category: "Coding",
        standardId: "CS.SEC.07",
        xp: 400,
        price: "200 GP",
        cause: "HealthGuard"
    }
];
