/* ==========================================================================
   HEADLESS DIAGNOSTIC ENGINE v2 (Autonomy Protection)
   Checks Persona Logic against Mission Database without Browser.
   run with: `npx tsx src/scripts/verify-logic.ts`
   ========================================================================== */
import { MISSION_DB } from "../data/MissionDatabase";
import { USER_PERSONAS } from "../services/SimulationEngine";

console.log("⚡ RUNNING HEADLESS DIAGNOSTIC v2 (AUTONOMY CHECK)...\n");

let failureCount = 0;

Object.values(USER_PERSONAS).forEach((persona) => {
    console.log(`[TEST] Checking Persona: ${persona.name} (Grade ${persona.gradeLevel}) | Passion: ${persona.passion}`);

    // 1. REPLICATE APP FILTER LOGIC
    const gradeNum = persona.gradeLevel;
    // const history: string[] = []; // Simulating empty history (Unused)

    const availableMissions = MISSION_DB.filter(m => {
        // Check Grade
        return gradeNum >= m.minGrade && gradeNum <= m.maxGrade;
    });

    // 2. CHECK PASSION ALIGNMENT
    // Does the system offer missions that validly match their specific passion?
    const passionMatches = availableMissions.filter(m => {
        const p = persona.passion.toLowerCase();
        if (p.includes("cod") || p.includes("tech")) return m.category === "CODING";
        if (p.includes("sci") || p.includes("bio")) return m.category === "SCIENCE";
        if (p.includes("creat") || p.includes("art")) return m.category === "CREATIVE" || m.category === "HUMANITIES" || m.category === "DESIGN";
        if (p.includes("lead")) return m.category === "LEADERSHIP" || m.category === "BUSINESS";
        return true; // Fallback
    });

    // 3. CHECK ASSERTIONS
    const totalAvailable = availableMissions.length;
    const passionAvailable = passionMatches.length;

    if (totalAvailable === 0) {
        console.error(`  ❌ FAIL: No missions found for Grade ${gradeNum}`);
        failureCount++;
    } else if (passionAvailable < 3) {
        console.error(`  ⚠️ WEAKNESS: ${persona.passion} only has ${passionAvailable} choices! (Target: 3+)`);
        // We log it as a weakness, but maybe strictly failing it depends on strictness.
        // Let's count it as a failure to enforce the user's "3 Choice" rule.
        failureCount++;
    } else {
        console.log(`  ✅ PASS: ${totalAvailable} Total Missions. ${passionAvailable} Perfect Matches for "${persona.passion}".`);
    }
    console.log("-----------------------------------------");
});

if (failureCount > 0) {
    console.error(`\n🔥 CRITICAL: ${failureCount} LOGIC FAILURES DETECTED.`);
    process.exit(1);
} else {
    console.log("\n✅ ALL SYSTEMS NOMINAL. LOGIC IS PERFECT.");
    process.exit(0);
}
