import React, { useState, useCallback } from 'react';
import { masterTeacher, GHOST_CLASSROOM, type SimulationRun, type BlueprintViolation } from '../../lib/masterTeacher';

export const MasterTeacherDashboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [isRunning, setIsRunning] = useState(false);
    const [lastRun, setLastRun] = useState<SimulationRun | null>(null);
    const [report, setReport] = useState<string>('');
    const [showReport, setShowReport] = useState(false);

    const runSimulation = useCallback(async () => {
        setIsRunning(true);
        setReport('');

        // Simulate async processing
        await new Promise(r => setTimeout(r, 100));

        const result = masterTeacher.runSwarmSimulation(50); // 50 iterations
        setLastRun(result);

        // Generate report
        const morningReport = masterTeacher.generateMorningReport();
        setReport(morningReport);
        setIsRunning(false);
        setShowReport(true);
    }, []);

    const getSeverityColor = (severity: BlueprintViolation['severity']) => {
        switch (severity) {
            case 'CRITICAL': return 'text-red-400 bg-red-500/20';
            case 'HIGH': return 'text-orange-400 bg-orange-500/20';
            case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/20';
            case 'LOW': return 'text-blue-400 bg-blue-500/20';
        }
    };

    return (
        <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-xl overflow-auto p-6 animate-fade-in">
            <div className="max-w-6xl mx-auto">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-2">
                            🎓 MASTER TEACHER
                        </h1>
                        <p className="text-zinc-500 text-sm font-mono">
                            Self-Correcting Swarm Intelligence • Blueprint: 2-6-2026
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={runSimulation}
                            disabled={isRunning}
                            className={`px-6 py-3 font-black text-sm uppercase rounded-xl transition-all ${isRunning
                                ? 'bg-zinc-800 text-zinc-500 cursor-wait'
                                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 shadow-lg shadow-purple-500/30'
                                }`}
                        >
                            {isRunning ? '⏳ SIMULATING...' : '🚀 RUN SWARM'}
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-3 bg-zinc-800 text-zinc-400 text-sm font-bold rounded-xl hover:bg-zinc-700"
                        >
                            ✕ CLOSE
                        </button>
                    </div>
                </div>

                {/* GHOST CLASSROOM */}
                <div className="mb-8">
                    <h2 className="text-xs font-mono text-zinc-600 uppercase tracking-widest mb-4">👻 GHOST CLASSROOM (5 AGENTS)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        {GHOST_CLASSROOM.map(agent => (
                            <div key={agent.id} className="p-4 bg-zinc-900/60 border border-white/5 rounded-xl relative overflow-hidden group hover:border-purple-500/30 transition-all">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-all" />
                                <div className="relative z-10">
                                    <div className="text-2xl mb-2">{agent.personality === 'GAMER' ? '🎮' : agent.personality === 'INTROVERT' ? '📚' : agent.personality === 'STRUGGLING' ? '😰' : agent.personality === 'PRODIGY' ? '🌟' : '🔍'}</div>
                                    <h3 className="font-bold text-white">{agent.name}</h3>
                                    <div className="text-xs text-zinc-500 mt-1">Grade {agent.grade} • {agent.track}</div>
                                    <div className="flex items-center gap-2 mt-3">
                                        <div className="h-1.5 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all ${agent.excitement > 70 ? 'bg-green-500' : agent.excitement > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                style={{ width: `${agent.excitement}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] text-zinc-600">{agent.excitement}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SIMULATION RESULTS */}
                {lastRun && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Stats */}
                        <div className="p-6 bg-zinc-900/60 border border-white/5 rounded-xl">
                            <h3 className="text-xs font-mono text-zinc-600 uppercase mb-4">📊 RUN STATS</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Interactions</span>
                                    <span className="font-bold text-white">{lastRun.totalInteractions.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Duration</span>
                                    <span className="font-bold text-white">{((lastRun.endTime - lastRun.startTime) / 1000).toFixed(1)}s</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Engagement Δ</span>
                                    <span className={`font-bold ${lastRun.engagementDelta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {lastRun.engagementDelta >= 0 ? '+' : ''}{lastRun.engagementDelta.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Violations */}
                        <div className="p-6 bg-zinc-900/60 border border-white/5 rounded-xl">
                            <h3 className="text-xs font-mono text-zinc-600 uppercase mb-4">⚠️ VIOLATIONS</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-red-400">CRITICAL</span>
                                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded">
                                        {lastRun.violations.filter(v => v.severity === 'CRITICAL').length}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-orange-400">HIGH</span>
                                    <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs font-bold rounded">
                                        {lastRun.violations.filter(v => v.severity === 'HIGH').length}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-yellow-400">MEDIUM</span>
                                    <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded">
                                        {lastRun.violations.filter(v => v.severity === 'MEDIUM').length}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Auto-Fixes */}
                        <div className="p-6 bg-zinc-900/60 border border-white/5 rounded-xl">
                            <h3 className="text-xs font-mono text-zinc-600 uppercase mb-4">🔧 AUTO-FIXES APPLIED</h3>
                            {lastRun.autoFixesApplied.length > 0 ? (
                                <ul className="space-y-2">
                                    {lastRun.autoFixesApplied.map((fix, idx) => (
                                        <li key={idx} className="text-sm text-green-400 flex items-start gap-2">
                                            <span>✓</span>
                                            <span>{fix}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-zinc-500 text-sm">No fixes needed this run.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* VIOLATION LOG */}
                {lastRun && lastRun.violations.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xs font-mono text-zinc-600 uppercase tracking-widest mb-4">📋 RECENT VIOLATIONS (Top 10)</h2>
                        <div className="space-y-2 max-h-64 overflow-auto">
                            {lastRun.violations.slice(0, 10).map((v, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-3 bg-zinc-900/40 border border-white/5 rounded-lg">
                                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${getSeverityColor(v.severity)}`}>
                                        {v.severity}
                                    </span>
                                    <span className="text-sm text-white flex-1">{v.description}</span>
                                    <span className="text-xs text-zinc-600">{v.agentName}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* MORNING REPORT */}
                {showReport && report && (
                    <div className="mb-8">
                        <h2 className="text-xs font-mono text-zinc-600 uppercase tracking-widest mb-4">📝 MORNING REPORT (Copy to Founder)</h2>
                        <pre className="p-6 bg-zinc-950 border border-purple-500/30 rounded-xl text-green-400 text-xs font-mono whitespace-pre-wrap overflow-auto max-h-96">
                            {report}
                        </pre>
                    </div>
                )}

                {/* EMPTY STATE */}
                {!lastRun && !isRunning && (
                    <div className="text-center py-20 text-zinc-600">
                        <div className="text-6xl mb-6">🧠</div>
                        <h3 className="text-xl font-bold text-white mb-2">Ready to Observe</h3>
                        <p className="text-sm">Click "RUN SWARM" to simulate 250 student interactions and detect Blueprint violations.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
