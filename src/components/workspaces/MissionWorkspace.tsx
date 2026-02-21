import React, { useState, useMemo, useEffect, useRef } from 'react';
import { SquadOrchestrator } from '../../engines/intake/SquadOrchestrator';

interface MissionWorkspaceProps {
    mission: any;
    onComplete: (qualityScore: number) => void;
    onCancel: () => void;
    userGap?: string; // Passed from App state to allow contextual Sage comms
}

export const MissionWorkspace: React.FC<MissionWorkspaceProps> = ({ mission, onComplete, onCancel, userGap }) => {
    const [activeTab, setActiveTab] = useState<'BRIEFING' | 'WORKBENCH'>('BRIEFING');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [squadMessage, setSquadMessage] = useState<{ sender: string, text: string } | null>(null);
    const idleTimer = useRef<NodeJS.Timeout | null>(null);

    // TRIGGER 1: Mission Start (Sage-7)
    useEffect(() => {
        const timer = setTimeout(() => {
            setSquadMessage({
                sender: 'SAGE-7',
                text: `Calibration mission engaged: ${mission.title}. ${userGap ? `Targeting identified gap: ${userGap}.` : ''} Initialize Step 1.`
            });
            // Auto-clear after 8s
            setTimeout(() => setSquadMessage(null), 8000);
        }, 500);

        return () => clearTimeout(timer);
    }, [mission.title, userGap]);

    // TRIGGER 2: Idle > 90s (Sage-7)
    useEffect(() => {
        const resetIdle = () => {
            if (idleTimer.current) clearTimeout(idleTimer.current);
            idleTimer.current = setTimeout(() => {
                setSquadMessage({
                    sender: 'SAGE-7',
                    text: `Efficiency drop detected. Hint: Follow the structure in Intel Data. Focus on ${mission.category === 'CODING' ? 'syntax precision' : 'data alignment'}.`
                });
                setTimeout(() => setSquadMessage(null), 8000);
            }, 90000);
        };

        resetIdle();
        return () => { if (idleTimer.current) clearTimeout(idleTimer.current); };
    }, [content, mission.category]);

    // SIMULATED AI GRADER (The Brain) - DEPRECATED: Moving to SquadOrchestrator Rubrics
    // const calculateQuality = useCallback((input: string) => { ... });

    const scoreInfo = useMemo(() => {
        if (!content.trim()) return { color: 'bg-zinc-600', label: 'IDLE', textColor: 'text-zinc-500' };
        return { color: 'bg-emerald-500', label: 'DRAFT READY', textColor: 'text-emerald-400' };
    }, [content]);

    const liveScore = content.trim() ? 100 : 0;

    const uplinkData = (data: string) => {
        setContent(prev => {
            const separator = prev.trim() ? '\n' : '';
            return `${prev}${separator}▸ ${data}`;
        });
        setActiveTab('WORKBENCH');
    };

    const handleSubmit = () => {
        if (!content.trim()) return;

        setIsSubmitting(true);
        setSquadMessage(null);

        // TRIGGER 3: Submission (Oracle-3) - Enhanced Verifier
        setTimeout(() => {
            const { passed, score, feedback } = SquadOrchestrator.evaluateSubmission(mission.standardId || mission.standard || 'DEFAULT', content);
            setIsSubmitting(false);

            if (!passed) {
                setSquadMessage({
                    sender: 'ORACLE-3',
                    text: feedback
                });
            } else {
                setSquadMessage({
                    sender: 'ORACLE-3',
                    text: feedback
                });
                setTimeout(() => onComplete(score), 2000);
            }
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[1500] bg-zinc-950 flex flex-col animate-fade-in text-white font-sans">
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-900">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${mission.type === 'TRAINING' ? 'bg-purple-500' : 'bg-blue-500'}`}></span>
                        <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">{mission.type} MISSION</span>
                        {mission.standard && <span className="ml-2 px-2 py-0.5 bg-cyan-900/50 border border-cyan-500/30 rounded text-[10px] font-mono text-cyan-400 uppercase">{mission.standard}</span>}
                    </div>
                    <h2 className="text-xl font-black">{mission.title}</h2>
                </div>
                <div className="flex items-center gap-6">
                    {/* TABS */}
                    <div className="flex bg-black rounded-lg p-1 border border-white/10">
                        <button onClick={() => setActiveTab('BRIEFING')} className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${activeTab === 'BRIEFING' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}>MISSION INTEL</button>
                        <button onClick={() => setActiveTab('WORKBENCH')} className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${activeTab === 'WORKBENCH' ? 'bg-blue-600 text-white' : 'text-zinc-500 hover:text-white'}`}>WORKBENCH</button>
                    </div>

                    <button onClick={onCancel} className="px-4 py-2 border border-zinc-700 text-zinc-400 text-xs rounded hover:text-white uppercase tracking-wider">Exit Mission</button>
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-7xl mx-auto w-full h-full flex flex-col">

                    {/* VIEW: BRIEFING (LEARN MODE) */}
                    {activeTab === 'BRIEFING' && (
                        <div className="flex flex-col h-full animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                {/* CARD 1: INTEL DATA */}
                                <div className="p-6 bg-zinc-900/50 border border-white/10 rounded-2xl">
                                    <div className="text-4xl mb-4">{mission.category === 'CODING' ? '💻' : mission.category === 'SCIENCE' ? '🔬' : mission.category === 'CREATIVE' ? '🎨' : '📋'}</div>
                                    <h3 className="font-bold text-lg mb-2">Intel Data</h3>
                                    <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                                        {mission.category === 'CODING' && 'Review the function signature and edge cases below. Your code must handle all listed inputs.'}
                                        {mission.category === 'SCIENCE' && 'Analyze the field data collected from the survey region. Use these data points in your report.'}
                                        {mission.category === 'CREATIVE' && 'Study the narrative prompt and character constraints. Your draft must address the core theme.'}
                                        {!['CODING', 'SCIENCE', 'CREATIVE'].includes(mission.category) && 'Review the source material below. Your submission must reference these key points.'}
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        {mission.category === 'CODING' && <>
                                            <button onClick={() => uplinkData('Input: Array of integers')} className="text-left p-2 bg-black/50 border border-cyan-500/30 text-xs text-cyan-300 font-mono hover:bg-cyan-900/30 hover:border-cyan-400 transition-colors rounded group flex items-center justify-between">
                                                <span>▸ Input: Array of integers</span><span className="opacity-0 group-hover:opacity-100 text-[10px] uppercase tracking-widest text-cyan-500">Uplink ⚡</span>
                                            </button>
                                            <button onClick={() => uplinkData('Output: Sorted result')} className="text-left p-2 bg-black/50 border border-cyan-500/30 text-xs text-cyan-300 font-mono hover:bg-cyan-900/30 hover:border-cyan-400 transition-colors rounded group flex items-center justify-between">
                                                <span>▸ Output: Sorted result</span><span className="opacity-0 group-hover:opacity-100 text-[10px] uppercase tracking-widest text-cyan-500">Uplink ⚡</span>
                                            </button>
                                            <button onClick={() => uplinkData('Edge: Empty array returns []')} className="text-left p-2 bg-black/50 border border-cyan-500/30 text-xs text-cyan-300 font-mono hover:bg-cyan-900/30 hover:border-cyan-400 transition-colors rounded group flex items-center justify-between">
                                                <span>▸ Edge: Empty array returns []</span><span className="opacity-0 group-hover:opacity-100 text-[10px] uppercase tracking-widest text-cyan-500">Uplink ⚡</span>
                                            </button>
                                        </>}

                                        {mission.category === 'SCIENCE' && <>
                                            <button onClick={() => uplinkData('Soil pH: 5.2 (acidic)')} className="text-left p-2 bg-black/50 border border-cyan-500/30 text-xs text-cyan-300 font-mono hover:bg-cyan-900/30 hover:border-cyan-400 transition-colors rounded group flex items-center justify-between">
                                                <span>▸ Soil pH: 5.2 (acidic)</span><span className="opacity-0 group-hover:opacity-100 text-[10px] uppercase tracking-widest text-cyan-500">Uplink ⚡</span>
                                            </button>
                                            <button onClick={() => uplinkData('Water level: -2.4 in. from baseline')} className="text-left p-2 bg-black/50 border border-cyan-500/30 text-xs text-cyan-300 font-mono hover:bg-cyan-900/30 hover:border-cyan-400 transition-colors rounded group flex items-center justify-between">
                                                <span>▸ Water level: -2.4 in.</span><span className="opacity-0 group-hover:opacity-100 text-[10px] uppercase tracking-widest text-cyan-500">Uplink ⚡</span>
                                            </button>
                                            <button onClick={() => uplinkData('Flora: 3 invasive species detected')} className="text-left p-2 bg-black/50 border border-cyan-500/30 text-xs text-cyan-300 font-mono hover:bg-cyan-900/30 hover:border-cyan-400 transition-colors rounded group flex items-center justify-between">
                                                <span>▸ Flora: 3 invasive species</span><span className="opacity-0 group-hover:opacity-100 text-[10px] uppercase tracking-widest text-cyan-500">Uplink ⚡</span>
                                            </button>
                                        </>}

                                        {mission.category === 'CREATIVE' && <>
                                            <button onClick={() => uplinkData('Theme: Resilience under pressure')} className="text-left p-2 bg-black/50 border border-cyan-500/30 text-xs text-cyan-300 font-mono hover:bg-cyan-900/30 hover:border-cyan-400 transition-colors rounded group flex items-center justify-between">
                                                <span>▸ Theme: Resilience</span><span className="opacity-0 group-hover:opacity-100 text-[10px] uppercase tracking-widest text-cyan-500">Uplink ⚡</span>
                                            </button>
                                            <button onClick={() => uplinkData('Setting: Near-future urban')} className="text-left p-2 bg-black/50 border border-cyan-500/30 text-xs text-cyan-300 font-mono hover:bg-cyan-900/30 hover:border-cyan-400 transition-colors rounded group flex items-center justify-between">
                                                <span>▸ Setting: Urban Future</span><span className="opacity-0 group-hover:opacity-100 text-[10px] uppercase tracking-widest text-cyan-500">Uplink ⚡</span>
                                            </button>
                                        </>}

                                        {!['CODING', 'SCIENCE', 'CREATIVE'].includes(mission.category) && <div className="p-2 text-xs text-zinc-500 italic">No uplink data available for this mission type.</div>}
                                    </div>
                                </div>
                                {/* CARD 2: REFERENCE FORMAT */}
                                <div className="p-6 bg-zinc-900/50 border border-white/10 rounded-2xl">
                                    <div className="text-4xl mb-4">👁️</div>
                                    <h3 className="font-bold text-lg mb-2">Reference Format</h3>
                                    <p className="text-sm text-zinc-400 leading-relaxed mb-4">A 10/10 submission follows this structure:</p>
                                    <div className="p-3 bg-zinc-800 rounded font-mono text-xs text-green-400 border-l-2 border-green-500 whitespace-pre-line">
                                        {mission.category === 'CODING' && 'function solve(arr) {\n  if (!arr.length) return [];\n  return arr.sort((a,b) => a - b);\n}'}
                                        {mission.category === 'SCIENCE' && '# FIELD REPORT\n## Summary: Acidic soil in Sector 7\n## Data: pH 5.2, water -2.4 in.\n## Recommendation: Soil treatment'}
                                        {mission.category === 'CREATIVE' && '"The city hummed beneath\na sky the color of static.\nShe pressed forward, knowing\nretreat was never an option."'}
                                        {!['CODING', 'SCIENCE', 'CREATIVE'].includes(mission.category) && '# REPORT\n## Summary:\n## Key Findings:\n## Conclusion:'}
                                    </div>
                                </div>
                                {/* CARD 3: DELIVERABLE */}
                                <div className="p-6 bg-zinc-900/50 border border-white/10 rounded-2xl">
                                    <div className="text-4xl mb-4">🎯</div>
                                    <h3 className="font-bold text-lg mb-2">Your Deliverable</h3>
                                    <ul className="text-sm text-zinc-400 space-y-2">
                                        <li>1. Review the Intel Data.</li>
                                        <li>2. {mission.category === 'CODING' ? 'Write the function in the Workbench.' : mission.category === 'SCIENCE' ? 'Draft your Field Report using the data.' : mission.category === 'CREATIVE' ? 'Write your narrative draft.' : 'Complete the assignment.'}</li>
                                        <li>3. Submit for AI Verification.</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="text-center mt-auto mb-10">
                                <button onClick={() => setActiveTab('WORKBENCH')} className="px-10 py-5 bg-blue-600 text-white font-black text-xl rounded-full hover:scale-105 transition-transform shadow-[0_0_40px_rgba(37,99,235,0.4)]">
                                    LAUNCH WORKSPACE 🚀
                                </button>
                            </div>
                        </div>
                    )}

                    {/* VIEW: WORKBENCH (BUILD MODE) */}
                    {activeTab === 'WORKBENCH' && (
                        <div className="flex flex-col md:flex-row gap-6 h-full animate-fade-in">
                            {/* LEFT SIDEBAR (Tasks) */}
                            <div className="w-full md:w-1/4 space-y-6">
                                <div className="bg-zinc-900/80 p-6 rounded-2xl border border-white/10">
                                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Mission Checklist</h4>
                                    <ul className="space-y-4 text-sm font-mono">
                                        <li className="flex items-center gap-3 text-green-400"><span className="text-lg">✓</span> Intel Reviewed</li>
                                        <li className="flex items-center gap-3 text-white"><span className="text-lg animate-pulse">○</span> Execute Task</li>
                                        <li className="flex items-center gap-3 text-zinc-500"><span className="text-lg">○</span> Verify Quality</li>
                                    </ul>
                                </div>
                                <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/20 text-xs text-blue-200">
                                    <strong>📡 SQUAD DISPATCH:</strong> Your team is standing by for this {mission.category?.toLowerCase() || 'mission'} data. Precision is mandatory.
                                </div>
                            </div>

                            {/* RIGHT EDITOR */}
                            <div className="flex-1 bg-black border border-white/10 rounded-2xl overflow-hidden flex flex-col relative">
                                <div className="bg-zinc-900 px-4 py-2 border-b border-white/10 flex items-center justify-between">
                                    <span className="text-xs font-mono text-zinc-500">editor.main</span>
                                    <span className="text-xs font-mono text-green-500">ONLINE</span>
                                </div>

                                <textarea
                                    value={content}
                                    onChange={(e) => { setContent(e.target.value); }}
                                    className="flex-1 bg-transparent p-6 text-zinc-300 font-mono focus:outline-none resize-none text-lg leading-relaxed"
                                    placeholder={mission.category === 'CODING' ? '// Name: \n// Input: \n// Output: \n// Logic:' : '# FIELD REPORT\n'}
                                    spellCheck="false"
                                />

                                {squadMessage && (
                                    <div className="absolute bottom-24 left-6 right-6 bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                                        <div className="flex items-start gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-10 h-10 rounded bg-slate-800 border flex items-center justify-center font-black text-[10px] ${squadMessage.sender.startsWith('SAGE') ? 'border-purple-500 text-purple-400' : 'border-emerald-500 text-emerald-400'}`}>
                                                    {squadMessage.sender.split('-')[0]}
                                                </div>
                                                <div className="text-[8px] font-mono text-slate-500 mt-1">{squadMessage.sender.split('-')[1]}</div>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-[10px] font-black tracking-widest text-slate-500 uppercase mb-1">Incoming Transmission</h4>
                                                <p className="text-sm font-mono text-slate-200 leading-relaxed">
                                                    {squadMessage.text}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="p-4 border-t border-white/10 bg-zinc-900/50 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                            <div className={`h-full ${scoreInfo.color} transition-all duration-300`} style={{ width: `${liveScore}%` }} />
                                        </div>
                                        <span className={`text-xs font-mono ${scoreInfo.textColor} min-w-[80px] text-right`}>{scoreInfo.label}</span>
                                    </div>
                                    <div className="flex justify-end">
                                        <button onClick={handleSubmit} disabled={isSubmitting || !content.trim()} className={`px-8 py-3 rounded-xl font-bold uppercase tracking-widest transition-all ${content.trim() ? "bg-emerald-500 text-black hover:bg-emerald-400" : "bg-zinc-800 text-zinc-500"}`}>
                                            {isSubmitting ? "Validing..." : "Commit Artifact"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
