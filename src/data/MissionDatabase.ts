/* ==========================================================================
   MYBESTPURPOSE: MISSION DATABASE (Synced with Ultimate App.tsx)
   ========================================================================== */

export const MISSION_DB = [
    // K-5 FOUNDATIONS
    { id: "SCI.K5.01", type: "TRAINING", title: "Backyard Bio-Blitz", client: "Academy", reward: 100, gp: 100, xp: 50, desc: "Find/draw 3 bugs.", category: "SCIENCE", minGrade: 0, maxGrade: 5, color: "text-emerald-400" },
    { id: "COD.K5.01", type: "TRAINING", title: "Robot Logic Maze", client: "Academy", reward: 100, gp: 100, xp: 50, desc: "Guide the mouse.", category: "CODING", minGrade: 0, maxGrade: 5, color: "text-blue-400" },
    { id: "CRE.K5.01", type: "TRAINING", title: "My Hero Story", client: "Academy", reward: 100, gp: 100, xp: 50, desc: "Draw a hero.", category: "CREATIVE", minGrade: 0, maxGrade: 5, color: "text-yellow-400" },

    // 6-12 SKILLS
    { id: "CS.WEB.03", type: "TRAINING", title: "Portfolio Site", client: "Academy", reward: 260, gp: 260, xp: 130, desc: "Code your own site.", category: "CODING", minGrade: 6, maxGrade: 16, color: "text-indigo-400" },
    { id: "CRE.MED.08", type: "TRAINING", title: "Viral Impact Doc", client: "Academy", reward: 240, gp: 240, xp: 120, desc: "Edit a 60s doc.", category: "CREATIVE", minGrade: 6, maxGrade: 16, color: "text-pink-500" },

    // REAL WORLD CONTRACTS (High Grade)
    { id: "RW.01", type: "CLIENT_CONTRACT", title: "Debug Shopify Store", client: "TechFlow Inc.", reward: 500, gp: 500, xp: 250, desc: "Fix CSS layout bug.", category: "CODING", minGrade: 10, maxGrade: 20, color: "text-white" },
    { id: "RW.02", type: "CLIENT_CONTRACT", title: "Logo Redesign", client: "StartUp Coffee", reward: 450, gp: 450, xp: 225, desc: "Vector logo assets.", category: "CREATIVE", minGrade: 8, maxGrade: 20, color: "text-white" },
];
