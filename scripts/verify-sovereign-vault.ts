
import { WorldEngineOS } from '../src/services/WorldEngineOS';
import { VaultService } from '../src/services/VaultService';
import { ContractSolvencyEngine } from '../src/services/ContractSolvencyEngine';
import { DeanProtocol } from '../src/services/DeanProtocol';
import type { LearnerProfile } from '../src/engines/world-engine/LearnerModel';

/**
 * SOVEREIGN VAULT VERIFICATION
 * Proves the Dual-Asset Economy (GP + IC) and Tiering logic.
 */
async function verifySovereignVault() {
    console.log("💎 STARTING SOVEREIGN VAULT EVOLUTION...");

    const mockProfile: LearnerProfile = {
        id: "legend-001",
        name: "Test Vault user",
        currentGrade: 5,
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
        impactCredits: 0
    };

    const missionId = "vault-mission-1";
    const contractId = "client-contract-vault";
    const payment = 1000;

    console.log("\n1. Setting up Governance & Solvency...");
    ContractSolvencyEngine.fundContract(contractId, payment);
    DeanProtocol.submitEvidence(missionId, "https://vault.proof");
    DeanProtocol.registerAIReview(missionId, 90, "Excellent impact.");
    DeanProtocol.registerPeerReview(missionId, "p1", "PASS", "Reputation earned.");
    DeanProtocol.registerPeerReview(missionId, "p2", "PASS", "Approved.");

    console.log("2. Executing High Intensity Evolution...");
    const result = await WorldEngineOS.executeEvolution(
        mockProfile,
        missionId,
        contractId,
        payment,
        "Carbon Capture Mesh",
        "High"
    );

    console.log("\n3. Verifying Dual-Asset Distribution:");
    // Student Potential (60%) = 600. Lead Share (70%) = 420.
    // High Intensity base IC = 60.
    console.log(`   - Genesis Points (GP): ${mockProfile.genesisPoints} (Expected: 420)`);
    console.log(`   - Impact Credits (IC): ${mockProfile.impactCredits} (Expected: 60)`);

    const metrics = VaultService.getVaultMetrics(mockProfile);
    console.log(`   - Reputation Tier: ${metrics.reputationTier}`);
    console.log(`   - Governance Weight: ${metrics.governanceWeight.toFixed(2)}`);

    if (mockProfile.genesisPoints !== 420) throw new Error("GP mismatch.");
    if (mockProfile.impactCredits !== 60) throw new Error("IC mismatch.");
    if (metrics.reputationTier !== 'BRONZE') throw new Error("Initial tier mismatch."); // 60 is < 100

    console.log("\n4. Simulating Reputation Growth...");
    // Force some IC growth
    VaultService.mintRewards(mockProfile, 0, 150);
    const updatedMetrics = VaultService.getVaultMetrics(mockProfile);
    console.log(`   - New IC Total: ${updatedMetrics.icTotal}`);
    console.log(`   - New Tier: ${updatedMetrics.reputationTier} (Expected: SILVER)`);
    console.log(`   - New Governance Weight: ${updatedMetrics.governanceWeight.toFixed(2)}`);

    if (updatedMetrics.reputationTier !== 'SILVER') throw new Error("Tier upgrade failed.");

    console.log("\n💎 SOVEREIGN VAULT VERIFIED. DUAL-ASSET ECONOMY IS STABLE.");
    process.exit(0);
}

verifySovereignVault().catch(err => {
    console.error(`\n❌ VERIFICATION FAILED: ${err.message}`);
    process.exit(1);
});
