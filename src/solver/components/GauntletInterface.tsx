// =============================================================================
// GAUNTLET INTERFACE — Mission Control (Phase III, Step 2)
// =============================================================================
//
// NOT a quiz screen. NOT Duolingo. This is MISSION CONTROL.
// Aesthetic: SpaceX Launch Control / IDE Debugger — dark, data-dense, alive.
//
// LAYOUT:
// ┌──────────────────────────────────────────────────────────────┐
// │  MISSION HEADER (title, status badge, elapsed timer)        │
// ├───────────────────────────────────┬──────────────────────────┤
// │  TELEMETRY DECK                  │  NEURAL LINK             │
// │  (step timeline + active step)   │  (NeuralAvatar, compact) │
// │                                  │  + event pulse ring      │
// ├───────────────────────────────────┴──────────────────────────┤
// │  SOLVER INPUT ZONE (dynamic per step type)                  │
// ├─────────────────────────────────────────────────────────────│
// │  TERMINAL (scrolling system log)                            │
// └──────────────────────────────────────────────────────────────┘
//
// FAILURE PHILOSOPHY:
// When CHECK fails → SDI Gap Analysis, NOT "Try Again".
// Failure = a bug in the logic graph, not a judgment of worth.
// =============================================================================

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
    Target,
    Zap,
    CheckCircle2,
    Gift,
    GitBranch,
    Clock,
    AlertTriangle,
    Terminal,
    RotateCcw,
    XCircle,
    ChevronRight,
    Activity,
    Play,
    Send,
    Bug,
    BookOpen,
} from 'lucide-react';

import {
    MissionRunner,
    createMissionFromBlueprint,
    type MissionEvent,
    type MissionStep,
    type MissionStatus,
    type StepPhase,
    type StepSubmission,
} from '../../engines/MissionRunner';

import type { LogicNodeType, BlueprintState } from '../../architect/types';
import type { SkillGraph, SkillCategory } from '../../engine/types';
import type { VerifiedCompetency } from '../../engines/world-engine/LearnerModel';
import type { MissionReward } from '../../engine/types';
import type { KnowledgeNode } from '../../engines/world-engine/KnowledgeGraph';

// =============================================================================
// TYPES
// =============================================================================

interface GauntletInterfaceProps {
    /** The blueprint to execute */
    blueprint: BlueprintState;

    /** Mission metadata */
    missionId: string;
    title: string;
    description: string;
    category: SkillCategory;

    /** Rewards on completion */
    reward: MissionReward;

    /** v9.3 Knowledge Graph mappings */
    knowledgeMapping?: Map<string, string>;
    knowledgeNodes?: Map<string, KnowledgeNode>;

    /** Neural Avatar data (for the Neural Link panel) */
    skillGraph: SkillGraph;
    verifiedCompetencies: VerifiedCompetency[];
    calibrationScore: number;

    /** Config */
    allowRetry?: boolean;
    maxRetries?: number;
    timeLimitSeconds?: number;

    /** Callbacks */
    onComplete?: (reward: MissionReward) => void;
    onAbandon?: () => void;
}

interface TerminalLine {
    timestamp: number;
    type: 'system' | 'success' | 'error' | 'warning' | 'info' | 'trait';
    message: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const NODE_TYPE_META: Record<LogicNodeType, {
    icon: React.ReactNode;
    label: string;
    color: string;
    bgColor: string;
    verb: string;
}> = {
    GOAL: {
        icon: <Target size={16} />,
        label: 'GOAL',
        color: '#22d3ee',
        bgColor: 'rgba(34, 211, 238, 0.1)',
        verb: 'INITIALIZING',
    },
    ACTION: {
        icon: <Zap size={16} />,
        label: 'ACTION',
        color: '#a78bfa',
        bgColor: 'rgba(167, 139, 250, 0.1)',
        verb: 'EXECUTING',
    },
    DECISION: {
        icon: <GitBranch size={16} />,
        label: 'DECISION',
        color: '#f59e0b',
        bgColor: 'rgba(245, 158, 11, 0.1)',
        verb: 'EVALUATING',
    },
    CHECK: {
        icon: <CheckCircle2 size={16} />,
        label: 'CHECK',
        color: '#10b981',
        bgColor: 'rgba(16, 185, 129, 0.1)',
        verb: 'VALIDATING',
    },
    PAYOFF: {
        icon: <Gift size={16} />,
        label: 'PAYOFF',
        color: '#ec4899',
        bgColor: 'rgba(236, 72, 153, 0.1)',
        verb: 'REWARDING',
    },
};

const STATUS_META: Record<MissionStatus, {
    label: string;
    color: string;
    pulseClass: string;
}> = {
    IDLE: { label: 'STANDBY', color: '#64748b', pulseClass: '' },
    BRIEFING: { label: 'BRIEFING', color: '#22d3ee', pulseClass: 'gauntlet-pulse-cyan' },
    IN_PROGRESS: { label: 'LIVE', color: '#10b981', pulseClass: 'gauntlet-pulse-green' },
    CHECKING: { label: 'COMPUTING', color: '#f59e0b', pulseClass: 'gauntlet-pulse-amber' },
    COMPLETED: { label: 'COMPLETE', color: '#10b981', pulseClass: '' },
    FAILED: { label: 'ABORTED', color: '#ef4444', pulseClass: 'gauntlet-pulse-red' },
    ABANDONED: { label: 'ABANDONED', color: '#64748b', pulseClass: '' },
};

const PHASE_COLOR: Record<StepPhase, string> = {
    PENDING: '#334155',
    ACTIVE: '#22d3ee',
    AWAITING_INPUT: '#a78bfa',
    CHECKING: '#f59e0b',
    PASSED: '#10b981',
    FAILED: '#ef4444',
    SKIPPED: '#64748b',
};

// SDI gap labels for failure diagnostics
const SDI_GAP_LABELS: Record<number, { label: string; description: string; module: string }> = {
    0: { label: 'Observation', description: 'Concrete pattern recognition', module: 'Foundations' },
    1: { label: 'Modeling', description: 'Abstract model construction', module: 'Modeling Lab' },
    2: { label: 'Variable Isolation', description: 'Isolating and testing variables', module: 'Logic Core' },
    3: { label: 'Systems Integration', description: 'Multi-system synthesis', module: 'Systems Thinking' },
};

// =============================================================================
// COMPONENT
// =============================================================================

export const GauntletInterface: React.FC<GauntletInterfaceProps> = ({
    blueprint,
    missionId,
    title,
    description,
    category,
    reward,
    knowledgeMapping,
    knowledgeNodes,
    skillGraph,
    verifiedCompetencies,
    calibrationScore,
    allowRetry = true,
    maxRetries = 3,
    timeLimitSeconds = 0,
    onComplete,
    onAbandon,
}) => {
    // ─── State ───
    const [runner, setRunner] = useState<MissionRunner | null>(null);
    const [status, setStatus] = useState<MissionStatus>('IDLE');
    const [steps, setSteps] = useState<Readonly<MissionStep[]>>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    const [progress, setProgress] = useState(0);
    const [elapsedMs, setElapsedMs] = useState(0);
    const [terminalLog, setTerminalLog] = useState<TerminalLine[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [neuralPulse, setNeuralPulse] = useState(false);
    const [failedStepData, setFailedStepData] = useState<{
        stepIndex: number;
        sdi: number;
        feedback: string;
        nodeLabel: string;
    } | null>(null);

    // ─── Refs ───
    const terminalRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // ─── Terminal Logger ───
    const logToTerminal = useCallback((type: TerminalLine['type'], message: string) => {
        setTerminalLog(prev => [...prev, {
            timestamp: Date.now(),
            type,
            message,
        }]);
    }, []);

    // ─── Initialize MissionRunner ───
    useEffect(() => {
        const missionRunner = createMissionFromBlueprint(blueprint, {
            missionId,
            title,
            description,
            category,
            reward,
            knowledgeMapping,
            knowledgeNodes,
            timeLimitSeconds,
            allowRetry,
            maxRetries,
        });

        // Subscribe to events
        const unsub = missionRunner.on((event: MissionEvent) => {
            // Trigger Neural Link pulse on every state change
            setNeuralPulse(true);
            setTimeout(() => setNeuralPulse(false), 800);

            // Update reactive state
            setStatus(missionRunner.getStatus());
            setSteps([...missionRunner.getSteps()]);
            setCurrentStepIndex(missionRunner.getCurrentStepIndex());
            setProgress(missionRunner.getProgress());

            // Route events to terminal
            switch (event.type) {
                case 'MISSION_STARTED':
                    logToTerminal('system', `>> MISSION INITIALIZED: "${title}" [${event.totalSteps} steps]`);
                    logToTerminal('system', `>> Execution order resolved. Commencing briefing...`);
                    break;

                case 'STEP_ACTIVATED':
                    logToTerminal('info', `>> STEP ${event.stepIndex + 1}: ${NODE_TYPE_META[event.node.type].verb} — "${event.node.label}"`);
                    break;

                case 'STEP_AWAITING_INPUT': {
                    const verb = event.nodeType === 'CHECK' ? 'Validation required' : 'Input required';
                    logToTerminal('warning', `>> AWAITING: ${verb} at Step ${event.stepIndex + 1}`);
                    break;
                }

                case 'STEP_SUBMITTED':
                    logToTerminal('system', `>> SUBMITTED: Processing Step ${event.stepIndex + 1}...`);
                    break;

                case 'STEP_CHECKED':
                    if (event.result.passed) {
                        logToTerminal('success', `>> CHECK PASSED: Score ${Math.round(event.result.score * 100)}% — ${event.result.feedback}`);
                    } else {
                        logToTerminal('error', `>> CHECK FAILED: ${event.result.feedback}`);
                    }
                    break;

                case 'STEP_PASSED':
                    logToTerminal('success', `>> STEP ${event.stepIndex + 1} RESOLVED: ✓ (${Math.round(event.score * 100)}%)`);
                    break;

                case 'STEP_FAILED':
                    logToTerminal('error', `>> STEP ${event.stepIndex + 1} FAILED: ${event.feedback}`);
                    break;

                case 'MISSION_COMPLETED':
                    logToTerminal('success', `>> MISSION COMPLETE — Accuracy: ${event.completedNode.accuracy}% | Time: ${event.completedNode.timeSpent}s`);
                    logToTerminal('success', `>> Competencies verified: ${event.reward.competencies.length}`);
                    onComplete?.(event.reward);
                    break;

                case 'MISSION_FAILED': {
                    logToTerminal('error', `>> MISSION ABORTED at Step ${event.failedStepIndex + 1}: ${event.reason}`);
                    // Build SDI gap data
                    const failedStep = missionRunner.getSteps()[event.failedStepIndex];
                    if (failedStep) {
                        setFailedStepData({
                            stepIndex: event.failedStepIndex,
                            sdi: failedStep.sdi ?? 0,
                            feedback: event.reason,
                            nodeLabel: failedStep.node.label,
                        });
                    }
                    break;
                }

                case 'TRAIT_OBSERVED':
                    logToTerminal('trait', `>> TRAIT DETECTED: ${event.traitId} — "${event.evidence}"`);
                    break;

                case 'COMPETENCY_VERIFIED':
                    logToTerminal('success', `>> COMPETENCY VERIFIED: ${event.competencyId} (${Math.round(event.masteryScore * 100)}%)`);
                    break;

                case 'MISSION_ABANDONED':
                    logToTerminal('warning', `>> MISSION ABANDONED: ${event.completedSteps}/${event.totalSteps} steps completed`);
                    break;
            }
        });

        setRunner(missionRunner);
        logToTerminal('system', `>> MissionRunner v3.0 loaded`);
        logToTerminal('system', `>> Blueprint: ${blueprint.nodes.length} nodes, ${blueprint.connections.length} connections`);
        logToTerminal('system', `>> Awaiting launch command...`);

        return () => {
            unsub();
            if (timerRef.current) clearInterval(timerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ─── Elapsed Timer ───
    useEffect(() => {
        if (status === 'IN_PROGRESS' || status === 'BRIEFING' || status === 'CHECKING') {
            timerRef.current = setInterval(() => {
                if (runner) {
                    setElapsedMs(runner.getElapsedMs());
                }
            }, 100);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [status, runner]);

    // ─── Auto-scroll terminal ───
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [terminalLog]);

    // ─── Derived State ───
    const currentStep = useMemo(() => {
        if (currentStepIndex < 0 || currentStepIndex >= steps.length) return null;
        return steps[currentStepIndex];
    }, [currentStepIndex, steps]);

    const formattedTime = useMemo(() => {
        const totalSeconds = Math.floor(elapsedMs / 1000);
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        const ms = Math.floor((elapsedMs % 1000) / 10);
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
    }, [elapsedMs]);

    // ─── Handlers ───
    const handleStart = useCallback(() => {
        runner?.start();
    }, [runner]);

    const handleSubmit = useCallback(() => {
        if (!runner || !inputValue.trim()) return;
        const submission: StepSubmission = {
            type: 'TEXT',
            payload: inputValue.trim(),
            submittedAt: Date.now(),
            timeSpentMs: runner.getElapsedMs(),
        };
        runner.submit(submission);
        setInputValue('');
    }, [runner, inputValue]);

    const handleRetry = useCallback(() => {
        if (!runner) return;
        const retried = runner.retry();
        if (retried) {
            setFailedStepData(null);
            logToTerminal('system', `>> RETRY: Reinitializing Step ${currentStepIndex + 1}...`);
        }
    }, [runner, currentStepIndex, logToTerminal]);

    const handleAbandon = useCallback(() => {
        runner?.abandon();
        onAbandon?.();
    }, [runner, onAbandon]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    }, [handleSubmit]);

    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <div style={{
            background: '#0a0e17',
            color: '#e2e8f0',
            minHeight: '100vh',
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Scanline overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
                zIndex: 100,
            }} />

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* MISSION HEADER BAR */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <header style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 20px',
                borderBottom: '1px solid rgba(100, 116, 139, 0.2)',
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.9), rgba(10, 14, 23, 1))',
                flexShrink: 0,
            }}>
                {/* Left: Mission ID + Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        fontSize: 10,
                        letterSpacing: 2,
                        color: '#64748b',
                        textTransform: 'uppercase',
                    }}>
                        MR-{missionId.slice(-6).toUpperCase()}
                    </div>
                    <div style={{
                        width: 1,
                        height: 20,
                        background: '#1e293b',
                    }} />
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>
                        {title}
                    </div>
                </div>

                {/* Center: Status Badge */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                }}>
                    <div
                        className={STATUS_META[status].pulseClass}
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: STATUS_META[status].color,
                        }}
                    />
                    <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 2,
                        color: STATUS_META[status].color,
                        textTransform: 'uppercase',
                    }}>
                        {STATUS_META[status].label}
                    </span>
                </div>

                {/* Right: Timer + Progress */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8' }}>
                        <Clock size={14} />
                        <span style={{ fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>
                            {formattedTime}
                        </span>
                    </div>
                    <div style={{
                        width: 80,
                        height: 4,
                        borderRadius: 2,
                        background: '#1e293b',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            width: `${progress * 100}%`,
                            height: '100%',
                            borderRadius: 2,
                            background: 'linear-gradient(90deg, #22d3ee, #10b981)',
                            transition: 'width 0.5s ease-out',
                        }} />
                    </div>
                    <span style={{ fontSize: 11, color: '#64748b' }}>
                        {Math.round(progress * 100)}%
                    </span>
                </div>
            </header>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* MAIN BODY: TELEMETRY + NEURAL LINK */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 280px',
                flex: 1,
                overflow: 'hidden',
            }}>
                {/* ─── LEFT: TELEMETRY DECK ─── */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: '1px solid rgba(100, 116, 139, 0.15)',
                    overflow: 'hidden',
                }}>
                    {/* Step Timeline */}
                    <div style={{
                        padding: '16px 20px',
                        borderBottom: '1px solid rgba(100, 116, 139, 0.15)',
                        flexShrink: 0,
                    }}>
                        <div style={{
                            fontSize: 9,
                            letterSpacing: 2,
                            color: '#475569',
                            marginBottom: 10,
                            textTransform: 'uppercase',
                        }}>
                            Execution Pipeline
                        </div>
                        <div style={{
                            display: 'flex',
                            gap: 4,
                            alignItems: 'center',
                            overflowX: 'auto',
                            paddingBottom: 4,
                        }}>
                            {steps.map((step, i) => {
                                const meta = NODE_TYPE_META[step.node.type];
                                const isCurrent = i === currentStepIndex;
                                return (
                                    <div key={step.node.id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4,
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 6,
                                            padding: '5px 10px',
                                            borderRadius: 4,
                                            background: isCurrent ? meta.bgColor : 'transparent',
                                            border: `1px solid ${isCurrent ? meta.color : PHASE_COLOR[step.phase]}`,
                                            opacity: step.phase === 'PENDING' ? 0.4 : 1,
                                            transition: 'all 0.3s ease',
                                            position: 'relative',
                                        }}>
                                            {isCurrent && (
                                                <div style={{
                                                    position: 'absolute',
                                                    inset: -1,
                                                    borderRadius: 4,
                                                    border: `1px solid ${meta.color}`,
                                                    animation: 'gauntlet-step-glow 2s ease-in-out infinite',
                                                    pointerEvents: 'none',
                                                }} />
                                            )}
                                            <span style={{ color: PHASE_COLOR[step.phase] }}>
                                                {meta.icon}
                                            </span>
                                            <span style={{
                                                fontSize: 10,
                                                fontWeight: 600,
                                                color: PHASE_COLOR[step.phase],
                                                letterSpacing: 1,
                                                whiteSpace: 'nowrap',
                                            }}>
                                                {meta.label}
                                            </span>
                                            {step.phase === 'PASSED' && (
                                                <CheckCircle2 size={12} style={{ color: '#10b981' }} />
                                            )}
                                            {step.phase === 'FAILED' && (
                                                <XCircle size={12} style={{ color: '#ef4444' }} />
                                            )}
                                        </div>
                                        {i < steps.length - 1 && (
                                            <ChevronRight size={12} style={{ color: '#334155', flexShrink: 0 }} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Active Step Display */}
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '20px',
                        overflow: 'auto',
                    }}>
                        {/* ─── IDLE STATE ─── */}
                        {status === 'IDLE' && (
                            <div style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 20,
                            }}>
                                <div style={{
                                    fontSize: 10,
                                    letterSpacing: 3,
                                    color: '#475569',
                                    textTransform: 'uppercase',
                                }}>
                                    Mission Control — Standing By
                                </div>
                                <p style={{
                                    fontSize: 12,
                                    color: '#94a3b8',
                                    textAlign: 'center',
                                    maxWidth: 400,
                                    lineHeight: 1.6,
                                }}>
                                    {description}
                                </p>
                                <button
                                    onClick={handleStart}
                                    style={{
                                        padding: '12px 32px',
                                        border: '1px solid #22d3ee',
                                        borderRadius: 6,
                                        background: 'rgba(34, 211, 238, 0.08)',
                                        color: '#22d3ee',
                                        fontSize: 12,
                                        fontWeight: 700,
                                        letterSpacing: 2,
                                        cursor: 'pointer',
                                        textTransform: 'uppercase',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        transition: 'all 0.2s',
                                        fontFamily: 'inherit',
                                    }}
                                    onMouseOver={e => {
                                        e.currentTarget.style.background = 'rgba(34, 211, 238, 0.2)';
                                        e.currentTarget.style.boxShadow = '0 0 20px rgba(34, 211, 238, 0.2)';
                                    }}
                                    onMouseOut={e => {
                                        e.currentTarget.style.background = 'rgba(34, 211, 238, 0.08)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <Play size={14} />
                                    Launch Mission
                                </button>
                            </div>
                        )}

                        {/* ─── ACTIVE STEP ─── */}
                        {currentStep && status !== 'IDLE' && status !== 'FAILED' && status !== 'COMPLETED' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {/* Step Header */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                }}>
                                    <div style={{
                                        padding: '6px 10px',
                                        borderRadius: 4,
                                        background: NODE_TYPE_META[currentStep.node.type].bgColor,
                                        border: `1px solid ${NODE_TYPE_META[currentStep.node.type].color}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                    }}>
                                        <span style={{ color: NODE_TYPE_META[currentStep.node.type].color }}>
                                            {NODE_TYPE_META[currentStep.node.type].icon}
                                        </span>
                                        <span style={{
                                            fontSize: 10,
                                            fontWeight: 700,
                                            color: NODE_TYPE_META[currentStep.node.type].color,
                                            letterSpacing: 2,
                                        }}>
                                            {NODE_TYPE_META[currentStep.node.type].label}
                                        </span>
                                    </div>
                                    <div style={{
                                        fontSize: 9,
                                        color: '#475569',
                                        letterSpacing: 1,
                                    }}>
                                        STEP {currentStepIndex + 1} OF {steps.length}
                                    </div>
                                    {currentStep.tier && (
                                        <div style={{
                                            fontSize: 9,
                                            color: '#64748b',
                                            padding: '2px 6px',
                                            border: '1px solid #1e293b',
                                            borderRadius: 3,
                                        }}>
                                            T:{currentStep.tier} SDI:{currentStep.sdi}
                                        </div>
                                    )}
                                </div>

                                {/* Step Label */}
                                <h2 style={{
                                    fontSize: 18,
                                    fontWeight: 600,
                                    color: '#f1f5f9',
                                    margin: 0,
                                    fontFamily: "'Inter', system-ui, sans-serif",
                                }}>
                                    {currentStep.node.label}
                                </h2>

                                {/* Step Data / Description */}
                                {currentStep.node.data?.['description'] && (
                                    <p style={{
                                        fontSize: 13,
                                        color: '#94a3b8',
                                        lineHeight: 1.6,
                                        margin: 0,
                                        fontFamily: "'Inter', system-ui, sans-serif",
                                    }}>
                                        {String(currentStep.node.data['description'])}
                                    </p>
                                )}

                                {/* Input Zone */}
                                {currentStep.phase === 'AWAITING_INPUT' && (
                                    <div style={{
                                        marginTop: 8,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 12,
                                    }}>
                                        <div style={{
                                            fontSize: 9,
                                            letterSpacing: 2,
                                            color: '#a78bfa',
                                            textTransform: 'uppercase',
                                        }}>
                                            Solver Input Required
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            gap: 8,
                                        }}>
                                            <input
                                                type="text"
                                                value={inputValue}
                                                onChange={e => setInputValue(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                placeholder={
                                                    currentStep.node.type === 'CHECK'
                                                        ? 'Enter verification value...'
                                                        : 'Enter your response...'
                                                }
                                                style={{
                                                    flex: 1,
                                                    padding: '10px 14px',
                                                    border: '1px solid #334155',
                                                    borderRadius: 4,
                                                    background: '#0f172a',
                                                    color: '#e2e8f0',
                                                    fontSize: 13,
                                                    fontFamily: 'inherit',
                                                    outline: 'none',
                                                    transition: 'border-color 0.2s',
                                                }}
                                                onFocus={e => e.currentTarget.style.borderColor = '#a78bfa'}
                                                onBlur={e => e.currentTarget.style.borderColor = '#334155'}
                                                autoFocus
                                            />
                                            <button
                                                onClick={handleSubmit}
                                                disabled={!inputValue.trim()}
                                                style={{
                                                    padding: '10px 20px',
                                                    border: '1px solid #a78bfa',
                                                    borderRadius: 4,
                                                    background: inputValue.trim() ? 'rgba(167, 139, 250, 0.15)' : 'transparent',
                                                    color: inputValue.trim() ? '#a78bfa' : '#475569',
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    letterSpacing: 1,
                                                    cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 6,
                                                    fontFamily: 'inherit',
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                <Send size={14} />
                                                SUBMIT
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Checking Indicator */}
                                {currentStep.phase === 'CHECKING' && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        padding: '12px 16px',
                                        background: 'rgba(245, 158, 11, 0.06)',
                                        border: '1px solid rgba(245, 158, 11, 0.2)',
                                        borderRadius: 6,
                                    }}>
                                        <Activity size={16} style={{ color: '#f59e0b', animation: 'spin 1s linear infinite' }} />
                                        <span style={{ fontSize: 11, color: '#f59e0b', letterSpacing: 1 }}>
                                            COMPUTING VERIFICATION...
                                        </span>
                                    </div>
                                )}

                                {/* Failed Step — Retry */}
                                {currentStep.phase === 'FAILED' && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        padding: '12px 16px',
                                        background: 'rgba(239, 68, 68, 0.06)',
                                        border: '1px solid rgba(239, 68, 68, 0.2)',
                                        borderRadius: 6,
                                    }}>
                                        <AlertTriangle size={16} style={{ color: '#ef4444' }} />
                                        <span style={{ fontSize: 12, color: '#ef4444', flex: 1 }}>
                                            Verification failed. Debug and re-submit.
                                        </span>
                                        {allowRetry && (
                                            <button
                                                onClick={handleRetry}
                                                style={{
                                                    padding: '6px 14px',
                                                    border: '1px solid #ef4444',
                                                    borderRadius: 4,
                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                    color: '#ef4444',
                                                    fontSize: 11,
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 4,
                                                    fontFamily: 'inherit',
                                                }}
                                            >
                                                <RotateCcw size={12} />
                                                RETRY
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ═══════════════════════════════════════════════════════ */}
                        {/* SDI GAP ANALYSIS (Failure as Data) */}
                        {/* ═══════════════════════════════════════════════════════ */}
                        {status === 'FAILED' && failedStepData && (
                            <div style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 24,
                                padding: 20,
                            }}>
                                {/* Abort Header */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                }}>
                                    <Bug size={24} style={{ color: '#ef4444' }} />
                                    <span style={{
                                        fontSize: 11,
                                        fontWeight: 700,
                                        letterSpacing: 3,
                                        color: '#ef4444',
                                        textTransform: 'uppercase',
                                    }}>
                                        Mission Aborted
                                    </span>
                                </div>

                                {/* Failure Location */}
                                <div style={{
                                    fontSize: 13,
                                    color: '#94a3b8',
                                    textAlign: 'center',
                                    fontFamily: "'Inter', system-ui, sans-serif",
                                }}>
                                    Logic Failure at Step {failedStepData.stepIndex + 1}: "{failedStepData.nodeLabel}"
                                </div>

                                {/* ─── THE SDI GAP CARD ─── */}
                                <div style={{
                                    width: '100%',
                                    maxWidth: 480,
                                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.04), rgba(245, 158, 11, 0.04))',
                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                    borderRadius: 8,
                                    padding: '24px',
                                }}>
                                    <div style={{
                                        fontSize: 9,
                                        letterSpacing: 2,
                                        color: '#f59e0b',
                                        textTransform: 'uppercase',
                                        marginBottom: 12,
                                    }}>
                                        Gap Detected
                                    </div>

                                    <div style={{
                                        fontSize: 20,
                                        fontWeight: 700,
                                        color: '#f1f5f9',
                                        fontFamily: "'Inter', system-ui, sans-serif",
                                        marginBottom: 8,
                                    }}>
                                        {SDI_GAP_LABELS[failedStepData.sdi]?.label ?? 'Unknown'} (SDI {failedStepData.sdi})
                                    </div>

                                    <p style={{
                                        fontSize: 13,
                                        color: '#94a3b8',
                                        lineHeight: 1.6,
                                        margin: '0 0 16px 0',
                                        fontFamily: "'Inter', system-ui, sans-serif",
                                    }}>
                                        {SDI_GAP_LABELS[failedStepData.sdi]?.description ?? 'A gap in your logic graph was detected.'}
                                    </p>

                                    {/* Diagnostic */}
                                    <div style={{
                                        padding: '12px 16px',
                                        background: 'rgba(15, 23, 42, 0.6)',
                                        borderRadius: 6,
                                        border: '1px solid #1e293b',
                                        marginBottom: 16,
                                    }}>
                                        <div style={{
                                            fontSize: 10,
                                            color: '#475569',
                                            letterSpacing: 1,
                                            marginBottom: 6,
                                        }}>
                                            SYSTEM DIAGNOSTIC
                                        </div>
                                        <div style={{
                                            fontSize: 12,
                                            color: '#e2e8f0',
                                            fontFamily: 'inherit',
                                        }}>
                                            {failedStepData.feedback}
                                        </div>
                                    </div>

                                    {/* Recommendation */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        padding: '10px 14px',
                                        background: 'rgba(34, 211, 238, 0.06)',
                                        border: '1px solid rgba(34, 211, 238, 0.15)',
                                        borderRadius: 6,
                                    }}>
                                        <BookOpen size={16} style={{ color: '#22d3ee', flexShrink: 0 }} />
                                        <span style={{
                                            fontSize: 12,
                                            color: '#22d3ee',
                                            fontFamily: "'Inter', system-ui, sans-serif",
                                        }}>
                                            Review the <strong>{SDI_GAP_LABELS[failedStepData.sdi]?.module ?? 'Core'}</strong> module to patch this bug.
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', gap: 12 }}>
                                    {allowRetry && (
                                        <button
                                            onClick={handleRetry}
                                            style={{
                                                padding: '10px 24px',
                                                border: '1px solid #f59e0b',
                                                borderRadius: 6,
                                                background: 'rgba(245, 158, 11, 0.08)',
                                                color: '#f59e0b',
                                                fontSize: 11,
                                                fontWeight: 700,
                                                letterSpacing: 1,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 6,
                                                fontFamily: 'inherit',
                                            }}
                                        >
                                            <RotateCcw size={14} />
                                            DEBUG & RETRY
                                        </button>
                                    )}
                                    <button
                                        onClick={handleAbandon}
                                        style={{
                                            padding: '10px 24px',
                                            border: '1px solid #334155',
                                            borderRadius: 6,
                                            background: 'transparent',
                                            color: '#64748b',
                                            fontSize: 11,
                                            fontWeight: 600,
                                            letterSpacing: 1,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 6,
                                            fontFamily: 'inherit',
                                        }}
                                    >
                                        <XCircle size={14} />
                                        ABORT MISSION
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ─── COMPLETED STATE ─── */}
                        {status === 'COMPLETED' && (
                            <div style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 20,
                            }}>
                                <div style={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: '50%',
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    border: '2px solid #10b981',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <CheckCircle2 size={28} style={{ color: '#10b981' }} />
                                </div>
                                <div style={{
                                    fontSize: 11,
                                    letterSpacing: 3,
                                    color: '#10b981',
                                    textTransform: 'uppercase',
                                    fontWeight: 700,
                                }}>
                                    Mission Complete
                                </div>
                                <div style={{
                                    fontSize: 14,
                                    color: '#94a3b8',
                                    textAlign: 'center',
                                    fontFamily: "'Inter', system-ui, sans-serif",
                                }}>
                                    {reward.competencies.length > 0 && (
                                        <span>{reward.competencies.length} competencies verified. </span>
                                    )}
                                    Time: {formattedTime}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ─── RIGHT: NEURAL LINK PANEL ─── */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(15, 23, 42, 0.5)',
                    overflow: 'hidden',
                }}>
                    {/* Neural Link Header */}
                    <div style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid rgba(100, 116, 139, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <div style={{
                            fontSize: 9,
                            letterSpacing: 2,
                            color: '#475569',
                            textTransform: 'uppercase',
                        }}>
                            Neural Link
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                        }}>
                            <div style={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: neuralPulse ? '#22d3ee' : '#334155',
                                boxShadow: neuralPulse ? '0 0 8px rgba(34, 211, 238, 0.5)' : 'none',
                                transition: 'all 0.3s ease',
                            }} />
                            <span style={{
                                fontSize: 9,
                                color: neuralPulse ? '#22d3ee' : '#475569',
                                letterSpacing: 1,
                            }}>
                                {neuralPulse ? 'SYNC' : 'IDLE'}
                            </span>
                        </div>
                    </div>

                    {/* Compact Skill Overview */}
                    <div style={{
                        flex: 1,
                        padding: 16,
                        overflowY: 'auto',
                    }}>
                        {/* Skill Graph Mini Display */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 8,
                            marginBottom: 16,
                        }}>
                            {(Object.entries(skillGraph.skills) as [SkillCategory, typeof skillGraph.skills[SkillCategory]][]).map(([cat, skill]) => (
                                <div key={cat} style={{
                                    padding: '8px 10px',
                                    background: cat === category ? 'rgba(34, 211, 238, 0.06)' : 'rgba(15, 23, 42, 0.4)',
                                    border: `1px solid ${cat === category ? 'rgba(34, 211, 238, 0.2)' : '#1e293b'}`,
                                    borderRadius: 6,
                                }}>
                                    <div style={{
                                        fontSize: 9,
                                        color: '#64748b',
                                        letterSpacing: 1,
                                        marginBottom: 4,
                                        textTransform: 'uppercase',
                                    }}>
                                        {cat}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                                        <span style={{
                                            fontSize: 16,
                                            fontWeight: 700,
                                            color: '#f1f5f9',
                                        }}>
                                            {skill.level}
                                        </span>
                                        <span style={{
                                            fontSize: 9,
                                            color: '#475569',
                                        }}>
                                            / 100
                                        </span>
                                    </div>
                                    <div style={{
                                        marginTop: 4,
                                        height: 2,
                                        background: '#1e293b',
                                        borderRadius: 1,
                                        overflow: 'hidden',
                                    }}>
                                        <div style={{
                                            width: `${skill.mastery * 100}%`,
                                            height: '100%',
                                            background: cat === category ? '#22d3ee' : '#334155',
                                            borderRadius: 1,
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Calibration Score */}
                        <div style={{
                            padding: '10px 12px',
                            background: 'rgba(15, 23, 42, 0.4)',
                            border: '1px solid #1e293b',
                            borderRadius: 6,
                            marginBottom: 16,
                        }}>
                            <div style={{
                                fontSize: 9,
                                color: '#475569',
                                letterSpacing: 1,
                                marginBottom: 6,
                                textTransform: 'uppercase',
                            }}>
                                Calibration
                            </div>
                            <div style={{
                                height: 4,
                                background: '#1e293b',
                                borderRadius: 2,
                                overflow: 'hidden',
                            }}>
                                <div style={{
                                    width: `${calibrationScore}%`,
                                    height: '100%',
                                    borderRadius: 2,
                                    background: calibrationScore > 60
                                        ? 'linear-gradient(90deg, #10b981, #22d3ee)'
                                        : calibrationScore > 30
                                            ? '#f59e0b'
                                            : '#ef4444',
                                }} />
                            </div>
                            <div style={{
                                fontSize: 10,
                                color: '#64748b',
                                marginTop: 4,
                                textAlign: 'right',
                            }}>
                                {calibrationScore}%
                            </div>
                        </div>

                        {/* Verified Competencies Count */}
                        <div style={{
                            padding: '10px 12px',
                            background: 'rgba(15, 23, 42, 0.4)',
                            border: '1px solid #1e293b',
                            borderRadius: 6,
                        }}>
                            <div style={{
                                fontSize: 9,
                                color: '#475569',
                                letterSpacing: 1,
                                marginBottom: 4,
                                textTransform: 'uppercase',
                            }}>
                                Verified Competencies
                            </div>
                            <div style={{
                                fontSize: 20,
                                fontWeight: 700,
                                color: '#10b981',
                            }}>
                                {verifiedCompetencies.length}
                            </div>
                        </div>
                    </div>

                    {/* Abandon Button */}
                    {status !== 'IDLE' && status !== 'COMPLETED' && status !== 'ABANDONED' && (
                        <div style={{
                            padding: '12px 16px',
                            borderTop: '1px solid rgba(100, 116, 139, 0.15)',
                        }}>
                            <button
                                onClick={handleAbandon}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #334155',
                                    borderRadius: 4,
                                    background: 'transparent',
                                    color: '#64748b',
                                    fontSize: 10,
                                    letterSpacing: 1,
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                    transition: 'all 0.2s',
                                }}
                                onMouseOver={e => {
                                    e.currentTarget.style.borderColor = '#ef4444';
                                    e.currentTarget.style.color = '#ef4444';
                                }}
                                onMouseOut={e => {
                                    e.currentTarget.style.borderColor = '#334155';
                                    e.currentTarget.style.color = '#64748b';
                                }}
                            >
                                ABORT MISSION
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* TERMINAL */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <div style={{
                height: 180,
                borderTop: '1px solid rgba(100, 116, 139, 0.2)',
                background: '#080c14',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
            }}>
                {/* Terminal Header */}
                <div style={{
                    padding: '6px 16px',
                    borderBottom: '1px solid rgba(100, 116, 139, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    flexShrink: 0,
                }}>
                    <Terminal size={12} style={{ color: '#475569' }} />
                    <span style={{
                        fontSize: 9,
                        letterSpacing: 2,
                        color: '#475569',
                        textTransform: 'uppercase',
                    }}>
                        System Output
                    </span>
                    <div style={{ flex: 1 }} />
                    <span style={{
                        fontSize: 9,
                        color: '#334155',
                    }}>
                        {terminalLog.length} lines
                    </span>
                </div>

                {/* Terminal Log */}
                <div
                    ref={terminalRef}
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '8px 16px',
                    }}
                >
                    {terminalLog.map((line, i) => (
                        <div key={i} style={{
                            fontSize: 11,
                            lineHeight: 1.7,
                            display: 'flex',
                            gap: 10,
                        }}>
                            <span style={{
                                color: '#334155',
                                flexShrink: 0,
                                fontVariantNumeric: 'tabular-nums',
                                minWidth: 75,
                            }}>
                                {new Date(line.timestamp).toLocaleTimeString('en-US', {
                                    hour12: false,
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                })}
                            </span>
                            <span style={{
                                color: line.type === 'success' ? '#10b981'
                                    : line.type === 'error' ? '#ef4444'
                                        : line.type === 'warning' ? '#f59e0b'
                                            : line.type === 'info' ? '#22d3ee'
                                                : line.type === 'trait' ? '#a78bfa'
                                                    : '#64748b',
                            }}>
                                {line.message}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* CSS ANIMATIONS (injected) */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <style>{`
                @keyframes gauntlet-step-glow {
                    0%, 100% { box-shadow: 0 0 4px rgba(34, 211, 238, 0.1); }
                    50% { box-shadow: 0 0 12px rgba(34, 211, 238, 0.3); }
                }

                .gauntlet-pulse-cyan {
                    animation: gauntlet-dot-pulse-cyan 2s ease-in-out infinite;
                }
                @keyframes gauntlet-dot-pulse-cyan {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.4); }
                    50% { box-shadow: 0 0 0 5px rgba(34, 211, 238, 0); }
                }

                .gauntlet-pulse-green {
                    animation: gauntlet-dot-pulse-green 1.5s ease-in-out infinite;
                }
                @keyframes gauntlet-dot-pulse-green {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
                    50% { box-shadow: 0 0 0 5px rgba(16, 185, 129, 0); }
                }

                .gauntlet-pulse-amber {
                    animation: gauntlet-dot-pulse-amber 1s ease-in-out infinite;
                }
                @keyframes gauntlet-dot-pulse-amber {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
                    50% { box-shadow: 0 0 0 5px rgba(245, 158, 11, 0); }
                }

                .gauntlet-pulse-red {
                    animation: gauntlet-dot-pulse-red 0.8s ease-in-out infinite;
                }
                @keyframes gauntlet-dot-pulse-red {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
                    50% { box-shadow: 0 0 0 5px rgba(239, 68, 68, 0); }
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default GauntletInterface;
