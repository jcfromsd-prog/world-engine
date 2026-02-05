/* ==========================================================================
   SIMULATION ENGINE
   File: src/services/SimulationEngine.ts
   
   Simulates a complete user journey through the 4 pillars:
   CONNECT → LEARN → SOLVE → EARN
   
   Supports persona injection via localStorage for E2E testing.
   ========================================================================== */
import { SquadMatcher } from "./SquadMatcher";
import { RecommendationEngine, type FlashcardSignal } from "./RecommendationEngine";

// Define our "Success Archetypes" for different user segments
export const USER_PERSONAS = {
    GRADE_4: { id: "p_4th", archetype: "Explorer", skillTheta: -2.0, interests: ["NATURE", "DINOSAURS"] },
    HS_SOPHOMORE: { id: "p_hs", archetype: "Builder", skillTheta: 0.5, interests: ["TECH", "CODING"] },
    COLLEGE_FRESH: { id: "p_col", archetype: "Innovator", skillTheta: 2.0, interests: ["AI", "STARTUP"] }
};

export type PersonaKey = keyof typeof USER_PERSONAS;

/**
 * Gets the persona key from localStorage, falling back to default.
 * This allows E2E tests to inject a specific persona before page load.
 */
export function getTargetPersonaKey(): PersonaKey {
    if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem('simulatePersona');
        if (stored && stored in USER_PERSONAS) {
            return stored as PersonaKey;
        }
    }
    return 'HS_SOPHOMORE'; // Default fallback
}

/**
 * Clears the injected persona from localStorage.
 * Call this after simulation completes to reset state.
 */
export function clearSimulatePersona(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('simulatePersona');
    }
}

export const SimulationEngine = {
    /**
     * Runs a full journey simulation for the specified persona.
     * If no personaKey is provided, reads from localStorage or uses default.
     */
    async runSimulation(
        personaKey?: PersonaKey,
        onUpdate: (log: string) => void = console.log
    ): Promise<boolean> {
        // Resolve persona: explicit param > localStorage > default
        const resolvedKey = personaKey || getTargetPersonaKey();
        const user = USER_PERSONAS[resolvedKey];

        onUpdate(`🚀 STARTING SIMULATION: ${user.archetype} (Theta: ${user.skillTheta})`);

        // STEP 1: CONNECT (Find a Squad)
        await this.sleep(1000);
        onUpdate("🔍 1. CONNECT: Scanning for Squad...");
        const squadResult = SquadMatcher.findOptimalSquad();
        const mySquad = squadResult.squads[0] || { name: 'Solo Ranger', compatibilityScore: 0.5 };
        onUpdate(`✅ Squad Found: "${mySquad.name}" (Compatibility: ${(mySquad.compatibilityScore * 100).toFixed(0)}%)`);

        // STEP 2: LEARN (Do Flashcards)
        await this.sleep(1500);
        onUpdate("🧠 2. LEARN: Assessing Knowledge Gaps...");
        let currentTheta = user.skillTheta;
        for (let i = 1; i <= 3; i++) {
            await this.sleep(800);
            const signal: FlashcardSignal[] = [{
                itemId: `sim_${i}`,
                bloomLevel: "REMEMBER",
                success: true,
                timestamp: Date.now()
            }];
            RecommendationEngine.analyzeUserSignals(signal);
            currentTheta += 0.2;
            onUpdate(`📚 Concept ${i} Mastered! Skill Theta rising: ${currentTheta.toFixed(2)}`);
        }

        // STEP 3: SOLVE (Complete a Mission)
        await this.sleep(1500);
        onUpdate("🛠️ 3. SOLVE: Taking on Real-World Mission...");
        onUpdate("✅ Mission 'Ecosystem Analysis' Submitted.");

        // STEP 4: EARN (Get Rewards)
        await this.sleep(1000);
        onUpdate("💰 4. EARN: Verifying Impact...");
        const earnings = 50 * (currentTheta + 3);
        onUpdate(`🏆 SUCCESS: Earned ${earnings.toFixed(0)} Prestige Points & unlocked 'Sovereign' Badge.`);

        // Clean up localStorage after successful simulation
        clearSimulatePersona();

        return true;
    },

    /**
     * Runs simulation using persona from localStorage (for E2E tests).
     */
    async runFromInjectedPersona(onUpdate: (log: string) => void): Promise<boolean> {
        return this.runSimulation(undefined, onUpdate);
    },

    sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
