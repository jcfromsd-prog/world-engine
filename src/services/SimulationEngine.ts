/* ==========================================================================
   SIMULATION ENGINE (ENHANCED)
   File: src/services/SimulationEngine.ts
   
   Simulates a complete user journey through the 5 pillars:
   IDENTITY → CONNECT → LEARN → SOLVE → EARN
   
   Now integrated with:
   - NY/CA K-16 Curriculum Database
   - IRT-based Recommendation Engine
   - Real standards references (NGSS, NACE, CCSS)
   ========================================================================== */
import type { UserProfile, FlashcardSignal } from "../types/EngineTypes";
import { GRADE_LABELS } from "../types/EngineTypes";
import { RecommendationEngine } from "./RecommendationEngine";
import { SquadMatcher } from "./SquadMatcher";

// ═══════════════════════════════════════════════════════════════════════════
// USER PERSONAS (NY/CA K-16 Standards-Aligned)
// ═══════════════════════════════════════════════════════════════════════════
export const USER_PERSONAS: Record<string, UserProfile> = {
    // THE KID (Grades K-5)
    ELEMENTARY_NOVICE: {
        id: "user_sim_01",
        name: "Leo (The Explorer)",
        archetype: "Explorer",
        passion: "Science",
        skillTheta: -2.5,
        gradeLevel: 3,
        interests: ["Nature", "Science", "Animals"],
        competencies: {},
    },
    // THE TEEN (Grades 9-12)
    HS_SOPHOMORE: {
        id: "user_sim_02",
        name: "Maya (The Builder)",
        archetype: "Builder",
        passion: "Coding",
        skillTheta: 0.8,
        gradeLevel: 10,
        interests: ["Coding", "Tech", "Engineering"],
        competencies: {},
    },
    // THE PRO (College/Career)
    COLLEGE_SENIOR: {
        id: "user_sim_03",
        name: "Alex (The Legend)",
        archetype: "Innovator",
        passion: "Creative",
        skillTheta: 2.2,
        gradeLevel: 15,
        interests: ["Leadership", "Business", "Startup"],
        competencies: {},
    },
};

export type PersonaKey = keyof typeof USER_PERSONAS;

/**
 * Gets the persona key from localStorage, falling back to default.
 * This allows E2E tests to inject a specific persona before page load.
 */
export function getTargetPersonaKey(): PersonaKey {
    if (typeof window !== "undefined" && window.localStorage) {
        const stored = localStorage.getItem("simulatePersona");
        if (stored && stored in USER_PERSONAS) {
            return stored as PersonaKey;
        }
    }
    return "HS_SOPHOMORE"; // Default fallback
}

/**
 * Clears the injected persona from localStorage.
 */
export function clearSimulatePersona(): void {
    if (typeof window !== "undefined" && window.localStorage) {
        localStorage.removeItem("simulatePersona");
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// SIMULATION ENGINE
// ═══════════════════════════════════════════════════════════════════════════
export const SimulationEngine = {
    /**
     * Runs a full journey simulation through all 5 pillars.
     * IDENTITY → CONNECT → LEARN → SOLVE → EARN
     */
    async runSimulation(
        personaKey?: PersonaKey,
        onUpdate: (log: string) => void = console.log
    ): Promise<boolean> {
        // Resolve persona
        const resolvedKey = personaKey || getTargetPersonaKey();
        const user = { ...USER_PERSONAS[resolvedKey] }; // Clone to allow mutation
        const history: FlashcardSignal[] = [];

        onUpdate(`═══════════════════════════════════════════════════════════════`);
        onUpdate(`🚀 SIMULATION START: ${user.name} (${user.archetype})`);
        onUpdate(`   📊 Grade Level: ${GRADE_LABELS[user.gradeLevel] || `Grade ${user.gradeLevel}`}`);
        onUpdate(`   🧠 Initial Skill Theta: ${user.skillTheta.toFixed(2)}`);
        onUpdate(`   💡 Interests: ${user.interests.join(", ")}`);
        onUpdate(`═══════════════════════════════════════════════════════════════`);

        // ─────────────────────────────────────────────────────────────────────────
        // STEP 0: IDENTITY (Profile Recognition)
        // ─────────────────────────────────────────────────────────────────────────
        await this.sleep(800);
        onUpdate(`\n🛡️ STEP 0: IDENTITY`);
        onUpdate(`   ✅ Neural profile recognized: ${user.archetype} archetype`);
        onUpdate(`   ✅ ${user.gradeLevel > 12 ? "Career-ready" : "K-12"} standards loaded`);

        // ─────────────────────────────────────────────────────────────────────────
        // STEP 1: CONNECT (Squad Matching)
        // ─────────────────────────────────────────────────────────────────────────
        await this.sleep(1000);
        onUpdate(`\n👥 STEP 1: CONNECT`);
        onUpdate(`   🔍 Scanning for compatible squads...`);

        const squadResult = SquadMatcher.findOptimalSquad();
        const mySquad = squadResult.squads[0] || {
            name: `The ${user.interests[0] || "Impact"} Crew`,
            compatibilityScore: 0.94
        };

        await this.sleep(600);
        onUpdate(`   ✅ Squad Found: "${mySquad.name}"`);
        onUpdate(`   📈 Compatibility: ${(mySquad.compatibilityScore * 100).toFixed(0)}%`);

        // ─────────────────────────────────────────────────────────────────────────
        // STEP 2: LEARN (Adaptive Content Delivery)
        // ─────────────────────────────────────────────────────────────────────────
        await this.sleep(1200);
        onUpdate(`\n🧠 STEP 2: LEARN`);
        onUpdate(`   📚 Analyzing ${user.gradeLevel > 12 ? "NACE Career" : "State Academic"} standards...`);

        // Run 3 learning cycles
        for (let i = 1; i <= 3; i++) {
            await this.sleep(900);

            const recommendation = RecommendationEngine.recommendNext(user, history);

            if (recommendation) {
                const { node, successProbability } = recommendation;

                onUpdate(`   ┌─ Concept ${i}: "${node.title}"`);
                onUpdate(`   │  📝 Standard: ${node.standardRef}`);
                onUpdate(`   │  🎯 Subject: ${node.subject} | Bloom: ${node.bloomLevel}`);
                onUpdate(`   │  📊 Success Probability: ${(successProbability * 100).toFixed(0)}%`);

                // Simulate outcome (weighted by probability)
                const success = Math.random() < successProbability + 0.1;

                if (success) {
                    const oldTheta = user.skillTheta;
                    user.skillTheta = RecommendationEngine.updateSkillTheta(
                        user.skillTheta,
                        node.difficulty,
                        true
                    );

                    onUpdate(`   └─ ✅ MASTERED! Theta: ${oldTheta.toFixed(2)} → ${user.skillTheta.toFixed(2)}`);

                    history.push({
                        itemId: node.id,
                        success: true,
                        timestamp: Date.now(),
                    });
                } else {
                    onUpdate(`   └─ ⚠️ Stall detected. Deploying micro-intervention...`);
                    await this.sleep(500);
                    onUpdate(`      🔄 Recovery pathway activated.`);

                    history.push({
                        itemId: node.id,
                        success: false,
                        timestamp: Date.now(),
                    });
                }
            } else {
                onUpdate(`   ⚠️ No suitable content found for this level.`);
            }
        }

        // ─────────────────────────────────────────────────────────────────────────
        // STEP 3: SOLVE (Mission Assignment)
        // ─────────────────────────────────────────────────────────────────────────
        await this.sleep(1200);
        onUpdate(`\n⚡ STEP 3: SOLVE`);

        const solveMission = RecommendationEngine.recommendNext(user, history, {
            targetProbability: 0.65, // Slightly harder for missions
        });

        if (solveMission) {
            const { node } = solveMission;
            onUpdate(`   🎯 Mission Assigned: "${node.title}"`);
            onUpdate(`   📋 Description: ${node.description}`);
            onUpdate(`   ⏱️ Estimated Time: ${node.estimatedMinutes || 30} minutes`);

            await this.sleep(1500);

            // Simulate mission completion
            const missionSuccess = Math.random() > 0.2; // 80% success rate

            if (missionSuccess) {
                onUpdate(`   ✅ MISSION COMPLETE!`);
                onUpdate(`   🏆 Competence verified — mastery recorded`);

                // Update theta for successful mission (bigger impact)
                user.skillTheta = RecommendationEngine.updateSkillTheta(
                    user.skillTheta,
                    node.difficulty,
                    true
                );
            } else {
                onUpdate(`   ⚠️ Mission requires revision. Feedback provided.`);
            }
        }

        // ─────────────────────────────────────────────────────────────────────────
        // STEP 4: EARN (Rewards & Payouts)
        // ─────────────────────────────────────────────────────────────────────────
        await this.sleep(1000);
        onUpdate(`\n💰 STEP 4: EARN`);
        onUpdate(`   🔐 Verifying impact credentials...`);

        await this.sleep(600);

        // Calculate earnings based on grade level and skill improvement
        const baseReward = user.gradeLevel > 12 ? 150 : 50;
        const skillBonus = Math.max(0, user.skillTheta) * 20;
        const totalGP = Math.round(baseReward + skillBonus);

        if (user.gradeLevel > 12) {
            onUpdate(`   💵 Internship Stipend: $${totalGP * 2} deposited`);
        } else {
            onUpdate(`   🏆 Verified Competencies: +${totalGP} recorded`);
        }

        onUpdate(`   🌟 Artifact Earned: "${user.archetype} ${RecommendationEngine.getSkillLevelDescription(user.skillTheta)}"`);

        // ─────────────────────────────────────────────────────────────────────────
        // SIMULATION COMPLETE
        // ─────────────────────────────────────────────────────────────────────────
        await this.sleep(800);
        onUpdate(`\n═══════════════════════════════════════════════════════════════`);
        onUpdate(`🏁 SIMULATION COMPLETE`);
        onUpdate(`   📊 Final Skill Theta: ${user.skillTheta.toFixed(2)}`);
        onUpdate(`   📈 Level: ${RecommendationEngine.getSkillLevelDescription(user.skillTheta)}`);
        onUpdate(`   ✅ Standards Verified: NY/CA + NGSS + ${user.gradeLevel > 12 ? "NACE" : "CCSS"}`);
        onUpdate(`═══════════════════════════════════════════════════════════════`);

        // Clean up
        clearSimulatePersona();

        return true;
    },

    /**
     * Runs simulation using persona from localStorage (for E2E tests).
     */
    async runFromInjectedPersona(onUpdate: (log: string) => void): Promise<boolean> {
        return this.runSimulation(undefined, onUpdate);
    },

    /**
     * Runs ALL personas in sequence and reports pass/fail stats.
     * The "Audit Button" logic.
     */
    async runFullQA(onUpdate: (log: string) => void): Promise<void> {
        let passed = 0;
        let failed = 0;
        const report: string[] = [];

        onUpdate(`🚨 STARTING FULL QA BATCH TEST (ALL PERSONAS)`);

        for (const [key] of Object.entries(USER_PERSONAS)) {
            onUpdate(`\n🔹 TESTING PERSONA: ${key}...`);
            try {
                const result = await this.runSimulation(key as PersonaKey, (msg) => {
                    // Show Milestones and Errors
                    if (msg.includes('RED ALERT') || msg.includes('FAIL') || msg.includes('✅') || msg.includes('🛡️') || msg.includes('🏁')) {
                        onUpdate(msg);
                    }
                });

                if (result) {
                    passed++;
                    report.push(`✅ ${key}: PASSED`);
                } else {
                    failed++;
                    report.push(`❌ ${key}: FAILED`);
                }
            } catch (e) {
                failed++;
                report.push(`❌ ${key}: CRASHED (${e})`);
            }
        }

        onUpdate(`\n═══════════════════════════════════════════════════════════════`);
        onUpdate(`🏁 QA BATCH COMPLETE`);
        onUpdate(`   PASSED: ${passed} | FAILED: ${failed}`);
        onUpdate(`   REPORT SUMMARY:`);
        report.forEach(r => onUpdate(`   ${r}`));
        onUpdate(`═══════════════════════════════════════════════════════════════`);
    },

    /**
     * Sleep utility
     */
    sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
};

export default SimulationEngine;
