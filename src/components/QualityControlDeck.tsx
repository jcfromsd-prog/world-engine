
import { useState } from 'react';
import {
    Users,
    BookOpen,
    Activity,
    Play,
    BarChart3,
    Brain,
    X
} from 'lucide-react';
import {
    PERSONA_BOTS,
    runSimulation,
    auditMission,
    getVelocityMetrics,
} from '../engine/QualityControl';
import type {
    SimulationLog,
    AuditReport
} from '../engine/QualityControl';
import type { Mission } from '../engine/types';

// Mock missions for demo purposes if none provided
// Extended to match Mission type partially
const DEFAULT_MISSIONS: any[] = [
    {
        id: 'm1',
        title: 'Leaf Pattern Match',
        description: 'Find the matching leaf patterns in the forest floor. Photosynthesis check required.',
        educationalTags: ['NATURE', 'SCIENCE'],
        difficulty: 'easy',
        // Mocking extra fields to satisfy type if needed by consumers, though we cast
    },
    {
        id: 'm2',
        title: 'Binary Logic Gate',
        description: 'Complete the circuit using AND/OR gates. Requires boolean logic mastery.',
        educationalTags: ['TECH', 'LOGIC', 'MATH'],
        difficulty: 'hard'
    },
    {
        id: 'm3',
        title: 'Team Resource Split',
        description: 'Divide 100 apples among 3 team members fairly. Explain your remainder strategy.',
        educationalTags: ['PEOPLE', 'MATH'],
        difficulty: 'medium'
    }
];

interface QualityControlDeckProps {
    missions?: any[]; // Using any to be flexible with UI vs Engine types for this diagnostic view
    onClose?: () => void;
}

export default function QualityControlDeck({ missions = DEFAULT_MISSIONS, onClose }: QualityControlDeckProps) {
    const [activeTab, setActiveTab] = useState<'classroom' | 'audit' | 'metrics'>('classroom');
    const [simLogs, setSimLogs] = useState<SimulationLog[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);
    const [auditReports, setAuditReports] = useState<AuditReport[]>([]);

    // ----------------- ACTIONS -----------------

    const handleRunSimulation = () => {
        setIsSimulating(true);
        setSimLogs([]); // Clear previous

        // Simulate "Fast Forward" - 1 second delay
        setTimeout(() => {
            const logs: SimulationLog[] = [];
            // Run each bot through each mission
            PERSONA_BOTS.forEach(bot => {
                missions.forEach(mission => {
                    // Random chance to play this mission (not every bot plays every mission)
                    if (Math.random() > 0.3) {
                        logs.push(runSimulation(bot, mission as Mission));
                    }
                });
            });
            setSimLogs(logs);
            setIsSimulating(false);
        }, 1500);
    };

    const handleRunAudit = () => {
        const reports = missions.map(m => auditMission(m as Mission));
        setAuditReports(reports);
        setActiveTab('audit');
    };

    // ----------------- RENDERERS -----------------

    const renderClassroom = () => (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-zinc-900/50 p-6 rounded-xl border border-gray-800">
                <div>
                    <h3 className="text-xl font-bold text-white mb-2">Virtual Classroom Simulation</h3>
                    <p className="text-gray-400 text-sm">Target: {PERSONA_BOTS.length} AI Student Personas | Speed: 1000x Real-time</p>
                </div>
                <button
                    onClick={handleRunSimulation}
                    disabled={isSimulating}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold tracking-wider uppercase transition-all ${isSimulating ? 'bg-zinc-800 text-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 text-black shadow-lg shadow-green-900/40'}`}
                >
                    {isSimulating ? (
                        <><Activity className="animate-spin" size={20} /> Simulating...</>
                    ) : (
                        <><Play size={20} /> Run Simulation</>
                    )}
                </button>
            </div>

            {/* RESULTS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {simLogs.length > 0 ? (
                    simLogs.map((log, idx) => {
                        const bot = PERSONA_BOTS.find(p => p.id === log.personaId);
                        const mission = missions.find(m => m.id === log.missionId);
                        const isFail = log.outcome === 'quit' || log.outcome === 'failure';

                        return (
                            <div key={idx} className={`p-4 rounded-xl border ${isFail ? 'bg-red-900/10 border-red-500/30' : 'bg-zinc-900/40 border-gray-800'} relative overflow-hidden`}>
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isFail ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                            {bot?.name[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-sm">{bot?.name}</div>
                                            <div className="text-[10px] text-gray-500 uppercase">{bot?.type}</div>
                                        </div>
                                    </div>
                                    <div className={`text-xs font-mono font-bold ${isFail ? 'text-red-500' : 'text-green-500'}`}>
                                        {log.outcome.toUpperCase()}
                                    </div>
                                </div>

                                <div className="text-xs text-gray-300 italic mb-3 bg-black/20 p-2 rounded border-l-2 border-gray-700">
                                    "{log.diaryEntry}"
                                </div>

                                <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
                                    <span>Mission: {mission?.title}</span>
                                    <span>Sat: {Math.round(log.satisfaction)}%</span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    !isSimulating && (
                        <div className="col-span-full py-12 text-center text-gray-600 italic border border-dashed border-gray-800 rounded-xl">
                            Press "Run Simulation" to generate student telemetry.
                        </div>
                    )
                )}
            </div>
        </div>
    );

    const renderAudit = () => (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-zinc-900/50 p-6 rounded-xl border border-gray-800">
                <div>
                    <h3 className="text-xl font-bold text-white mb-2">Curriculum Auditor</h3>
                    <p className="text-gray-400 text-sm">Standards: Common Core (Math) & NGSS (Science) | Strictness: High</p>
                </div>
                <button
                    onClick={handleRunAudit}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold tracking-wider uppercase transition-all shadow-lg shadow-indigo-900/40"
                >
                    <BookOpen size={20} /> Run Audit
                </button>
            </div>

            <div className="space-y-4">
                {auditReports.map((report, idx) => {
                    const mission = missions.find(m => m.id === report.missionId);
                    const isGood = report.grade === 'A' || report.grade === 'B';

                    return (
                        <div key={idx} className="bg-zinc-900/40 border border-gray-800 p-6 rounded-xl flex flex-col md:flex-row gap-6">
                            {/* GRADE */}
                            <div className="flex-shrink-0 flex flex-col items-center justify-center w-24 border-r border-gray-800 pr-6">
                                <div className={`text-5xl font-black ${isGood ? 'text-green-500' : 'text-amber-500'}`}>
                                    {report.grade}
                                </div>
                                <div className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest text-center">Score</div>
                            </div>

                            {/* DETAILS */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-white text-lg">{mission?.title}</h4>
                                    <span className="text-[10px] font-mono bg-zinc-800 px-2 py-1 rounded text-gray-400">{report.standardAlignment}</span>
                                </div>

                                <div className="flex gap-4 mb-4">
                                    <div className="flex-1">
                                        <div className="text-[10px] text-green-500 font-bold uppercase mb-1">Strengths</div>
                                        <ul className="text-sm text-gray-400 list-disc list-inside">
                                            {report.strengths.map((s) => <li key={s}>{s}</li>)}
                                        </ul>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] text-amber-500 font-bold uppercase mb-1">Weaknesses</div>
                                        <ul className="text-sm text-gray-400 list-disc list-inside">
                                            {report.weaknesses.map((w) => <li key={w}>{w}</li>)}
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-blue-900/10 border border-blue-500/20 p-3 rounded flex gap-3 items-start">
                                    <Brain className="text-blue-400 mt-1 flex-shrink-0" size={16} />
                                    <p className="text-sm text-blue-200">{report.suggestion}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {auditReports.length === 0 && (
                    <div className="py-12 text-center text-gray-600 italic border border-dashed border-gray-800 rounded-xl">
                        No audit reports generated yet.
                    </div>
                )}
            </div>
        </div>
    );

    const renderMetrics = () => {
        const metrics = getVelocityMetrics();
        return (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {metrics.map((m, idx) => (
                        <div key={idx} className="bg-zinc-900/50 border border-gray-800 p-6 rounded-xl">
                            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">{m.metric}</div>
                            <div className="text-3xl font-mono font-bold text-white mb-2">{m.value}</div>
                            <div className={`flex items-center gap-1 text-xs font-bold uppercase ${m.status === 'healthy' ? 'text-green-500' : m.status === 'warning' ? 'text-amber-500' : 'text-red-500'}`}>
                                <Activity size={12} />
                                {m.status} • {m.trend.toUpperCase()} Trend
                            </div>
                        </div>
                    ))}
                </div>

                {/* Simulated Graph Area */}
                <div className="bg-zinc-900/30 border border-gray-800 rounded-xl p-8 text-center min-h-[300px] flex items-center justify-center flex-col">
                    <BarChart3 className="text-zinc-800 mb-4" size={64} />
                    <h4 className="text-gray-500 font-bold uppercase tracking-widest">Live Velocity Data Stream</h4>
                    <p className="text-gray-600 text-sm mt-2 max-w-md">
                        Connecting to Soulbound Engine telemetry...<br />
                        (This visualization would connect to the real-time events database in production)
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black text-white font-mono flex flex-col animate-in fade-in duration-300">
            {/* TOOLBAR */}
            <header className="h-16 border-b border-gray-800 bg-zinc-950 flex items-center px-6 justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.5)]">
                        <Users className="text-white" size={20} />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-none">Founder's Cockpit</h1>
                        <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Quality Control Engine</span>
                    </div>
                </div>

                <div className="flex bg-zinc-900 rounded p-1 border border-gray-800">
                    {(['classroom', 'audit', 'metrics'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-zinc-700 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <button onClick={onClose} className="p-2 hover:bg-red-900/20 text-gray-500 hover:text-red-500 rounded transition-colors">
                    <X size={20} />
                </button>
            </header>

            {/* CONTENT AREA */}
            <main className="flex-1 overflow-y-auto p-6 bg-black/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    {activeTab === 'classroom' && renderClassroom()}
                    {activeTab === 'audit' && renderAudit()}
                    {activeTab === 'metrics' && renderMetrics()}
                </div>
            </main>
        </div>
    );
}
