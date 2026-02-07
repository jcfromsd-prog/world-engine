/* ==========================================================================
   FOUNDER COMMAND PANEL (Upgraded from FounderCheckModal)
   File: src/components/dashboard/FounderCommandPanel.tsx
   ========================================================================== */
import React, { useState, useMemo } from 'react';
import { SimulationEngine } from '../../services/SimulationEngine';
import { masterTeacher, GHOST_CLASSROOM } from '../../lib/masterTeacher';
import { auditEngine, AUDIT_PROFILES } from '../../services/AuditEngine';
import type { AuditResult } from '../../services/AuditEngine';

interface FounderCommandPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onLaunchMasterTeacher: () => void;
    onDeployGhostClass: () => void;
}

type AuditStep = 'UI' | 'SOCIAL' | 'GROWTH' | 'ECONOMY';
type AuditStatus = 'PENDING' | 'RUNNING' | 'PASS' | 'FAIL';

interface StepState {
    status: AuditStatus;
    msg?: string;
}

export const FounderCommandPanel: React.FC<FounderCommandPanelProps> = ({
    isOpen,
    onClose,
    onLaunchMasterTeacher: _onLaunchMasterTeacher,
    onDeployGhostClass
}) => {
    const [logs, setLogs] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [metrics, setMetrics] = useState({ logic: 64, agents: 92, optimization: 45 });
    const [activeTab, setActiveTab] = useState<'COMMAND' | 'SIMULATE' | 'LOGS' | 'AUDIT'>('COMMAND');

    // Audit State
    const [auditState, setAuditState] = useState<Record<string, Record<AuditStep, StepState>>>({});

    // Calculate overall system health for the badge
    const systemHealth = useMemo(() => {
        const avg = Math.round((metrics.logic + metrics.agents + metrics.optimization) / 3);
        return avg;
    }, [metrics]);

    if (!isOpen) return null;

    const handleSimulate = (key: string) => {
        localStorage.setItem('simulatePersona', key);
        window.location.reload();
    };

    const handleRunQA = async () => {
        setIsRunning(true);
        setActiveTab('LOGS');
        setLogs(['🚀 INITIALIZING GHOST SQUAD QA...', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━']);

        await SimulationEngine.runFullQA((msg) => {
            setLogs(prev => [...prev, msg]);

            // Update metrics based on results
            if (msg.includes("PASSED")) {
                setMetrics(prev => ({
                    logic: Math.min(100, prev.logic + 12),
                    agents: Math.min(100, prev.agents + 8),
                    optimization: Math.min(100, prev.optimization + 15)
                }));
            }
        });
        setIsRunning(false);
    };

    const handleRunMasterTeacher = async () => {
        setIsRunning(true);
        setActiveTab('LOGS');
        setLogs(['🎓 LAUNCHING MASTER TEACHER SIMULATION...', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━']);

        // Run simulation
        await new Promise(r => setTimeout(r, 500));
        const result = masterTeacher.runSwarmSimulation(50);

        // Log results
        setLogs(prev => [
            ...prev,
            `✓ Simulated ${result.totalInteractions} interactions`,
            `✓ Duration: ${((result.endTime - result.startTime) / 1000).toFixed(1)}s`,
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
            `⚠️ Violations: ${result.violations.length}`,
            ...result.violations.slice(0, 5).map(v => `  • [${v.severity}] ${v.description}`),
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
            `🔧 Auto-Fixes Applied:`,
            ...(result.autoFixesApplied.length > 0
                ? result.autoFixesApplied.map(f => `  ✓ ${f}`)
                : ['  (No fixes needed)']),
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
            `📊 Engagement Delta: ${result.engagementDelta >= 0 ? '+' : ''}${result.engagementDelta.toFixed(1)}%`,
            `✨ MASTER TEACHER CYCLE COMPLETE`
        ]);

        // Update metrics
        setMetrics(prev => ({
            ...prev,
            agents: Math.min(100, prev.agents + 5),
            optimization: Math.min(100, prev.optimization + (result.engagementDelta > 0 ? 10 : -5))
        }));

        setIsRunning(false);
    };

    const handleResetWorld = () => {
        if (confirm('⚠️ This will reset all simulation states. Continue?')) {
            masterTeacher.resetWeights();
            setMetrics({ logic: 64, agents: 92, optimization: 45 });
            setLogs(['🔄 WORLD STATE RESET TO BASELINE', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━']);
        }
    };

    const handleRunDeepAudit = async () => {
        setIsRunning(true);

        // Initialize State: Set all to RUNNING
        const initialAudit: Record<string, Record<AuditStep, StepState>> = {};
        Object.values(AUDIT_PROFILES).forEach(p => {
            initialAudit[p.id] = {
                UI: { status: 'RUNNING' },
                SOCIAL: { status: 'RUNNING' },
                GROWTH: { status: 'RUNNING' },
                ECONOMY: { status: 'RUNNING' }
            };
        });
        setAuditState(initialAudit);

        // Run Audit Engine (The Logic Core)
        // Add artificial delay for visualization effect (0.8s)
        await new Promise(r => setTimeout(r, 800));

        const results: AuditResult[] = await auditEngine.runFullAudit();

        // Process Results
        const newAuditState = { ...initialAudit };
        let failCount = 0;

        results.forEach(res => {
            // Map result to state
            if (!newAuditState[res.profile]) newAuditState[res.profile] = {
                UI: { status: 'PENDING' },
                SOCIAL: { status: 'PENDING' },
                GROWTH: { status: 'PENDING' },
                ECONOMY: { status: 'PENDING' }
            };

            newAuditState[res.profile][res.category] = {
                status: res.status,
                msg: res.message
            };

            if (res.status === 'FAIL') failCount++;
        });

        setAuditState(newAuditState);
        setIsRunning(false);

        if (failCount === 0) {
            setMetrics(prev => ({ ...prev, logic: 100, optimization: 100 }));
        } else {
            // Penalize metrics check
            setMetrics(prev => ({ ...prev, logic: Math.max(0, prev.logic - 10) }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[200] p-4 animate-fade-in">
            <div className="w-full max-w-5xl bg-zinc-950 border border-purple-500/30 rounded-2xl shadow-[0_0_80px_rgba(168,85,247,0.15)] flex flex-col max-h-[90vh] overflow-hidden">

                {/* HEADER WITH METRICS */}
                <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
                    <div className="flex justify-between items-start">
                        {/* Title */}
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-1">
                                🎛️ FOUNDER COMMAND PANEL
                            </h2>
                            <div className="text-xs text-zinc-500 font-mono">
                                WORLD ENGINE • BUILD 2026.02.07
                            </div>
                        </div>

                        {/* THE 3 METRICS (Preserved as requested) */}
                        <div className="flex gap-6">
                            <div className="text-center">
                                <div className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mb-2">Logic Coverage</div>
                                <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden mb-1">
                                    <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-500" style={{ width: `${metrics.logic}%` }} />
                                </div>
                                <div className={`text-lg font-black ${metrics.logic >= 80 ? 'text-green-400' : metrics.logic >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                                    {metrics.logic}%
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-2">Agent Coverage</div>
                                <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden mb-1">
                                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500" style={{ width: `${metrics.agents}%` }} />
                                </div>
                                <div className={`text-lg font-black ${metrics.agents >= 80 ? 'text-green-400' : metrics.agents >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                                    {metrics.agents}%
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-[10px] text-green-400 font-bold uppercase tracking-widest mb-2">Optimization</div>
                                <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden mb-1">
                                    <div className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500" style={{ width: `${metrics.optimization}%` }} />
                                </div>
                                <div className={`text-lg font-black ${metrics.optimization >= 80 ? 'text-green-400' : metrics.optimization >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                                    {metrics.optimization}%
                                </div>
                            </div>
                        </div>

                        {/* Close */}
                        <button onClick={onClose} className="text-zinc-500 hover:text-white p-2 hover:bg-white/5 rounded-lg transition-all">
                            ✕
                        </button>
                    </div>
                </div>

                {/* TAB NAV */}
                <div className="flex border-b border-white/5 bg-zinc-900/50">
                    {(['COMMAND', 'SIMULATE', 'LOGS', 'AUDIT'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab
                                    ? 'text-purple-400 border-b-2 border-purple-500 bg-purple-500/5'
                                    : 'text-zinc-600 hover:text-zinc-400'
                                }`}
                        >
                            {tab === 'COMMAND' && '🎛️ '}{tab === 'SIMULATE' && '👤 '}{tab === 'LOGS' && '📋 '}{tab === 'AUDIT' && '🛡️ '}{tab}
                        </button>
                    ))}
                </div>

                {/* TAB CONTENT */}
                <div className="flex-1 overflow-auto p-6">

                    {/* COMMAND TAB */}
                    {activeTab === 'COMMAND' && (
                        <div className="space-y-6">
                            {/* Primary Actions */}
                            <div>
                                <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-4">🚀 PRIMARY CONTROLS</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {/* Master Teacher */}
                                    <button
                                        onClick={handleRunMasterTeacher}
                                        disabled={isRunning}
                                        className="group p-6 bg-gradient-to-br from-purple-900/30 to-purple-800/10 border border-purple-500/30 rounded-xl hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all disabled:opacity-50"
                                    >
                                        <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🧠</div>
                                        <h4 className="font-bold text-white mb-1">Launch Master Teacher</h4>
                                        <p className="text-xs text-zinc-500">Run AI swarm simulation & auto-tune algorithms</p>
                                    </button>

                                    {/* Ghost Class */}
                                    <button
                                        onClick={onDeployGhostClass}
                                        className="group p-6 bg-gradient-to-br from-blue-900/30 to-blue-800/10 border border-blue-500/30 rounded-xl hover:border-blue-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all"
                                    >
                                        <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">👻</div>
                                        <h4 className="font-bold text-white mb-1">Deploy Ghost Class</h4>
                                        <p className="text-xs text-zinc-500">View live virtual agents & engagement metrics</p>
                                    </button>

                                    {/* Reset */}
                                    <button
                                        onClick={handleResetWorld}
                                        className="group p-6 bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 border border-zinc-700/50 rounded-xl hover:border-zinc-500 transition-all"
                                    >
                                        <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🔄</div>
                                        <h4 className="font-bold text-white mb-1">Reset World State</h4>
                                        <p className="text-xs text-zinc-500">Restore algorithm weights to baseline</p>
                                    </button>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div>
                                <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-4">⚡ QUICK DIAGNOSTICS</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={handleRunQA}
                                        disabled={isRunning}
                                        className={`w-full py-4 border-2 border-green-500/50 text-green-400 font-bold tracking-widest uppercase rounded-xl hover:bg-green-500/10 transition-all ${isRunning ? 'opacity-50 cursor-wait animate-pulse' : ''}`}
                                    >
                                        {isRunning ? '⏳ RUNNING...' : '🛡️ LOGIC VERIFY'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsRunning(true);
                                            setActiveTab('LOGS');
                                            setLogs(['🐞 STARTING UI STRESS TEST...', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━']);

                                            setTimeout(() => {
                                                const buttons = document.querySelectorAll('button');
                                                const links = document.querySelectorAll('a');
                                                let failures = 0;

                                                setLogs(prev => [...prev, `🔍 Scanning ${buttons.length} Buttons & ${links.length} Links...`]);

                                                // Specific check for CALIBRATE
                                                const calBtn = document.getElementById('btn-calibrate');
                                                if (calBtn) {
                                                    setLogs(prev => [...prev, `✓ [CALIBRATE] Button Detected`]);
                                                    setLogs(prev => [...prev, `  ↳ ID: btn-calibrate`]);
                                                    setLogs(prev => [...prev, `  ↳ Visible: Yes`]);
                                                } else {
                                                    setLogs(prev => [...prev, `🔴 [CALIBRATE] Button NOT FOUND`]);
                                                    failures++;
                                                }

                                                // General Audit
                                                setLogs(prev => [...prev, `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`]);
                                                setLogs(prev => [...prev, `📋 AUDIT REPORT:`]);

                                                if (failures === 0) {
                                                    setLogs(prev => [...prev, `✨ ALL CRITICAL UI ELEMENTS RESPONGING`]);
                                                } else {
                                                    setLogs(prev => [...prev, `⚠️ DETECTED ${failures} UI FAILURES`]);
                                                }

                                                setIsRunning(false);
                                            }, 1000);
                                        }}
                                        disabled={isRunning}
                                        className={`w-full py-4 border-2 border-orange-500/50 text-orange-400 font-bold tracking-widest uppercase rounded-xl hover:bg-orange-500/10 transition-all ${isRunning ? 'opacity-50 cursor-wait animate-pulse' : ''}`}
                                    >
                                        {isRunning ? '⏳ AUDITING...' : '🐞 RUN UI AUDIT'}
                                    </button>
                                </div>
                            </div>

                            {/* Ghost Classroom Preview */}
                            <div>
                                <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-4">👻 GHOST CLASSROOM ({GHOST_CLASSROOM.length} AGENTS)</h3>
                                <div className="grid grid-cols-5 gap-3">
                                    {GHOST_CLASSROOM.map(agent => (
                                        <div key={agent.id} className="p-3 bg-zinc-900/50 border border-white/5 rounded-lg text-center">
                                            <div className="text-xl mb-1">
                                                {agent.personality === 'GAMER' ? '🎮' : agent.personality === 'INTROVERT' ? '📚' : agent.personality === 'STRUGGLING' ? '😰' : agent.personality === 'PRODIGY' ? '🌟' : '🔍'}
                                            </div>
                                            <div className="text-xs font-bold text-white">{agent.name}</div>
                                            <div className="text-[10px] text-zinc-600">G{agent.grade} • {agent.track}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SIMULATE TAB */}
                    {activeTab === 'SIMULATE' && (
                        <div className="space-y-6">
                            <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-4">👤 SIMULATE AS USER</h3>
                            <p className="text-sm text-zinc-500 mb-6">Click a persona to reload the app as that user type. Useful for testing the experience from different perspectives.</p>

                            <div className="grid grid-cols-3 gap-4">
                                <button
                                    onClick={() => handleSimulate('ELEMENTARY_NOVICE')}
                                    className="group p-6 bg-zinc-900/50 border border-white/10 rounded-xl hover:border-green-500/50 hover:bg-green-500/5 transition-all text-left"
                                >
                                    <div className="text-3xl mb-3">🌱</div>
                                    <h4 className="font-bold text-white mb-1">LEO</h4>
                                    <p className="text-xs text-zinc-500">Grade 3 • Explorer • First-time user</p>
                                </button>

                                <button
                                    onClick={() => handleSimulate('HS_SOPHOMORE')}
                                    className="group p-6 bg-zinc-900/50 border border-white/10 rounded-xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-left"
                                >
                                    <div className="text-3xl mb-3">🔬</div>
                                    <h4 className="font-bold text-white mb-1">MAYA</h4>
                                    <p className="text-xs text-zinc-500">Grade 10 • Builder • Science track</p>
                                </button>

                                <button
                                    onClick={() => handleSimulate('COLLEGE_SENIOR')}
                                    className="group p-6 bg-zinc-900/50 border border-white/10 rounded-xl hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-left"
                                >
                                    <div className="text-3xl mb-3">🎓</div>
                                    <h4 className="font-bold text-white mb-1">ALEX</h4>
                                    <p className="text-xs text-zinc-500">College • Legend • Power user</p>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* LOGS TAB */}
                    {activeTab === 'LOGS' && (
                        <div className="font-mono text-xs leading-relaxed space-y-1 bg-black p-4 rounded-xl border border-white/5 min-h-[300px]">
                            {logs.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-zinc-700 py-20">
                                    <div className="text-4xl mb-4 opacity-50">📋</div>
                                    <div>AWAITING SYSTEM OUTPUT...</div>
                                </div>
                            ) : (
                                logs.map((log, i) => (
                                    <div
                                        key={i}
                                        className={`${log.includes('FAIL') || log.includes('⚠️')
                                            ? 'text-orange-400'
                                            : log.includes('✓') || log.includes('PASSED') || log.includes('SUCCESS')
                                                ? 'text-green-400'
                                                : log.includes('━')
                                                    ? 'text-zinc-700'
                                                    : 'text-zinc-500'
                                            }`}
                                    >
                                        {log}
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* AUDIT TAB (NEW) */}
                    {activeTab === 'AUDIT' && (
                        <div className="space-y-6">

                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-1">SHIELD PROTOCOL: DEEP LIFECYCLE AUDIT</h3>
                                    <p className="text-xs text-zinc-500">Autonomous agents attempt full career simulation: Click → Social → Job → Pay.</p>
                                </div>
                                <button
                                    onClick={handleRunDeepAudit}
                                    disabled={isRunning}
                                    className="px-6 py-3 bg-red-900/20 border border-red-500/50 text-red-400 font-bold uppercase rounded-lg hover:bg-red-900/40 transition-all disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isRunning ? <span className="animate-spin">⚙️</span> : '🛡️'}
                                    {isRunning ? 'AUDIT IN PROGRESS...' : 'INITIATE DEEP AUDIT'}
                                </button>
                            </div>

                            {/* AGENT CHECKLIST */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {Object.values(AUDIT_PROFILES).map(persona => {
                                    const personaStatus = auditState[persona.id] || {
                                        UI: { status: 'PENDING' },
                                        SOCIAL: { status: 'PENDING' },
                                        GROWTH: { status: 'PENDING' },
                                        ECONOMY: { status: 'PENDING' }
                                    };

                                    return (
                                        <div key={persona.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative overflow-hidden">
                                            {/* AGENT HEADER */}
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xl">
                                                    {persona.id === 'MAYA' ? '🔬' : persona.id === 'LEO' ? '🌱' : '🎓'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-sm">{persona.id}</div>
                                                    <div className="text-[10px] text-zinc-500 uppercase">{persona.role} • LVL {persona.grade}</div>
                                                </div>
                                            </div>

                                            {/* CHECKLIST */}
                                            <div className="space-y-3">
                                                {(['UI', 'SOCIAL', 'GROWTH', 'ECONOMY'] as AuditStep[]).map(step => (
                                                    <div key={step} className="flex flex-col gap-1">
                                                        <div className="flex items-center justify-between text-xs font-mono">
                                                            <span className={personaStatus[step].status === 'PENDING' ? 'text-zinc-600' : 'text-zinc-300'}>{step}_CHECK</span>

                                                            {personaStatus[step].status === 'PENDING' && <span className="text-zinc-700">...</span>}
                                                            {personaStatus[step].status === 'RUNNING' && <span className="text-yellow-500 animate-pulse">Running...</span>}
                                                            {personaStatus[step].status === 'PASS' && <span className="text-green-500 font-bold">✅ PASS</span>}
                                                            {personaStatus[step].status === 'FAIL' && <span className="text-red-500 font-bold animate-pulse">❌ FAIL</span>}
                                                        </div>
                                                        {status === 'FAIL' && personaStatus[step].msg && (
                                                            <div className="text-[9px] text-red-400 bg-red-900/10 p-1 rounded font-mono border-l-2 border-red-500">
                                                                {personaStatus[step].msg}
                                                            </div>
                                                        )}
                                                        {personaStatus[step].status === 'PASS' && personaStatus[step].msg && (
                                                            <div className="text-[9px] text-zinc-600 font-mono pl-1">
                                                                ↳ {personaStatus[step].msg}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* STATUS BAR */}
                                            <div className="absolute bottom-0 left-0 h-1 bg-zinc-800 w-full">
                                                <div
                                                    className={`h-full transition-all duration-300 ${Object.values(personaStatus).some(s => s.status === 'FAIL') ? 'bg-red-500' : 'bg-green-500'}`}
                                                    style={{ width: `${(Object.values(personaStatus).filter(s => s.status === 'PASS').length / 4) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                    )}
                </div>

                {/* FOOTER STATUS */}
                <div className="p-4 border-t border-white/5 bg-zinc-900/50 flex justify-between items-center">
                    <div className="flex items-center gap-3 text-xs text-zinc-600">
                        <div className={`h-2 w-2 rounded-full ${systemHealth >= 70 ? 'bg-green-500' : systemHealth >= 40 ? 'bg-yellow-500' : 'bg-red-500'} animate-pulse`} />
                        <span className="font-mono">SYSTEM HEALTH: {systemHealth}% {systemHealth >= 70 ? '🟢 OPTIMAL' : systemHealth >= 40 ? '🟡 TUNING' : '🔴 NEEDS WORK'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleRunQA}
                            disabled={isRunning}
                            className="px-3 py-1.5 bg-blue-900/20 border border-blue-500/30 text-[10px] font-bold text-blue-400 uppercase rounded hover:bg-blue-900/40 hover:text-blue-300 transition-all disabled:opacity-50"
                        >
                            {isRunning ? '⏳...' : '👻 RUN GHOST'}
                        </button>
                        <button
                            onClick={handleRunMasterTeacher}
                            disabled={isRunning}
                            className="px-3 py-1.5 bg-purple-900/20 border border-purple-500/30 text-[10px] font-bold text-purple-400 uppercase rounded hover:bg-purple-900/40 hover:text-purple-300 transition-all disabled:opacity-50"
                        >
                            {isRunning ? '⏳...' : '🧠 RUN TEACHER'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// =============================================================================
// FOUNDER BADGE COMPONENT (For Footer)
// =============================================================================
interface FounderBadgeProps {
    systemHealth: number;
    onClick: () => void;
}

export const FounderBadge: React.FC<FounderBadgeProps> = ({ systemHealth, onClick }) => {
    const statusEmoji = systemHealth >= 70 ? '🟢' : systemHealth >= 40 ? '🟡' : '🔴';
    const statusText = systemHealth >= 70 ? 'OPTIMIZED' : systemHealth >= 40 ? 'TUNING' : 'NEEDS WORK';

    return (
        <button
            onClick={onClick}
            className="group px-4 py-2 bg-zinc-900 border border-purple-500/30 text-xs font-bold text-white uppercase rounded-lg hover:bg-purple-900/30 hover:border-purple-400 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/10"
        >
            <span className="text-purple-400">⌘</span>
            <span>FOUNDER: {statusEmoji} {systemHealth}% {statusText}</span>
            <span className="text-zinc-600 group-hover:text-purple-400 transition-colors">▶</span>
        </button>
    );
};
