/* ==========================================================================
   MYBESTPURPOSE: MISSION DATABASE (Expanded Version)
   Ensures 3+ choices for every Grade/Passion combination.
   ========================================================================== */

export const MISSION_DB = [
    // --- K-5 (Foundations / Explorer) ---
    { id: "SCI.K5.01", title: "Backyard Bio-Blitz", desc: "Find/draw 3 bugs in your yard.", category: "SCIENCE", xp: 100, gp: 50, color: "text-emerald-400", minGrade: 0, maxGrade: 5, tags: ["NATURE", "VISUAL"] },
    { id: "SCI.K5.02", title: "Cloud Watcher", desc: "Identify 3 cloud types.", category: "SCIENCE", xp: 100, gp: 50, color: "text-cyan-400", minGrade: 0, maxGrade: 5, tags: ["NATURE", "VISUAL"] },
    { id: "SCI.K5.03", title: "Seed Sprout Lab", desc: "Track a bean's growth.", category: "SCIENCE", xp: 120, gp: 60, color: "text-green-400", minGrade: 0, maxGrade: 5, tags: ["NATURE"] },
    { id: "COD.K5.01", title: "Robot Logic Maze", desc: "Guide the mouse to cheese.", category: "CODING", xp: 100, gp: 50, color: "text-blue-400", minGrade: 0, maxGrade: 5, tags: ["LOGIC", "CODE"] },
    { id: "COD.K5.02", title: "Pattern Decoder", desc: "Find the missing shape.", category: "CODING", xp: 110, gp: 55, color: "text-purple-400", minGrade: 0, maxGrade: 5, tags: ["LOGIC", "CODE"] },
    { id: "COD.K5.03", title: "Pixel Art Maker", desc: "Draw with code blocks.", category: "CODING", xp: 110, gp: 55, color: "text-pink-400", minGrade: 0, maxGrade: 5, tags: ["ART", "CODE"] },
    { id: "CRE.K5.01", title: "My Hero Story", desc: "Draw a planet hero.", category: "CREATIVE", xp: 100, gp: 50, color: "text-yellow-400", minGrade: 0, maxGrade: 5, tags: ["ART"] },
    { id: "CRE.K5.02", title: "Sound Scape", desc: "Record nature sounds.", category: "CREATIVE", xp: 100, gp: 50, color: "text-orange-400", minGrade: 0, maxGrade: 5, tags: ["ART", "NATURE"] },
    { id: "CRE.K5.03", title: "Kindness Card", desc: "Design a card for a friend.", category: "CREATIVE", xp: 100, gp: 50, color: "text-red-400", minGrade: 0, maxGrade: 5, tags: ["ART"] },

    // --- 6-12 (Analysis / Builder / Legend) ---
    { id: "CS.ALG.01", title: "Clean Energy Code", desc: "Optimize solar grids.", category: "CODING", xp: 250, gp: 120, color: "text-green-400", minGrade: 6, maxGrade: 16, tags: ["CODE", "GREENTECH"] },
    { id: "CS.AI.02", title: "Chatbot Trainer", desc: "Teach an AI ethics.", category: "CODING", xp: 280, gp: 130, color: "text-blue-400", minGrade: 6, maxGrade: 16, tags: ["CODE", "AI"] },
    { id: "CS.WEB.03", title: "Portfolio Site", desc: "Code your own website.", category: "CODING", xp: 260, gp: 125, color: "text-indigo-400", minGrade: 6, maxGrade: 16, tags: ["CODE", "DESIGN"] },
    { id: "SCI.BIO.04", title: "Bio-Diversity Map", desc: "Analyze drone footage.", category: "SCIENCE", xp: 300, gp: 150, color: "text-emerald-400", minGrade: 6, maxGrade: 16, tags: ["NATURE", "ANALYSIS"] },
    { id: "SCI.CHEM.05", title: "Water Filter Sim", desc: "Design clean water tech.", category: "SCIENCE", xp: 290, gp: 140, color: "text-cyan-400", minGrade: 6, maxGrade: 16, tags: ["NATURE"] },
    { id: "SCI.PHYS.06", title: "Rocket Trajectory", desc: "Calc launch angles.", category: "SCIENCE", xp: 310, gp: 155, color: "text-purple-400", minGrade: 6, maxGrade: 16, tags: ["MATH"] },
    { id: "HUM.SOC.02", title: "Policy Narrative", desc: "Draft a connectivity bill.", category: "HUMANITIES", xp: 180, gp: 80, color: "text-yellow-400", minGrade: 6, maxGrade: 16, tags: ["WRITING"] },
    { id: "ART.DES.01", title: "UI for the Blind", desc: "Design accessible apps.", category: "DESIGN", xp: 220, gp: 110, color: "text-pink-400", minGrade: 6, maxGrade: 16, tags: ["ART", "DESIGN"] },
    { id: "HIS.ARC.05", title: "Digital History", desc: "Archive local stories.", category: "HISTORY", xp: 300, gp: 150, color: "text-orange-400", minGrade: 6, maxGrade: 16, tags: ["WRITING"] },
    { id: "CRE.MED.08", title: "Viral Impact Doc", desc: "Film and edit a 60-second mini-doc about a local hero.", category: "CREATIVE", xp: 240, gp: 115, color: "text-pink-500", minGrade: 6, maxGrade: 16, tags: ["ART", "FILM"] },

    // --- COLLEGE / PRO (Advanced / Pro) ---
    { id: "CS.SEC.07", title: "Quantum Encryption", desc: "Patch medical records.", category: "CODING", xp: 400, gp: 200, color: "text-rose-400", minGrade: 13, maxGrade: 20, tags: ["CODE", "SECURITY"] },
    { id: "SCI.AST.09", title: "Asteroid Trajectory", desc: "Calc impact probs.", category: "SCIENCE", xp: 450, gp: 220, color: "text-purple-400", minGrade: 13, maxGrade: 20, tags: ["MATH", "PHYSICS"] },
    { id: "BUS.VC.10", title: "Venture Capstone", desc: "Pitch a startup plan.", category: "BUSINESS", xp: 500, gp: 300, color: "text-gold-400", minGrade: 13, maxGrade: 20, tags: ["LEADERSHIP"] },
    { id: "LEA.STR.11", title: "Global Summit Admin", desc: "Coordinate climate policy.", category: "LEADERSHIP", xp: 480, gp: 280, color: "text-yellow-400", minGrade: 13, maxGrade: 20, tags: ["LEADERSHIP", "WRITING"] },
    { id: "LEA.ENT.12", title: "Impact Startup", desc: "Build a social enterprise.", category: "LEADERSHIP", xp: 550, gp: 350, color: "text-emerald-400", minGrade: 13, maxGrade: 20, tags: ["LEADERSHIP", "BIZ"] },
];
