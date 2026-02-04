
import React, { useState } from 'react';
import { Activity, CheckCircle, XCircle, AlertTriangle, Zap, Users, Terminal, ChevronRight } from 'lucide-react';
import QualityControlDeck from './QualityControlDeck';

// ----------------- TYPES -----------------
interface SimulationResult {
    archetype: string;
    sector: string;
    mode: string;
    role1: string;
    role2: string;
    missionCount: number;
    status: 'pass' | 'fail' | 'warning';
    notes: string;
}

interface DiagnosticStats {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
    coverage: number;
}

// ----------------- PATH SIMULATION ENGINE -----------------
// This mirrors the logic in AssessmentModule's getPaths function
const simulatePath = (archetype: string, sector: string): { role1: string; role2: string; mode: string } => {
    // Map archetype to mode
    const modeMap: Record<string, string> = {
        'Engineer': 'hands-on',
        'Architect': 'systems',
        'Creator': 'creative',
        'Commander': 'leadership'
    };
    const mode = modeMap[archetype] || 'general';

    // NATURE SECTOR
    if (sector === "Nature") {
        if (mode === 'hands-on') return { role1: "Field Engineer", role2: "Eco Builder", mode };
        if (mode === 'systems') return { role1: "Bio Architect", role2: "Data Ecologist", mode };
        if (mode === 'creative') return { role1: "Nature Storyteller", role2: "Eco Designer", mode };
        return { role1: "Eco Strategist", role2: "Policy Architect", mode }; // Commander
    }

    // TECH SECTOR
    if (sector === "Tech") {
        if (mode === 'hands-on') return { role1: "Robotics Engineer", role2: "Maker Specialist", mode };
        if (mode === 'systems') return { role1: "Code Ronin", role2: "Logic Warden", mode };
        if (mode === 'creative') return { role1: "UX Architect", role2: "Brand Alchemist", mode };
        return { role1: "Grid Commander", role2: "Product Visionary", mode }; // Commander
    }

    // PEOPLE SECTOR (Default)
    if (mode === 'hands-on') return { role1: "Community Builder", role2: "Support Specialist", mode };
    if (mode === 'systems') return { role1: "Operations Analyst", role2: "Data Storyteller", mode };
    if (mode === 'creative') return { role1: "Pixel Weaver", role2: "Story Smith", mode };
    return { role1: "Squad Captain", role2: "Growth Hacker", mode }; // Commander
};

// ----------------- COMPONENT -----------------
const SystemDiagnostic: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isQualityOpen, setIsQualityOpen] = useState(false);
    const [results, setResults] = useState<SimulationResult[] | null>(null);
    const [stats, setStats] = useState<DiagnosticStats | null>(null);
    const [isRunning, setIsRunning] = useState(false);

    const runSimulation = () => {
        setIsRunning(true);

        // Define all possible inputs
        const archetypes = ['Engineer', 'Architect', 'Creator', 'Commander'];
        const sectors = ['Nature', 'Tech', 'People'];

        const simulationResults: SimulationResult[] = [];
        let passed = 0, failed = 0, warnings = 0;

        // Run every combination
        archetypes.forEach(archetype => {
            sectors.forEach(sector => {
                const { role1, role2, mode } = simulatePath(archetype, sector);

                let status: 'pass' | 'fail' | 'warning' = 'pass';
                let notes = 'All systems nominal';

                // Validation checks
                if (!role1 || role1 === 'UNKNOWN') {
                    status = 'fail';
                    notes = 'CRITICAL: No primary role assigned';
                    failed++;
                } else if (!role2) {
                    status = 'warning';
                    notes = 'Only one role available';
                    warnings++;
                } else {
                    passed++;
                }

                simulationResults.push({
                    archetype,
                    sector,
                    mode,
                    role1,
                    role2,
                    missionCount: role1 ? 2 : 0,
                    status,
                    notes
                });
            });
        });

        // Calculate stats
        const total = simulationResults.length;
        setStats({
            total,
            passed,
            failed,
            warnings,
            coverage: Math.round((passed / total) * 100)
        });

        // Simulate processing time for effect
        setTimeout(() => {
            setResults(simulationResults);
            setIsRunning(false);
            setIsOpen(true);
        }, 800);
    };

    const closeReport = () => {
        setIsOpen(false);
        setResults(null);
        setStats(null);
    };

    // Status badge component
    const StatusBadge = ({ status }: { status: 'pass' | 'fail' | 'warning' }) => {
        if (status === 'pass') return (
            <span className="flex items-center gap-1 bg-green-900/30 text-green-400 px-2 py-1 rounded text-[10px] font-bold">
                <CheckCircle size={10} /> CONNECTED
            </span>
        );
        if (status === 'fail') return (
            <span className="flex items-center gap-1 bg-red-900/30 text-red-400 px-2 py-1 rounded text-[10px] font-bold">
                <XCircle size={10} /> DEAD END
            </span>
        );
        return (
            <span className="flex items-center gap-1 bg-yellow-900/30 text-yellow-400 px-2 py-1 rounded text-[10px] font-bold">
                <AlertTriangle size={10} /> WARNING
            </span>
        );
    };

    // Archetype color mapping
    const archetypeColor: Record<string, string> = {
        'Engineer': 'text-yellow-400',
        'Architect': 'text-cyan-400',
        'Creator': 'text-pink-400',
        'Commander': 'text-orange-400'
    };

    // Sector color mapping
    const sectorColor: Record<string, string> = {
        'Nature': 'text-green-400',
        'Tech': 'text-blue-400',
        'People': 'text-rose-400'
    };

    return (
        <>
            {/* DIAGNOSTIC TRIGGER BUTTONS */}
            <div className="fixed bottom-4 right-4 z-[90] flex flex-col gap-2 items-end">
                {/* 1. QUALITY CONTROL COCKPIT */}
                <button
                    onClick={() => setIsQualityOpen(true)}
                    className="group bg-indigo-900/80 border border-indigo-500/50 hover:bg-indigo-600 text-white px-4 py-3 text-xs font-mono uppercase rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-indigo-500/30 backdrop-blur-sm"
                >
                    <Users size={14} />
                    <span>Founder Check</span>
                </button>

                {/* 2. PATH SIMULATION */}
                <button
                    onClick={runSimulation}
                    disabled={isRunning}
                    className="group bg-zinc-900 border border-gray-700 hover:border-green-500 text-gray-400 hover:text-green-400 px-4 py-3 text-xs font-mono uppercase rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-green-500/20"
                >
                    {isRunning ? (
                        <>
                            <div className="w-3 h-3 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                            <span>Scanning...</span>
                        </>
                    ) : (
                        <>
                            <Activity size={14} className="group-hover:animate-pulse" />
                            <span>Run Path Simulation</span>
                        </>
                    )}
                </button>
            </div>

            {/* QUALITY CONTROL OVERLAY */}
            {isQualityOpen && (
                <QualityControlDeck onClose={() => setIsQualityOpen(false)} />
            )}

            {/* DIAGNOSTIC REPORT OVERLAY */}
            {isOpen && results && stats && (
                <div className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-xl overflow-auto animate-in fade-in duration-300">
                    <div className="max-w-6xl mx-auto p-6 md:p-10">

                        {/* HEADER */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center border border-green-500/50">
                                    <Terminal size={24} className="text-green-400" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-black text-white uppercase tracking-wider">System Diagnostic Report</h1>
                                    <p className="text-gray-500 text-sm font-mono">Path Simulation Protocol v1.0</p>
                                </div>
                            </div>
                            <button
                                onClick={closeReport}
                                className="text-gray-500 hover:text-white p-2 hover:bg-zinc-900 rounded transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* STATS CARDS */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-zinc-900 border border-gray-800 p-4 rounded-xl">
                                <div className="text-3xl font-black text-white">{stats.total}</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest">Total Paths</div>
                            </div>
                            <div className="bg-green-900/20 border border-green-800/50 p-4 rounded-xl">
                                <div className="text-3xl font-black text-green-400">{stats.passed}</div>
                                <div className="text-[10px] text-green-600 uppercase tracking-widest">Passed</div>
                            </div>
                            <div className="bg-red-900/20 border border-red-800/50 p-4 rounded-xl">
                                <div className="text-3xl font-black text-red-400">{stats.failed}</div>
                                <div className="text-[10px] text-red-600 uppercase tracking-widest">Failed</div>
                            </div>
                            <div className="bg-zinc-900 border border-gray-800 p-4 rounded-xl">
                                <div className="text-3xl font-black text-cyan-400">{stats.coverage}%</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest">Coverage</div>
                            </div>
                        </div>

                        {/* COVERAGE BAR */}
                        <div className="bg-zinc-900 border border-gray-800 p-4 rounded-xl mb-8">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-gray-500 uppercase tracking-widest">Path Coverage</span>
                                <span className="text-xs font-mono text-green-400">{stats.passed}/{stats.total} VALID</span>
                            </div>
                            <div className="h-3 bg-black rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full transition-all duration-1000"
                                    style={{ width: `${stats.coverage}%` }}
                                />
                            </div>
                        </div>

                        {/* RESULTS TABLE */}
                        <div className="bg-zinc-900/50 border border-gray-800 rounded-xl overflow-hidden">
                            <div className="p-4 border-b border-gray-800 flex items-center gap-2">
                                <Zap size={14} className="text-yellow-400" />
                                <span className="text-xs text-gray-400 uppercase tracking-widest">Simulation Matrix</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-800 text-[10px] text-gray-500 uppercase tracking-widest">
                                            <th className="px-4 py-3">Archetype</th>
                                            <th className="px-4 py-3">Sector</th>
                                            <th className="px-4 py-3">Mode</th>
                                            <th className="px-4 py-3">Primary Role</th>
                                            <th className="px-4 py-3">Secondary Role</th>
                                            <th className="px-4 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="font-mono text-sm">
                                        {results.map((r, i) => (
                                            <tr key={i} className="border-b border-gray-900 hover:bg-zinc-800/50 transition-colors">
                                                <td className={`px-4 py-3 font-bold ${archetypeColor[r.archetype]}`}>
                                                    {r.archetype}
                                                </td>
                                                <td className={`px-4 py-3 ${sectorColor[r.sector]}`}>
                                                    {r.sector}
                                                </td>
                                                <td className="px-4 py-3 text-gray-500 text-xs">
                                                    {r.mode}
                                                </td>
                                                <td className="px-4 py-3 text-white font-bold">
                                                    {r.role1}
                                                </td>
                                                <td className="px-4 py-3 text-gray-400">
                                                    {r.role2}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <StatusBadge status={r.status} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* SQUAD SIMULATION HINT */}
                        <div className="mt-8 p-6 bg-zinc-900/30 border border-gray-800 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <Users size={20} className="text-orange-400" />
                                <h3 className="text-white font-bold">Squad Formation Preview</h3>
                            </div>
                            <p className="text-gray-500 text-sm mb-4">
                                With 4 archetypes, a complete squad can be formed:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {['Engineer', 'Architect', 'Creator', 'Commander'].map(arch => (
                                    <span key={arch} className={`px-3 py-1 rounded-full text-xs font-bold border ${arch === 'Engineer' ? 'border-yellow-500/50 text-yellow-400 bg-yellow-900/20' :
                                        arch === 'Architect' ? 'border-cyan-500/50 text-cyan-400 bg-cyan-900/20' :
                                            arch === 'Creator' ? 'border-pink-500/50 text-pink-400 bg-pink-900/20' :
                                                'border-orange-500/50 text-orange-400 bg-orange-900/20'
                                        }`}>
                                        {arch}
                                    </span>
                                ))}
                                <ChevronRight size={14} className="text-gray-600 self-center" />
                                <span className="px-3 py-1 rounded-full text-xs font-bold border border-green-500/50 text-green-400 bg-green-900/20">
                                    = Complete Team
                                </span>
                            </div>
                        </div>

                        {/* CLOSE BUTTON */}
                        <div className="mt-8 text-center">
                            <button
                                onClick={closeReport}
                                className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold uppercase tracking-widest rounded-lg transition-colors"
                            >
                                Close Diagnostic
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SystemDiagnostic;
