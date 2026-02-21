/* ==========================================================================
   EXECUTION SCRIPT: BATCH #5 (THE ELEVATION STRESS TEST)
   Target: PurposeLedger & ElevationProtocol Verification
   ========================================================================== */

import { SimulationEngine } from "../src/services/SimulationEngine";
import { PurposeLedger } from "../src/services/PurposeLedger";

async function runBatch5() {
    console.log("🚀 INITIATING BATCH #5: THE ELEVATION STRESS TEST");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const config = {
        agentCount: 50,
        target: "Elevation Protocol & Immutable Ledger",
        stressVectors: ["EXPLOIT_ATTEMPTS", "TRUST_VERIFICATION"] as any,
        personaDistribution: {
            SKEPTIC: 20,
            GAMER: 20,
            WOUNDED: 10
        },
        stepDelayMs: 10 // Accelerated for batch verification
    };

    let totalConfettiTriggers = 0;
    let totalXPReferences = 0;
    let exploitBlockCount = 0;
    let validLedgerWrites = 0;

    const report = await SimulationEngine.runBatch(config, {
        onProgress: (p) => {
            console.log(`[PROGRESS] ${Math.round(p.progressPercent * 100)}% | Agent ${p.currentAgent}/${p.totalAgents} (${p.agentName})`);
        },
        onLog: (msg) => {
            // 1. CONFETTI & GAMIFICATION AUDIT
            const lower = msg.toLowerCase();
            if (lower.includes("confetti") || lower.includes("fireworks") || lower.includes("sparkle")) {
                totalConfettiTriggers++;
            }
            if (lower.includes(" xp") || lower.includes("points ") || lower.includes("gp ")) {
                // Exclude 'SHA-256' or other valid tech terms if needed
                if (!lower.includes("sha-256")) {
                    totalXPReferences++;
                }
            }

            // 2. EXPLOIT & LEDGER TRACKING
            if (msg.includes("EXPLOIT BLOCKED")) exploitBlockCount++;
            if (msg.includes("IMPACT LEDGERED")) validLedgerWrites++;
        },
        onAgentComplete: (res) => {
            // Optional: Per-agent metrics
        }
    });

    console.log("\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🏁 BATCH #5 COMPLETE: EXECUTION REPORT");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const ledgerIntegrity = await PurposeLedger.verifyChain();

    console.log(`📊 AGENTS PROCESSED: ${report.totalAgents}`);
    console.log(`✅ PASSED: ${report.passedCount}`);
    console.log(`🧩 ABANDONED: ${report.abandonCount}`);
    console.log(`❌ FAILED/BLOCKED: ${report.failedCount}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    console.log(`🛡️  SCENARIO 1: THE "CONFETTI" AUDIT`);
    console.log(`   - Confetti/Animation Logs: ${totalConfettiTriggers} ${totalConfettiTriggers === 0 ? "✅ (CLEAN)" : "❌ (VIOLATION)"}`);
    console.log(`   - XP/Points References: ${totalXPReferences} ${totalXPReferences === 0 ? "✅ (CLEAN)" : "❌ (VIOLATION)"}`);

    console.log(`🕵️  SCENARIO 2: THE EXPLOIT DENIAL`);
    console.log(`   - "Gamer" Exploit Attempts Blocked: ${exploitBlockCount} / 20 ${exploitBlockCount === 20 ? "✅ (100% SECURE)" : "❌ (SECURITY GAP)"}`);

    console.log(`⛓️  SCENARIO 3: LEDGER INTEGRITY`);
    console.log(`   - Immutable Ledger Writes: ${validLedgerWrites}`);
    console.log(`   - SHA-256 Chain Verification: ${ledgerIntegrity ? "✅ VERIFIED" : "❌ CORRUPTED"}`);

    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    if (totalConfettiTriggers === 0 && exploitBlockCount === 20 && ledgerIntegrity) {
        console.log("✨ BATCH #5 SUCCESS: ALL SOUL CONSTRAINTS VERIFIED.");
        process.exit(0);
    } else {
        console.log("🚨 BATCH #5 FAILURE: CONSTRAINTS NOT MET.");
        process.exit(1);
    }
}

runBatch5().catch(err => {
    console.error("Simulation System Crash:", err);
    process.exit(1);
});
