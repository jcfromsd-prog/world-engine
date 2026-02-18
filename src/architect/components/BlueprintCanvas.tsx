import React, { useRef, useCallback, useEffect, useState } from 'react';
import ReactFlow, {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    Controls,
    MiniMap
} from 'reactflow';
import type {
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange
} from 'reactflow';
import 'reactflow/dist/style.css';
import confetti from 'canvas-confetti';

import { BlueprintEngine } from '../core/BlueprintEngine';
import type { LogicNode, LogicConnection, BlueprintState } from '../types';
import { devTelemetry } from '../../engines/logic-link/ObservabilityLayer';

import { NeuralEdge } from './NeuralEdge';
import { LogicSieve } from '../validation/LogicSieve';

// ─── LAUNCH BRIDGE IMPORTS ───
import { GauntletInterface } from '../../solver/components/GauntletInterface';
import type { LearnerProfile } from '../../engines/world-engine/LearnerModel';
import type { SkillGraph, MissionReward } from '../../engine/types';

// Initialize Engine Singleton
const engine = BlueprintEngine.getInstance();

const edgeTypes = {
    neural: NeuralEdge,
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA for Simulation Mode
// ─────────────────────────────────────────────────────────────────────────────
// In production, this comes from the LearnerModel / Supabase.
// For the Launch Bridge (Build → Test → Iterate), we use a realistic stub.

const MOCK_SKILL_GRAPH: SkillGraph = {
    skills: {
        logic: { category: 'logic', level: 35, mastery: 0.42, tier: 'apprentice', lastPracticed: Date.now(), streak: 3 },
        creativity: { category: 'creativity', level: 28, mastery: 0.31, tier: 'novice', lastPracticed: Date.now(), streak: 1 },
        engineering: { category: 'engineering', level: 22, mastery: 0.25, tier: 'novice', lastPracticed: Date.now(), streak: 0 },
        leadership: { category: 'leadership', level: 18, mastery: 0.20, tier: 'novice', lastPracticed: Date.now(), streak: 2 },
        nature: { category: 'nature', level: 30, mastery: 0.38, tier: 'apprentice', lastPracticed: Date.now(), streak: 5 },
        social: { category: 'social', level: 25, mastery: 0.28, tier: 'novice', lastPracticed: Date.now(), streak: 1 },
    },
    dominantSkill: 'logic',
    weakestSkill: 'leadership',
};

function createMockProfile(): LearnerProfile {
    return {
        id: 'sim-user-' + Date.now(),
        name: 'Blueprint Architect',
        currentGrade: 5,
        currentTier: 'BUILDERS',
        masteryMap: new Map(),
        domainLevels: {
            literacy: 1,
            numeracy: 1,
            science: 0,
            social: 0,
            sel: 0,
            career: 0,
        },
        cognitiveState: {
            focusLevel: 0.8,
            frustrationLevel: 0.1,
            energyLevel: 0.9,
            currentZPD: 2,
        },
        interests: ['Architecture', 'Systems Design'],
        learningStyle: 'visual',
        goals: ['Build a complete mission pipeline'],
        traits: new Map(),
        verifiedCompetencies: [],
        completedMissions: [],
        activeContracts: [],
        totalEarnings: 0,
        calibrationScore: 40,
    };
}

// Command Factory Helper
const createAddNodeCommand = (node: Node, setNodes: React.Dispatch<React.SetStateAction<Node[]>>, nodesRef: React.MutableRefObject<Node[]>) => ({
    label: `Add Node ${node.data.type}`,
    execute: () => {
        setNodes(nds => nds.concat(node));
        nodesRef.current.push(node);

        // Sync Logic Nodes to Engine
        // NOTE: In a full implementation, we'd map ReactFlow Nodes -> LogicNodes here
        const logicNodes = nodesRef.current.map(n => ({ id: n.id, type: n.data.type, position: n.position, label: n.data.label }));
        // We aren't updating connections in this specific command, but we should sync state broadly
        engine.updateLocalState(logicNodes, []); // Simplification for MVP Command
    },
    undo: () => {
        setNodes(nds => nds.filter(n => n.id !== node.id));
        nodesRef.current = nodesRef.current.filter(n => n.id !== node.id);

        const logicNodes = nodesRef.current.map(n => ({ id: n.id, type: n.data.type, position: n.position, label: n.data.label }));
        engine.updateLocalState(logicNodes, []);
    }
});

const BlueprintCanvas: React.FC = () => {
    // We use React State here ONLY for rendering, but Logic is decoupled.
    // The Engine is the source of truth for validation.
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [isValid, setIsValid] = useState(false);

    // ─── LAUNCH BRIDGE STATE ───
    const [isSimulating, setIsSimulating] = useState(false);
    const [simProfile, setSimProfile] = useState<LearnerProfile>(() => createMockProfile());
    const [simMissionId, setSimMissionId] = useState(() => `sim_${Date.now()}`);
    const [simBlueprint, setSimBlueprint] = useState<BlueprintState | null>(null);

    // Refs for performance (avoiding closure staleness in callbacks)
    const nodesRef = useRef<Node[]>([]);
    const edgesRef = useRef<Edge[]>([]);
    const simProfileRef = useRef<LearnerProfile>(simProfile);

    // Keep ref in sync
    useEffect(() => {
        simProfileRef.current = simProfile;
    }, [simProfile]);

    useEffect(() => {
        // Subscribe to Engine updates (e.g. from cloud sync or undo/redo)
        const unsubscribe = engine.subscribe((state) => {
            setIsValid(state.isValid);

            if (state.isValid) {
                // SUCCESS DOPAMINE
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#34d399', '#60a5fa', '#fbbf24'] // Green, Blue, Amber
                });
                devTelemetry.trackEvent('CHECK', 'Blueprint Compiled & Valid', 'success');
            }
        });
        return unsubscribe;
    }, []);

    // KEYBOARD SHORTCUTS
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Escape exits simulation
            if (e.key === 'Escape' && isSimulating) {
                setIsSimulating(false);
                return;
            }

            if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
                e.preventDefault();
                if (e.shiftKey) {
                    engine.redo();
                } else {
                    engine.undo();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSimulating]);

    const onNodesChange = useCallback((changes: NodeChange[]) => {
        setNodes((nds) => {
            const next = applyNodeChanges(changes, nds);
            nodesRef.current = next;
            return next;
        });
    }, []);

    const onEdgesChange = useCallback((changes: EdgeChange[]) => {
        setEdges((eds) => {
            const next = applyEdgeChanges(changes, eds);
            edgesRef.current = next;
            return next;
        });
    }, []);

    const onConnect = useCallback((connection: Connection) => {
        if (!connection.source || !connection.target) return;

        // 1. Construct Candidate Graph
        const currentNodes: LogicNode[] = nodesRef.current.map(n => ({
            id: n.id,
            type: (n.data?.type || 'ACTION') as any,
            label: n.data?.label || n.id,
            position: n.position
        }));

        const currentEdges: LogicConnection[] = edgesRef.current.map(e => ({
            id: e.id,
            source: e.source,
            target: e.target
        }));

        // Add candidate edge
        const candidateEdge: LogicConnection = {
            id: `temp-${Date.now()}`,
            source: connection.source,
            target: connection.target
        };

        // 2. Validate Cycle
        const hasCycle = LogicSieve.detectCycles(currentNodes, [...currentEdges, candidateEdge]);

        if (hasCycle) {
            // BLOCK CONNECTION
            devTelemetry.trackEvent('CHECK', 'Circular Dependency Detected & Blocked', 'failure');
            alert("⚠️ LOGIC LOOP DETECTED: You cannot connect output back to input upstream.");
            return;
        }

        // 3. ALLOW CONNECTION
        setEdges((eds) => {
            const newEdge: Edge = {
                ...connection,
                id: `e-${connection.source}-${connection.target}`,
                type: 'neural',
                animated: true,
                data: { isValid: true }
            } as Edge;

            const next = addEdge(newEdge, eds);
            edgesRef.current = next;

            // Sync to Engine
            const logicEdges: LogicConnection[] = next.map(e => ({
                id: e.id,
                source: e.source,
                target: e.target
            }));
            engine.updateLocalState(currentNodes, logicEdges);

            return next;
        });

        devTelemetry.trackEvent('ACTION', 'Neural Link Established', 'neutral');

    }, []);

    const handleCompile = useCallback(() => {
        // Trigger explicit validation check via Engine
        const validation = engine.validate();
        setIsValid(validation.valid);

        if (validation.valid) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#22d3ee', '#818cf8', '#34d399'] // Cyan, Indigo, Emerald
            });
            devTelemetry.trackEvent('CHECK', 'Blueprint Compiled & Valid', 'success');
        } else {
            devTelemetry.trackEvent('CHECK', `Blueprint Invalid: ${validation.error}`, 'failure');
            alert(`Blueprint Incomplete: ${validation.error}`);
        }
    }, []);

    // Helper to add node for testing (Wrapped in Command)
    const addNode = (type: string) => {
        const id = `${type}-${Date.now()}`;
        const newNode: Node = {
            id,
            position: { x: Math.random() * 400, y: Math.random() * 400 },
            data: { label: type, type },
            style: { border: '1px solid #777', padding: 10, borderRadius: 5, background: '#1a1a1a', color: '#fff' }
        };

        // Execute via Engine Command
        const cmd = createAddNodeCommand(newNode, setNodes, nodesRef);
        engine.executeCommand(cmd);
    };

    // =========================================================================
    // LAUNCH BRIDGE: Convert ReactFlow graph → BlueprintState
    // =========================================================================

    const buildBlueprintFromCanvas = useCallback((): BlueprintState => {
        const logicNodes: LogicNode[] = nodesRef.current.map(n => ({
            id: n.id,
            type: (n.data?.type || 'ACTION') as LogicNode['type'],
            label: n.data?.label || n.id,
            position: n.position,
            data: n.data,
        }));

        const logicConnections: LogicConnection[] = edgesRef.current.map(e => ({
            id: e.id,
            source: e.source,
            target: e.target,
        }));

        return {
            nodes: logicNodes,
            connections: logicConnections,
            isValid: isValid,
            lastSynced: Date.now(),
        };
    }, [isValid]);

    // =========================================================================
    // LAUNCH BRIDGE: Execute Mission
    // =========================================================================

    const handleLaunchMission = useCallback(() => {
        if (!isValid) return;

        // Reset simulation profile and mission ID for fresh run
        setSimProfile(createMockProfile());
        setSimMissionId(`sim_${Date.now()}`);
        setSimBlueprint(buildBlueprintFromCanvas());

        devTelemetry.trackEvent('ACTION', 'Mission Launched from Blueprint Canvas', 'success');
        setIsSimulating(true);
    }, [isValid, buildBlueprintFromCanvas]);

    const handleSimulationComplete = useCallback((_reward: MissionReward) => {
        devTelemetry.trackEvent('CHECK', 'Simulation Complete — Returning to Editor', 'success');
        // Short delay so the user sees the "COMPLETE" state before we exit
        setTimeout(() => setIsSimulating(false), 2500);
    }, []);

    const handleSimulationAbandon = useCallback(() => {
        devTelemetry.trackEvent('ACTION', 'Simulation Abandoned — Returning to Editor', 'neutral');
        setTimeout(() => setIsSimulating(false), 500);
    }, []);

    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <div
            data-testid="blueprint-root"
            className={`h-[600px] w-full border-4 transition-colors duration-500 ${isValid ? 'border-green-500/50' : 'border-red-500/50'}`}
            style={{ position: 'relative' }}
        >
            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* TOOLBAR */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <div className="absolute top-4 right-4 z-50 flex gap-2">
                <button onClick={() => addNode('GOAL')} className="px-4 py-2 bg-slate-800 text-white rounded shadow">Add GOAL</button>
                <button onClick={() => addNode('ACTION')} className="px-4 py-2 bg-slate-800 text-white rounded shadow">Add ACTION</button>
                <button onClick={() => addNode('PAYOFF')} className="px-4 py-2 bg-slate-800 text-white rounded shadow">Add PAYOFF</button>
                <button
                    onClick={handleCompile}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded shadow-lg transition-all"
                >
                    COMPILE
                </button>

                {/* ─── LAUNCH BRIDGE BUTTON ─── */}
                <button
                    onClick={handleLaunchMission}
                    disabled={!isValid}
                    title={isValid ? 'Execute this blueprint as a live mission' : 'Compile a valid blueprint first'}
                    style={{
                        padding: '8px 20px',
                        border: isValid ? '1px solid #22d3ee' : '1px solid #334155',
                        borderRadius: 6,
                        background: isValid
                            ? 'linear-gradient(135deg, rgba(34, 211, 238, 0.15), rgba(16, 185, 129, 0.10))'
                            : 'rgba(30, 41, 59, 0.5)',
                        color: isValid ? '#22d3ee' : '#475569',
                        fontSize: 13,
                        fontWeight: 700,
                        letterSpacing: 1,
                        cursor: isValid ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        transition: 'all 0.3s ease',
                        opacity: isValid ? 1 : 0.5,
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    }}
                    onMouseOver={e => {
                        if (isValid) {
                            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34, 211, 238, 0.25), rgba(16, 185, 129, 0.20))';
                            e.currentTarget.style.boxShadow = '0 0 20px rgba(34, 211, 238, 0.2)';
                        }
                    }}
                    onMouseOut={e => {
                        if (isValid) {
                            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34, 211, 238, 0.15), rgba(16, 185, 129, 0.10))';
                            e.currentTarget.style.boxShadow = 'none';
                        }
                    }}
                >
                    🚀 EXECUTE MISSION
                </button>
            </div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* REACT FLOW CANVAS */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <div style={{
                width: '100%',
                height: '100%',
                filter: isSimulating ? 'blur(6px) brightness(0.3)' : 'none',
                transition: 'filter 0.4s ease',
                pointerEvents: isSimulating ? 'none' : 'auto',
            }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    edgeTypes={edgeTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                >
                    <Background />
                    <Controls
                        style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '4px', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                        showInteractive={false}
                    />
                    <MiniMap
                        style={{ height: 120, width: 160, backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px' }}
                        nodeColor="#334155"
                        maskColor="rgba(15, 23, 42, 0.8)"
                        zoomable
                        pannable
                    />
                </ReactFlow>
            </div>

            <div className="absolute bottom-4 left-4 text-xs text-white/30 font-mono pointer-events-none">
                undo: ctrl+z | redo: ctrl+shift+z{isValid ? ' | 🚀 ready to launch' : ''}
            </div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* SIMULATION OVERLAY: GAUNTLET INTERFACE */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {isSimulating && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9999,
                        animation: 'gauntlet-overlay-enter 0.4s ease-out',
                    }}
                >
                    {/* ─── CLOSE BUTTON (always accessible) ─── */}
                    <button
                        onClick={() => setIsSimulating(false)}
                        title="Exit Simulation (Esc)"
                        style={{
                            position: 'fixed',
                            top: 12,
                            right: 16,
                            zIndex: 10001,
                            padding: '6px 14px',
                            border: '1px solid rgba(100, 116, 139, 0.3)',
                            borderRadius: 6,
                            background: 'rgba(15, 23, 42, 0.9)',
                            color: '#94a3b8',
                            fontSize: 11,
                            fontWeight: 600,
                            letterSpacing: 1,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontFamily: "'JetBrains Mono', monospace",
                            backdropFilter: 'blur(8px)',
                            transition: 'all 0.2s',
                        }}
                        onMouseOver={e => {
                            e.currentTarget.style.borderColor = '#ef4444';
                            e.currentTarget.style.color = '#ef4444';
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.borderColor = 'rgba(100, 116, 139, 0.3)';
                            e.currentTarget.style.color = '#94a3b8';
                        }}
                    >
                        ✕ EXIT SIM
                    </button>

                    {/* ─── GAUNTLET ─── */}
                    <GauntletInterface
                        blueprint={simBlueprint!}
                        missionId={simMissionId}
                        title="Blueprint Test Flight"
                        description="Testing your blueprint logic chain. Build → Test → Iterate."
                        category="logic"
                        reward={{ competencies: [] }}
                        skillGraph={MOCK_SKILL_GRAPH}
                        verifiedCompetencies={simProfile.verifiedCompetencies}
                        calibrationScore={simProfile.calibrationScore}
                        allowRetry={true}
                        maxRetries={5}
                        onComplete={handleSimulationComplete}
                        onAbandon={handleSimulationAbandon}
                    />
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* CSS ANIMATIONS */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <style>{`
                @keyframes gauntlet-overlay-enter {
                    from {
                        opacity: 0;
                        transform: scale(0.97);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    );
};

export default BlueprintCanvas;
