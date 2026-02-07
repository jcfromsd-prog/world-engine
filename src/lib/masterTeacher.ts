// =============================================================================
// THE MASTER TEACHER: Self-Correcting Swarm Intelligence
// Blueprint Reference: MASTER FOUNDER BLUEPRINT 2-6-2026
// Metrics: Engagement, Excitement, Fulfillment
// =============================================================================

import { MissionGenerator, type LiveMission } from './MissionGenerator';

// --- AGENT PERSONAS (The Ghost Classroom) ---
export interface GhostAgent {
    id: string;
    name: string;
    grade: number;
    track: 'CODING' | 'CREATIVE' | 'SCIENCE' | 'LEADERSHIP';
    personality: 'GAMER' | 'INTROVERT' | 'STRUGGLING' | 'PRODIGY' | 'EXPLORER';
    patience: number; // 1-10 (how many wrong tasks before quitting)
    excitement: number; // 0-100 (current engagement level)
}

export const GHOST_CLASSROOM: GhostAgent[] = [
    { id: 'AGENT_A', name: 'Maya', grade: 7, track: 'SCIENCE', personality: 'EXPLORER', patience: 5, excitement: 70 },
    { id: 'AGENT_B', name: 'Leo', grade: 5, track: 'CREATIVE', personality: 'INTROVERT', patience: 3, excitement: 60 },
    { id: 'AGENT_C', name: 'Jordan', grade: 11, track: 'LEADERSHIP', personality: 'PRODIGY', patience: 8, excitement: 80 },
    { id: 'AGENT_D', name: 'Sam', grade: 4, track: 'CODING', personality: 'GAMER', patience: 6, excitement: 90 },
    { id: 'AGENT_E', name: 'Alex', grade: 9, track: 'SCIENCE', personality: 'STRUGGLING', patience: 2, excitement: 40 },
];

// --- BLUEPRINT VIOLATION TYPES ---
export type ViolationType =
    | 'TRACK_MISMATCH'      // Agent saw wrong category at top
    | 'BOREDOM_DETECTED'    // Excitement dropped below 30
    | 'RAGE_QUIT'           // Agent ran out of patience
    | 'FREE_REWARD'         // Agent got reward without effort
    | 'DIFFICULTY_SPIKE'    // Task too hard for grade
    | 'STALE_FEED';         // Same tasks repeated

export interface BlueprintViolation {
    timestamp: number;
    agentId: string;
    agentName: string;
    type: ViolationType;
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    suggestedFix: string;
}

// --- SIMULATION RESULT ---
export interface SimulationRun {
    runId: string;
    startTime: number;
    endTime: number;
    totalInteractions: number;
    violations: BlueprintViolation[];
    engagementDelta: number; // +/- change in average excitement
    autoFixesApplied: string[];
}

// --- ALGORITHM WEIGHTS (Tunable by AutoTuner) ---
export interface AlgorithmWeights {
    relevanceBoost: number;      // How much to prioritize track match (default: 1000)
    difficultyTolerance: number; // Grade range flexibility (default: 2)
    varietyFactor: number;       // Penalize showing same category twice (default: 0.8)
    rewardInfluence: number;     // How much GP affects sort (default: 1.0)
}

let CURRENT_WEIGHTS: AlgorithmWeights = {
    relevanceBoost: 1000,
    difficultyTolerance: 2,
    varietyFactor: 0.8,
    rewardInfluence: 1.0,
};

// =============================================================================
// THE MASTER TEACHER CLASS
// =============================================================================
export class MasterTeacher {
    private violations: BlueprintViolation[] = [];
    private simulationHistory: SimulationRun[] = [];

    /**
     * Run a single agent through the Genesis Feed simulation
     */
    simulateAgentSession(agent: GhostAgent, feed: LiveMission[]): BlueprintViolation[] {
        const sessionViolations: BlueprintViolation[] = [];
        let currentExcitement = agent.excitement;
        let wrongCategoryStreak = 0;

        // Check top 3 missions shown to the agent
        const topMissions = feed.slice(0, 3);

        topMissions.forEach((mission, idx) => {
            // CHECK 1: Track Mismatch (Top mission should match agent's track)
            if (idx === 0 && mission.category !== agent.track) {
                wrongCategoryStreak++;
                currentExcitement -= 15;

                sessionViolations.push({
                    timestamp: Date.now(),
                    agentId: agent.id,
                    agentName: agent.name,
                    type: 'TRACK_MISMATCH',
                    description: `${agent.name} (${agent.track}) saw "${mission.category}" at position #1`,
                    severity: 'HIGH',
                    suggestedFix: `Increase relevanceBoost weight for ${agent.track} category`,
                });
            }

            // CHECK 2: Difficulty Spike (Mission grade range vs agent grade)
            if (agent.grade < mission.minGrade - CURRENT_WEIGHTS.difficultyTolerance) {
                currentExcitement -= 20;
                sessionViolations.push({
                    timestamp: Date.now(),
                    agentId: agent.id,
                    agentName: agent.name,
                    type: 'DIFFICULTY_SPIKE',
                    description: `${agent.name} (Grade ${agent.grade}) shown task requiring Grade ${mission.minGrade}+`,
                    severity: 'MEDIUM',
                    suggestedFix: `Increase difficultyTolerance or filter by grade`,
                });
            }
        });

        // CHECK 3: Boredom Detection (Excitement too low)
        if (currentExcitement < 30) {
            sessionViolations.push({
                timestamp: Date.now(),
                agentId: agent.id,
                agentName: agent.name,
                type: 'BOREDOM_DETECTED',
                description: `${agent.name}'s excitement dropped to ${currentExcitement}%`,
                severity: 'CRITICAL',
                suggestedFix: `Inject variety or gamification elements for ${agent.personality} personality`,
            });
        }

        // CHECK 4: Rage Quit (Patience exhausted)
        if (wrongCategoryStreak >= agent.patience) {
            sessionViolations.push({
                timestamp: Date.now(),
                agentId: agent.id,
                agentName: agent.name,
                type: 'RAGE_QUIT',
                description: `${agent.name} would quit after ${wrongCategoryStreak} irrelevant tasks`,
                severity: 'CRITICAL',
                suggestedFix: `URGENT: Relevance algorithm failing for ${agent.track} track`,
            });
        }

        this.violations.push(...sessionViolations);
        return sessionViolations;
    }

    /**
     * Run full swarm simulation
     */
    runSwarmSimulation(iterations: number = 100): SimulationRun {
        const runId = `SIM_${Date.now()}`;
        const startTime = Date.now();
        const runViolations: BlueprintViolation[] = [];
        let totalExcitementBefore = 0;
        let totalExcitementAfter = 0;

        for (let i = 0; i < iterations; i++) {
            // Generate a fresh feed for each iteration
            const feed = MissionGenerator.generateInitialFeed(8);

            // Run each agent through the feed
            GHOST_CLASSROOM.forEach(agent => {
                totalExcitementBefore += agent.excitement;

                // Sort feed by user's track (simulating the algorithm)
                const personalizedFeed = this.sortFeedForAgent(feed, agent);
                const violations = this.simulateAgentSession(agent, personalizedFeed);
                runViolations.push(...violations);

                // Simulate excitement change
                const excitementDelta = violations.length > 0 ? -10 : 5;
                totalExcitementAfter += Math.max(0, Math.min(100, agent.excitement + excitementDelta));
            });
        }

        const endTime = Date.now();
        const engagementDelta = (totalExcitementAfter - totalExcitementBefore) / (iterations * GHOST_CLASSROOM.length);

        // Apply Auto-Fixes based on violations
        const autoFixes = this.applyAutoFixes(runViolations);

        const run: SimulationRun = {
            runId,
            startTime,
            endTime,
            totalInteractions: iterations * GHOST_CLASSROOM.length,
            violations: runViolations,
            engagementDelta,
            autoFixesApplied: autoFixes,
        };

        this.simulationHistory.push(run);
        return run;
    }

    /**
     * Sort feed based on agent's track (simulating personalization)
     */
    private sortFeedForAgent(feed: LiveMission[], agent: GhostAgent): LiveMission[] {
        return [...feed].sort((a, b) => {
            const aScore = (a.category === agent.track ? CURRENT_WEIGHTS.relevanceBoost : 0) + a.reward * CURRENT_WEIGHTS.rewardInfluence;
            const bScore = (b.category === agent.track ? CURRENT_WEIGHTS.relevanceBoost : 0) + b.reward * CURRENT_WEIGHTS.rewardInfluence;
            return bScore - aScore;
        });
    }

    /**
     * AUTO-TUNER: Apply fixes based on detected violations
     */
    private applyAutoFixes(violations: BlueprintViolation[]): string[] {
        const fixes: string[] = [];

        const trackMismatches = violations.filter(v => v.type === 'TRACK_MISMATCH').length;
        const boredomEvents = violations.filter(v => v.type === 'BOREDOM_DETECTED').length;
        const difficultySpikes = violations.filter(v => v.type === 'DIFFICULTY_SPIKE').length;

        // FIX 1: Too many track mismatches -> Boost relevance weight
        if (trackMismatches > violations.length * 0.3) {
            CURRENT_WEIGHTS.relevanceBoost *= 1.25;
            fixes.push(`Increased relevanceBoost to ${CURRENT_WEIGHTS.relevanceBoost.toFixed(0)}`);
        }

        // FIX 2: Too much boredom -> Reduce reward influence (variety over money)
        if (boredomEvents > 5) {
            CURRENT_WEIGHTS.rewardInfluence *= 0.9;
            fixes.push(`Reduced rewardInfluence to ${CURRENT_WEIGHTS.rewardInfluence.toFixed(2)} (prioritizing variety)`);
        }

        // FIX 3: Difficulty spikes -> Increase tolerance
        if (difficultySpikes > 10) {
            CURRENT_WEIGHTS.difficultyTolerance += 1;
            fixes.push(`Increased difficultyTolerance to ${CURRENT_WEIGHTS.difficultyTolerance}`);
        }

        return fixes;
    }

    /**
     * Generate "Morning Report" for the Founder
     */
    generateMorningReport(): string {
        const lastRun = this.simulationHistory[this.simulationHistory.length - 1];
        if (!lastRun) return '📊 No simulations run yet. Use CTRL+SHIFT+M to start.';

        const criticalCount = lastRun.violations.filter(v => v.severity === 'CRITICAL').length;
        const highCount = lastRun.violations.filter(v => v.severity === 'HIGH').length;

        const engagementEmoji = lastRun.engagementDelta > 0 ? '📈' : lastRun.engagementDelta < 0 ? '📉' : '➡️';

        return `
══════════════════════════════════════════════════════════════
🎓 MASTER TEACHER MORNING REPORT
══════════════════════════════════════════════════════════════
RUN ID: ${lastRun.runId}
DURATION: ${((lastRun.endTime - lastRun.startTime) / 1000).toFixed(1)}s
INTERACTIONS: ${lastRun.totalInteractions.toLocaleString()}

📊 ENGAGEMENT TREND: ${engagementEmoji} ${lastRun.engagementDelta > 0 ? '+' : ''}${lastRun.engagementDelta.toFixed(1)}%

⚠️ VIOLATIONS DETECTED:
   • CRITICAL: ${criticalCount}
   • HIGH: ${highCount}
   • TOTAL: ${lastRun.violations.length}

🔧 AUTO-FIXES APPLIED:
${lastRun.autoFixesApplied.length > 0 ? lastRun.autoFixesApplied.map(f => `   ✓ ${f}`).join('\n') : '   (None needed)'}

📋 TOP ISSUES:
${lastRun.violations.slice(0, 3).map(v => `   • [${v.severity}] ${v.description}`).join('\n') || '   ✅ No major issues detected.'}

💡 RECOMMENDATION:
${criticalCount > 0 ? '   🚨 URGENT: Review critical violations immediately.' : '   ✅ System performing within acceptable parameters.'}
══════════════════════════════════════════════════════════════
    `.trim();
    }

    /**
     * Get current algorithm weights (for debugging)
     */
    getCurrentWeights(): AlgorithmWeights {
        return { ...CURRENT_WEIGHTS };
    }

    /**
     * Reset weights to defaults
     */
    resetWeights(): void {
        CURRENT_WEIGHTS = {
            relevanceBoost: 1000,
            difficultyTolerance: 2,
            varietyFactor: 0.8,
            rewardInfluence: 1.0,
        };
    }

    /**
     * Get all violations
     */
    getAllViolations(): BlueprintViolation[] {
        return [...this.violations];
    }
}

// Singleton instance
export const masterTeacher = new MasterTeacher();
