
import { CalibrationService } from '../src/services/CalibrationService';
import { LearnerProfile } from '../src/engines/world-engine/LearnerModel';

async function runVerification() {
    console.log("🕵️ STARTING CALIBRATION VERIFICATION PROTOCOL...");

    // 1. Setup Mock Profile
    const mockProfile: LearnerProfile = {
        id: "test-user-001",
        name: "Test Contributor",
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

    console.log("📊 INITIAL STATE:");
    console.log(`   - Is Calibrated: ${mockProfile.isCalibrated}`);
    console.log(`   - Confidence: ${mockProfile.confidence}%`);
    console.log(`   - Unlocked Tasks: ${mockProfile.unlockedTasks.length}`);

    // 2. Execute Calibration
    console.log("\n⚡ EXECUTING CALIBRATION SERVICE...");
    const report = CalibrationService.runCalibration(mockProfile, {
        grade: 10,
        domain: 'Code',
        style: 'Logic'
    });

    // 3. Assert Changes
    console.log("\n✅ VERIFYING RESULTS:");
    console.log(`   - TraceID: ${report.traceId}`);
    console.log(`   - New Confidence: ${mockProfile.confidence}% (Expected: 85%)`);
    console.log(`   - Is Calibrated: ${mockProfile.isCalibrated} (Expected: true)`);
    console.log(`   - New Grade: ${mockProfile.currentGrade} (Expected: 10)`);
    console.log(`   - Unlocked Tasks: ${mockProfile.unlockedTasks.length} (Expected: 2)`);

    const errors: string[] = [];
    if (mockProfile.confidence !== 85) errors.push("Confidence boost failed");
    if (mockProfile.isCalibrated !== true) errors.push("Calibration flag failed");
    if (mockProfile.currentGrade !== 10) errors.push("Grade update failed");
    if (mockProfile.unlockedTasks.length !== 2) errors.push("Task unlock failed");

    if (errors.length > 0) {
        console.error("\n❌ VERIFICATION FAILED:");
        errors.forEach(e => console.error(`   - ${e}`));
        process.exit(1);
    } else {
        console.log("\n💎 CALIBRATION VERIFIED. Identity Protocol is stable.");
        process.exit(0);
    }
}

runVerification();
