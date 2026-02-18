import 'dotenv/config';
import { MissionGenerator } from '../engines/MissionGenerator';
import type { LearnerProfile } from '../engines/world-engine/LearnerModel';
import type { SkillCategory } from '../engine/types';

// =============================================================================
// SYNAPSE VERIFICATION: Testing the RAG Pipeline
// =============================================================================
// Run: npx tsx src/scripts/test_brain.ts
// =============================================================================

const MOCK_PROFILE: LearnerProfile = {
    id: 'test-user',
    name: 'Test Subject',
    currentGrade: 10,
    currentTier: 'BUILDERS',
    masteryMap: new Map(),
    domainLevels: {
        literacy: 2,
        numeracy: 2,
        science: 2,
        social: 1,
        sel: 1,
        career: 1
    },
    cognitiveState: {
        focusLevel: 1,
        frustrationLevel: 0,
        energyLevel: 1,
        currentZPD: 1
    },
    interests: ['Physics', 'Space'],
    learningStyle: 'visual',
    goals: ['Learn Physics'],
    traits: new Map(),
    verifiedCompetencies: [],
    completedMissions: [],
    activeContracts: [],
    totalEarnings: 0,
    calibrationScore: 50
};

async function testBrain() {
    console.log("🧠 Testing Content Brain (RAG Pipeline)...");
    console.log(`👤 Profile: ${MOCK_PROFILE.currentTier} / Interest: ${MOCK_PROFILE.interests[0]}`);

    try {
        const mission = await MissionGenerator.generateMission(MOCK_PROFILE, 'Physics');

        console.log("\n✅ Mission Generated Successfully:");
        console.log(`   Title: "${mission.metadata.title}"`);
        console.log(`   RAG Verified: ${mission.metadata.ragVerified}`);
        console.log(`   Source Standard: ${mission.metadata.sourceStandard}`);

        console.log("\n📜 Grounding Source (The Truth):");
        console.log("   ---------------------------------------------------");
        console.log(`   "${mission.metadata.groundingSource}"`);
        console.log("   ---------------------------------------------------");

        if (mission.metadata.ragVerified && mission.metadata.groundingSource) {
            console.log("\n🎉 TEST PASSED: The AI is grounded in truth.");
        } else {
            console.error("\n❌ TEST FAILED: RAG verification missing.");
            process.exit(1);
        }

    } catch (err: any) {
        console.error("\n💥 CRITICAL FAILURE:", err.message);
        process.exit(1);
    }
}

testBrain();
