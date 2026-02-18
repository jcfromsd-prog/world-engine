/* ==========================================================================
   ARTIFACT REGISTRY: Verified Competence System (v9.3)
   ==========================================================================
   SOUL CONSTRAINT: No badges, no coins, no "Level Up" icons.
   
   An "Artifact of Knowledge" is a verifiable proof that the learner 
   CAN DO something real. It is the 3D representation of a proven skill.
   
   Examples:
   - "Verified Phonemic Decoder" — Tier: SPROUTS, SDI: 0
   - "Structural Truss Modeler" — Tier: BUILDERS, SDI: 1
   - "Chemical Variable Isolator" — Tier: TRAILBLAZERS, SDI: 2
   - "Symbolic Growth Modeler" — Tier: EXPLORERS, SDI: 3
   - "Ecosystem Systems Architect" — Tier: VOYAGERS, SDI: 4
   
   Pedagogical Why: We sell competence and the proof of it. 
   A child's avatar grows a neural network graph of REAL skills, not coins.
   ========================================================================== */

import type { SpiralTier, SDI, BloomLevel } from '../engines/world-engine/KnowledgeGraph';
import type { SubjectDomain } from '../engines/world-engine/LearnerModel';

// ============================================================================
// TYPES
// ============================================================================

/** Category of the artifact — what domain of human capability it represents */
export type ArtifactCategory =
    | 'LITERACY'        // Reading, Writing, Communication
    | 'NUMERACY'        // Mathematical Reasoning
    | 'SCIENTIFIC'      // Empirical Investigation
    | 'CIVIC'           // Historical and Civic Understanding
    | 'PROFESSIONAL';   // Career-Ready Competencies (NACE-aligned)

/** How rare/advanced this artifact is — maps directly to tier progression */
export type ArtifactSignificance =
    | 'FOUNDATION'      // SPROUTS-level proof (everyone starts here)
    | 'STRUCTURAL'      // BUILDERS-level proof (cause-and-effect demonstrated)
    | 'ANALYTICAL'      // TRAILBLAZERS-level proof (hidden variables mastered)
    | 'ABSTRACT'        // EXPLORERS-level proof (symbolic reasoning proven)
    | 'SYSTEMIC';       // VOYAGERS-level proof (systems integration demonstrated)

/**
 * An Artifact of Knowledge.
 * 
 * NOT a badge. NOT a coin. NOT a "Level Up" icon.
 * It is a portable, auditable proof of demonstrated competence.
 * 
 * Think of it as a "diploma fragment" — a specific, verifiable skill
 * that accumulates into a complete professional profile.
 */
export interface KnowledgeArtifact {
    id: string;
    title: string;                   // "Verified Phonemic Decoder"
    description: string;             // What this proves the learner can do
    category: ArtifactCategory;
    significance: ArtifactSignificance;

    // Spiral Framework alignment
    tier: SpiralTier;
    sdi: SDI;
    bloomLevel: BloomLevel;
    domain: SubjectDomain;

    // Verification criteria
    verification: {
        type: 'MASTERY_THRESHOLD' | 'ASSESSMENT_PASS' | 'PORTFOLIO_REVIEW' | 'PEER_VERIFIED';
        threshold: number;           // e.g., 0.8 mastery score required
        requiredNodes: string[];     // KnowledgeNode IDs that must be mastered
        description: string;         // Human-readable verification requirement
    };

    // Metadata
    gradeBand: string;               // "K-2", "3-5", "6-8", "9-12", "College"
    standardRef?: string;            // CCSS/NGSS/NACE standard
    phenomenon: string;              // The real-world anchor for this proof
    pedagogicalWhy: string;          // Why this artifact matters

    // Visual representation (for the Neural Avatar)
    visualModel: string;             // Reference to 3D asset or SVG path
}

// ============================================================================
// ARTIFACT REGISTRY
// ============================================================================

export const ARTIFACT_REGISTRY: KnowledgeArtifact[] = [
    // ═══════════════════════════════════════════════════════════════════════════
    // SPROUTS (K-2) — FOUNDATION Artifacts | SDI 0 | Verb: OBSERVE
    // ═══════════════════════════════════════════════════════════════════════════

    // LITERACY — SPROUTS
    {
        id: "artifact_phonemic_decoder",
        title: "Verified Phonemic Decoder",
        description: "Can hear, isolate, and reproduce individual speech sounds (phonemes) in spoken words.",
        category: "LITERACY",
        significance: "FOUNDATION",
        tier: "SPROUTS",
        sdi: 0,
        bloomLevel: "REMEMBER",
        domain: "literacy",
        verification: {
            type: "MASTERY_THRESHOLD",
            threshold: 0.8,
            requiredNodes: ["ela.g1.phonics.short_vowels"],
            description: "Score ≥80% accuracy on phoneme isolation assessment."
        },
        gradeBand: "K-2",
        standardRef: "CCSS.ELA-LITERACY.RF.1.2.A",
        phenomenon: "A child hears the sounds in 'cat' and can tell you: /k/ /æ/ /t/.",
        pedagogicalWhy: "Phonemic awareness is the #1 predictor of early reading success (NRP, 2000). Without this, decoding is impossible.",
        visualModel: "artifact_sound_wave"
    },
    {
        id: "artifact_cvc_reader",
        title: "CVC Word Reader",
        description: "Can decode and fluently read consonant-vowel-consonant words from print.",
        category: "LITERACY",
        significance: "FOUNDATION",
        tier: "SPROUTS",
        sdi: 0,
        bloomLevel: "APPLY",
        domain: "literacy",
        verification: {
            type: "MASTERY_THRESHOLD",
            threshold: 0.8,
            requiredNodes: ["ela.g1.phonics.short_vowels", "ela.g1.reading.cvc_words"],
            description: "Read 10 CVC words aloud with ≥80% accuracy."
        },
        gradeBand: "K-2",
        standardRef: "CCSS.ELA-LITERACY.RF.1.3.B",
        phenomenon: "Labels in the classroom: the child reads 'cup', 'pen', 'box' without help.",
        pedagogicalWhy: "CVC decoding is the bridge from auditory awareness to visual symbol reading. This is the first proof of independent literacy.",
        visualModel: "artifact_open_book"
    },

    // NUMERACY — SPROUTS
    {
        id: "artifact_number_sense",
        title: "Verified Number Sense",
        description: "Can count to 100 by ones and tens using concrete objects.",
        category: "NUMERACY",
        significance: "FOUNDATION",
        tier: "SPROUTS",
        sdi: 0,
        bloomLevel: "REMEMBER",
        domain: "numeracy",
        verification: {
            type: "MASTERY_THRESHOLD",
            threshold: 0.8,
            requiredNodes: ["math.g1.number_sense.counting_100"],
            description: "Count 100 objects accurately in two modalities (ones, tens)."
        },
        gradeBand: "K-2",
        standardRef: "CCSS.MATH.CONTENT.1.NBT.A.1",
        phenomenon: "A jar of marbles — 'How many?' The child counts by grouping into tens.",
        pedagogicalWhy: "Number sense is the prerequisite for all arithmetic. Concrete counting builds the motor-cognitive link to quantity.",
        visualModel: "artifact_abacus"
    },
    {
        id: "artifact_concrete_addition",
        title: "Concrete Addition Operator",
        description: "Can add two single-digit numbers using physical objects and explain the process.",
        category: "NUMERACY",
        significance: "FOUNDATION",
        tier: "SPROUTS",
        sdi: 0,
        bloomLevel: "APPLY",
        domain: "numeracy",
        verification: {
            type: "MASTERY_THRESHOLD",
            threshold: 0.8,
            requiredNodes: ["math.g1.number_sense.counting_100", "math.g1.addition.single_digit"],
            description: "Solve 10 single-digit addition problems using manipulatives with ≥80% accuracy."
        },
        gradeBand: "K-2",
        standardRef: "CCSS.MATH.CONTENT.1.OA.C.6",
        phenomenon: "Two piles of blocks — push together and count. 'How many now?'",
        pedagogicalWhy: "Addition through physical manipulation builds the constraint that math describes reality, not an abstract game.",
        visualModel: "artifact_building_blocks"
    },

    // SCIENTIFIC — SPROUTS
    {
        id: "artifact_weather_observer",
        title: "Weather Pattern Observer",
        description: "Can observe and record weather conditions over time, identifying basic patterns.",
        category: "SCIENTIFIC",
        significance: "FOUNDATION",
        tier: "SPROUTS",
        sdi: 0,
        bloomLevel: "REMEMBER",
        domain: "science",
        verification: {
            type: "PORTFOLIO_REVIEW",
            threshold: 0.8,
            requiredNodes: [],
            description: "Submit a 5-day weather journal with daily observations and drawings."
        },
        gradeBand: "K-2",
        standardRef: "NGSS-K-2-Earth",
        phenomenon: "Look outside every morning — what do you see? Sun, clouds, rain, wind.",
        pedagogicalWhy: "Systematic observation is the foundation of scientific thinking. Weather is universally accessible and immediately verifiable.",
        visualModel: "artifact_weather_vane"
    },

    // CIVIC — SPROUTS
    {
        id: "artifact_community_mapper",
        title: "Community Mapper",
        description: "Can identify and describe the roles of community helpers and local landmarks.",
        category: "CIVIC",
        significance: "FOUNDATION",
        tier: "SPROUTS",
        sdi: 0,
        bloomLevel: "UNDERSTAND",
        domain: "social",
        verification: {
            type: "PORTFOLIO_REVIEW",
            threshold: 0.8,
            requiredNodes: [],
            description: "Create a simple community map identifying 5+ community roles or landmarks."
        },
        gradeBand: "K-2",
        standardRef: "CA-HSS-K-2",
        phenomenon: "Walk through your neighborhood — who do you see working? What buildings are there?",
        pedagogicalWhy: "Understanding community structure is the concrete precursor to civic engagement and systems thinking.",
        visualModel: "artifact_neighborhood_map"
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // BUILDERS (3-5) — STRUCTURAL Artifacts | SDI 1 | Verb: MODEL
    // ═══════════════════════════════════════════════════════════════════════════

    {
        id: "artifact_narrative_builder",
        title: "Narrative Structure Builder",
        description: "Can construct a story with proper dialogue, character development, and sequential plot.",
        category: "LITERACY",
        significance: "STRUCTURAL",
        tier: "BUILDERS",
        sdi: 1,
        bloomLevel: "CREATE",
        domain: "literacy",
        verification: {
            type: "PORTFOLIO_REVIEW",
            threshold: 0.8,
            requiredNodes: [],
            description: "Submit 3 original narratives demonstrating character arc, dialogue, and resolution."
        },
        gradeBand: "3-5",
        standardRef: "NY-ELA-3-5-Writing",
        phenomenon: "Read a story and notice: 'The character changed from scared to brave. How did the author DO that?'",
        pedagogicalWhy: "Narrative construction requires modeling cause-and-effect in human behavior — the core of SDI 1 (cause/effect modeling).",
        visualModel: "artifact_story_blueprint"
    },
    {
        id: "artifact_fraction_modeler",
        title: "Fraction Modeler",
        description: "Can model, compare, and operate on fractions using visual representations.",
        category: "NUMERACY",
        significance: "STRUCTURAL",
        tier: "BUILDERS",
        sdi: 1,
        bloomLevel: "APPLY",
        domain: "numeracy",
        verification: {
            type: "MASTERY_THRESHOLD",
            threshold: 0.8,
            requiredNodes: [],
            description: "Solve 15 fraction problems using visual models (area, number line) with ≥80% accuracy."
        },
        gradeBand: "3-5",
        standardRef: "CCSS-MATH-3-5-NF",
        phenomenon: "Cut a pizza into 8 slices — if you eat 3, what fraction is left? Draw it.",
        pedagogicalWhy: "Fractions are where math transitions from counting to MODELING parts-of-wholes. This is the SDI 1 gateway to proportional reasoning.",
        visualModel: "artifact_fraction_wheel"
    },
    {
        id: "artifact_ecosystem_modeler",
        title: "Ecosystem Modeler",
        description: "Can model food chains, energy flow, and organism interdependence in an ecosystem.",
        category: "SCIENTIFIC",
        significance: "STRUCTURAL",
        tier: "BUILDERS",
        sdi: 1,
        bloomLevel: "ANALYZE",
        domain: "science",
        verification: {
            type: "PORTFOLIO_REVIEW",
            threshold: 0.8,
            requiredNodes: [],
            description: "Create a complete food web diagram for a local ecosystem with energy flow arrows."
        },
        gradeBand: "3-5",
        standardRef: "NGSS-3-5-LS2",
        phenomenon: "A dead tree in the forest — what happens to it? Where does the energy go?",
        pedagogicalWhy: "Ecosystems are the first system where children see that cause-and-effect is BIDIRECTIONAL — organisms affect each other.",
        visualModel: "artifact_food_web"
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // TRAILBLAZERS (6-8) — ANALYTICAL Artifacts | SDI 2 | Verb: INFER
    // ═══════════════════════════════════════════════════════════════════════════

    {
        id: "artifact_source_evaluator",
        title: "Source Credibility Evaluator",
        description: "Can evaluate information sources for credibility, bias, and relevance.",
        category: "LITERACY",
        significance: "ANALYTICAL",
        tier: "TRAILBLAZERS",
        sdi: 2,
        bloomLevel: "EVALUATE",
        domain: "literacy",
        verification: {
            type: "ASSESSMENT_PASS",
            threshold: 0.8,
            requiredNodes: [],
            description: "Correctly evaluate 10 sources (5 credible, 5 non-credible) with reasoning."
        },
        gradeBand: "6-8",
        standardRef: "CA-ELA-6-8",
        phenomenon: "Two articles about climate change — one from a scientist, one from a blog. Which is credible? How do you know?",
        pedagogicalWhy: "Source evaluation requires INFERRING hidden variables (author intent, funding, methodology) — the core of SDI 2.",
        visualModel: "artifact_magnifying_glass"
    },
    {
        id: "artifact_data_analyst",
        title: "Statistical Data Analyst",
        description: "Can collect, organize, and interpret data using statistical measures and visual representations.",
        category: "NUMERACY",
        significance: "ANALYTICAL",
        tier: "TRAILBLAZERS",
        sdi: 2,
        bloomLevel: "ANALYZE",
        domain: "numeracy",
        verification: {
            type: "ASSESSMENT_PASS",
            threshold: 0.8,
            requiredNodes: [],
            description: "Analyze 3 real-world data sets: calculate mean/median/mode, create graphs, and write conclusions."
        },
        gradeBand: "6-8",
        standardRef: "NY-MATH-6-8-Stats",
        phenomenon: "A table of school lunch choices over a month — what patterns emerge? What would you predict for next month?",
        pedagogicalWhy: "Statistics requires isolating variables in messy real-world data — the hallmark of SDI 2 (variable isolation).",
        visualModel: "artifact_bar_chart"
    },
    {
        id: "artifact_lab_experimenter",
        title: "Controlled Experiment Designer",
        description: "Can design and execute a controlled experiment with proper variable isolation.",
        category: "SCIENTIFIC",
        significance: "ANALYTICAL",
        tier: "TRAILBLAZERS",
        sdi: 2,
        bloomLevel: "CREATE",
        domain: "science",
        verification: {
            type: "PORTFOLIO_REVIEW",
            threshold: 0.8,
            requiredNodes: [],
            description: "Submit a lab report with hypothesis, controlled/IV/DV identification, data collection, and conclusion."
        },
        gradeBand: "6-8",
        standardRef: "NGSS-MS-PS1",
        phenomenon: "Does the color of light affect plant growth? Design an experiment to find out.",
        pedagogicalWhy: "Controlled experimentation is the operational definition of 'isolating variables' — SDI 2 in its purest form.",
        visualModel: "artifact_test_tube_rack"
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // EXPLORERS (9-12) — ABSTRACT Artifacts | SDI 3 | Verb: ABSTRACT
    // ═══════════════════════════════════════════════════════════════════════════

    {
        id: "artifact_rhetorician",
        title: "Argumentative Rhetorician",
        description: "Can construct and defend a multi-paragraph argument using Claim-Evidence-Reasoning.",
        category: "LITERACY",
        significance: "ABSTRACT",
        tier: "EXPLORERS",
        sdi: 3,
        bloomLevel: "EVALUATE",
        domain: "literacy",
        verification: {
            type: "ASSESSMENT_PASS",
            threshold: 0.8,
            requiredNodes: [],
            description: "Write a 5-paragraph argumentative essay scored ≥80% on the NY Regents ELA rubric."
        },
        gradeBand: "9-12",
        standardRef: "NY-ELA-9-12-Rhetoric",
        phenomenon: "A proposed school policy change — argue for or against it using evidence and formal logic.",
        pedagogicalWhy: "Argumentation is formal abstraction applied to language — the student models symbolic relationships between claims and evidence.",
        visualModel: "artifact_debate_podium"
    },
    {
        id: "artifact_math_modeler",
        title: "Mathematical Modeler",
        description: "Can create mathematical models for real-world problems using formal abstractions.",
        category: "NUMERACY",
        significance: "ABSTRACT",
        tier: "EXPLORERS",
        sdi: 3,
        bloomLevel: "CREATE",
        domain: "numeracy",
        verification: {
            type: "ASSESSMENT_PASS",
            threshold: 0.8,
            requiredNodes: [],
            description: "Model 3 real-world scenarios using equations/functions and validate predictions against data."
        },
        gradeBand: "9-12",
        standardRef: "CCSS-MATH-HS-Modeling",
        phenomenon: "A bridge is sagging — calculate the structural load to determine if it's safe.",
        pedagogicalWhy: "THE PIVOT: The student stops touching the physical world and learns to model it symbolically. This is the gateway to systems thinking.",
        visualModel: "artifact_equation_blueprint"
    },
    {
        id: "artifact_regents_algebra",
        title: "NY Regents Algebra Verified",
        description: "Demonstrated mastery equivalent to passing the NY Regents Algebra exam.",
        category: "NUMERACY",
        significance: "ABSTRACT",
        tier: "EXPLORERS",
        sdi: 3,
        bloomLevel: "APPLY",
        domain: "numeracy",
        verification: {
            type: "ASSESSMENT_PASS",
            threshold: 0.8,
            requiredNodes: [],
            description: "Pass a simulated NY Regents Algebra assessment with ≥65% (passing) or ≥85% (mastery)."
        },
        gradeBand: "9-12",
        standardRef: "NY-Regents-Algebra",
        phenomenon: "Multi-step word problems requiring equation setup, solving, and interpretation of results.",
        pedagogicalWhy: "The Regents exam is a real-world verification standard. Passing it is a portable, universally recognized competency proof.",
        visualModel: "artifact_regents_seal"
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // PROFESSIONAL COMPETENCIES (NACE-Aligned) — Cross-Tier
    // ═══════════════════════════════════════════════════════════════════════════

    {
        id: "artifact_communicator",
        title: "Verified Communicator",
        description: "Demonstrates effective written and oral communication across multiple contexts.",
        category: "PROFESSIONAL",
        significance: "STRUCTURAL",
        tier: "BUILDERS",
        sdi: 1,
        bloomLevel: "APPLY",
        domain: "career",
        verification: {
            type: "PORTFOLIO_REVIEW",
            threshold: 0.8,
            requiredNodes: [],
            description: "Portfolio of 5+ communication samples across written, oral, and visual modalities."
        },
        gradeBand: "3-5",
        standardRef: "NACE-Communication",
        phenomenon: "Present your science project to the class — can others understand your findings?",
        pedagogicalWhy: "Communication is not a 'soft skill' — it is the operational interface between internal competence and external impact.",
        visualModel: "artifact_microphone"
    },
    {
        id: "artifact_critical_thinker",
        title: "Verified Critical Thinker",
        description: "Consistently applies analytical reasoning to solve complex, multi-step problems.",
        category: "PROFESSIONAL",
        significance: "ANALYTICAL",
        tier: "TRAILBLAZERS",
        sdi: 2,
        bloomLevel: "ANALYZE",
        domain: "career",
        verification: {
            type: "ASSESSMENT_PASS",
            threshold: 0.8,
            requiredNodes: [],
            description: "Solve 25 complex analytical problems requiring multi-step reasoning with ≥80% accuracy."
        },
        gradeBand: "6-8",
        standardRef: "NACE-Critical-Thinking",
        phenomenon: "A city is running out of water — analyze the data, identify causes, and propose 3 solutions.",
        pedagogicalWhy: "Critical thinking is SDI 2 applied to real-world problems — isolating variables, evaluating evidence, drawing conclusions.",
        visualModel: "artifact_brain_circuit"
    },
    {
        id: "artifact_collaborator",
        title: "Verified Collaborator",
        description: "Demonstrates effective teamwork, conflict resolution, and collective problem-solving.",
        category: "PROFESSIONAL",
        significance: "STRUCTURAL",
        tier: "BUILDERS",
        sdi: 1,
        bloomLevel: "APPLY",
        domain: "sel",
        verification: {
            type: "PEER_VERIFIED",
            threshold: 0.8,
            requiredNodes: [],
            description: "Complete 10 squad missions with peer reviews averaging ≥80% on collaboration rubric."
        },
        gradeBand: "3-5",
        standardRef: "NACE-Teamwork",
        phenomenon: "Your squad has a disagreement about the project direction — how do you resolve it productively?",
        pedagogicalWhy: "Collaboration is cause-and-effect in human systems — your actions affect the team, and theirs affect you.",
        visualModel: "artifact_handshake"
    },
    {
        id: "artifact_leader",
        title: "Verified Leader",
        description: "Demonstrates leadership through guiding teams, making decisions under pressure, and mentoring others.",
        category: "PROFESSIONAL",
        significance: "ABSTRACT",
        tier: "EXPLORERS",
        sdi: 3,
        bloomLevel: "EVALUATE",
        domain: "career",
        verification: {
            type: "PEER_VERIFIED",
            threshold: 0.8,
            requiredNodes: [],
            description: "Lead 5 squad missions to completion with peer leadership reviews averaging ≥80%."
        },
        gradeBand: "9-12",
        standardRef: "NACE-Leadership",
        phenomenon: "Your team is behind deadline and morale is low — what do you do?",
        pedagogicalWhy: "Leadership requires abstraction of human motivation, resource allocation, and strategic thinking — SDI 3 in social systems.",
        visualModel: "artifact_compass"
    },
    {
        id: "artifact_service_record",
        title: "Verified Service Record",
        description: "Authenticated proof of value delivery in a commercial or civic context.",
        category: "PROFESSIONAL",
        significance: "SYSTEMIC",
        tier: "VOYAGERS",
        sdi: 4,
        bloomLevel: "CREATE",
        domain: "career",
        verification: {
            type: "PORTFOLIO_REVIEW",
            threshold: 1.0,
            requiredNodes: [],
            description: "Successful completion of a marketplace contract with client sign-off."
        },
        gradeBand: "College",
        standardRef: "NACE-Professionalism",
        phenomenon: "A client pays for your work — the ultimate proof of value.",
        pedagogicalWhy: "Economic value creation is the final exam of the educational system.",
        visualModel: "artifact_contract_scroll"
    }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get artifacts by category
 */
export function getArtifactsByCategory(category: ArtifactCategory): KnowledgeArtifact[] {
    return ARTIFACT_REGISTRY.filter(a => a.category === category);
}

/**
 * Get artifacts by tier
 */
export function getArtifactsByTier(tier: SpiralTier): KnowledgeArtifact[] {
    return ARTIFACT_REGISTRY.filter(a => a.tier === tier);
}

/**
 * Get artifacts by grade band
 */
export function getArtifactsByGradeBand(gradeBand: string): KnowledgeArtifact[] {
    return ARTIFACT_REGISTRY.filter(a => a.gradeBand === gradeBand);
}

/**
 * Get artifact by ID
 */
export function getArtifactById(id: string): KnowledgeArtifact | undefined {
    return ARTIFACT_REGISTRY.find(a => a.id === id);
}

/**
 * Check if a learner qualifies for an artifact based on mastery scores.
 * 
 * Pedagogical Why: Artifacts are EARNED through demonstrated competence,
 * not through point accumulation. The threshold is mastery >= 0.8.
 */
export function checkArtifactEligibility(
    artifact: KnowledgeArtifact,
    masteryScores: Record<string, number>
): { eligible: boolean; progress: number; missing: string[] } {
    const { verification } = artifact;

    if (verification.requiredNodes.length === 0) {
        // Portfolio or peer-verified — requires manual review
        return { eligible: false, progress: 0, missing: ['Requires manual verification'] };
    }

    const missing: string[] = [];
    let totalMastery = 0;

    for (const nodeId of verification.requiredNodes) {
        const score = masteryScores[nodeId] || 0;
        totalMastery += score;
        if (score < verification.threshold) {
            missing.push(nodeId);
        }
    }

    const progress = verification.requiredNodes.length > 0
        ? totalMastery / verification.requiredNodes.length
        : 0;

    return {
        eligible: missing.length === 0,
        progress,
        missing
    };
}

export default ARTIFACT_REGISTRY;
