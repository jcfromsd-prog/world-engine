
// ============================================================================
// WORLD ENGINE: KNOWLEDGE GRAPH
// ============================================================================
// The "Map" of all learning objectives from Grade 1 through Grade 12.
// Organized as a Directed Acyclic Graph (DAG) where nodes are skills and edges are prerequisites.
// Based on: docs/ARCHITECTURE_2026.md
// ============================================================================

import type { SubjectDomain, GradeLevel } from './LearnerModel';

// ============================================================================
// SPIRAL FRAMEWORK TYPES (v9.3)
// ============================================================================

/** The 5 developmental tiers from the Spiral Framework */
export type SpiralTier = 'SPROUTS' | 'BUILDERS' | 'TRAILBLAZERS' | 'EXPLORERS' | 'VOYAGERS';

/** Spiral Depth Index: 0=Concrete → 4=Systems Integration */
export type SDI = 0 | 1 | 2 | 3 | 4;

/** Bloom's Taxonomy levels */
export type BloomLevel = 'REMEMBER' | 'UNDERSTAND' | 'APPLY' | 'ANALYZE' | 'EVALUATE' | 'CREATE';

/** The cognitive verb associated with each tier */
export const TIER_VERB: Record<SpiralTier, string> = {
    SPROUTS: 'OBSERVE',
    BUILDERS: 'MODEL',
    TRAILBLAZERS: 'INFER',
    EXPLORERS: 'ABSTRACT',
    VOYAGERS: 'INTEGRATE'
};

/** The archetype associated with each tier */
export const TIER_ARCHETYPE: Record<SpiralTier, string> = {
    SPROUTS: 'Naturalist',
    BUILDERS: 'Engineer',
    TRAILBLAZERS: 'Investigator',
    EXPLORERS: 'Navigator',
    VOYAGERS: 'Architect'
};

/** Grade range for each tier */
export const TIER_GRADE_RANGE: Record<SpiralTier, [number, number]> = {
    SPROUTS: [1, 2],
    BUILDERS: [3, 5],
    TRAILBLAZERS: [6, 8],
    EXPLORERS: [9, 12],
    VOYAGERS: [13, 16]
};

export interface KnowledgeNode {
    id: string;             // unique ID (e.g., "math.g1.addition.single_digit")
    title: string;          // Human-readable title
    domain: SubjectDomain;
    gradeLevel: GradeLevel;

    // Connections
    prerequisites: string[]; // List of IDs that MUST be mastered first
    unlocks: string[];       // List of IDs that this node unlocks

    // Metadata
    description: string;
    standardRef?: string;    // Common Core / State Standard (e.g., "CCSS.MATH.CONTENT.1.OA.A.1")
    tags: string[];          // e.g., "addition", "phonics", "shapes"

    // Content Weight
    difficulty: number;      // 0.0 - 1.0 (relative to grade level)
    estimatedTime: number;   // Minutes to complete

    // ══════════════════════════════════════════════════════════
    // SPIRAL FRAMEWORK (v9.3)
    // ══════════════════════════════════════════════════════════

    /** Developmental tier: SPROUTS → VOYAGERS */
    tier: SpiralTier;

    /** Spiral Depth Index: 0=Concrete manipulation → 4=Systems integration */
    sdi: SDI;

    /** Bloom's Taxonomy level */
    bloomLevel: BloomLevel;

    /** The real-world phenomenon that anchors this task (NGSS Phenomenon-First) */
    phenomenon: string;

    /** Why this task exists pedagogically — logged for every AI suggestion */
    pedagogicalWhy: string;

    /** If true, content claims standard alignment and MUST be RAG-verified */
    ragRequired: boolean;
}

export class KnowledgeGraph {
    private nodes: Map<string, KnowledgeNode>;
    private adjacencyList: Map<string, string[]>; // Mapping node -> unlocked nodes
    private reverseAdjacencyList: Map<string, string[]>; // Mapping node -> prerequisites

    constructor() {
        this.nodes = new Map();
        this.adjacencyList = new Map();
        this.reverseAdjacencyList = new Map();
    }

    public addNode(node: KnowledgeNode): void {
        this.nodes.set(node.id, node);
        if (!this.adjacencyList.has(node.id)) this.adjacencyList.set(node.id, []);
        if (!this.reverseAdjacencyList.has(node.id)) this.reverseAdjacencyList.set(node.id, []);

        // Register Prereqs
        node.prerequisites.forEach(prereqId => {
            // Prereq -> This Node
            if (!this.adjacencyList.has(prereqId)) this.adjacencyList.set(prereqId, []);
            this.adjacencyList.get(prereqId)?.push(node.id);

            // This Node -> Prereq
            this.reverseAdjacencyList.get(node.id)?.push(prereqId);
        });
    }

    public getNode(id: string): KnowledgeNode | undefined {
        return this.nodes.get(id);
    }

    /**
     * Determine what is "Unlocked" based on mastered nodes.
     * A node is unlocked if ALL its prerequisites are in the "mastered" set.
     */
    public getUnlockedNodes(masteredNodeIds: Set<string>): KnowledgeNode[] {
        const unlocked: KnowledgeNode[] = [];

        this.nodes.forEach(node => {
            // If already mastered, skip
            if (masteredNodeIds.has(node.id)) return;

            // Check if all prereqs are met
            const prereqs = this.reverseAdjacencyList.get(node.id) || [];
            const allPrereqsMet = prereqs.every(id => masteredNodeIds.has(id));

            if (allPrereqsMet) {
                unlocked.push(node);
            }
        });

        return unlocked;
    }

    /**
     * Get nodes by domain and grade level
     */
    public getNodesByGrade(grade: GradeLevel, domain?: SubjectDomain): KnowledgeNode[] {
        const result: KnowledgeNode[] = [];
        this.nodes.forEach(node => {
            if (node.gradeLevel === grade) {
                if (!domain || node.domain === domain) {
                    result.push(node);
                }
            }
        });
        return result;
    }
}

// ============================================================================
// SEED DATA (Example Subset)
// ============================================================================
// Tagged per v9.3: [Tier] | [SDI] | [Bloom's] | [Why] | [RAG: Y/N]
// Foundations (Grade 1-2) — SPROUTS Tier | SDI 0 (Concrete) | Verb: OBSERVE
export const SEED_GRAPH = new KnowledgeGraph();

// GRADE 1 - MATH
// [SPROUTS | SDI 0 | REMEMBER | Why: Number sense is the prerequisite for all arithmetic | RAG: Y]
SEED_GRAPH.addNode({
    id: "math.g1.number_sense.counting_100",
    title: "Counting to 100",
    domain: "numeracy",
    gradeLevel: 1,
    prerequisites: [],
    unlocks: ["math.g1.addition.single_digit"],
    description: "Count to 100 by ones and tens.",
    standardRef: "CCSS.MATH.CONTENT.1.NBT.A.1",
    tags: ["counting", "numbers"],
    difficulty: 0.2,
    estimatedTime: 10,
    // SPIRAL FRAMEWORK (v9.3)
    tier: 'SPROUTS',
    sdi: 0,
    bloomLevel: 'REMEMBER',
    phenomenon: "A jar of marbles on the teacher's desk — how many are there?",
    pedagogicalWhy: "Number sense is the concrete foundation for all arithmetic. Children must physically count objects before abstracting to symbols.",
    ragRequired: true
});

// [SPROUTS | SDI 0 | APPLY | Why: Builds on counting to introduce combining quantities | RAG: Y]
SEED_GRAPH.addNode({
    id: "math.g1.addition.single_digit",
    title: "Simple Addition (1-10)",
    domain: "numeracy",
    gradeLevel: 1,
    prerequisites: ["math.g1.number_sense.counting_100"],
    unlocks: ["math.g1.subtraction.single_digit", "math.g1.addition.word_problems"],
    description: "Add two single-digit numbers using concrete objects.",
    standardRef: "CCSS.MATH.CONTENT.1.OA.C.6",
    tags: ["addition", "arithmetic"],
    difficulty: 0.3,
    estimatedTime: 15,
    // SPIRAL FRAMEWORK (v9.3)
    tier: 'SPROUTS',
    sdi: 0,
    bloomLevel: 'APPLY',
    phenomenon: "Two groups of blocks on the table — push them together and count the total.",
    pedagogicalWhy: "Addition is the first operation. Concrete manipulation (pushing blocks together) builds the motor-cognitive link before symbolic representation.",
    ragRequired: true
});

// GRADE 1 - LITERACY
// [SPROUTS | SDI 0 | REMEMBER | Why: Phonemic awareness precedes decoding | RAG: Y]
SEED_GRAPH.addNode({
    id: "ela.g1.phonics.short_vowels",
    title: "Short Vowel Sounds",
    domain: "literacy",
    gradeLevel: 1,
    prerequisites: [],
    unlocks: ["ela.g1.reading.cvc_words"],
    description: "Identify short a, e, i, o, u sounds in spoken words.",
    standardRef: "CCSS.ELA-LITERACY.RF.1.2.A",
    tags: ["phonics", "reading"],
    difficulty: 0.2,
    estimatedTime: 10,
    // SPIRAL FRAMEWORK (v9.3)
    tier: 'SPROUTS',
    sdi: 0,
    bloomLevel: 'REMEMBER',
    phenomenon: "Listen to the sounds animals make — the 'a' in 'cat', the 'i' in 'pig'.",
    pedagogicalWhy: "Phonemic awareness is the strongest predictor of early reading success. Children must hear and isolate sounds before decoding print.",
    ragRequired: true
});

// [SPROUTS | SDI 0 | APPLY | Why: Decoding is the bridge from sound to symbol | RAG: Y]
SEED_GRAPH.addNode({
    id: "ela.g1.reading.cvc_words",
    title: "Reading CVC Words",
    domain: "literacy",
    gradeLevel: 1,
    prerequisites: ["ela.g1.phonics.short_vowels"],
    unlocks: ["ela.g1.reading.simple_sentences"],
    description: "Read consonant-vowel-consonant words like 'cat', 'pig', 'sun'.",
    standardRef: "CCSS.ELA-LITERACY.RF.1.3.B",
    tags: ["reading", "vocabulary"],
    difficulty: 0.3,
    estimatedTime: 15,
    // SPIRAL FRAMEWORK (v9.3)
    tier: 'SPROUTS',
    sdi: 0,
    bloomLevel: 'APPLY',
    phenomenon: "Labels on objects in the classroom — the child reads 'cup', 'pen', 'box'.",
    pedagogicalWhy: "CVC decoding is the bridge from auditory phonemic awareness to visual symbol reading. This is the first proof of literacy competence.",
    ragRequired: true
});
