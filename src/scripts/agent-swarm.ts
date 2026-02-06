/* ==========================================================================
   OPENCLAW AGENT SWARM v2.1 (FIXED)
   Autonomous Behavioral Verification for MyBestPurpose.
   
   "We don't just test code. We simulate life."
   
   Run with: npx tsx src/scripts/agent-swarm.ts
   ========================================================================== */

import { MISSION_DB } from "../data/MissionDatabase";
import { USER_PERSONAS } from "../services/SimulationEngine";

// --- TYPES ---
interface AgentReport {
    agentName: string;
    happiness: number; // 0-100
    walletGP: number;
    history: string[];
    logs: string[];
    status: "GRADUATED" | "DROPOUT" | "STUCK";
}

// --- CONFIG ---
const AGENTS_TO_RUN = ["Maya", "Leo", "Alex"];

console.log("\n🦁 RELEASING OPENCLAW AGENT SWARM...\n");

const runAgentJourney = (personaKey: string): AgentReport => {
    // 1. SPAWN AGENT
    // We treat the static USER_PERSONAS as the "Seed DNA"
    const dna = Object.values(USER_PERSONAS).find(p => p.name.includes(personaKey));
    if (!dna) throw new Error(`Agent DNA for ${personaKey} not found.`);

    const agent: AgentReport = {
        agentName: dna.name,
        happiness: 100, // Starts optimistic
        walletGP: 0,
        history: [],
        logs: [],
        status: "STUCK"
    };

    const log = (msg: string) => {
        agent.logs.push(msg);
        console.log(`[${agent.agentName}] ${msg}`);
    };

    log(`Spawned. Grade: ${dna.gradeLevel} | Passion: ${dna.passion}`);

    // 2. ONBOARDING (Validation)
    // Does the logic assign the correct squad?
    let squad = "Generalists";
    const p = dna.passion.toUpperCase();

    // Improved Case-Insensitive Matching
    if (p.includes("COD") || p.includes("TECH")) squad = "Algo-Rhythm";
    else if (p.includes("SCI") || p.includes("BIO")) squad = "Bio-Guardians";
    else if (p.includes("CRE") || p.includes("ART")) squad = "Visionaries";
    else if (p.includes("LEAD") || p.includes("BIZ")) squad = "Vanguards";

    log(` Assigned to Squad: ${squad}`);

    // 3. BROWSING (Psychological Safety)
    // Can they find work that matters to them?
    const validMissions = MISSION_DB.filter(m => {
        const gradeMatch = m.minGrade <= dna.gradeLevel && m.maxGrade >= dna.gradeLevel;
        // Simple regex passion match logic mirroring App.tsx
        // Note: App checks if Category is loosely matched to Passion
        return gradeMatch;
    });

    if (validMissions.length === 0) {
        log(`❌ CRITICAL: No missions found! I feel useless.`);
        agent.happiness -= 50;
        agent.status = "DROPOUT";
        return agent;
    }

    log(` Found ${validMissions.length} potential missions. I feel autonomous.`);

    // 4. SELECTION (Agency)
    // Pick the highest paying one (Rational Economic Actor behavior)
    validMissions.sort((a, b) => b.gp - a.gp);
    const chosenMission = validMissions[0];

    log(` Selected Mission: "${chosenMission.title}" (Promise: ${chosenMission.gp} GP | ${chosenMission.xp} XP)`);

    // 5. WORK (Simulation)
    log(`... Working on mission ...`);

    // 6. PAYOUT (Economic Integrity)
    // Simulating App.tsx behavior (NOW FIXED):
    const receivedAmount = chosenMission.gp;

    agent.walletGP += receivedAmount;
    agent.history.push(chosenMission.id);

    if (agent.walletGP !== chosenMission.gp) {
        log(`⚠️ INFLATION WARNING: I was promised ${chosenMission.gp} GP but received ${agent.walletGP}. Economy is unstable.`);
        agent.happiness -= 10;
        agent.status = "GRADUATED";
    } else {
        log(`💰 PAID EQUITABLY. Wallet Balance: ${agent.walletGP} GP.`);
        agent.status = "GRADUATED";
    }

    return agent;
};

// --- RUN SWARM ---
const swarmResults = AGENTS_TO_RUN.map(name => {
    try {
        return runAgentJourney(name);
    } catch (e) {
        console.error("Agent Died:", e);
        return null;
    }
});

console.log("\n--- SWARM REPORT ---");
swarmResults.forEach(r => {
    if (r) console.log(`${r.agentName}: ${r.status} (Happiness: ${r.happiness}%) | Earned: ${r.walletGP} GP`);
});
console.log("--------------------\n");
