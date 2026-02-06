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

    if (!isOpen) return null;

    const handleSimulate = (key: string) => {
        localStorage.setItem('simulatePersona', key);
        window.location.reload();
    };

    const handleRunQA = async () => {
        setIsRunning(true);
        setLogs(['🚀 STARTING GHOST SQUAD QA...']);
        await SimulationEngine.runFullQA((msg) => {
            setLogs(prev => [...prev, msg]);
        });
        setIsRunning(false);
    };

    return (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[200] font-mono text-green-400 p-4">
            <div className="w-full max-w-4xl bg-black border-2 border-green-500 rounded-lg shadow-[0_0_50px_rgba(34,197,94,0.2)] flex flex-col max-h-[90vh]">

                {/* HEADER */}
                <div className="p-6 border-b border-green-500/30 flex justify-between items-center bg-green-900/10">
                    <div>
                        <h2 className="text-2xl font-black tracking-widest text-green-400">👁️ NOETIC INTEGRITY CHECK</h2>
                        <div className="text-xs text-green-600 mt-1">GHOST SQUAD PROTOCOL: ACTIVE</div>
                    </div>
                    <button onClick={onClose} className="text-green-600 hover:text-green-400">✕</button>
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
                            <h3 className="text-xs font-bold text-green-600 uppercase tracking-[0.2em] mb-4">System Verification</h3>
                            <button
                                onClick={handleRunQA}
                                disabled={isRunning}
                                className={`w-full py-4 border-2 border-green-500 font-bold tracking-widest uppercase hover:bg-green-500 hover:text-black transition-all ${isRunning ? 'opacity-50 cursor-wait' : ''}`}
                            >
                                {isRunning ? 'Running Tests...' : 'Run Full QA Batch'}
                            </button>
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
