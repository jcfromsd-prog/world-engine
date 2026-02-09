
import { WorldEngine } from '../engines/world-engine/WorldEngine';
import { SEED_GRAPH } from '../engines/world-engine/KnowledgeGraph';
import { LearnerProfile } from '../engines/world-engine/LearnerModel';
import * as fs from 'fs';
import * as path from 'path';

// --- MOCK PROFILE FOR VERIFICATION ---
const MOCK_PROFILE: LearnerProfile = {
    id: "verify-user-01",
    name: "Verification Bot",
    currentGrade: 1,
    masteryMap: new Map(),
    domainLevels: { literacy: 1.0, numeracy: 1.0, science: 1.0, social: 1.0, sel: 1.0, career: 1.0 },
    cognitiveState: { focusLevel: 100, frustrationLevel: 0, energyLevel: 100, currentZPD: 0.2 },
    interests: ["Testing"],
    learningStyle: 'visual',
    goals: ["Verify Reseed"],
    completedMissions: [],
    genesisPoints: 0
};

// --- CONFIG ---
const TARGET_GRADE = 5;
const EXPECTED_MIN_DELTA = 3; // Entry node + at least 1 child per domain (we added 2 domains)
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-');
const BACKUP_ROOT = fs.existsSync('D:/') ? 'D:/Backups/WorldEngine_Verify_' + TIMESTAMP : './.backup/WorldEngine_Verify_' + TIMESTAMP;

async function runVerification() {
    console.log(`\n🕵️ STARTING RESEED VERIFICATION PROTOCOL (TraceID: ${crypto.randomUUID().slice(0, 8)})`);

    // 1. Initialize Engine
    const engine = new WorldEngine(MOCK_PROFILE, SEED_GRAPH);
    const initialSize = engine.getProfile().masteryMap.size;
    console.log(`   📊 Initial Mastery Size: ${initialSize}`);

    // 2. Create Snapshot
    if (!fs.existsSync(BACKUP_ROOT)) {
        fs.mkdirSync(BACKUP_ROOT, { recursive: true });
    }
    const snapshotPath = path.join(BACKUP_ROOT, 'pre_reseed_snapshot.json');
    // Convert Map to Array for JSON
    const serializableProfile = {
        ...MOCK_PROFILE,
        masteryMap: Array.from(MOCK_PROFILE.masteryMap.entries())
    };
    fs.writeFileSync(snapshotPath, JSON.stringify(serializableProfile, null, 2));
    console.log(`   💾 Pre-flight Snapshot Saved: ${snapshotPath}`);

    // 3. Execute Reseed
    console.log(`   ⚠️ Executing resetProgress(Grade ${TARGET_GRADE})...`);
    engine.resetProgress(TARGET_GRADE);

    // 4. Verify Delta
    const finalSize = engine.getProfile().masteryMap.size;
    const delta = finalSize - initialSize;
    console.log(`   📊 Final Mastery Size: ${finalSize}`);
    console.log(`   📈 DELTA: +${delta} Nodes Unlocked`);

    // 5. Assertions
    if (delta <= 0) {
        console.error(`   ❌ CRITICAL FAILURE: No nodes were unlocked. The swarm has no runway!`);
        process.exit(1);
    }

    if (delta < EXPECTED_MIN_DELTA) {
        console.warn(`   ⚠️ WARNING: Delta (+${delta}) is lower than expected minimum (+${EXPECTED_MIN_DELTA}). Check graph connectivity.`);
    } else {
        console.log(`   ✅ SUCCESS: Recursive Subtree Unlock Verified.`);
    }

    // List Unlocked Nodes for Audit
    console.log(`\n   📝 Unlocked Node IDs:`);
    const masteredIds = engine.getProfile().masteryMap.keys();
    for (const id of masteredIds) {
        console.log(`      - ${id}`);
    }

    console.log(`\nRef: ${BACKUP_ROOT}`);
}

runVerification().catch(e => {
    console.error(e);
    process.exit(1);
});
