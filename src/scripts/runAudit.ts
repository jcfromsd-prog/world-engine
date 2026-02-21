
import { SimulationEngine } from '../services/SimulationEngine';
import { SimulationBatchConfig } from '../types/EngineTypes';

const config: SimulationBatchConfig = {
    agentCount: 50,
    target: 'PEDAGOGICAL_AUDIT',
    stressVectors: [],
    personaDistribution: {
        ELEMENTARY_NOVICE: 10, // K-2
        WOUNDED: 10,           // 3-5
        DRIFTER: 10,           // 6-8
        GAMER: 10,             // 9-12
        COLLEGE_SENIOR: 10     // College+
    },
    stepDelayMs: 10 // Fast execution
};

console.log("🚀 STARTING GLOBAL PEDAGOGICAL AUDIT...");

SimulationEngine.runBatch(config, {
    onProgress: (p) => {
        if (p.completedCount % 5 === 0) {
            process.stdout.write(`\rProgress: ${(p.progressPercent * 100).toFixed(0)}% (${p.completedCount}/${p.totalAgents})`);
        }
    },
    onLog: (msg) => {
        // Only log failures or abandons to keep output clean
        if (msg.includes("PEDAGOGICAL") || msg.includes("ABANDON") || msg.includes("CONFUSION")) {
            console.log(msg);
        }
    },
    onAgentComplete: (res) => {
        if (res.outcome === "PEDAGOGICAL_ABANDON") {
            console.log(`\n❌ [ABANDON] ${res.personaName} (Grade ${res.personaKey}) - Check Logs`);
        }
    }
}).then((report) => {
    console.log("\n\n📊 AUDIT COMPLETE");
    console.log(`Pass Rate: ${(report.passRate * 100).toFixed(1)}%`);
    console.log(`Fail Rate: ${(report.failRate * 100).toFixed(1)}%`);
    console.log(`Abandon Rate: ${(report.abortRate * 100).toFixed(1)}%`); // Note: Custom outcomes might need manual freq count if not mapped to standard rates

    // Manually count pedagogical abandons if not in abortRate
    const abandonCount = report.results.filter(r => r.outcome === "PEDAGOGICAL_ABANDON").length;
    console.log(`Pedagogical Abandons: ${abandonCount}/${report.config.agentCount} (${((abandonCount / report.config.agentCount) * 100).toFixed(1)}%)`);

    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
});
