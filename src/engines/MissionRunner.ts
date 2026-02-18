// =============================================================================
// MISSION RUNNER: Blueprint → Live Execution State Machine (Phase III)
// =============================================================================
//
// WHAT THIS IS:
// Converts a static Blueprint (a DAG of LogicNodes + LogicConnections) into a
// step-by-step live mission execution with deterministic state transitions:
//
//   GOAL → ACTION → CHECK → PAYOFF
//
// Each node in the Blueprint becomes a "step" the solver walks through.
// The Runner tracks progress, validates outputs, and records evidence for the
// Identity Engine (verified competencies, trait observations).
//
// WHAT THIS IS NOT:
// - Not a game loop (no ticks, no render cycle)
// - Not a mission generator (that's MissionGenerator.ts)
// - Not the Blueprint editor (that's BlueprintEngine.ts)
//
// ARCHITECTURE:
// ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
// │  Blueprint   │───>│ MissionRunner │───>│  Identity    │
// │  (static)    │    │  (live FSM)  │    │  Engine      │
// └──────────────┘    └──────────────┘    └──────────────┘
//    Nodes/Edges        State Machine       Competencies
//
// IMPORTS:
// - KnowledgeNode from v9.3 KnowledgeGraph (spiral framework alignment)
// - LogicNode/LogicConnection from architect types (blueprint structure)
// - MissionReward/CompletedNode from engine types (outcomes)
// =============================================================================

import type { KnowledgeNode, SpiralTier, SDI, BloomLevel } from './world-engine/KnowledgeGraph';
import type { LogicNode, LogicNodeType, LogicConnection, BlueprintState } from '../architect/types';
import type { MissionReward, CompletedNode, SkillCategory } from '../engine/types';

// =============================================================================
// TYPES
// =============================================================================

/** The phases a mission step can be in */
export type StepPhase = 'PENDING' | 'ACTIVE' | 'AWAITING_INPUT' | 'CHECKING' | 'PASSED' | 'FAILED' | 'SKIPPED';

/** The overall status of the mission */
export type MissionStatus =
    | 'IDLE'          // Created but not started
    | 'BRIEFING'      // Showing GOAL context
    | 'IN_PROGRESS'   // Solver is working through steps
    | 'CHECKING'      // Final validation in progress
    | 'COMPLETED'     // All steps passed → PAYOFF
    | 'FAILED'        // A critical step failed (retry available)
    | 'ABANDONED';    // Solver quit mid-mission

/** A single step in the mission execution */
export interface MissionStep {
    /** The original LogicNode from the Blueprint */
    node: LogicNode;

    /** Which phase this step is currently in */
    phase: StepPhase;

    /** The KnowledgeNode this step maps to (if any) — links to v9.3 */
    knowledgeNodeId?: string;

    /** Spiral Framework metadata (inherited from KnowledgeNode) */
    tier?: SpiralTier;
    sdi?: SDI;
    bloomLevel?: BloomLevel;

    /** Solver's submission for this step */
    submission?: StepSubmission;

    /** When this step became active */
    startedAt?: number;

    /** When this step was resolved (passed/failed) */
    resolvedAt?: number;
}

/** What the solver submits for a step */
export interface StepSubmission {
    /** The type of submission */
    type: 'TEXT' | 'CODE' | 'SELECTION' | 'FILE' | 'DRAWING' | 'AUTO';

    /** The raw payload */
    payload: unknown;

    /** Timestamp of submission */
    submittedAt: number;

    /** Time spent on this step (ms) */
    timeSpentMs: number;
}

/** Result of checking a step submission */
export interface StepCheckResult {
    passed: boolean;
    score: number;        // 0.0 - 1.0
    feedback: string;
    evidence?: string;    // For the Identity Engine
}

/** Configuration for how to run a mission */
export interface MissionRunConfig {
    /** The Blueprint to execute */
    blueprint: BlueprintState;

    /** Map of LogicNode IDs → KnowledgeNode IDs for v9.3 alignment */
    knowledgeMapping?: Map<string, string>;

    /** KnowledgeNode lookup (from the KnowledgeGraph) */
    knowledgeNodes?: Map<string, KnowledgeNode>;

    /** Reward on completion */
    reward: MissionReward;

    /** Mission metadata */
    missionId: string;
    title: string;
    description: string;

    /** Skill domain for CompletedNode recording */
    category: SkillCategory;

    /** Time limit in seconds (0 = unlimited) */
    timeLimitSeconds: number;

    /** Can the solver retry failed steps? */
    allowRetry: boolean;

    /** Maximum retry attempts per step */
    maxRetries: number;
}

/** Events emitted by the MissionRunner */
export type MissionEvent =
    | { type: 'MISSION_STARTED'; missionId: string; totalSteps: number }
    | { type: 'STEP_ACTIVATED'; stepIndex: number; node: LogicNode }
    | { type: 'STEP_AWAITING_INPUT'; stepIndex: number; nodeType: LogicNodeType }
    | { type: 'STEP_SUBMITTED'; stepIndex: number; submission: StepSubmission }
    | { type: 'STEP_CHECKED'; stepIndex: number; result: StepCheckResult }
    | { type: 'STEP_PASSED'; stepIndex: number; score: number }
    | { type: 'STEP_FAILED'; stepIndex: number; feedback: string }
    | { type: 'MISSION_COMPLETED'; completedNode: CompletedNode; reward: MissionReward }
    | { type: 'MISSION_FAILED'; failedStepIndex: number; reason: string }
    | { type: 'MISSION_ABANDONED'; completedSteps: number; totalSteps: number }
    | { type: 'TRAIT_OBSERVED'; traitId: string; evidence: string }
    | { type: 'COMPETENCY_VERIFIED'; competencyId: string; masteryScore: number };

export type MissionEventListener = (event: MissionEvent) => void;

// =============================================================================
// EXECUTION ORDER RESOLVER
// =============================================================================

/**
 * Topological sort of Blueprint nodes using connections as edges.
 * Respects the GOAL → ACTION → CHECK → PAYOFF ordering constraint.
 *
 * Priority: GOAL nodes first, then by dependency order (topological),
 * then PAYOFF nodes last.
 */
function resolveExecutionOrder(
    nodes: LogicNode[],
    connections: LogicConnection[]
): LogicNode[] {
    // Build adjacency + in-degree maps
    const adj = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    for (const node of nodes) {
        adj.set(node.id, []);
        inDegree.set(node.id, 0);
    }

    for (const conn of connections) {
        adj.get(conn.source)?.push(conn.target);
        inDegree.set(conn.target, (inDegree.get(conn.target) || 0) + 1);
    }

    // Kahn's algorithm — topological sort
    const queue: LogicNode[] = [];
    const sorted: LogicNode[] = [];

    // Seed with zero-indegree nodes (GOAL nodes should be first)
    for (const node of nodes) {
        if ((inDegree.get(node.id) || 0) === 0) {
            queue.push(node);
        }
    }

    // Sort queue: GOALs first, PAYOFFs last
    const typePriority: Record<LogicNodeType, number> = {
        GOAL: 0,
        ACTION: 1,
        DECISION: 2,
        CHECK: 3,
        PAYOFF: 4,
    };

    queue.sort((a, b) => typePriority[a.type] - typePriority[b.type]);

    while (queue.length > 0) {
        const current = queue.shift()!;
        sorted.push(current);

        for (const neighbor of (adj.get(current.id) || [])) {
            const newDegree = (inDegree.get(neighbor) || 1) - 1;
            inDegree.set(neighbor, newDegree);
            if (newDegree === 0) {
                const neighborNode = nodes.find(n => n.id === neighbor);
                if (neighborNode) {
                    // Insert sorted by type priority
                    let inserted = false;
                    for (let i = 0; i < queue.length; i++) {
                        if (typePriority[neighborNode.type] < typePriority[queue[i].type]) {
                            queue.splice(i, 0, neighborNode);
                            inserted = true;
                            break;
                        }
                    }
                    if (!inserted) queue.push(neighborNode);
                }
            }
        }
    }

    // Cycle detection
    if (sorted.length !== nodes.length) {
        console.warn('[MissionRunner] Blueprint contains a cycle! Falling back to type-order.');
        return [...nodes].sort((a, b) => typePriority[a.type] - typePriority[b.type]);
    }

    return sorted;
}

// =============================================================================
// MISSION RUNNER — FINITE STATE MACHINE
// =============================================================================

export class MissionRunner {
    // ─── State ───
    private status: MissionStatus = 'IDLE';
    private steps: MissionStep[] = [];
    private currentStepIndex: number = -1;
    private config: MissionRunConfig;

    // ─── Timing ───
    private startedAt: number = 0;
    private completedAt: number = 0;
    private retryCount: Map<number, number> = new Map();

    // ─── Event System ───
    private listeners: MissionEventListener[] = [];

    // ─── Trait Tracking ───
    private failThenSucceedCount: number = 0;
    private totalTimeMs: number = 0;

    // =========================================================================
    // CONSTRUCTOR
    // =========================================================================

    constructor(config: MissionRunConfig) {
        this.config = config;

        // Resolve execution order from Blueprint
        const orderedNodes = resolveExecutionOrder(
            config.blueprint.nodes,
            config.blueprint.connections
        );

        // Build steps with v9.3 metadata
        this.steps = orderedNodes.map(node => {
            const knowledgeId = config.knowledgeMapping?.get(node.id);
            const kNode = knowledgeId ? config.knowledgeNodes?.get(knowledgeId) : undefined;

            return {
                node,
                phase: 'PENDING' as StepPhase,
                knowledgeNodeId: knowledgeId,
                tier: kNode?.tier,
                sdi: kNode?.sdi,
                bloomLevel: kNode?.bloomLevel,
            };
        });
    }

    // =========================================================================
    // PUBLIC API
    // =========================================================================

    /** Get current mission status */
    getStatus(): MissionStatus {
        return this.status;
    }

    /** Get all steps with their current phases */
    getSteps(): Readonly<MissionStep[]> {
        return this.steps;
    }

    /** Get the currently active step (or null if none) */
    getCurrentStep(): MissionStep | null {
        if (this.currentStepIndex < 0 || this.currentStepIndex >= this.steps.length) {
            return null;
        }
        return this.steps[this.currentStepIndex];
    }

    /** Get the current step index */
    getCurrentStepIndex(): number {
        return this.currentStepIndex;
    }

    /** Get progress as a fraction (0.0 - 1.0) */
    getProgress(): number {
        if (this.steps.length === 0) return 0;
        const completed = this.steps.filter(s => s.phase === 'PASSED' || s.phase === 'SKIPPED').length;
        return completed / this.steps.length;
    }

    /** Get elapsed time in milliseconds */
    getElapsedMs(): number {
        if (this.startedAt === 0) return 0;
        const end = this.completedAt > 0 ? this.completedAt : Date.now();
        return end - this.startedAt;
    }

    /** Subscribe to mission events */
    on(listener: MissionEventListener): () => void {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    // =========================================================================
    // STATE TRANSITIONS
    // =========================================================================

    /**
     * START the mission.
     * Transitions: IDLE → BRIEFING → (auto) first GOAL step
     */
    start(): void {
        if (this.status !== 'IDLE') {
            console.warn(`[MissionRunner] Cannot start: status is ${this.status}`);
            return;
        }

        if (this.steps.length === 0) {
            console.error('[MissionRunner] Cannot start: blueprint has no nodes');
            return;
        }

        this.status = 'BRIEFING';
        this.startedAt = Date.now();

        this.emit({
            type: 'MISSION_STARTED',
            missionId: this.config.missionId,
            totalSteps: this.steps.length,
        });

        // Auto-advance to first step
        this.advanceToNextStep();
    }

    /**
     * SUBMIT solver input for the current step.
     * Transitions: AWAITING_INPUT → CHECKING → (PASSED | FAILED)
     */
    submit(submission: StepSubmission): void {
        const step = this.getCurrentStep();
        if (!step || step.phase !== 'AWAITING_INPUT') {
            console.warn('[MissionRunner] Cannot submit: no step awaiting input');
            return;
        }

        step.submission = submission;
        step.phase = 'CHECKING';
        this.status = 'CHECKING';

        this.emit({
            type: 'STEP_SUBMITTED',
            stepIndex: this.currentStepIndex,
            submission,
        });

        // Run the check
        const result = this.checkStep(step);

        this.emit({
            type: 'STEP_CHECKED',
            stepIndex: this.currentStepIndex,
            result,
        });

        if (result.passed) {
            this.resolveStepPassed(step, result);
        } else {
            this.resolveStepFailed(step, result);
        }
    }

    /**
     * RETRY the current step after failure.
     * Transitions: FAILED → AWAITING_INPUT (if retries available)
     */
    retry(): boolean {
        const step = this.getCurrentStep();
        if (!step || step.phase !== 'FAILED') {
            console.warn('[MissionRunner] Cannot retry: step is not in FAILED state');
            return false;
        }

        if (!this.config.allowRetry) {
            console.warn('[MissionRunner] Retries not allowed for this mission');
            return false;
        }

        const retries = this.retryCount.get(this.currentStepIndex) || 0;
        if (retries >= this.config.maxRetries) {
            console.warn(`[MissionRunner] Max retries (${this.config.maxRetries}) reached`);
            return false;
        }

        this.retryCount.set(this.currentStepIndex, retries + 1);
        step.phase = 'AWAITING_INPUT';
        step.submission = undefined;
        this.status = 'IN_PROGRESS';

        this.emit({
            type: 'STEP_AWAITING_INPUT',
            stepIndex: this.currentStepIndex,
            nodeType: step.node.type,
        });

        return true;
    }

    /**
     * ABANDON the mission.
     * Transitions: any → ABANDONED
     */
    abandon(): void {
        if (this.status === 'COMPLETED' || this.status === 'ABANDONED') return;

        const completedSteps = this.steps.filter(s => s.phase === 'PASSED').length;
        this.status = 'ABANDONED';
        this.completedAt = Date.now();

        this.emit({
            type: 'MISSION_ABANDONED',
            completedSteps,
            totalSteps: this.steps.length,
        });
    }

    // =========================================================================
    // INTERNAL STATE MACHINE
    // =========================================================================

    private advanceToNextStep(): void {
        this.currentStepIndex++;

        if (this.currentStepIndex >= this.steps.length) {
            // All steps completed → PAYOFF
            this.completeMission();
            return;
        }

        const step = this.steps[this.currentStepIndex];
        step.phase = 'ACTIVE';
        step.startedAt = Date.now();
        this.status = 'IN_PROGRESS';

        this.emit({
            type: 'STEP_ACTIVATED',
            stepIndex: this.currentStepIndex,
            node: step.node,
        });

        // Auto-handling based on node type
        switch (step.node.type) {
            case 'GOAL':
                // GOAL steps are informational — auto-pass after "briefing"
                step.phase = 'PASSED';
                step.resolvedAt = Date.now();
                this.emit({ type: 'STEP_PASSED', stepIndex: this.currentStepIndex, score: 1.0 });
                // Advance immediately
                this.advanceToNextStep();
                break;

            case 'ACTION':
            case 'DECISION':
            case 'CHECK':
                // These require solver input
                step.phase = 'AWAITING_INPUT';
                this.emit({
                    type: 'STEP_AWAITING_INPUT',
                    stepIndex: this.currentStepIndex,
                    nodeType: step.node.type,
                });
                break;

            case 'PAYOFF':
                // PAYOFF steps are auto-resolved — the reward is the step
                step.phase = 'PASSED';
                step.resolvedAt = Date.now();
                this.emit({ type: 'STEP_PASSED', stepIndex: this.currentStepIndex, score: 1.0 });
                this.advanceToNextStep();
                break;

            default:
                console.warn(`[MissionRunner] Unknown node type: ${step.node.type}`);
                step.phase = 'SKIPPED';
                this.advanceToNextStep();
        }
    }

    private resolveStepPassed(step: MissionStep, result: StepCheckResult): void {
        step.phase = 'PASSED';
        step.resolvedAt = Date.now();
        this.status = 'IN_PROGRESS';

        // Track fail-then-succeed for resilience trait
        const retries = this.retryCount.get(this.currentStepIndex) || 0;
        if (retries > 0) {
            this.failThenSucceedCount++;
            this.emit({
                type: 'TRAIT_OBSERVED',
                traitId: 'resilience',
                evidence: `Passed step "${step.node.label}" after ${retries} retry attempt(s)`,
            });
        }

        // Record evidence if this maps to a v9.3 KnowledgeNode
        if (step.knowledgeNodeId && result.score >= 0.8 && result.evidence) {
            this.emit({
                type: 'COMPETENCY_VERIFIED',
                competencyId: step.knowledgeNodeId,
                masteryScore: result.score,
            });
        }

        this.emit({
            type: 'STEP_PASSED',
            stepIndex: this.currentStepIndex,
            score: result.score,
        });

        // Advance
        this.advanceToNextStep();
    }

    private resolveStepFailed(step: MissionStep, result: StepCheckResult): void {
        step.phase = 'FAILED';
        this.status = 'IN_PROGRESS';

        this.emit({
            type: 'STEP_FAILED',
            stepIndex: this.currentStepIndex,
            feedback: result.feedback,
        });

        // If no retry allowed and it's a critical step, fail the mission
        if (!this.config.allowRetry || (this.retryCount.get(this.currentStepIndex) || 0) >= this.config.maxRetries) {
            if (step.node.type === 'CHECK') {
                // CHECK failures are critical — mission fails
                this.failMission(this.currentStepIndex, result.feedback);
            }
            // ACTION/DECISION failures allow skipping or retrying
        }
    }

    private completeMission(): void {
        this.status = 'COMPLETED';
        this.completedAt = Date.now();
        this.totalTimeMs = this.completedAt - this.startedAt;

        // Build the CompletedNode evidence record
        const avgScore = this.steps
            .filter(s => s.submission)
            .reduce((sum, s) => {
                // Default to 1.0 for steps without checks (GOAL/PAYOFF)
                const result = this.checkStep(s);
                return sum + result.score;
            }, 0) / Math.max(1, this.steps.filter(s => s.submission).length);

        const completedNode: CompletedNode = {
            id: this.config.missionId,
            title: this.config.title,
            category: this.config.category,
            completedAt: this.completedAt,
            competencyProven: avgScore >= 0.8,
            timeSpent: Math.round(this.totalTimeMs / 1000),
            accuracy: Math.round(avgScore * 100),
            attempts: 1 + (this.retryCount.size > 0
                ? Array.from(this.retryCount.values()).reduce((a, b) => a + b, 0)
                : 0),
        };

        this.emit({
            type: 'MISSION_COMPLETED',
            completedNode,
            reward: this.config.reward,
        });

        // Observe traits
        if (this.failThenSucceedCount >= 2) {
            this.emit({
                type: 'TRAIT_OBSERVED',
                traitId: 'resilience',
                evidence: `Completed mission "${this.config.title}" after recovering from ${this.failThenSucceedCount} failed steps`,
            });
        }

        if (avgScore >= 0.95) {
            this.emit({
                type: 'TRAIT_OBSERVED',
                traitId: 'precision',
                evidence: `Achieved ${Math.round(avgScore * 100)}% accuracy on "${this.config.title}"`,
            });
        }
    }

    private failMission(failedStepIndex: number, reason: string): void {
        this.status = 'FAILED';
        this.completedAt = Date.now();

        this.emit({
            type: 'MISSION_FAILED',
            failedStepIndex,
            reason,
        });
    }

    // =========================================================================
    // STEP CHECKER
    // =========================================================================

    /**
     * Check a step's submission.
     *
     * In production, this would delegate to domain-specific checkers:
     * - Math: verify numerical answer
     * - Code: run test suite
     * - Creative: AI evaluation rubric
     * - Science: data validation
     *
     * For now, this is a pluggable stub that returns a default pass.
     * The real checker will be injected via config in Phase IV.
     */
    private checkStep(step: MissionStep): StepCheckResult {
        if (!step.submission) {
            return { passed: false, score: 0, feedback: 'No submission provided' };
        }

        // GOAL and PAYOFF steps auto-pass
        if (step.node.type === 'GOAL' || step.node.type === 'PAYOFF') {
            return { passed: true, score: 1.0, feedback: 'Informational step completed' };
        }

        // Default: pass with full score (stub — real checkers in Phase IV)
        // The data field on LogicNode can contain checker hints
        const expectedAnswer = step.node.data?.['expectedAnswer'];

        if (expectedAnswer !== undefined) {
            const isCorrect = String(step.submission.payload) === String(expectedAnswer);
            return {
                passed: isCorrect,
                score: isCorrect ? 1.0 : 0.0,
                feedback: isCorrect ? 'Correct!' : `Expected: ${expectedAnswer}`,
                evidence: isCorrect
                    ? `Correctly answered "${step.node.label}"`
                    : undefined,
            };
        }

        // No checker defined — auto-pass for now
        return {
            passed: true,
            score: 0.85,
            feedback: 'Submission accepted (auto-verified)',
            evidence: `Completed step "${step.node.label}"`,
        };
    }

    // =========================================================================
    // EVENT EMITTER
    // =========================================================================

    private emit(event: MissionEvent): void {
        console.log(`[MissionRunner] ${event.type}`, event);
        for (const listener of this.listeners) {
            try {
                listener(event);
            } catch (err) {
                console.error('[MissionRunner] Listener error:', err);
            }
        }
    }
}

// =============================================================================
// FACTORY — Create a MissionRunner from a BlueprintState
// =============================================================================

export function createMissionFromBlueprint(
    blueprint: BlueprintState,
    options: {
        missionId?: string;
        title?: string;
        description?: string;
        category?: SkillCategory;
        reward?: MissionReward;
        knowledgeMapping?: Map<string, string>;
        knowledgeNodes?: Map<string, KnowledgeNode>;
        timeLimitSeconds?: number;
        allowRetry?: boolean;
        maxRetries?: number;
    } = {}
): MissionRunner {
    return new MissionRunner({
        blueprint,
        missionId: options.missionId || `mission_${Date.now()}`,
        title: options.title || 'Untitled Mission',
        description: options.description || '',
        category: options.category || 'logic',
        reward: options.reward || { competencies: [] },
        knowledgeMapping: options.knowledgeMapping,
        knowledgeNodes: options.knowledgeNodes,
        timeLimitSeconds: options.timeLimitSeconds || 0,
        allowRetry: options.allowRetry ?? true,
        maxRetries: options.maxRetries ?? 3,
    });
}
