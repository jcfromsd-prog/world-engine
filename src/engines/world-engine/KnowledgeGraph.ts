
// ============================================================================
// WORLD ENGINE: KNOWLEDGE GRAPH
// ============================================================================
// The "Map" of all learning objectives from Grade 1 through Grade 12.
// Organized as a Directed Acyclic Graph (DAG) where nodes are skills and edges are prerequisites.
// Based on: docs/ARCHITECTURE_2026.md
// ============================================================================

import type { SubjectDomain, GradeLevel } from './LearnerModel';

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
    /**
     * Get IDs of nodes unlocked by a specific node (Children)
     */
    public getConnectedNodes(nodeId: string): string[] {
        return this.adjacencyList.get(nodeId) || [];
    }
}

// ============================================================================
// SEED DATA (Example Subset)
// ============================================================================
// Foundations (Grade 1-2)
export const SEED_GRAPH = new KnowledgeGraph();

// GRADE 1 - MATH
SEED_GRAPH.addNode({
    id: "math.g1.number_sense.counting_100",
    title: "Counting to 100",
    domain: "numeracy",
    gradeLevel: 1,
    prerequisites: [], // Foundation
    unlocks: ["math.g1.addition.single_digit"],
    description: "Count to 100 onese and tens.",
    standardRef: "CCSS.MATH.CONTENT.1.NBT.A.1",
    tags: ["counting", "numbers"],
    difficulty: 0.2,
    estimatedTime: 10
});

SEED_GRAPH.addNode({
    id: "math.g1.addition.single_digit",
    title: "Simple Addition (1-10)",
    domain: "numeracy",
    gradeLevel: 1,
    prerequisites: ["math.g1.number_sense.counting_100"],
    unlocks: ["math.g1.subtraction.single_digit", "math.g1.addition.word_problems"],
    description: "Add two single-digit numbers.",
    standardRef: "CCSS.MATH.CONTENT.1.OA.C.6",
    tags: ["addition", "arithmetic"],
    difficulty: 0.3,
    estimatedTime: 15
});

// GRADE 1 - LITERACY
SEED_GRAPH.addNode({
    id: "ela.g1.phonics.short_vowels",
    title: "Short Vowel Sounds",
    domain: "literacy",
    gradeLevel: 1,
    prerequisites: [], // Foundation
    unlocks: ["ela.g1.reading.cvc_words"],
    description: "Identify short a, e, i, o, u sounds.",
    standardRef: "CCSS.ELA-LITERACY.RF.1.2.A",
    tags: ["phonics", "reading"],
    difficulty: 0.2,
    estimatedTime: 10
});

SEED_GRAPH.addNode({
    id: "ela.g1.reading.cvc_words",
    title: "Reading CVC Words",
    domain: "literacy",
    gradeLevel: 1,
    prerequisites: ["ela.g1.phonics.short_vowels"],
    unlocks: ["ela.g1.reading.simple_sentences"],
    description: "Read consonant-vowel-consonant words like 'cat', 'pig'.",
    standardRef: "CCSS.ELA-LITERACY.RF.1.3.B",
    tags: ["reading", "vocabulary"],
    difficulty: 0.3,
    estimatedTime: 15
});

// GRADE 5 - MATH (Entry Point)
SEED_GRAPH.addNode({
    id: "math.g5.fractions.intro",
    title: "Understanding Fractions",
    domain: "numeracy",
    gradeLevel: 5,
    prerequisites: [], // Entry node for G5 (assumes G1-4 mastery)
    unlocks: ["math.g5.fractions.addition"],
    description: "Understand fractions as parts of a whole.",
    standardRef: "CCSS.MATH.CONTENT.5.NF.A.1",
    tags: ["fractions", "division"],
    difficulty: 0.5,
    estimatedTime: 20
});

// GRADE 5 - SCIENCE (Entry Point)
SEED_GRAPH.addNode({
    id: "sci.g5.ecosystems.food_webs",
    title: "Food Webs & Energy",
    domain: "science",
    gradeLevel: 5,
    prerequisites: [],
    unlocks: ["sci.g5.ecosystems.decomposers"],
    description: "Trace the flow of energy through an ecosystem.",
    standardRef: "NGSS.5-PS3-1",
    tags: ["biology", "nature"],
    difficulty: 0.4,
    estimatedTime: 25
});

// GRADE 5 - MATH (Depth 1)
SEED_GRAPH.addNode({
    id: "math.g5.fractions.addition",
    title: "Adding Like Fractions",
    domain: "numeracy",
    gradeLevel: 5,
    prerequisites: ["math.g5.fractions.intro"], // Depth 1
    unlocks: [], // Leaf for now
    description: "Add fractions with the same denominator.",
    standardRef: "CCSS.MATH.CONTENT.5.NF.A.1",
    tags: ["fractions", "addition"],
    difficulty: 0.6,
    estimatedTime: 20
});

// GRADE 5 - SCIENCE (Depth 1)
SEED_GRAPH.addNode({
    id: "sci.g5.ecosystems.decomposers",
    title: "Decomposers & Nutrient Cycling",
    domain: "science",
    gradeLevel: 5,
    prerequisites: ["sci.g5.ecosystems.food_webs"], // Depth 1
    unlocks: [], // Leaf for now
    description: "Understand the role of decomposers in recycling nutrients.",
    standardRef: "NGSS.5-LS2-1",
    tags: ["biology", "recycling"],
    difficulty: 0.5,
    estimatedTime: 20
});
