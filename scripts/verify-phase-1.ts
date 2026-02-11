
import { FinancialEngine, SOVEREIGN_2_0_FEES } from '../src/services/FinancialEngine';
import { MissionGenerator } from '../src/lib/MissionGenerator';

/**
 * PHASE 1 VERIFICATION SCRIPT
 * Validates Trust & Identity Activation Pillars.
 */
async function verify() {
    console.log("🚀 STARTING PHASE 1 INTEGRITY CHECK...");

    // 1. FINANCIAL ENGINE: Split Verification
    console.log("\n💰 CHECKING FINANCIAL ENGINE:");
    const totalAmount = 1000;
    const split = FinancialEngine.calculateSplit(totalAmount, SOVEREIGN_2_0_FEES);

    console.log(`   - Total: ${totalAmount} SYS`);
    console.log(`   - Platform Fee: ${split.platformFee} SYS`);
    console.log(`   - Student Potential: ${split.studentPotential} SYS`);

    const sum = split.platformFee + split.studentPotential;
    if (Math.abs(sum - totalAmount) > 0.001) {
        throw new Error(`FINANCIAL_FAILURE: Funds mismanaged. Expected ${totalAmount}, got ${sum}`);
    }
    console.log("   ✅ SPLIT INTEGRITY: PASSED (100% Accounted)");

    // 2. SOLVENCY GUARD: Payout Validation
    console.log("\n🛡️ CHECKING SOLVENCY GUARD:");
    const emptyEscrow = 0;
    const insufficientBalance = 50;
    const canPayoutEmpty = FinancialEngine.validatePayout('CLEARED', emptyEscrow, 100);
    const canPayoutCleared = FinancialEngine.validatePayout('CLEARED', 500, 100);
    const canPayoutPending = FinancialEngine.validatePayout('PENDING', 500, 100);

    if (canPayoutEmpty) throw new Error("SOLVENCY_FAILURE: Payout allowed on empty escrow!");
    if (!canPayoutCleared) throw new Error("SOLVENCY_FAILURE: Legitimate payout blocked!");
    if (canPayoutPending) throw new Error("SOLVENCY_FAILURE: Payout allowed on pending status!");

    console.log("   ✅ SOLVENCY LOGIC: PASSED");

    // 3. MISSION TIERING: Gating Verification
    console.log("\n🧬 CHECKING MISSION TIERING:");

    // Simulate Tier 0 Environment
    (global as any).window = { isCalibrated: false, confidence: 15 };
    const tierZeroMission = MissionGenerator.generateMission();

    console.log(`   - Expected: TRAINING | Found: ${tierZeroMission.type}`);
    if (tierZeroMission.type !== 'TRAINING') {
        throw new Error("TIERING_FAILURE: Uncalibrated user accessed Tier 1+ contracts!");
    }

    // Simulate High Confidence Environment
    (global as any).window.isCalibrated = true;
    (global as any).window.confidence = 85;

    // Generate a few to ensure we see a non-training one
    let foundContract = false;
    for (let i = 0; i < 10; i++) {
        const m = MissionGenerator.generateMission();
        if (m.type === 'CLIENT_CONTRACT' || m.type === 'BOUNTY') foundContract = true;
    }

    if (!foundContract) throw new Error("TIERING_FAILURE: Calibrated user blocked from higher tiers!");

    console.log("   ✅ MISSION TIERING: PASSED");

    const traceId = FinancialEngine.generateTraceId();
    console.log(`\n💎 PHASE 1 VERIFIED. TRACE-ID: ${traceId}`);
    process.exit(0);
}

verify().catch(err => {
    console.error(`\n❌ VERIFICATION FAILED: ${err.message}`);
    process.exit(1);
});
