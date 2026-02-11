
import { ContractSolvencyEngine } from '../src/services/ContractSolvencyEngine';
import { DeanProtocol } from '../src/services/DeanProtocol';
import { MarketplaceGovernor } from '../src/services/MarketplaceGovernor';
import type { LearnerProfile } from '../src/engines/world-engine/LearnerModel';

/**
 * GHOST CLASS SIMULATION
 * Verifies Phases 2-4: The Governance Core.
 */

async function simulateGhostClass() {
    console.log("👻 STARTING GHOST CLASS SIMULATION: THE GOVERNANCE CORE");

    // --- SETUP: MOCK DATA ---
    const mockProfile: LearnerProfile = {
        id: "student-001",
        name: "Test Legend",
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
        genesisPoints: 0
    };

    const missionId = "mission-alpha-99";
    const contractId = "client-contract-xyz";
    const rewardAmount = 500;

    // --- STEP 1: FUND CONTRACT ---
    console.log("\n1. Funding Client Contract...");
    ContractSolvencyEngine.fundContract(contractId, rewardAmount);
    const funding = ContractSolvencyEngine.getContractFunding(contractId);
    if (!funding || funding.escrowBalance !== rewardAmount) throw new Error("Step 1 failed: Contract not funded.");

    // --- STEP 2: SUBMIT EVIDENCE ---
    console.log("2. Submitting Student Evidence...");
    DeanProtocol.submitEvidence(missionId, "https://github.com/mybestpurpose/ghost-class-artifact");

    // --- STEP 3: DEAN PROTOCOL CYCLE ---
    console.log("3. Running Dean Protocol Multi-Sig...");

    // AI REVIEW
    DeanProtocol.registerAIReview(missionId, 88, "Solution is mathematically sound.");

    // PEER REVIEW 1
    DeanProtocol.registerPeerReview(missionId, "peer-reviewer-1", "PASS", "Excellent logic flow.");

    // PEER REVIEW 2
    DeanProtocol.registerPeerReview(missionId, "peer-reviewer-2", "PASS", "Meets all criteria.");

    const isApproved = DeanProtocol.checkApprovalStatus(missionId);
    console.log(`   - Governance Approval Status: ${isApproved ? "APPROVED" : "FAILED"}`);
    if (!isApproved) throw new Error("Step 3 failed: Dean Protocol Rule of 3 not met.");

    // --- STEP 4: GOVERNOR COMPLETION ---
    console.log("\n4. Triggering Marketplace Governor...");
    const result = await MarketplaceGovernor.processMissionCompletion(
        mockProfile,
        missionId,
        contractId,
        rewardAmount,
        "Neural Engine Optimization"
    );

    if (!result.success) throw new Error(`Step 4 failed: ${result.error}`);

    // --- STEP 5: FINAL ASSERTIONS ---
    console.log("\n5. Verifying Final State:");
    console.log(`   - Student Wallet: ${mockProfile.genesisPoints} GP (Expected: ${rewardAmount})`);
    console.log(`   - Remaining Escrow: ${ContractSolvencyEngine.getContractFunding(contractId)?.escrowBalance} (Expected: 0)`);
    console.log(`   - Victory Log Count: ${MarketplaceGovernor.getVictoryLogs().length}`);
    console.log(`   - TraceID: ${result.traceId}`);

    if (mockProfile.genesisPoints !== rewardAmount) throw new Error("Final check failed: Wallet mismatch.");
    if (ContractSolvencyEngine.getContractFunding(contractId)?.escrowBalance !== 0) throw new Error("Final check failed: Escrow not cleared.");

    console.log("\n💎 GHOST CLASS SIMULATION PASSED. GOVERNANCE CORE IS STABLE.");
    process.exit(0);
}

simulateGhostClass().catch(err => {
    console.error(`\n❌ SIMULATION FAILED: ${err.message}`);
    process.exit(1);
});
