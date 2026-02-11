
import { CalibrationService } from '../src/services/CalibrationService';
import { LearnerProfile } from '../src/engines/world-engine/LearnerModel';

/**
 * VERIFICATION SCRIPT: PHASE 1 IDENTITY CALIBRATION
 * This script validates the integrity of the Calibration Protocol.
 * 1. Mocks a Profile
 * 2. Runs Calibration
 * 3. Asserts confidence boost and Solvency Guard (Tier 0 only)
 */
async function verify() {
    console.log("🕵️ STARTING CALIBRATION INTEGRITY CHECK...");

    // 1. SETUP MOCK
    const mockProfile: LearnerProfile = {
        id: "l-001",
        name: "Test Diver",
        currentGrade: 5,
        masteryMap: new Map(),
        domainLevels: { literacy: 1, numeracy: 1, science: 1, social: 1, sel: 1, career: 1 },
        cognitiveState: { focusLevel: 100, frustrationLevel: 0, energyLevel: 100, currentZPD: 0.2 },
        interests: [],
        learningStyle: 'mixed',
        goals: [],
        isCalibrated: false,
        confidence: 15,
        unlockedTasks: [],
        version: 1,
        completedMissions: [],
        genesisPoints: 0
    };

    const actor = { id: 'dev-001', isAdmin: true };

    try {
        console.log("⚡ EXECUTING PROTOCOL...");
        const report = CalibrationService.runCalibration(mockProfile, {
            grade: 8,
            domain: 'Design',
            style: 'Visual'
        }, actor, 1);

        console.log("✅ PROTOCOL EXECUTED. ASSERTING RESULTS...");

        const expectedTasks = ['task-training-onboarding', 'task-skill-assessment'];
        const hasTierZero = expectedTasks.every(t => mockProfile.unlockedTasks.includes(t));
        const onlyTierZero = mockProfile.unlockedTasks.length === 2;

        if (mockProfile.confidence !== 85) throw new Error(`CONFIDENCE_FAILURE: Expected 85, got ${mockProfile.confidence}`);
        if (!hasTierZero) throw new Error("SOLVENCY_GUARD_FAILURE: Tier 0 tasks missing");
        if (!onlyTierZero) throw new Error("SOLVENCY_GUARD_FAILURE: Illegal tasks detected in unlock list");
        if (mockProfile.version !== 2) throw new Error(`VERSION_FAILURE: Expected 2, got ${mockProfile.version}`);

        console.log("\n💎 VERIFICATION SUCCESS:");
        console.log(`   - TraceID: ${report.traceId}`);
        console.log(`   - Final Confidence: ${mockProfile.confidence}%`);
        console.log(`   - Tasks Unlocked: ${mockProfile.unlockedTasks.join(', ')}`);
        console.log(`   - Profile Version: v${mockProfile.version}`);

        process.exit(0);
    } catch (err: any) {
        console.error("\n❌ VERIFICATION FAILED:");
        console.error(`   Reason: ${err.message}`);
        process.exit(1);
    }
}

verify();
