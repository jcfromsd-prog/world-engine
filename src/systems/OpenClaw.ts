
// ============================================================================
// OPENCLAW: AUTOMATED LEARNER SIMULATION
// ============================================================================
// A headless agent that autonomously traverses the learning graph to verify
// curriculum continuity and mastery mechanics.
// ============================================================================

import { WorldEngine } from "../engines/world-engine/WorldEngine";
import type { KnowledgeNode } from "../engines/world-engine/KnowledgeGraph";

export class OpenClawSystem {
    private engine: WorldEngine;
    private isActive: boolean = false;
    private speedOffset: number = 1000; // Default 1s delay
    private logCallback: (msg: string) => void;

    constructor(engine: WorldEngine, logCallback: (msg: string) => void) {
        this.engine = engine;
        this.logCallback = logCallback;
    }

    public setSpeed(delayMs: number): void {
        this.speedOffset = delayMs;
        this.log("Speed set to " + delayMs + "ms");
    }

    public async startSwarm(): Promise<void> {
        if (this.isActive) return;
        this.isActive = true;
        this.log("🤖 OPENCLAW AGENT ACTIVATED");
        this.log("Scanning Knowledge Graph for optimal path...");

        await this.runSimulationLoop();
    }

    public stopSwarm(): void {
        this.isActive = false;
        this.log("⛔ OPENCLAW AGENT TERMINATED");
    }

    private log(msg: string): void {
        this.logCallback(`[CLAW] ${msg}`);
    }

    private async runSimulationLoop(): Promise<void> {
        while (this.isActive) {
            // 1. Analyze State
            const profile = this.engine.getProfile();
            const currentMastery = profile.masteryMap.size;

            // 2. Determine Next Best Action
            // Safety check for engine
            if (!this.engine) {
                this.log("[CRITICAL] Engine connection lost.");
                this.stopSwarm();
                return;
            }

            const options = this.engine.getNextTaskOptions?.(1) || [];

            if (options.length === 0) {
                this.log(`[CRITICAL] DEAD END DETECTED. No available missions.`);
                this.log(`Total Mastery Achieved: ${currentMastery}`);
                this.stopSwarm();
                return;
            }

            const targetMission = options[0];
            this.log(`Target Acquired: [${targetMission.id}] ${targetMission.title}`);

            // 3. Execute Mission (Simulated Delay)
            await this.simulateMissionExecution(targetMission);

            if (!this.isActive) break;

            // 4. Submit & Verify
            this.engine.submitTask?.(targetMission.id, true, 45); // Success, 45s

            // Verification
            const newMastery = this.engine.getProfile?.().masteryMap.size ?? currentMastery;
            if (newMastery > currentMastery) {
                this.log(`[SUCCESS] Mastery verified. Total: ${newMastery}`);
            } else {
                this.log(`[WARNING] Mastery count did not increase. Re-studying?`);
            }

            // speed offset delay between tasks
            await new Promise(r => setTimeout(r, this.speedOffset));
        }
    }

    private async simulateMissionExecution(mission: KnowledgeNode): Promise<void> {
        // Render loop/time simulation
        // In simulation mode, we just wait.
        // In a real headless browser, this would click elements.
        // Here we just wait for the "completion time" scaled by our speed factor.

        // Base time is 500ms for "Instant", up to 2000ms for "1x" to feel real
        const executionTime = this.speedOffset === 0 ? 50 : 500;

        this.log(`Executing ${mission.domain} mission...`);
        await new Promise(r => setTimeout(r, executionTime));
    }
}
