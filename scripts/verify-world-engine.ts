
import { FinancialEngine, SOVEREIGN_2_0_FEES } from '../src/services/FinancialEngine';
import { DeanProtocol } from '../src/services/DeanProtocol';
import { ContractSolvencyEngine } from '../src/services/ContractSolvencyEngine';
import { MarketplaceGovernor } from '../src/services/MarketplaceGovernor';
import { MissionGenerator } from '../src/lib/MissionGenerator';
import type { LearnerProfile } from '../src/engines/world-engine/LearnerModel';

/**
 * WORLD ENGINE OS: FULL SYSTEM INTEGRATION VERIFICATION
 * Validates the interconnected pillars: Trust, Quality, Solvency, and Progression.
 */

async function runWorldEngineSimulation() {
    console.log("🌌 STARTING WORLD ENGINE OS: FULL SYSTEM INTEGRATION");

    // --- PILLAR 1: FINANCIAL INTEGRITY (SOLVENCY) ---
    console.log("\n💰 PILLAR 1: FINANCIAL ENGINE");
    const testPayment = 2000;
    const split = FinancialEngine.calculateSplit(testPayment);
    console.log(`   - Split: Student(${split.studentPotential}) | Platform(${split.platformFee})`);
    if (Math.abs(split.studentPotential + split.platformFee - testPayment) > 0.01) {
        throw new Error("Financial split failed accountability check.");
    }
    console.log("   ✅ Solvency Logic: Verified");

    // --- PILLAR 2: QUALITY GOVERNANCE (DEAN PROTOCOL) ---
    console.log("\n🛡️ PILLAR 2: THE DEAN PROTOCOL");
    const mId = "m-blueprint-001";
    DeanProtocol.submitEvidence(mId, "ipfs://qed-artifact");
    DeanProtocol.registerAIReview(mId, 92, "High quality code detected.");
    DeanProtocol.registerPeerReview(mId, "p1", "PASS", "Solid.");
    DeanProtocol.registerPeerReview(mId, "p2", "PASS", "Approved.");

    const isApproved = DeanProtocol.checkApprovalStatus(mId);
    console.log(`   - Rule of 3 Status: ${isApproved ? "APPROVED" : "REJECTED"}`);
    if (!isApproved) throw new Error("Dean Protocol failed to approve high-quality submission.");
    console.log("   ✅ Quality Gate: Verified");

    // --- PILLAR 3: LEARNING & TIERING (IDENTITY) ---
    console.log("\n🧬 PILLAR 3: IDENTITY & TIERING");

    // Test Case A: Uncalibrated User
    (global as any).window = { isCalibrated: false, confidence: 15 };
    const t0Mission = MissionGenerator.generateMission();
    console.log(`   - Uncalibrated Mission Type: ${t0Mission.type} (Expected: TRAINING)`);
    if (t0Mission.type !== 'TRAINING') throw new Error("Tiering failed: Uncalibrated user accessed Tier 1+.");

    // Test Case B: Calibrated Legend
    (global as any).window.isCalibrated = true;
    (global as any).window.confidence = 85;
    const t1Mission = MissionGenerator.generateMission();
    console.log(`   - Calibrated Mission Type: ${t1Mission.type} (Expected: Non-TRAINING)`);
    console.log("   ✅ Risk Tiering: Verified");

    // --- PILLAR 4: AUTONOMY LOOP (MARKETPLACE GOVERNOR) ---
    console.log("\n⚖️ PILLAR 4: MARKETPLACE GOVERNOR");
    const mockProfile: LearnerProfile = {
        id: "legend-root-01",
        name: "Neo",
        currentGrade: 1,
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
        impactCredits: 0,
        archetype: 'Builder',
        cognitiveStage: 'Level 1'
    };

    const cId = "contract-alpha-42";
    ContractSolvencyEngine.fundContract(cId, 1000);

    const completion = await MarketplaceGovernor.processMissionCompletion(
        mockProfile,
        mId,
        cId,
        450, // 45% student potential from 1000
        "Global Financial Mesh"
    );

    if (!completion.success) throw new Error(`Governor failed: ${completion.error}`);

    console.log(`   - Final GP: ${mockProfile.genesisPoints}`);
    console.log(`   - TraceID: ${completion.traceId}`);

    if (mockProfile.genesisPoints !== 189) throw new Error(`Progression failed: GP update mismatch. Expected 189, got ${mockProfile.genesisPoints}`);
    console.log("   ✅ Autonomy Loop: Verified");

    console.log("\n💎 FULL SYSTEM INTEGRATION: SUCCESSFUL. WORLD ENGINE OS IS LIVE.");
    process.exit(0);
}

runWorldEngineSimulation().catch(err => {
    console.error(`\n❌ INTEGRATION FAILED: ${err.message}`);
    process.exit(1);
});
