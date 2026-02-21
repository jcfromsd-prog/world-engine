/* ==========================================================================
   SIMULATION DASHBOARD v1.1 — AUTONOMOUS + OBSERVABLE
   File: src/components/SimulationDashboard.tsx

   Features:
   - One-click batch launch (zero manual "Continue" clicks)
   - Real-time progress bar with ETA
   - "Simulating Agent X of Y... (Step: Z)" status
   - 🟥 EMERGENCY STOP button to abort gracefully
   - Per-agent result badges with pass/fail/crash tracking
   - Auto-scrolling log terminal
   ========================================================================== */
import React, { useState, useRef, useCallback, useEffect } from "react";
import {
    SimulationEngine,
    USER_PERSONAS,
    type PersonaKey,
} from "../services/SimulationEngine";
import type {
    SimulationBatchConfig,
    SimulationProgress,
    SimulationAgentResult,
    SimulationBatchReport,
    StressVector,
} from "../types/EngineTypes";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════
interface SimulationLog {
    message: string;
    timestamp: Date;
    type: "info" | "success" | "warning" | "header" | "error";
}

type DashboardMode = "CONFIG" | "RUNNING" | "COMPLETE";

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════
const getLogType = (msg: string): SimulationLog["type"] => {
    if (msg.startsWith("═") || msg.startsWith("🚀") || msg.startsWith("🏁") || msg.includes("BATCH"))
        return "header";
    if (msg.includes("✅") || msg.includes("COMPLETE") || msg.includes("MASTERED") || msg.includes("PASS"))
        return "success";
    if (msg.includes("⚠️") || msg.includes("Stall") || msg.includes("FAIL"))
        return "warning";
    if (msg.includes("🟥") || msg.includes("CRASH") || msg.includes("ABORT") || msg.includes("🛑") || msg.includes("Abandoned"))
        return "error";
    return "info";
};

const formatMs = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    const secs = Math.floor(ms / 1000);
    const mins = Math.floor(secs / 60);
    if (mins > 0) return `${mins}m ${secs % 60}s`;
    return `${secs}s`;
};

const STEP_COLORS: Record<string, string> = {
    IDENTITY: "text-cyan-400",
    CONNECT: "text-blue-400",
    LEARN: "text-purple-400",
    SOLVE: "text-green-400",
    EARN: "text-yellow-400",
    COMPLETE: "text-emerald-400",
};

const STEP_ICONS: Record<string, string> = {
    IDENTITY: "🛡️",
    CONNECT: "👥",
    LEARN: "🧠",
    SOLVE: "⚡",
    EARN: "💰",
    COMPLETE: "🏁",
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export const SimulationDashboard: React.FC = () => {
    // ── State ──
    const [mode, setMode] = useState<DashboardMode>("CONFIG");
    const [logs, setLogs] = useState<SimulationLog[]>([]);
    const [progress, setProgress] = useState<SimulationProgress | null>(null);
    const [results, setResults] = useState<SimulationAgentResult[]>([]);
    const [report, setReport] = useState<SimulationBatchReport | null>(null);

    // ── Config State ──
    const [agentCount, setAgentCount] = useState(50);
    const [target, setTarget] = useState("Onboarding Flow");
    const [stepDelay, setStepDelay] = useState(150);
    const [stressVectors, setStressVectors] = useState<StressVector[]>(["ADVERSARIAL", "RAGE_QUIT"]);
    const [selectedPersona, setSelectedPersona] = useState<PersonaKey | "ALL">("ALL");

    // ── Refs ──
    const abortControllerRef = useRef<AbortController | null>(null);
    const logEndRef = useRef<HTMLDivElement>(null);

    // ── Auto-scroll ──
    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    // ── Callbacks ──
    const addLog = useCallback((msg: string) => {
        setLogs((prev) => [
            ...prev,
            { message: msg, timestamp: new Date(), type: getLogType(msg) },
        ]);
    }, []);

    const handleProgress = useCallback((p: SimulationProgress) => {
        setProgress(p);
    }, []);

    const handleAgentComplete = useCallback((r: SimulationAgentResult) => {
        setResults((prev) => [...prev, r]);
    }, []);

    // ── Launch Batch ──
    const launchBatch = async () => {
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setMode("RUNNING");
        setLogs([]);
        setResults([]);
        setReport(null);
        setProgress(null);

        const config: SimulationBatchConfig = {
            agentCount,
            target,
            stressVectors,
            stepDelayMs: stepDelay,
            signal: controller.signal,
            personaDistribution:
                selectedPersona !== "ALL"
                    ? { [selectedPersona]: agentCount }
                    : undefined, // undefined = even distribution
        };

        try {
            const batchReport = await SimulationEngine.runBatch(config, {
                onProgress: handleProgress,
                onLog: addLog,
                onAgentComplete: handleAgentComplete,
            });

            setReport(batchReport);
            setMode("COMPLETE");
        } catch (e) {
            addLog(`\n🟥 CRITICAL ERROR: ${e instanceof Error ? e.message : String(e)}`);
            setMode("COMPLETE");
        }
    };

    // ── Emergency Stop ──
    const emergencyStop = () => {
        abortControllerRef.current?.abort();
        addLog(`\n🟥 EMERGENCY STOP TRIGGERED BY OPERATOR`);
    };

    // ── Reset ──
    const resetDashboard = () => {
        setMode("CONFIG");
        setLogs([]);
        setResults([]);
        setReport(null);
        setProgress(null);
    };

    // ═══════════════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════════════
    return (
        <div className="min-h-screen bg-black text-white p-6 font-sans">
            {/* HEADER */}
            <header className="mb-8 border-b border-white/10 pb-4 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        SIMULATION ENGINE v1.1
                    </h1>
                    <p className="text-zinc-500 text-xs mt-1 font-mono">
                        AUTONOMOUS BATCH ORCHESTRATOR // ZERO MANUAL INTERVENTION
                    </p>
                </div>
                <div className="flex gap-2 items-center">
                    <span className="px-3 py-1 bg-zinc-800 rounded text-xs text-zinc-400 font-mono">
                        {mode}
                    </span>
                    {mode === "RUNNING" && progress && (
                        <span className="px-3 py-1 bg-emerald-900/50 rounded text-xs text-emerald-400 font-mono animate-pulse">
                            {Math.round(progress.progressPercent * 100)}%
                        </span>
                    )}
                </div>
            </header>

            {/* ──────────────────────────────────────────────────────────────── */}
            {/* PERSISTENT STATUS PANEL (visible during RUNNING + COMPLETE) */}
            {/* ──────────────────────────────────────────────────────────────── */}
            {(mode === "RUNNING" || mode === "COMPLETE") && progress && (
                <div className="mb-6 bg-zinc-900 border border-white/10 rounded-xl p-6">
                    {/* Progress Bar */}
                    <div className="mb-4">
                        <div className="flex justify-between text-xs font-mono text-zinc-400 mb-2">
                            <span>
                                {progress.isRunning
                                    ? `Simulating Agent ${progress.currentAgent} of ${progress.totalAgents}...`
                                    : progress.wasAborted
                                        ? "🟥 BATCH ABORTED"
                                        : "✅ BATCH COMPLETE"}
                            </span>
                            <span>
                                {progress.isRunning
                                    ? `ETA: ${formatMs(progress.estimatedRemainingMs)}`
                                    : `Total: ${formatMs((report?.completedAt || progress.startedAt) - progress.startedAt)}`}
                            </span>
                        </div>
                        <div className="w-full h-4 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-300 ${progress.wasAborted
                                    ? "bg-red-500"
                                    : progress.isRunning
                                        ? "bg-gradient-to-r from-blue-500 to-cyan-400"
                                        : "bg-gradient-to-r from-emerald-500 to-green-400"
                                    }`}
                                style={{ width: `${Math.round(progress.progressPercent * 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-5 gap-3 mb-4">
                        <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
                            <div className="text-2xl font-black text-white">
                                {progress.currentAgent}/{progress.totalAgents}
                            </div>
                            <div className="text-[10px] text-zinc-500 font-mono">AGENTS</div>
                        </div>
                        <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
                            <div className="text-2xl font-black text-emerald-400">
                                {progress.passedCount}
                            </div>
                            <div className="text-[10px] text-zinc-500 font-mono">PASSED</div>
                        </div>
                        <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
                            <div className="text-2xl font-black text-red-400">
                                {progress.failedCount}
                            </div>
                            <div className="text-[10px] text-zinc-500 font-mono">FAILED</div>
                        </div>
                        <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
                            <div className="text-2xl font-black text-amber-500">
                                {progress.abandonCount}
                            </div>
                            <div className="text-[10px] text-zinc-500 font-mono">ABANDONED</div>
                        </div>
                        <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
                            <div className={`text-2xl font-black ${STEP_COLORS[progress.currentStep] || "text-white"}`}>
                                {STEP_ICONS[progress.currentStep] || "—"}
                            </div>
                            <div className="text-[10px] text-zinc-500 font-mono">{progress.currentStep}</div>
                        </div>
                        <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
                            <div className="text-sm font-bold text-zinc-300 truncate">
                                {progress.agentName}
                            </div>
                            <div className="text-[10px] text-zinc-500 font-mono">CURRENT</div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-3">
                        {progress.isRunning && (
                            <button
                                onClick={emergencyStop}
                                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                            >
                                🟥 EMERGENCY STOP
                            </button>
                        )}
                        {!progress.isRunning && (
                            <>
                                <button
                                    onClick={resetDashboard}
                                    className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-bold rounded-xl transition-all"
                                >
                                    ← New Batch
                                </button>
                                <button
                                    onClick={launchBatch}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all"
                                >
                                    🔄 Re-Run
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ──────────────────────────────────────────────────────────── */}
                {/* LEFT: CONFIG PANEL */}
                {/* ──────────────────────────────────────────────────────────── */}
                <section className={mode === "CONFIG" ? "lg:col-span-1" : "lg:col-span-1"}>
                    {mode === "CONFIG" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-white">Batch Configuration</h2>

                            {/* Agent Count */}
                            <div>
                                <label className="text-xs text-zinc-400 font-mono block mb-2">
                                    AGENT COUNT
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    max={500}
                                    value={agentCount}
                                    onChange={(e) => setAgentCount(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:border-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* Target */}
                            <div>
                                <label className="text-xs text-zinc-400 font-mono block mb-2">
                                    TARGET SYSTEM
                                </label>
                                <select
                                    value={target}
                                    onChange={(e) => setTarget(e.target.value)}
                                    className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:border-blue-500 focus:outline-none"
                                >
                                    <option>Onboarding Flow</option>
                                    <option>Marketplace</option>
                                    <option>Learning Engine</option>
                                    <option>Full Journey (5 Pillars)</option>
                                </select>
                            </div>

                            {/* Step Delay */}
                            <div>
                                <label className="text-xs text-zinc-400 font-mono block mb-2">
                                    STEP DELAY ({stepDelay}ms) — Lower = Faster
                                </label>
                                <input
                                    type="range"
                                    min={10}
                                    max={1000}
                                    value={stepDelay}
                                    onChange={(e) => setStepDelay(parseInt(e.target.value))}
                                    className="w-full accent-blue-500"
                                />
                                <div className="flex justify-between text-[10px] text-zinc-600">
                                    <span>⚡ Turbo (10ms)</span>
                                    <span>🐢 Realistic (1s)</span>
                                </div>
                            </div>

                            {/* Stress Vectors */}
                            <div>
                                <label className="text-xs text-zinc-400 font-mono block mb-2">
                                    STRESS VECTORS
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {(["ADVERSARIAL", "RAGE_QUIT", "SLOW_NETWORK", "REFRESH_MID_FLOW", "NONE"] as StressVector[]).map(
                                        (sv) => (
                                            <button
                                                key={sv}
                                                onClick={() =>
                                                    setStressVectors((prev) =>
                                                        prev.includes(sv)
                                                            ? prev.filter((v) => v !== sv)
                                                            : [...prev, sv]
                                                    )
                                                }
                                                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${stressVectors.includes(sv)
                                                    ? "bg-red-900/50 border border-red-500/50 text-red-400"
                                                    : "bg-zinc-800 border border-white/5 text-zinc-500"
                                                    }`}
                                            >
                                                {sv}
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Persona Selector */}
                            <div>
                                <label className="text-xs text-zinc-400 font-mono block mb-2">
                                    PERSONA FOCUS
                                </label>
                                <select
                                    value={selectedPersona}
                                    onChange={(e) => setSelectedPersona(e.target.value as PersonaKey | "ALL")}
                                    className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="ALL">ALL (Even Distribution)</option>
                                    {Object.entries(USER_PERSONAS).map(([key, persona]) => (
                                        <option key={key} value={key}>
                                            {key} — {persona.name} (θ: {persona.skillTheta.toFixed(1)}, G{persona.gradeLevel})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* LAUNCH */}
                            <button
                                onClick={launchBatch}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-lg rounded-xl transition-all hover:scale-[1.02] shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                            >
                                🚀 LAUNCH BATCH ({agentCount} agents)
                            </button>
                        </div>
                    )}

                    {/* Agent Results Summary (shown during RUNNING/COMPLETE) */}
                    {mode !== "CONFIG" && results.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-zinc-400 mb-3 font-mono">
                                AGENT RESULTS ({results.length}/{agentCount})
                            </h3>
                            <div className="space-y-1 max-h-[500px] overflow-y-auto">
                                {results.map((r) => (
                                    <div
                                        key={r.agentIndex}
                                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono ${r.outcome === "PASS"
                                            ? "bg-emerald-900/20 border border-emerald-500/10"
                                            : r.outcome === "ABORT" || r.outcome === "PEDAGOGICAL_ABANDON"
                                                ? "bg-red-900/20 border border-red-500/10"
                                                : "bg-yellow-900/20 border border-yellow-500/10"
                                            }`}
                                    >
                                        <span className="text-zinc-300 truncate mr-2">
                                            #{r.agentIndex} {r.personaName}
                                        </span>
                                        <span
                                            className={
                                                r.outcome === "PASS"
                                                    ? "text-emerald-400"
                                                    : r.outcome === "ABORT" || r.outcome === "PEDAGOGICAL_ABANDON"
                                                        ? "text-red-400"
                                                        : "text-yellow-400"
                                            }
                                        >
                                            {r.outcome === "PASS" ? "✅" : (r.outcome === "ABORT" || r.outcome === "PEDAGOGICAL_ABANDON") ? "🟥" : "❌"}{" "}
                                            {r.outcome}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Batch Report (shown on COMPLETE) */}
                    {mode === "COMPLETE" && report && (
                        <div className="mt-6 bg-zinc-900/80 border border-white/10 rounded-xl p-4">
                            <h3 className="text-sm font-bold text-white mb-3 font-mono">
                                📊 BATCH REPORT
                            </h3>
                            <div className="space-y-2 text-xs font-mono">
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">Pass Rate:</span>
                                    <span
                                        className={
                                            report.passRate >= 0.65
                                                ? "text-emerald-400 font-bold"
                                                : "text-red-400 font-bold"
                                        }
                                    >
                                        {(report.passRate * 100).toFixed(0)}%{" "}
                                        {report.passRate >= 0.65 ? "✅" : "❌"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">Duration:</span>
                                    <span className="text-zinc-300">
                                        {formatMs(report.totalDurationMs)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">Abandon Rate:</span>
                                    <span className="text-amber-400 font-bold">
                                        {(report.abandonRate * 100).toFixed(0)}%
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">Agents:</span>
                                    <span className="text-zinc-300">{report.results.length}</span>
                                </div>
                                {report.wasAborted && (
                                    <div className="text-red-400 font-bold mt-2">
                                        🟥 Batch was aborted early
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </section>

                {/* ──────────────────────────────────────────────────────────── */}
                {/* RIGHT: LOG TERMINAL */}
                {/* ──────────────────────────────────────────────────────────── */}
                <section
                    className={`bg-zinc-900 rounded-xl border border-white/10 p-4 flex flex-col relative ${mode === "CONFIG" ? "lg:col-span-2 h-[600px]" : "lg:col-span-2 h-[700px]"
                        }`}
                >
                    <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-3">
                        <h3 className="font-mono text-zinc-300 text-xs">
                            &gt;&gt; ENGINE_LOGS_v1.1
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-zinc-600 font-mono">
                                {logs.length} lines
                            </span>
                            <div
                                className={`h-3 w-3 rounded-full ${mode === "RUNNING"
                                    ? "bg-green-500 animate-pulse"
                                    : mode === "COMPLETE"
                                        ? "bg-blue-500"
                                        : "bg-zinc-600"
                                    }`}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-0.5 font-mono text-[11px] leading-relaxed scrollbar-thin scrollbar-thumb-zinc-700">
                        {logs.length === 0 && (
                            <div className="text-zinc-600 text-center mt-20">
                                [SYSTEM STANDBY]
                                <br />
                                Configure batch parameters and press LAUNCH.
                            </div>
                        )}
                        {logs.map((log, i) => (
                            <div key={i} className="break-words">
                                <span className="text-zinc-700 mr-1">
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
                                                    : log.type === "error"
                                                        ? "text-red-400"
                                                        : "text-zinc-400"
                                    }
                                >
                                    {log.message}
                                </span>
                            </div>
                        ))}
                        <div ref={logEndRef} />
                    </div>

                    {/* Gradient Overlays */}
                    <div className="absolute top-0 left-0 w-full h-10 pointer-events-none bg-gradient-to-b from-zinc-900 to-transparent" />
                    <div className="absolute bottom-0 left-0 w-full h-10 pointer-events-none bg-gradient-to-t from-zinc-900 to-transparent" />
                </section>
            </main>

            {/* JOURNEY STAGES LEGEND */}
            <div className="mt-6 p-4 bg-zinc-900/50 rounded-xl border border-white/5">
                <div className="grid grid-cols-6 gap-2 text-center text-[10px] font-mono">
                    <div className="p-2 bg-cyan-500/10 rounded text-cyan-400">🛡️ IDENTITY</div>
                    <div className="p-2 bg-blue-500/10 rounded text-blue-400">👥 CONNECT</div>
                    <div className="p-2 bg-purple-500/10 rounded text-purple-400">🧠 LEARN</div>
                    <div className="p-2 bg-green-500/10 rounded text-green-400">⚡ SOLVE</div>
                    <div className="p-2 bg-yellow-500/10 rounded text-yellow-400">💰 EARN</div>
                    <div className="p-2 bg-emerald-500/10 rounded text-emerald-400">🏁 COMPLETE</div>
                </div>
            </div>
        </div>
    );
};

export default SimulationDashboard;
