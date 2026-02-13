
import * as fs from 'fs';
import * as path from 'path';

/**
 * RESTORE STATE UTILITY
 * Usage: npx tsx src/scripts/restore-state.ts <path_to_snapshot.json>
 * 
 * In a real production environment (Postgres), this would execute a massive UPDATE/INSERT transaction.
 * For this In-Memory prototype, it validates the snapshot integrity and prepares it for ingestion.
 */

const snapshotPath = process.argv[2];

if (!snapshotPath) {
    console.error("❌ Usage: npx tsx src/scripts/restore-state.ts <path_to_snapshot.json>");
    process.exit(1);
}

if (!fs.existsSync(snapshotPath)) {
    console.error(`❌ Snapshot file not found: ${snapshotPath}`);
    process.exit(1);
}

try {
    console.log(`\n🔄 INITIATING SYSTEM RESTORE...`);
    console.log(`   📂 Source: ${snapshotPath}`);

    const rawData = fs.readFileSync(snapshotPath, 'utf-8');
    const profile = JSON.parse(rawData);

    // Schema Validation (Lightweight)
    if (!profile.id || !profile.masteryMap) {
        throw new Error("Invalid Snapshot Schema: Missing 'id' or 'masteryMap'.");
    }

    // MAP Rehydration
    // In JSON, Maps are stored as arrays of entries [[key, val], [key, val]]
    const masteryCount = Array.isArray(profile.masteryMap) ? profile.masteryMap.length : 0;

    console.log(`   👤 User ID: ${profile.id}`);
    console.log(`   📚 Grade Level: ${profile.currentGrade}`);
    console.log(`   🧠 Knowledge Nodes: ${masteryCount}`);

    console.log(`\n✅ SNAPSHOT INTEGRITY VERIFIED.`);
    console.log(`   To apply this to the running instance, restart the server with:`);
    console.log(`   INIT_SNAPSHOT=${path.resolve(snapshotPath)} npm run dev`);

} catch (error: any) {
    console.error(`❌ RESTORE FAILED: ${error.message}`);
    process.exit(1);
}
