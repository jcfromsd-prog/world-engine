/* ==========================================================================
   SIMULATION DASHBOARD COMPONENT
   Provides a visual interface to run and observe the K-16 Mastery Engine
   ========================================================================== */
import React, { useState } from "react";
import { SimulationEngine, USER_PERSONAS, type PersonaKey } from "../services/SimulationEngine";
import { GRADE_LABELS } from "../types/EngineTypes";

interface SimulationLog {
    message: string;
    timestamp: Date;
    type: "info" | "success" | "warning" | "header";
}

export const SimulationDashboard: React.FC = () => {
    const [logs, setLogs] = useState<SimulationLog[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [selectedPersona, setSelectedPersona] = useState<PersonaKey>("HS_SOPHOMORE");

    const getLogType = (msg: string): SimulationLog["type"] => {
        if (msg.startsWith("═") || msg.startsWith("🚀") || msg.startsWith("🏁")) return "header";
        if (msg.includes("✅") || msg.includes("COMPLETE") || msg.includes("MASTERED")) return "success";
        if (msg.includes("⚠️") || msg.includes("Stall")) return "warning";
        return "info";
    };

    const runSimulation = async (personaKey: PersonaKey) => {
        setIsRunning(true);
        setLogs([]);
        setSelectedPersona(personaKey);

        await SimulationEngine.runSimulation(personaKey, (msg) => {
            setLogs((prev) => [
                ...prev,
                {
                    message: msg,
                    timestamp: new Date(),
                    type: getLogType(msg),
                },
            ]);
        });

        setTimeout(() => setIsRunning(false), 1000);
    };

    const personaButtons = [
        { key: "KINDER_NOVICE" as PersonaKey, color: "green", label: "Pre-K / Kindergarten", sublabel: "The Explorer Path" },
        { key: "GRADE_4_BUILDER" as PersonaKey, color: "emerald", label: "Grade 3-5", sublabel: "The Builder Path" },
        { key: "HS_SOPHOMORE" as PersonaKey, color: "blue", label: "High School", sublabel: "The Analyst Path" },
        { key: "COLLEGE_FRESH" as PersonaKey, color: "purple", label: "College / Career", sublabel: "The Innovator Path" },
    ];

    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans">
            {/* HEADER */}
            <header className="mb-10 border-b border-white/10 pb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        MYBESTPURPOSE
                    </h1>
                    <p className="text-zinc-500 text-sm mt-1">THE WORLD ENGINE // K-16 MASTERY PROTOCOL</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-zinc-800 rounded text-xs text-zinc-400">NY/CA STANDARDS</span>
                    <span className="px-3 py-1 bg-zinc-800 rounded text-xs text-zinc-400">NGSS</span>
                    <span className="px-3 py-1 bg-zinc-800 rounded text-xs text-zinc-400">NACE</span>
                </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* LEFT: CONTROLS */}
                <section>
                    <div className="space-y-6 mb-12">
                        <h2 className="text-2xl font-bold text-white">Choose a Simulation Path</h2>
                        <p className="text-zinc-400">
                            Run the engine against rigorous state standards to verify adaptive progression.
                        </p>

                        <div className="grid grid-cols-1 gap-4">
                            {personaButtons.map(({ key, color, label, sublabel }) => {
                                const persona = USER_PERSONAS[key];
                                return (
                                    <button
                                        key={key}
                                        onClick={() => runSimulation(key)}
                                        disabled={isRunning}
                                        className={`p-4 bg-zinc-900 border border-zinc-700 rounded-xl text-left hover:border-${color}-400 transition-all group disabled:opacity-50 disabled:cursor-not-allowed ${selectedPersona === key && isRunning ? `border-${color}-400` : ""
                                            }`}
                                    >
                                        <div className={`text-${color}-400 font-bold text-sm mb-1`}>{label}</div>
                                        <div className="text-white font-bold text-lg">{sublabel}</div>
                                        <div className="text-xs text-zinc-500 mt-2">
                                            {persona.name} • {GRADE_LABELS[persona.gradeLevel]} • θ: {persona.skillTheta.toFixed(1)}
                                        </div>
                                        <div className="text-xs text-zinc-600 mt-1">
                                            Interests: {persona.interests.join(", ")}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* LEGEND */}
                    <div className="p-4 bg-zinc-900/50 rounded-xl border border-white/5">
                        <h3 className="text-sm font-bold text-zinc-400 mb-3">JOURNEY STAGES</h3>
                        <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-mono">
                            <div className="p-2 bg-cyan-500/10 rounded text-cyan-400">🛡️ ID</div>
                            <div className="p-2 bg-blue-500/10 rounded text-blue-400">👥 CON</div>
                            <div className="p-2 bg-purple-500/10 rounded text-purple-400">🧠 LRN</div>
                            <div className="p-2 bg-green-500/10 rounded text-green-400">⚡ SLV</div>
                            <div className="p-2 bg-yellow-500/10 rounded text-yellow-400">💰 ERN</div>
                        </div>
                    </div>
                </section>

                {/* RIGHT: TERMINAL */}
                <section className="bg-zinc-900 rounded-xl border border-white/10 p-6 h-[700px] overflow-hidden flex flex-col relative">
                    <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-4">
                        <h3 className="font-mono text-zinc-300 text-sm">&gt;&gt; ENGINE_LOGS_V3.0</h3>
                        <div className={`h-3 w-3 rounded-full ${isRunning ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-1 font-mono text-sm scrollbar-thin scrollbar-thumb-zinc-700">
                        {logs.length === 0 && (
                            <div className="text-zinc-600 text-center mt-20">
                                [SYSTEM STANDBY]
                                <br />
                                Waiting for simulation trigger...
                            </div>
                        )}
                        {logs.map((log, i) => (
                            <div key={i} className="break-words leading-relaxed">
                                <span className="text-zinc-600 mr-2 text-xs">
                                    [{log.timestamp.toLocaleTimeString()}]
                                </span>
                                <span
                                    className={
                                        log.type === "header"
                                            ? "text-white font-bold"
                                            : log.type === "success"
                                                ? "text-green-400"
                                                : log.type === "warning"
                                                    ? "text-yellow-400"
                                                    : "text-zinc-300"
                                    }
                                >
                                    {log.message}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute top-0 left-0 w-full h-12 pointer-events-none bg-gradient-to-b from-zinc-900 to-transparent" />
                    <div className="absolute bottom-0 left-0 w-full h-12 pointer-events-none bg-gradient-to-t from-zinc-900 to-transparent" />
                </section>
            </main>
        </div>
    );
};

export default SimulationDashboard;
