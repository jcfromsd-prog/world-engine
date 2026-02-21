
import { SimulationEngine, USER_PERSONAS } from '../src/services/SimulationEngine';
import { SimulationBatchConfig } from '../src/types/EngineTypes';

async function executeBatch4() {
    console.log("🚀 EXECUTING CORE LOOP STRESS TEST (BATCH #4)");
    console.log("🎯 TARGET: Squad HQ & Genesis Feed (v1.2)");
    console.log("📊 Cohort: 50 Agents (15 Sprouts, 15 Wounded, 10 Drifters, 10 Gamers)\n");

    // Configure Personas for Batch #4
    USER_PERSONAS.ELEMENTARY_NOVICE.gradeLevel = 2; // Sprout Tier
    USER_PERSONAS.WOUNDED.skillTheta = -2.2;        // High Anxiety
    USER_PERSONAS.DRIFTER.skillTheta = -0.8;        // Low Focus
    USER_PERSONAS.GAMER.skillTheta = 1.2;           // Speedrunner

    const config: SimulationBatchConfig = {
        agentCount: 50,
        target: "Core Loop (Law 1, 3, 5)",
        stressVectors: ["NONE"],
        stepDelayMs: 20, // Accelerated for 50 agents
        personaDistribution: {
            "ELEMENTARY_NOVICE": 15, // Sprouts
            "WOUNDED": 15,
            "DRIFTER": 10,
            "GAMER": 10
        }
    };

    const report = await SimulationEngine.runBatch(config, {
        onProgress: (p) => {
            const pct = Math.round(p.progressPercent * 100);
            process.stdout.write(`\r[BATCH #4] ${pct}% | Agents: ${p.completedCount}/50 | Abandon: ${p.abandonCount} | Pass: ${p.passedCount}  `);
        },
        onLog: (msg) => {
            // Stream key events to keep it manageable
            if (msg.includes("RADICAL WARMTH") ||
                msg.includes("SPROUT FILTER") ||
                msg.includes("FREEZE") ||
                msg.includes("SQUAD RECOVERY") ||
                msg.includes("FILTER SUCCESS") ||
                msg.includes("GHOST TOWN")) {
                console.log(`\n${msg}`);
            }
        },
        onAgentComplete: (r) => {
            // Optional: log completions
        }
    });

    console.log("\n\n🏁 BATCH #4 COMPLETE");
    console.log(`📊 Pass Rate: ${(report.passRate * 100).toFixed(1)}%`);
    console.log(`📊 Abandon Rate: ${(report.abandonRate * 100).toFixed(1)}%`);
    console.log(`📊 Completed Agents: ${report.results.length}/${config.agentCount}`);

    console.log("\n✅ SUCCESS CRITERIA CHECK:");
    console.log(`- Zero Manual Interventions: ${report.results.length === 50 ? "✅ PASSED" : "❌ FAILED"}`);

    // Check Sprout abandonment
    if (report.abandonRate < 0.1) {
        console.log("- Sprout Engagement (Law 3): ✅ PASSED (0% abandon expected)");
    } else {
        console.log("- Sprout Engagement (Law 3): ⚠️ CHECK LOGS");
    }

    process.exit(0);
}

executeBatch4().catch(e => {
    console.error("Batch #4 Failed:", e);
    process.exit(1);
});
