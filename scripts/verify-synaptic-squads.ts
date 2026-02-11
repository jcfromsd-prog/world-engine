
import { SquadMatcher, UserVector } from '../src/services/SquadMatcher';
import { WorldEngineOS } from '../src/services/WorldEngineOS';
import { ContractSolvencyEngine } from '../src/services/ContractSolvencyEngine';
import { DeanProtocol } from '../src/services/DeanProtocol';
import type { LearnerProfile } from '../src/engines/world-engine/LearnerModel';

/**
 * SYNAPTIC SQUAD VERIFICATION
 * Proves the autonomous matching and reward distribution logic.
 */
async function verifySynapticSquads() {
    console.log("🧬 STARTING SYNAPTIC SQUAD EVOLUTION...");

    // 1. MOCK POOL: Different Archetypes
    const pool: UserVector[] = [
        { id: "L1", archetype: "Strategist", skillTheta: 2.5, interestTags: ["GENERAL", "SYSTEMS"] },
        { id: "M1", archetype: "Builder", skillTheta: 0.5, interestTags: ["SYSTEMS", "TECH"] },
        { id: "M2", archetype: "Healer", skillTheta: -0.2, interestTags: ["PEOPLE", "SYSTEMS"] },
        { id: "M3", archetype: "Builder", skillTheta: 0.1, interestTags: ["DESIGN"] }
    ];

    console.log("\n1. Matching Squad (Target size: 3)...");
    const matching = SquadMatcher.findOptimalSquad(pool);
    console.log(`   - Squads Formed: ${matching.squads.length}`);

    if (matching.squads.length === 0) throw new Error("Squad formation failed.");
    const squad = matching.squads[0];
    console.log(`   - Squad Name: ${squad.name}`);
    console.log(`   - Members: ${squad.members.map(m => m.archetype).join(", ")}`);

    if (squad.members.length !== 3) throw new Error("Squad size incorrect (Rule of 3)");

    // 2. SIMULATE EVOLUTION
    console.log("\n2. Executing Squad Evolution Event...");

    const mockLead: LearnerProfile = {
        id: "L1",
        name: "Lead Strategist",
        currentGrade: 10,
        masteryMap: new Map(),
        domainLevels: { literacy: 1, numeracy: 1, science: 1, social: 1, sel: 1, career: 1 },
        cognitiveState: { focusLevel: 100, frustrationLevel: 0, energyLevel: 100, currentZPD: 0.2 },
        interests: [],
        learningStyle: 'visual',
        goals: [],
        isCalibrated: true,
        confidence: 85,
        unlockedTasks: [],
        version: 1,
        completedMissions: [],
        genesisPoints: 0,
        archetype: 'Strategist'
    };

    const missionId = "sq-mission-77";
    const status = "client-contract-99";
    const payment = 1000;

    // PRE-REQ: Funding & Quality Gate
    ContractSolvencyEngine.fundContract(status, payment);
    DeanProtocol.submitEvidence(missionId, "https://proof.squad");
    DeanProtocol.registerAIReview(missionId, 95, "Squad logic is optimal.");
    DeanProtocol.registerPeerReview(missionId, "p1", "PASS", "Great team.");
    DeanProtocol.registerPeerReview(missionId, "p2", "PASS", "Approved.");

    const result = await WorldEngineOS.executeEvolution(
        mockLead,
        missionId,
        status,
        payment,
        "Distributed Neural Mesh"
    );

    // 3. ASSERTIONS
    console.log("\n3. Verifying Reward Distribution:");
    // Total Student Potential = 1,000 * 0.60 (45% solver + 15% squad) = 600
    // Lead Share = 600 * 0.70 = 420
    console.log(`   - Lead GP: ${mockLead.genesisPoints} (Expected: 420)`);
    console.log(`   - TraceID: ${result.traceId}`);

    if (mockLead.genesisPoints !== 420) throw new Error(`GP Mismatch. Expected 420, got ${mockLead.genesisPoints}`);

    console.log("\n💎 SYNAPTIC SQUAD EVOLUTION VERIFIED. SYSTEM STABLE.");
    process.exit(0);
}

verifySynapticSquads().catch(err => {
    console.error(`\n❌ VERIFICATION FAILED: ${err.message}`);
    process.exit(1);
});
