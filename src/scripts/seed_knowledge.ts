import 'dotenv/config';
import { VectorStore } from '../services/VectorStore';

// =============================================================================
// THE GOLDEN RECORD: Initial Truth Seeds for the AI
// =============================================================================
// Run this script to populate the vector database with verifiable scientific facts.
// Command: npx vite-node src/scripts/seed_knowledge.ts
// =============================================================================

const KNOWLEDGE_PACK = [
    // PHYSICS (Builders / HS)
    {
        content: "Newton's Third Law: For every action, there is an equal and opposite reaction. Forces always come in pairs.",
        metadata: {
            source: "NGSS-HS-PS2-1",
            tier: "Builder",
            domain: "Physics",
            topic: "Forces and Motion"
        }
    },
    // BIOLOGY (Sprouts / Elementary)
    {
        content: "Photosynthesis: The process by which plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar.",
        metadata: {
            source: "NGSS-HS-LS1-5",
            tier: "Sprouts",
            domain: "Biology",
            topic: "Energy Transfer"
        }
    },
    // EARTH SCIENCE (Explorers / Middle School)
    {
        content: "The Water Cycle: Water evaporates from the surface, condenses into clouds, and falls again to the surface as precipitation.",
        metadata: {
            source: "NGSS-MS-ESS2-4",
            tier: "Explorer",
            domain: "Earth Science",
            topic: "Systems"
        }
    },
    // CHEMISTRY (Voyagers / Advanced)
    {
        content: "Covalent Bonding: A chemical bond that involves the sharing of electron pairs between atoms.",
        metadata: {
            source: "NGSS-HS-PS1-2",
            tier: "Voyager",
            domain: "Chemistry",
            topic: "Atomic Structure"
        }
    },
    // CRITICAL THINKING (Universal)
    {
        content: "Scientific Method: A systematic procedure that consists of systematic observation, measurement, and experiment, and the formulation, testing, and modification of hypotheses.",
        metadata: {
            source: "Universal Scientific Practice",
            tier: "All",
            domain: "Meta-Science",
            topic: "Methodology"
        }
    }
];

async function seed() {
    console.log("🌱 Seeding Knowledge Graph...");

    // Check if we have an API key (light check)
    // Note: In tsx environment, we rely on process.env (loaded via dotenv)
    if (!process.env.VITE_OPENAI_API_KEY) {
        console.warn("⚠️  WARNING: No OpenAI API Key found. Ingestion will verify flow only.");
    }

    let successCount = 0;

    for (const item of KNOWLEDGE_PACK) {
        try {
            await VectorStore.ingest(item.content, item.metadata);
            successCount++;
        } catch (err: any) {
            console.error(`❌ Failed to ingest: ${item.metadata.source}`, err.message);
        }
    }

    console.log(`\n✅ Seeding Complete. Ingested ${successCount}/${KNOWLEDGE_PACK.length} standards.`);

    if (successCount === 0) {
        console.log("ℹ️  Note: Without an API Key, vectors are not generated/stored. The system will use fallbacks.");
    } else {
        console.log("🧠 The Content Brain is now active.");
    }
}

// Execute
seed().catch(console.error);
