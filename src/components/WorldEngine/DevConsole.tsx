
import React, { useState, useMemo } from 'react';
import type { KnowledgeNode } from '../../engines/world-engine/KnowledgeGraph';
import { WorldEngine } from '../../engines/world-engine/WorldEngine';
import { OpenClawSystem } from '../../systems/OpenClaw';

// --- STYLES ---
const CARD_STYLE = "bg-zinc-900 border border-white/10 rounded-xl p-6 mb-4";
const HEADER_STYLE = "text-xl font-bold text-white mb-4 flex items-center gap-2";

// --- 5-TIER MATRIX DEFINITIONS ---
const GRADE_BANDS = [
    { name: 'SPROUTS', range: [1, 2], icon: '🌱', color: 'text-green-400', border: 'border-green-500', bg: 'bg-green-500/10' },
    { name: 'BUILDERS', range: [3, 5], icon: '🛠️', color: 'text-blue-400', border: 'border-blue-500', bg: 'bg-blue-500/10' },
    { name: 'TRAILBLAZERS', range: [6, 8], icon: '🌲', color: 'text-amber-400', border: 'border-amber-500', bg: 'bg-amber-500/10' },
    { name: 'EXPLORERS', range: [9, 12], icon: '🧭', color: 'text-purple-400', border: 'border-purple-500', bg: 'bg-purple-500/10' },
    { name: 'VOYAGERS', range: [13, 16], icon: '🚀', color: 'text-red-400', border: 'border-red-500', bg: 'bg-red-500/10' }
];

export const WorldEngineDevConsole: React.FC<{
    onExit: () => void;
    engine: WorldEngine;
    onPlay?: (node: KnowledgeNode) => void;
}> = ({ onExit, engine, onPlay }) => {

    // Local State to force re-renders when engine updates
    const [tick, setTick] = useState(0);
    const [pulseStage, setPulseStage] = useState<0 | 1 | 2 | 3 | 4>(0); // 0=Idle, 1=Goal, 2=Action, 3=Check, 4=Payoff
    const [logs, setLogs] = useState<string[]>(["System Initialized."]);
    const [isClawRunning, setIsClawRunning] = useState(false);

    // MOCK PULSE ANIMATION (Heartbeat Simulation)
    React.useEffect(() => {
        const interval = setInterval(() => {
            setPulseStage(prev => {
                if (prev >= 4) return 0;
                return (prev + 1) as 0 | 1 | 2 | 3 | 4;
            });
        }, 1000); // 1-second pulse cycle
        return () => clearInterval(interval);
    }, []);

    const addLog = React.useCallback((msg: string) => {
        setLogs(prev => [msg, ...prev].slice(0, 20));
    }, []);

    const openClaw = useMemo(() => new OpenClawSystem(engine, addLog), [engine, addLog]);

    // Refresh recommendations whenever 'tick' changes (tick is incremented on task completion/reset)
    void tick; // consumed to satisfy lint — triggers re-render
    const recommendations = engine?.getNextTaskOptions?.(3) || [];

    // Engine is now passed in props to allow parent (LearnerMap) to coordinate Play mode
    if (!engine) {
        return (
            <div className="fixed inset-0 z-[2000] bg-black text-red-500 font-mono p-8 flex items-center justify-center">
                <h1>[CRITICAL ERROR] World Engine Not Initialized.</h1>
            </div>
        );
    }

    const handleTaskComplete = (node: KnowledgeNode) => {
        if (onPlay) {
            onPlay(node);
        } else {
            // Fallback for dev mode without player
            addLog(`Completed: ${node.title}`);
            engine.submitTask(node.id, true, 60);
            setTick(t => t + 1);
        }
    };

    const profile = engine.getProfile();
    const masteryCount = profile.masteryMap.size;

    return (
        <div className="fixed inset-0 z-[2000] bg-black text-green-400 font-mono p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8 border-b border-green-500/30 pb-4">
                    <h1 className="text-3xl font-black tracking-widest">WORLD ENGINE <span className="text-white text-sm">DEV CONSOLE v1.0</span></h1>
                    <button onClick={onExit} className="px-6 py-2 bg-red-900/20 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded">
                        TERMINATE SESSION
                    </button>
                </div>

                {/* 🤖 OPENCLAW CONTROL - RELOCATED TO TOP */}
                <div className="w-full mb-8 p-4 bg-green-900/10 border border-green-500/30 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-neon-green font-mono text-xl font-bold flex items-center gap-2">
                            <span>🤖</span> OPENCLAW SWARM CONTROL
                        </h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => { openClaw.startSwarm(); setIsClawRunning(true); }}
                                disabled={isClawRunning}
                                className="px-6 py-2 bg-green-500 text-black font-bold rounded hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                START SWARM
                            </button>
                            <button
                                onClick={() => { openClaw.stopSwarm(); setIsClawRunning(false); }}
                                disabled={!isClawRunning}
                                className="px-6 py-2 bg-red-500/20 text-red-500 border border-red-500 font-bold rounded hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                STOP SWARM
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4 mb-4 items-center">
                        <span className="text-zinc-500 font-mono text-sm self-center">SPEED:</span>
                        {[1000, 200, 0].map((speed) => (
                            <button
                                key={speed}
                                onClick={() => openClaw.setSpeed(speed)}
                                className="px-3 py-1 bg-zinc-800 text-white rounded text-xs font-mono hover:bg-zinc-700 focus:bg-green-500/20 focus:text-green-400 focus:border-green-500 border border-transparent"
                            >
                                {speed === 1000 ? '1x (1s)' : speed === 200 ? 'TURBO (200ms)' : 'INSTANT (0ms)'}
                            </button>
                        ))}

                        {/* ⚠️ RESET / SEED BUTTON */}
                        {process.env.NODE_ENV !== 'production' && (
                            <div className="flex items-center ml-4 pl-4 border-l border-white/10">
                                <button
                                    aria-label="Reset curriculum and reseed data"
                                    onClick={async () => {
                                        if (!window.confirm("Hard Reset & Reseed Curriculum? This cannot be undone.")) return;
                                        try {
                                            addLog(`[SYSTEM] ⚠️ Initiating Reset...`);
                                            engine.resetProgress();
                                            addLog(`[SYSTEM] ✅ Curriculum Reseeded. Ready to Swarm.`);
                                            setTick(t => t + 1); // Force re-render
                                        } catch (error: any) {
                                            addLog(`[SYSTEM] ❌ Reset Failed: ${error.message}`);
                                        }
                                    }}
                                    className="px-3 py-1 text-xs font-mono font-bold border rounded transition-all text-red-400 bg-red-500/10 border-red-500/50 hover:bg-red-500/20 cursor-pointer"
                                >
                                    [ ⚠️ RESET DATA ]
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="h-24 bg-black border border-green-500/10 rounded p-2 font-mono text-xs text-green-500/80 overflow-y-auto">
                        {logs.filter(l => l.includes('[CLAW]')).map((log, i) => (
                            <div key={i}>{log}</div>
                        ))}
                        {logs.filter(l => l.includes('[CLAW]')).length === 0 && (
                            <div className="text-zinc-700 italic">Agent waiting for command...</div>
                        )}
                    </div>
                </div>

                {/* 🧠 COGNITIVE TELEMETRY & MATRIX VALIDATOR */}
                <div className="w-full mb-8 p-6 bg-zinc-900/80 border border-indigo-500/30 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-20 text-6xl grayscale">📐</div>
                    <h3 className="text-white font-black text-xl mb-6 flex items-center gap-3">
                        <span className="text-2xl">🧠</span>
                        COGNITIVE TELEMETRY
                        <span className="text-xs font-mono font-normal text-indigo-400 border border-indigo-500/50 px-2 py-0.5 rounded">MATRIX VALIDATION ACTIVE</span>
                    </h3>

                    <div className="grid grid-cols-5 gap-2 mb-6">
                        {GRADE_BANDS.map(band => {
                            const isActive = profile.currentGrade >= band.range[0] && profile.currentGrade <= band.range[1];
                            return (
                                <button
                                    key={band.name}
                                    onClick={() => {
                                        // DIRECT MUTATION FOR DEV CONSOLE - Triggers Re-render via 'tick'
                                        (profile as any).currentGrade = band.range[0];
                                        setTick(t => t + 1);
                                        addLog(`[MATRIX] Shifted to ${band.name} (Grade ${band.range[0]})`);
                                    }}
                                    className={`relative p-3 rounded-lg border transition-all ${isActive ? `${band.bg} ${band.border} border-b-4` : 'bg-black border-white/5 opacity-50 hover:opacity-100'}`}
                                >
                                    <div className="text-2xl mb-1">{band.icon}</div>
                                    <div className={`text-[10px] font-black tracking-widest ${band.color}`}>{band.name}</div>
                                    <div className="text-[9px] text-zinc-500">GR {band.range[0]}-{band.range[1]}</div>

                                    {isActive && (
                                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_10px_white]"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ⚡ LOGIC-LINK MONITOR (NEURAL PULSE) */}
                <div className="w-full mb-8 p-6 bg-black border border-zinc-800 rounded-xl">
                    <h3 className="text-zinc-400 font-bold text-sm mb-4 flex justify-between">
                        <span>LOGIC-LINK PROTOCOL v2.0</span>
                        <span className="font-mono text-xs text-green-500 animate-pulse">● LIVE PULSE</span>
                    </h3>
                    <div className="flex items-center justify-between relative">
                        {/* CONNECTING LINE */}
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-800 -z-10"></div>

                        {[
                            { label: 'GOAL', icon: '🎯' },
                            { label: 'ACTION', icon: '⚡' },
                            { label: 'CHECK', icon: '🛡️' },
                            { label: 'PAYOFF', icon: '🎁' }
                        ].map((node, index) => {
                            const isActive = pulseStage > index;
                            const isCurrent = pulseStage === index + 1;

                            return (
                                <div key={node.label} className="flex flex-col items-center gap-2 bg-black px-4">
                                    <div className={`
                                        w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 transition-all duration-300
                                        ${isActive || isCurrent
                                            ? 'border-green-500 bg-green-500/20 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)] scale-110'
                                            : 'border-zinc-800 bg-zinc-900 text-zinc-600 grayscale'}
                                    `}>
                                        {node.icon}
                                    </div>
                                    <span className={`text-[10px] font-black tracking-widest transition-colors ${isActive || isCurrent ? 'text-green-400' : 'text-zinc-600'}`}>
                                        {node.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* LEFT: LEARNER STATE */}
                    <div className="col-span-1">
                        <div className={CARD_STYLE}>
                            <h2 className={HEADER_STYLE}>🧠 CORTEX STATE</h2>
                            <div className="space-y-2 text-sm text-zinc-400">
                                <div className="flex justify-between items-center">
                                    <span>GRADE LEVEL:</span>
                                    <div className="text-right">
                                        <span className="text-white font-bold text-lg">{profile.currentGrade}</span>
                                        <span className="text-[10px] block text-zinc-500 uppercase tracking-wider">
                                            {GRADE_BANDS.find(b => profile.currentGrade >= b.range[0] && profile.currentGrade <= b.range[1])?.name || 'UNKNOWN'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between"><span>MASTERY NODES:</span> <span className="text-white">{masteryCount}</span></div>
                                <div className="flex justify-between"><span>FOCUS:</span> <span className="text-blue-400">{profile.cognitiveState.focusLevel}%</span></div>
                                <div className="flex justify-between"><span>FRUSTRATION:</span> <span className="text-red-400">{profile.cognitiveState.frustrationLevel}%</span></div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-xs font-bold text-zinc-500 mb-2">DOMAIN SYNC</h3>
                            {Object.entries(profile.domainLevels).map(([domain, level]) => (
                                <div key={domain} className="mb-1">
                                    <div className="flex justify-between text-xs mb-0.5">
                                        <span className="uppercase">{domain}</span>
                                        <span>{level.toFixed(1)}</span>
                                    </div>
                                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500" style={{ width: `${(level % 1) * 100}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={CARD_STYLE}>
                            <h2 className={HEADER_STYLE}>📟 SYSTEM LOGS</h2>
                            <div className="text-xs text-zinc-500 font-mono h-40 overflow-hidden">
                                {logs.map((log, i) => (
                                    <div key={i} className="mb-1 border-l-2 border-green-500/20 pl-2">
                                        <span className="text-green-900">[{new Date().toLocaleTimeString()}]</span> {log}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* CENTER: RECOMMENDATION ENGINE */}
                    <div className="col-span-2">
                        <div className="bg-zinc-900/50 border border-green-500/20 rounded-xl p-8 min-h-[500px]">
                            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                                <span className="animate-pulse">🟢</span>
                                NEXT BEST ACTION
                            </h2>

                            {recommendations.length === 0 ? (
                                <div className="text-center py-20 text-zinc-500 italic">
                                    No unlocked nodes found. Curriculum Complete?
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {recommendations.map(node => (
                                        <div
                                            key={node.id}
                                            onClick={() => handleTaskComplete(node)}
                                            className="group relative p-6 bg-black border border-zinc-800 hover:border-green-400 hover:bg-zinc-900 transition-all cursor-pointer rounded-lg"
                                        >
                                            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-xs font-bold bg-green-500 text-black px-2 py-1 rounded flex items-center gap-1">
                                                    <span className="text-lg">▶</span> START MISSION
                                                </span>
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className="text-3xl text-zinc-600 group-hover:text-white transition-colors">
                                                    {node.domain === 'numeracy' ? '📐' : '📖'}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-green-400 transition-colors">{node.title}</h3>
                                                    <p className="text-sm text-zinc-400 mb-2">{node.description}</p>
                                                    <div className="flex gaps-2">
                                                        {node.tags.map(tag => (
                                                            <span key={tag} className="text-[10px] uppercase tracking-wider bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded mr-2">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                        <span className="text-[10px] text-blue-500 px-2 py-0.5 border border-blue-500/20 rounded">
                                                            {node.estimatedTime} MIN
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-8 p-4 bg-blue-900/10 border border-blue-500/30 rounded text-sm text-blue-300">
                                ℹ️ <strong>DEBUG NOTE:</strong> These tasks are generated in real-time by traversing the Knowledge Graph.
                                Completing a task updates the Learner Model and unlocks dependent nodes immediately.
                            </div>
                        </div>


                    </div>

                </div>


            </div>
        </div>
    );
};
