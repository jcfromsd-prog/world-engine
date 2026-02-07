
import React, { useState } from 'react';
import { GhostClassEngine } from '../../lib/ghostEngine';
import type { SimulationResult } from '../../lib/ghostEngine';

export const SwarmDashboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [results, setResults] = useState<SimulationResult[]>([]);
    const [running, setRunning] = useState(false);

    const handleRunSwarm = () => {
        setRunning(true);
        setTimeout(() => {
            const swarmResults = GhostClassEngine.runSwarm();
            setResults(swarmResults);
            setRunning(false);
        }, 1200);
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black text-white font-mono flex flex-col items-center justify-center p-8 animate-fade-in">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-2">👻 THE GHOST CLASS</h1>
            <p className="text-zinc-500 mb-8 uppercase tracking-widest text-xs">Automated Pedagogical Verification Swarm</p>

            <div className="w-full max-w-4xl bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden shadow-2xl">
                <div className="bg-zinc-800 px-6 py-3 border-b border-zinc-700 flex justify-between items-center">
                    <span className="text-xs text-zinc-400">status: {running ? <span className="text-yellow-400 animate-pulse">RUNNING SIMULATION...</span> : <span className="text-green-500">IDLE</span>}</span>
                    <button
                        onClick={handleRunSwarm}
                        disabled={running}
                        className={`px-4 py-2 text-xs font-bold uppercase rounded ${running ? 'bg-zinc-700 text-zinc-500' : 'bg-red-600 hover:bg-red-500 text-white'}`}
                    >
                        {running ? 'Spawning Agents...' : 'RELEASE SWARM'}
                    </button>
                </div>

                <div className="p-6 min-h-[300px] overflow-y-auto font-mono text-sm space-y-2">
                    {results.length === 0 && !running && <div className="text-zinc-600 text-center py-20">Click 'RELEASE SWARM' to test the Mission Logic.</div>}

                    {results.map((res, idx) => (
                        <div key={idx} className={`p-3 border-l-4 rounded bg-zinc-950 flex justify-between items-center animate-slide-in-right ${res.actualOutcome === res.expectedOutcome ? 'border-green-500' : 'border-red-500'}`}>
                            <div>
                                <div className="font-bold text-zinc-300">{res.agentId}</div>
                                <div className="text-xs text-zinc-500 truncate max-w-md">Input: "{res.input}"</div>
                            </div>
                            <div className="text-right">
                                <div className={`font-bold ${res.actualOutcome === 'ACCEPT' ? 'text-green-400' : 'text-red-400'}`}>
                                    {res.actualOutcome}
                                </div>
                                <div className="text-[10px] text-zinc-600 uppercase">
                                    Expected: {res.expectedOutcome} {res.actualOutcome === res.expectedOutcome ? '✅' : '❌'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button onClick={onClose} className="mt-8 text-zinc-600 hover:text-white text-xs uppercase underline">Exit Simulation</button>
        </div>
    );
};
