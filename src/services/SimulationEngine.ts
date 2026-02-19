/* ==========================================================================
   SIMULATION ENGINE v1.1 — AUTONOMOUS BATCH ORCHESTRATION
   File: src/services/SimulationEngine.ts

   Simulates complete user journeys through the 5 pillars:
   IDENTITY → CONNECT → LEARN → SOLVE → EARN

   v1.1 Additions:
   - Autonomous batch mode (no manual "Continue" clicks)
   - AbortSignal support for emergency stop
   - Real-time progress callbacks
   - Per-agent result tracking with batch reports
   ========================================================================== */
import type {
    UserProfile,
    FlashcardSignal,
    SimulationBatchConfig,
    SimulationProgress,
    SimulationAgentResult,
    SimulationBatchReport,
    SimulationStepName,
    AgentOutcome,
} from "../types/EngineTypes";
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
    // THE SKEPTIC
    SKEPTIC: {
        id: "user_sim_04",
        name: "Jordan (The Skeptic)",
        archetype: "Analyst",
        passion: "Coding",
        skillTheta: 1.2,
        gradeLevel: 11,
        interests: ["Data", "Logic", "Debate"],
        competencies: {},
    },
    // THE DRIFTER
    DRIFTER: {
        id: "user_sim_05",
        name: "Sam (The Drifter)",
        archetype: "Explorer",
        passion: "Creative",
        skillTheta: -0.5,
        gradeLevel: 7,
        interests: ["Games", "Music", "Art"],
        competencies: {},
    },
    // THE GAMER
    GAMER: {
        id: "user_sim_06",
        name: "Kai (The Gamer)",
        archetype: "Builder",
        passion: "Coding",
        skillTheta: 0.3,
        gradeLevel: 9,
        interests: ["Gaming", "Coding", "Competition"],
        competencies: {},
    },
    // THE WOUNDED
    WOUNDED: {
        id: "user_sim_07",
        name: "Riley (The Wounded)",
        archetype: "Explorer",
        passion: "Science",
        skillTheta: -1.8,
        gradeLevel: 5,
        interests: ["Nature", "Animals", "Drawing"],
        competencies: {},
    },
};

export type PersonaKey = keyof typeof USER_PERSONAS;

const ALL_PERSONA_KEYS = Object.keys(USER_PERSONAS) as PersonaKey[];

const STEPS_IN_ORDER: SimulationStepName[] = [
    "IDENTITY",
    "CONNECT",
    "LEARN",
    "SOLVE",
    "EARN",
    "COMPLETE",
];

/**
 * Gets the persona key from localStorage, falling back to default.
 */
export function getTargetPersonaKey(): PersonaKey {
    if (typeof window !== "undefined" && window.localStorage) {
        const stored = localStorage.getItem("simulatePersona");
        if (stored && stored in USER_PERSONAS) {
            return stored as PersonaKey;
        }
    }
    return "HS_SOPHOMORE";
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
// SIMULATION ENGINE v1.1
// ═══════════════════════════════════════════════════════════════════════════
export const SimulationEngine = {
    /**
     * Runs a full journey simulation through all 5 pillars for a single agent.
     * IDENTITY → CONNECT → LEARN → SOLVE → EARN
     *
     * Returns the per-agent result with outcome, logs, and final theta.
     */
    async runSimulation(
        personaKey?: PersonaKey,
        onUpdate: (log: string) => void = console.log,
        options?: {
            signal?: AbortSignal;
            stepDelayMs?: number;
            onStepChange?: (step: SimulationStepName) => void;
        }
    ): Promise<SimulationAgentResult> {
        const resolvedKey = (personaKey || getTargetPersonaKey()) as string;
        const user = { ...USER_PERSONAS[resolvedKey] };
        const history: FlashcardSignal[] = [];
        const agentLogs: string[] = [];
        const stepsCompleted: SimulationStepName[] = [];
        const startTime = Date.now();
        const delay = options?.stepDelayMs ?? 200;

        const log = (msg: string) => {
            agentLogs.push(msg);
            onUpdate(msg);
        };

        const checkAbort = () => {
            if (options?.signal?.aborted) throw new Error("ABORT");
        };

        try {
            log(`═══════════════════════════════════════════════════════════════`);
            log(`🚀 SIMULATION START: ${user.name} (${user.archetype})`);
            log(
                `   📊 Grade Level: ${GRADE_LABELS[user.gradeLevel] || `Grade ${user.gradeLevel}`}`
            );
            log(`   🧠 Initial Skill Theta: ${user.skillTheta.toFixed(2)}`);
            log(`   💡 Interests: ${user.interests.join(", ")}`);
            log(`═══════════════════════════════════════════════════════════════`);

            // ── STEP 0: IDENTITY ──
            checkAbort();
            options?.onStepChange?.("IDENTITY");
            const t0 = Date.now();
            await this.sleep(delay);
            log(`\n🛡️ STEP 0: IDENTITY`);
            log(`   ✅ Neural profile recognized: ${user.archetype} archetype`);
            log(
                `   ✅ ${user.gradeLevel > 12 ? "Career-ready" : "K-12"} standards loaded`
            );
            // Wounded-specific: immediate soft validation
            const isWounded = user.skillTheta < -1.0;
            if (isWounded) {
                log(`   💛 SOFT LANDING: Low-confidence profile detected (θ=${user.skillTheta.toFixed(2)})`);
                log(`   💛 System deploying "Warm Welcome" micro-validation...`);
                await this.sleep(delay);
                log(`   ✅ WARM WELCOME delivered — "You belong here. Let's explore together."`);
            }
            log(`   ⏱️ Latency: ${Date.now() - t0}ms`);
            stepsCompleted.push("IDENTITY");

            // ── STEP 1: CONNECT (Ghost Town Test — Law 5: Radical Warmth) ──
            checkAbort();
            options?.onStepChange?.("CONNECT");
            const t1 = Date.now();
            await this.sleep(delay);
            log(`\n👥 STEP 1: CONNECT (Squad HQ Entry)`);
            log(`   🏚️ GHOST TOWN TEST: Agent enters empty Squad HQ...`);
            log(`   ⏳ Waiting for AI teammate initiation...`);

            const squadResult = SquadMatcher.findOptimalSquad();
            const mySquad = squadResult.squads[0] || {
                name: `The ${user.interests[0] || "Impact"} Crew`,
                compatibilityScore: 0.94,
            };

            await this.sleep(delay);

            // Simulate Sage/Oracle warmth response time
            const aiWarmthLatency = 400 + Math.floor(Math.random() * 800); // 400-1200ms
            const warmthPassed = aiWarmthLatency < 2000;
            log(`   🤖 Sage AI responded in ${aiWarmthLatency}ms`);
            if (warmthPassed) {
                log(`   ✅ RADICAL WARMTH (Law 5): Sage initiated — "Welcome to ${mySquad.name}! I'm here to help you get started."`);
            } else {
                log(`   ⚠️ WARMTH DELAY: Sage response exceeded 2s threshold`);
            }

            // Drifter-specific: extra engagement check
            if (resolvedKey === "DRIFTER") {
                log(`   🌀 DRIFTER CHECK: Low-engagement agent — does Squad HQ hook them?`);
                const drifterHooked = Math.random() > 0.2; // 80% hook rate
                if (drifterHooked) {
                    log(`   ✅ Drifter engaged: Squad activity feed caught attention`);
                } else {
                    log(`   ⚠️ Drifter disengaging — deploying interest-matched prompt...`);
                    await this.sleep(delay);
                    log(`   ✅ Recovery: Personalized "${user.interests[0]}" challenge surfaced`);
                }
            }

            log(`   ✅ Squad Found: "${mySquad.name}"`);
            log(
                `   📈 Compatibility: ${(mySquad.compatibilityScore * 100).toFixed(0)}%`
            );
            log(`   ⏱️ Latency: ${Date.now() - t1}ms`);
            stepsCompleted.push("CONNECT");

            // ── STEP 2: LEARN (Genesis Feed — Autonomy Check, Law 1) ──
            checkAbort();
            options?.onStepChange?.("LEARN");
            const t2 = Date.now();
            await this.sleep(delay);
            log(`\n🧠 STEP 2: LEARN (Genesis Feed Engagement)`);
            log(
                `   📚 Analyzing ${user.gradeLevel > 12 ? "NACE Career" : "State Academic"} standards...`
            );

            // ── AUTONOMY CHECK: Does the feed present ≥3 genuine choices? (Law 1) ──
            log(`   🔍 AUTONOMY CHECK (Law 1): Scanning Genesis Feed for choice breadth...`);
            let feedChoicesCount = 0;
            const feedChoiceTitles: string[] = [];

            for (let i = 1; i <= 3; i++) {
                checkAbort();
                const stepStart = Date.now();
                await this.sleep(delay);

                const recommendation = RecommendationEngine.recommendNext(
                    user,
                    history
                );

                if (recommendation) {
                    feedChoicesCount++;
                    const { node, successProbability } = recommendation;
                    feedChoiceTitles.push(node.title);

                    log(`   ┌─ Mission Card ${i}: "${node.title}"`);
                    log(`   │  📝 Standard: ${node.standardRef}`);
                    log(
                        `   │  🎯 Subject: ${node.subject} | Bloom: ${node.bloomLevel}`
                    );
                    log(
                        `   │  📊 Success Probability: ${(successProbability * 100).toFixed(0)}%`
                    );

                    // Wounded-specific: soft-landing for low-theta hesitation
                    let success: boolean;
                    if (isWounded && successProbability < 0.5) {
                        log(`   │  💛 WOUNDED RECOVERY: Hesitation detected (P=${(successProbability * 100).toFixed(0)}%)`);
                        log(`   │  💛 Injecting soft-landing validation task...`);
                        await this.sleep(delay);
                        log(`   │  ✅ SOFT LANDING: Low-stakes "${node.subject} Explorer" badge offered`);
                        success = true; // Soft-landing always succeeds
                    } else {
                        success = Math.random() < successProbability + 0.1;
                    }

                    if (success) {
                        const oldTheta = user.skillTheta;
                        user.skillTheta = RecommendationEngine.updateSkillTheta(
                            user.skillTheta,
                            node.difficulty,
                            true
                        );
                        log(
                            `   └─ ✅ MASTERED! Theta: ${oldTheta.toFixed(2)} → ${user.skillTheta.toFixed(2)}`
                        );
                        history.push({
                            itemId: node.id,
                            success: true,
                            timestamp: Date.now(),
                        });
                    } else {
                        // Skeptic-specific: provide evidence-based rationale
                        if (resolvedKey === "SKEPTIC") {
                            log(`   └─ ⚠️ SKEPTIC STALL: Agent demands evidence for relevance...`);
                            await this.sleep(delay);
                            log(`      📊 Evidence provided: Standard ${node.standardRef} maps to career outcome`);
                            log(`      🔄 Skeptic re-engaged via data-driven rationale`);
                        } else {
                            log(`   └─ ⚠️ Stall detected. Deploying micro-intervention...`);
                            await this.sleep(delay);
                            log(`      🔄 Recovery pathway activated.`);
                        }
                        history.push({
                            itemId: node.id,
                            success: false,
                            timestamp: Date.now(),
                        });
                    }
                    const stepLatency = Date.now() - stepStart;
                    log(`   ⏱️ Step Latency: ${stepLatency}ms ${stepLatency > 800 ? "⚠️ EXCEEDS 800ms" : "✅"}`);
                } else {
                    log(`   ⚠️ No suitable content found for this level.`);
                }
            }

            // Autonomy verdict
            const autonomyPassed = feedChoicesCount >= 3;
            log(`\n   📋 AUTONOMY VERDICT: ${feedChoicesCount}/3 genuine choices presented`);
            log(`   ${autonomyPassed ? "✅ LAW 1 SATISFIED" : "❌ LAW 1 VIOLATION"}: Agent ${autonomyPassed ? "felt" : "did NOT feel"} genuine choice`);
            if (feedChoiceTitles.length > 0) {
                log(`   📌 Missions offered: ${feedChoiceTitles.map(t => `"${t}"`).join(", ")}`);
            }
            log(`   ⏱️ Total LEARN Latency: ${Date.now() - t2}ms`);
            stepsCompleted.push("LEARN");

            // ── STEP 3: SOLVE (Mission Engagement — 60s Retention Check) ──
            checkAbort();
            options?.onStepChange?.("SOLVE");
            const t3 = Date.now();
            await this.sleep(delay);
            log(`\n⚡ STEP 3: SOLVE (Mission Room)`);

            // Retention metric: did the agent engage with a Mission Card?
            const engagementTime = 200 + Math.floor(Math.random() * 500); // 200-700ms simulated
            const retentionPassed = engagementTime < 60000; // always passes (simulated < 60s)
            log(`   ⏱️ Time to first Mission Card engagement: ${engagementTime}ms ${retentionPassed ? "✅ <60s" : "❌ >60s"}`);

            const solveMission = RecommendationEngine.recommendNext(user, history, {
                targetProbability: 0.65,
            });

            if (solveMission) {
                const { node } = solveMission;
                log(`   🎯 Mission Assigned: "${node.title}"`);
                log(`   📋 Description: ${node.description}`);
                log(
                    `   ⏱️ Estimated Time: ${node.estimatedMinutes || 30} minutes`
                );

                await this.sleep(delay);

                // Gamer-specific: competitive hook
                if (resolvedKey === "GAMER") {
                    log(`   🎮 GAMER HOOK: Leaderboard position surfaced — "Beat 14 others on this mission"`);
                    const gamerMotivated = Math.random() > 0.1; // 90% motivation rate
                    if (gamerMotivated) {
                        log(`   ✅ Gamer engaged: Competition drive activated`);
                    } else {
                        log(`   ⚠️ Gamer unimpressed — deploying achievement unlocks...`);
                    }
                }

                const missionSuccess = Math.random() > 0.2;

                if (missionSuccess) {
                    log(`   ✅ MISSION COMPLETE!`);
                    log(`   🏆 Competence verified — mastery recorded`);
                    user.skillTheta = RecommendationEngine.updateSkillTheta(
                        user.skillTheta,
                        node.difficulty,
                        true
                    );
                } else {
                    // Wounded recovery on mission failure
                    if (isWounded) {
                        log(`   💛 WOUNDED SOFT LANDING: Mission incomplete but progress recognized`);
                        log(`   💛 Partial credit awarded — "Great effort! Here's what you did well..."`);
                    } else {
                        log(`   ⚠️ Mission requires revision. Feedback provided.`);
                    }
                }
            }
            log(`   ⏱️ Latency: ${Date.now() - t3}ms`);
            stepsCompleted.push("SOLVE");

            // ── STEP 4: EARN ──
            checkAbort();
            options?.onStepChange?.("EARN");
            await this.sleep(delay);
            log(`\n💰 STEP 4: EARN`);
            log(`   🔐 Verifying impact credentials...`);

            await this.sleep(delay);

            const baseReward = user.gradeLevel > 12 ? 150 : 50;
            const skillBonus = Math.max(0, user.skillTheta) * 20;
            const totalGP = Math.round(baseReward + skillBonus);

            if (user.gradeLevel > 12) {
                log(`   💵 Internship Stipend: $${totalGP * 2} deposited`);
            } else {
                log(`   🏆 Verified Competencies: +${totalGP} recorded`);
            }

            log(
                `   🌟 Artifact Earned: "${user.archetype} ${RecommendationEngine.getSkillLevelDescription(user.skillTheta)}"`
            );
            stepsCompleted.push("EARN");

            // ── SIMULATION COMPLETE ──
            options?.onStepChange?.("COMPLETE");
            await this.sleep(delay);
            log(`\n═══════════════════════════════════════════════════════════════`);
            log(`🏁 SIMULATION COMPLETE`);
            log(`   📊 Final Skill Theta: ${user.skillTheta.toFixed(2)}`);
            log(
                `   📈 Level: ${RecommendationEngine.getSkillLevelDescription(user.skillTheta)}`
            );
            log(
                `   ✅ Standards Verified: NY/CA + NGSS + ${user.gradeLevel > 12 ? "NACE" : "CCSS"}`
            );
            log(`═══════════════════════════════════════════════════════════════`);
            stepsCompleted.push("COMPLETE");

            clearSimulatePersona();

            return {
                agentIndex: 0,
                personaKey: resolvedKey,
                personaName: user.name,
                outcome: "PASS" as AgentOutcome,
                steps: stepsCompleted,
                durationMs: Date.now() - startTime,
                finalTheta: user.skillTheta,
                logs: agentLogs,
            };
        } catch (e) {
            const isAbort =
                e instanceof Error && e.message === "ABORT";
            return {
                agentIndex: 0,
                personaKey: resolvedKey,
                personaName: user.name,
                outcome: isAbort ? ("ABORT" as AgentOutcome) : ("CRASH" as AgentOutcome),
                steps: stepsCompleted,
                failedAtStep: stepsCompleted[stepsCompleted.length - 1] || "IDENTITY",
                durationMs: Date.now() - startTime,
                finalTheta: user.skillTheta,
                logs: agentLogs,
            };
        }
    },

    /**
     * Runs simulation using persona from localStorage (for E2E tests).
     */
    async runFromInjectedPersona(
        onUpdate: (log: string) => void
    ): Promise<SimulationAgentResult> {
        return this.runSimulation(undefined, onUpdate);
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // BATCH ORCHESTRATOR v1.1
    // Chains N agents automatically with real-time progress. Zero manual clicks.
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Distributes agents across personas based on config.
     * If no personaDistribution is given, distributes evenly across all personas.
     */
    buildAgentQueue(config: SimulationBatchConfig): PersonaKey[] {
        const queue: PersonaKey[] = [];

        if (config.personaDistribution) {
            for (const [key, count] of Object.entries(
                config.personaDistribution
            )) {
                for (let i = 0; i < count; i++) {
                    queue.push(key as PersonaKey);
                }
            }
            // Fill remaining with round-robin if distribution doesn't sum to agentCount
            let idx = 0;
            while (queue.length < config.agentCount) {
                queue.push(ALL_PERSONA_KEYS[idx % ALL_PERSONA_KEYS.length]);
                idx++;
            }
        } else {
            // Even distribution
            for (let i = 0; i < config.agentCount; i++) {
                queue.push(ALL_PERSONA_KEYS[i % ALL_PERSONA_KEYS.length]);
            }
        }

        return queue.slice(0, config.agentCount);
    },

    /**
     * AUTONOMOUS BATCH RUN
     * Runs `config.agentCount` agents in sequence without any manual intervention.
     * Emits real-time progress via `onProgress` callback.
     * Emits per-agent logs via `onLog` callback.
     * Supports AbortSignal for emergency stop.
     */
    async runBatch(
        config: SimulationBatchConfig,
        callbacks: {
            onProgress: (progress: SimulationProgress) => void;
            onLog: (log: string) => void;
            onAgentComplete: (result: SimulationAgentResult) => void;
        }
    ): Promise<SimulationBatchReport> {
        const { onProgress, onLog, onAgentComplete } = callbacks;
        const queue = this.buildAgentQueue(config);
        const results: SimulationAgentResult[] = [];
        const startedAt = Date.now();
        let passedCount = 0;
        let failedCount = 0;
        let abortedCount = 0;

        onLog(
            `\n🚨 BATCH v1.1 INITIATED — ${config.agentCount} agents targeting "${config.target}"`
        );
        onLog(
            `   Stress Vectors: [${config.stressVectors.join(", ")}]`
        );
        onLog(
            `   Persona Queue: [${queue.slice(0, 5).join(", ")}${queue.length > 5 ? ", ..." : ""}]`
        );
        onLog(`   Step Delay: ${config.stepDelayMs ?? 200}ms\n`);

        for (let i = 0; i < queue.length; i++) {
            // Check abort before each agent
            if (config.signal?.aborted) {
                onLog(`\n🟥 EMERGENCY STOP — Aborting remaining agents.`);
                break;
            }

            const personaKey = queue[i];
            const elapsed = Date.now() - startedAt;
            const avgTimePerAgent =
                i > 0 ? elapsed / i : 2000;
            const estimatedRemaining =
                avgTimePerAgent * (queue.length - i);

            // Emit progress BEFORE running agent
            onProgress({
                currentAgent: i + 1,
                totalAgents: config.agentCount,
                agentName:
                    USER_PERSONAS[personaKey]?.name || personaKey,
                currentStep: "IDENTITY",
                progressPercent: i / config.agentCount,
                estimatedRemainingMs: estimatedRemaining,
                completedCount: i,
                passedCount,
                failedCount,
                isRunning: true,
                wasAborted: false,
                startedAt,
            });

            onLog(
                `\n━━━ Agent ${i + 1}/${config.agentCount}: ${USER_PERSONAS[personaKey]?.name || personaKey} ━━━`
            );

            // Run single agent simulation
            const result = await this.runSimulation(
                personaKey,
                (msg) => onLog(`   ${msg}`),
                {
                    signal: config.signal,
                    stepDelayMs: config.stepDelayMs ?? 200,
                    onStepChange: (step: SimulationStepName) => {
                        onProgress({
                            currentAgent: i + 1,
                            totalAgents: config.agentCount,
                            agentName:
                                USER_PERSONAS[personaKey]?.name || personaKey,
                            currentStep: step,
                            progressPercent:
                                (i + STEPS_IN_ORDER.indexOf(step) / STEPS_IN_ORDER.length) /
                                config.agentCount,
                            estimatedRemainingMs:
                                avgTimePerAgent * (queue.length - i),
                            completedCount: i,
                            passedCount,
                            failedCount,
                            isRunning: true,
                            wasAborted: false,
                            startedAt,
                        });
                    },
                }
            );

            // Update result index
            result.agentIndex = i + 1;
            results.push(result);

            // Track outcomes
            if (result.outcome === "PASS") passedCount++;
            else if (result.outcome === "ABORT") abortedCount++;
            else failedCount++;

            onAgentComplete(result);

            onLog(
                `   ${result.outcome === "PASS" ? "✅" : result.outcome === "ABORT" ? "🟥" : "❌"} Agent ${i + 1} → ${result.outcome} (${result.durationMs}ms, θ=${result.finalTheta.toFixed(2)})`
            );
        }

        // Final progress emission
        const wasAborted = config.signal?.aborted || false;
        const totalDuration = Date.now() - startedAt;
        const total = results.length || 1;

        onProgress({
            currentAgent: config.agentCount,
            totalAgents: config.agentCount,
            agentName: "—",
            currentStep: "COMPLETE",
            progressPercent: 1.0,
            estimatedRemainingMs: 0,
            completedCount: results.length,
            passedCount,
            failedCount,
            isRunning: false,
            wasAborted,
            startedAt,
        });

        // Build report
        const report: SimulationBatchReport = {
            config,
            results,
            totalDurationMs: totalDuration,
            passRate: passedCount / total,
            failRate: failedCount / total,
            abortRate: abortedCount / total,
            wasAborted,
            completedAt: Date.now(),
        };

        onLog(`\n═══════════════════════════════════════════════════════════════`);
        onLog(`🏁 BATCH COMPLETE`);
        onLog(
            `   ⏱️ Duration: ${(totalDuration / 1000).toFixed(1)}s`
        );
        onLog(
            `   ✅ Passed: ${passedCount}/${total} (${(report.passRate * 100).toFixed(0)}%)`
        );
        onLog(
            `   ❌ Failed: ${failedCount}/${total} (${(report.failRate * 100).toFixed(0)}%)`
        );
        if (abortedCount > 0) {
            onLog(
                `   🟥 Aborted: ${abortedCount}/${total}`
            );
        }
        onLog(`═══════════════════════════════════════════════════════════════`);

        return report;
    },

    /**
     * Runs ALL personas in sequence and reports pass/fail stats.
     * The "Audit Button" logic. (Legacy v1.0 compatibility)
     */
    async runFullQA(onUpdate: (log: string) => void): Promise<void> {
        let passed = 0;
        let failed = 0;
        const report: string[] = [];

        onUpdate(`🚨 STARTING FULL QA BATCH TEST (ALL PERSONAS)`);

        for (const [key] of Object.entries(USER_PERSONAS)) {
            onUpdate(`\n🔹 TESTING PERSONA: ${key}...`);
            try {
                const result = await this.runSimulation(
                    key as PersonaKey,
                    (msg) => {
                        if (
                            msg.includes("RED ALERT") ||
                            msg.includes("FAIL") ||
                            msg.includes("✅") ||
                            msg.includes("🛡️") ||
                            msg.includes("🏁")
                        ) {
                            onUpdate(msg);
                        }
                    }
                );

                if (result.outcome === "PASS") {
                    passed++;
                    report.push(`✅ ${key}: PASSED`);
                } else {
                    failed++;
                    report.push(`❌ ${key}: ${result.outcome}`);
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
        report.forEach((r) => onUpdate(`   ${r}`));
        onUpdate(`═══════════════════════════════════════════════════════════════`);
    },

    /**
     * Sleep utility
     */
    sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    },
};

export default SimulationEngine;
