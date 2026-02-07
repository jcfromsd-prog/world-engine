/* ==========================================================================
   2. FOUNDER CHECK MODAL
   File: src/components/dashboard/FounderCheckModal.tsx
   ========================================================================== */
import React from 'react';

interface FounderCheckProps {
    isOpen: boolean;
    onClose: () => void;
}

import { SimulationEngine } from '../../services/SimulationEngine';
import { useState } from 'react';

export const FounderCheckModal: React.FC<FounderCheckProps> = ({ isOpen, onClose }) => {
    const [logs, setLogs] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [metrics, setMetrics] = useState({ logic: 100, economy: 100, safety: 100 });

    if (!isOpen) return null;

    const handleSimulate = (key: string) => {
        localStorage.setItem('simulatePersona', key);
        window.location.reload();
    };

    const handleRunQA = async () => {
        setIsRunning(true);
        setLogs(['🚀 STARTING GHOST SQUAD QA...', '--------------------------------']);
        setMetrics({ logic: 100, economy: 100, safety: 100 }); // Reset to 100% Risk

        await SimulationEngine.runFullQA((msg) => {
            setLogs(prev => [...prev, msg]);

            // "Countdown to Perfection" Logic
            if (msg.includes("PASSED")) {
                setMetrics(prev => ({
                    logic: Math.max(0, prev.logic - 34),
                    economy: Math.max(0, prev.economy - 34),
                    safety: Math.max(0, prev.safety - 34)
                }));
            }
            if (msg.includes("FAILED") || msg.includes("FAIL")) {
                setLogs(prev => [...prev, "⚠️ RISK LEVEL SPIKE DETECTED"]);
            }
        });
        setIsRunning(false);
    };

    return (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[200] font-mono text-green-400 p-4">
            <div className="w-full max-w-4xl bg-black border-2 border-green-500 rounded-lg shadow-[0_0_50px_rgba(34,197,94,0.2)] flex flex-col max-h-[90vh]">

                {/* HEADER */}
                <div className="p-6 border-b border-green-500/30 flex justify-between items-center bg-green-900/10">
                    <div>
                        <h2 className="text-2xl font-black tracking-widest text-green-400">👁️ FOUNDER CONTROL</h2>
                        <div className="text-xs text-green-600 mt-1">OPENCLAW PROTOCOL: ACTIVE</div>
                    </div>

                    {/* SYSTEM HUD - COUNTDOWN TO PERFECTION */}
                    <div className="flex gap-8">
                        <div className="flex flex-col items-center">
                            <span className="text-[9px] text-green-700 font-bold uppercase tracking-widest mb-1">Logic Risk</span>
                            <div className={`text-2xl font-black ${metrics.logic === 0 ? 'text-green-400 animate-pulse' : 'text-green-800'}`}>
                                {metrics.logic}%
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-[9px] text-green-700 font-bold uppercase tracking-widest mb-1">Econ Risk</span>
                            <div className={`text-2xl font-black ${metrics.economy === 0 ? 'text-green-400 animate-pulse' : 'text-green-800'}`}>
                                {metrics.economy}%
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-[9px] text-green-700 font-bold uppercase tracking-widest mb-1">Safe Risk</span>
                            <div className={`text-2xl font-black ${metrics.safety === 0 ? 'text-green-400 animate-pulse' : 'text-green-800'}`}>
                                {metrics.safety}%
                            </div>
                        </div>
                    </div>

                    <button onClick={onClose} className="text-green-600 hover:text-green-400 p-2">✕ CLOSE</button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* LEFT: CONTROLS */}
                    <div className="w-1/3 border-r border-green-500/30 p-6 space-y-8 overflow-y-auto">

                        {/* 1. VISUAL SIMULATION */}
                        <div>
                            <h3 className="text-xs font-bold text-green-600 uppercase tracking-[0.2em] mb-4">Simulate Active User</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => handleSimulate('ELEMENTARY_NOVICE')}
                                    className="w-full p-3 border border-green-500/50 hover:bg-green-500/20 rounded text-left transition-all group"
                                >
                                    <div className="text-sm font-bold text-white group-hover:text-green-300">LEO</div>
                                    <div className="text-[10px] text-green-600">Grade 3 • Explorer</div>
                                </button>

                                <button
                                    onClick={() => handleSimulate('HS_SOPHOMORE')}
                                    className="w-full p-3 border border-green-500/50 hover:bg-green-500/20 rounded text-left transition-all group"
                                >
                                    <div className="text-sm font-bold text-white group-hover:text-green-300">MAYA</div>
                                    <div className="text-[10px] text-green-600">Grade 10 • Builder</div>
                                </button>

                                <button
                                    onClick={() => handleSimulate('COLLEGE_SENIOR')}
                                    className="w-full p-3 border border-green-500/50 hover:bg-green-500/20 rounded text-left transition-all group"
                                >
                                    <div className="text-sm font-bold text-white group-hover:text-green-300">ALEX</div>
                                    <div className="text-[10px] text-green-600">College • Legend</div>
                                </button>
                            </div>
                        </div>

                        {/* 2. AUTOMATED QA */}
                        <div>
                            <h3 className="text-xs font-bold text-green-600 uppercase tracking-[0.2em] mb-4">Verification Cycle</h3>
                            <button
                                onClick={handleRunQA}
                                disabled={isRunning}
                                className={`w-full py-4 border-2 border-green-500 font-bold tracking-widest uppercase hover:bg-green-500 hover:text-black transition-all ${isRunning ? 'opacity-50 cursor-wait' : ''}`}
                            >
                                {isRunning ? 'Verifying...' : 'Run Diagnostics'}
                            </button>
                            <p className="text-[9px] text-green-700 mt-2 text-center">
                                {metrics.logic === 0 ? "✨ ALL SYSTEMS OPTIMIZED" : "⚠️ SYSTEM VERIFICATION REQUIRED"}
                            </p>
                        </div>

                    </div>

                    {/* RIGHT: LOGS */}
                    <div className="flex-1 bg-black p-6 overflow-y-auto font-mono text-xs leading-relaxed space-y-1">
                        {logs.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-green-800 opacity-50">
                                <div className="text-4xl mb-4">🛡️</div>
                                <div>AWAITING COMMAND PARAMETERS...</div>
                            </div>
                        ) : (
                            logs.map((log, i) => (
                                <div key={i} className={`${log.includes('RED ALERT') || log.includes('FAIL') ? 'text-red-500 font-bold bg-red-900/10 p-1' : log.includes('SUCCESS') || log.includes('PASSED') ? 'text-green-300' : 'text-green-700'}`}>
                                    {log}
                                </div>
                            ))
                        )}
                        <div id="log-end" />
                    </div>
                </div>
            </div>
        </div>
    );
};
