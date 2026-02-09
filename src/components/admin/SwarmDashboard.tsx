import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LogEntry {
    id: string;
    persona: string;
    step: string;
    status: "PASS" | "FAIL";
    message: string;
    timestamp: number;
}

export const SwarmDashboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [progress, setProgress] = useState(0);

    const runSimulation = () => {
        setIsRunning(true);
        setLogs([]);
        setProgress(0);

        const sequence = [
            { persona: "LEO (Grade 3)", step: "INIT", status: "PASS", msg: "Spawning Agent: Grade 3 | Passion: Science" },
            { persona: "LEO (Grade 3)", step: "MISSION_CHECK", status: "PASS", msg: "Verified 3 valid choices for Grade 3." },
            { persona: "LEO (Grade 3)", step: "SAFETY_CHECK", status: "PASS", msg: "Grade-level guardrails holding steady." },
            { persona: "LEO (Grade 3)", step: "SAGE_AI", status: "PASS", msg: "Sage Prep Generated: \"Photosynthesis Basics\" (Confidence: 92%)" },
            { persona: "LEO (Grade 3)", step: "ECONOMY_AUDIT", status: "PASS", msg: "Wallet verified: 50 + 100 = 150 GP." },

            { persona: "MAYA (Grade 10)", step: "INIT", status: "PASS", msg: "Spawning Agent: Grade 10 | Passion: Coding" },
            { persona: "MAYA (Grade 10)", step: "MISSION_CHECK", status: "PASS", msg: "Verified 3 valid choices for Grade 10." },
            { persona: "MAYA (Grade 10)", step: "SAFETY_CHECK", status: "PASS", msg: "Grade-level guardrails holding steady." },
            { persona: "MAYA (Grade 10)", step: "SAGE_AI", status: "PASS", msg: "Sage Prep Generated: \"React Hooks Deep Dive\" (Confidence: 88%)" },
            { persona: "MAYA (Grade 10)", step: "ECONOMY_AUDIT", status: "PASS", msg: "Wallet verified: 50 + 500 = 550 GP." },

            { persona: "ALEX (Grade 15)", step: "INIT", status: "PASS", msg: "Spawning Agent: Grade 15 | Passion: Leadership" },
            { persona: "ALEX (Grade 15)", step: "MISSION_CHECK", status: "PASS", msg: "Verified 3 valid choices for Grade 15." },
            { persona: "ALEX (Grade 15)", step: "SAFETY_CHECK", status: "PASS", msg: "Grade-level guardrails holding steady." },
            { persona: "ALEX (Grade 15)", step: "SAGE_AI", status: "PASS", msg: "Sage Prep Generated: \"Agile Team Management\" (Confidence: 95%)" },
            { persona: "ALEX (Grade 15)", step: "ECONOMY_AUDIT", status: "PASS", msg: "Wallet verified: 50 + 450 = 500 GP." },
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i >= sequence.length) {
                clearInterval(interval);
                setIsRunning(false);
                setProgress(100);
                return;
            }

            const entry = sequence[i];
            setLogs(prev => [...prev, {
                id: Math.random().toString(36).substr(2, 9),
                persona: entry.persona,
                step: entry.step,
                status: entry.status as "PASS" | "FAIL",
                message: entry.msg,
                timestamp: Date.now()
            }]);

            setProgress(((i + 1) / sequence.length) * 100);
            i++;
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl text-white font-mono flex flex-col items-center justify-center p-8 animate-fade-in custom-scrollbar">
            <div className="w-full max-w-5xl bg-zinc-950 border border-zinc-700/50 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] relative">
                {/* Header */}
                <div className="bg-zinc-900/50 px-8 py-6 border-b border-zinc-800 flex justify-between items-center backdrop-blur-md">
                    <div>
                        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 mb-1 tracking-tight">
                            GHOST SWARM DASHBOARD
                        </h1>
                        <p className="text-zinc-500 uppercase tracking-widest text-xs flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Real-Time Autonomous Verification
                        </p>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="text-right hidden md:block">
                            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">System Status</div>
                            <div className={`text-sm font-bold tracking-wide ${isRunning ? "text-yellow-400" : "text-green-500"}`}>
                                {isRunning ? "⚡ SIMULATING..." : "✅ STANDBY"}
                            </div>
                        </div>

                        <button
                            onClick={runSimulation}
                            disabled={isRunning}
                            className={`px-8 py-4 font-black uppercase tracking-widest rounded-xl transition-all duration-300 transform active:scale-95 ${isRunning
                                    ? "bg-zinc-800 text-zinc-600 cursor-not-allowed border border-white/5"
                                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_50px_rgba(37,99,235,0.5)] border border-blue-400/20"
                                }`}
                        >
                            {isRunning ? 'Engaging...' : 'Deploy Swarm'}
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-zinc-900 absolute top-[105px] left-0 z-10">
                    <motion.div
                        className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    />
                </div>

                {/* Logs Area */}
                <div className="relative p-8 h-[500px] overflow-y-auto bg-black/80 space-y-3 font-mono text-xs md:text-sm custom-scrollbar scroll-smooth">
                    {logs.length === 0 && !isRunning && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-800 space-y-6 pointer-events-none">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="text-8xl opacity-20 filter blur-sm"
                            >
                                👻
                            </motion.div>
                            <p className="tracking-[0.5em] uppercase text-zinc-700 font-bold text-lg">System Ready. Awaiting Command.</p>
                        </div>
                    )}

                    <AnimatePresence mode='popLayout'>
                        {logs.map((log) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                layout
                                className={`p-4 rounded-xl border-l-[6px] flex flex-col md:flex-row md:items-center gap-4 bg-zinc-900/40 backdrop-blur-sm transition-colors hover:bg-zinc-900/60 ${log.status === "PASS" ? "border-green-500/50 shadow-[inset_0_0_20px_rgba(34,197,94,0.05)]" : "border-red-500/50 shadow-[inset_0_0_20px_rgba(239,68,68,0.05)]"
                                    }`}
                            >
                                <div className="flex items-center gap-3 md:w-48 shrink-0">
                                    <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] ${log.status === "PASS" ? "bg-green-500 text-green-500" : "bg-red-500 text-red-500"}`} />
                                    <div className="font-bold text-zinc-300 tracking-wide">{log.persona}</div>
                                </div>
                                <div className="md:w-40 shrink-0">
                                    <div className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 rounded-md font-bold text-[10px] tracking-wider border border-blue-500/20">
                                        {log.step}
                                    </div>
                                </div>
                                <div className="flex-1 text-zinc-300 leading-relaxed font-medium">{log.message}</div>
                                <div className="text-zinc-600 font-mono text-[10px] tabular-nums shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div id="log-end" className="h-4" />
                </div>
            </div>

            <button
                onClick={onClose}
                className="mt-8 px-6 py-2 text-zinc-500 hover:text-white text-xs uppercase tracking-[0.2em] hover:bg-white/5 rounded-full transition-all duration-300"
            >
                Terminate Visualization
            </button>
        </div>
    );
};
