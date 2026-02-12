import React, { useState, useMemo, useCallback } from 'react';

interface MissionWorkspaceProps {
    mission: any;
    onComplete: () => void;
    onCancel: () => void;
}

export const MissionWorkspace: React.FC<MissionWorkspaceProps> = ({ mission, onComplete, onCancel }) => {
    const [activeTab, setActiveTab] = useState<'BRIEFING' | 'WORKBENCH'>('BRIEFING');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);

    // SIMULATED AI GRADER (The Brain)
    const calculateQuality = useCallback((input: string) => {
        let score = 0;
        // 1. Length Check
        if (input.length > 20) score += 30;
        if (input.length > 50) score += 30;

        // 2. Keyword Check (Context Aware)
        const lower = input.toLowerCase();
        if (mission.category === 'CODING' && (lower.includes('function') || lower.includes('return') || lower.includes('var') || lower.includes('const'))) score += 40;
        if (mission.category === 'SCIENCE' && (lower.includes('observe') || lower.includes('measure') || lower.includes('fail') || lower.includes('data'))) score += 40;
        if (mission.category === 'CREATIVE' && (lower.includes('feel') || lower.includes('color') || lower.includes('story') || lower.includes('create'))) score += 40;

        return Math.min(score, 100); // Cap at 100
    }, [mission.category]);

    // LIVE QUALITY SCORE (Updates as user types)
    const liveScore = useMemo(() => calculateQuality(content), [content, calculateQuality]);

    // Get color and label based on score
    const getScoreInfo = (score: number) => {
        if (score >= 70) return { color: 'bg-green-500', label: 'Ready!', textColor: 'text-green-400' };
        if (score >= 50) return { color: 'bg-yellow-500', label: 'Almost...', textColor: 'text-yellow-400' };
        if (score >= 30) return { color: 'bg-orange-500', label: 'Keep going', textColor: 'text-orange-400' };
        return { color: 'bg-zinc-600', label: 'Start typing...', textColor: 'text-zinc-500' };
    };

    const scoreInfo = getScoreInfo(liveScore);

    const handleSubmit = () => {
        if (!content.trim()) return;

        setIsSubmitting(true);
        setFeedback(null); // Clear previous hints

        // SIMULATE AI THINKING TIME
        setTimeout(() => {
            const score = calculateQuality(content);
            setIsSubmitting(false);

            if (score < 50) {
                // COACHING MODE (Pedagogical Feedback)
                let tip = "Good start! But you need more detail.";
                if (mission.category === 'CODING') tip = "Remember to check your variables!";
                if (mission.category === 'SCIENCE') tip = "More data needed!";
                if (mission.category === 'CREATIVE') tip = "Paint with words!";
                if (content.length < 20) tip = "Too short! Expand your entry.";
                setFeedback(tip);
            } else {
                // SUCCESS MODE (Legendary Validation)
                onComplete();
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
                                {/* JIT SYLLABUS CARDS */}
                                <div className="p-6 bg-zinc-900/50 border border-white/10 rounded-2xl">
                                    <div className="text-4xl mb-4">🧠</div>
                                    <h3 className="font-bold text-lg mb-2">The Concept</h3>
                                    <p className="text-sm text-zinc-400 leading-relaxed mb-4">Before we start, let's understand the core principle. Watch this 30s primer.</p>
                                    <div className="w-full h-32 bg-black rounded-lg flex items-center justify-center border border-white/5 text-zinc-600 font-mono text-xs">[VIDEO PLACEHOLDER]</div>
                                </div>
                                <div className="p-6 bg-zinc-900/50 border border-white/10 rounded-2xl">
                                    <div className="text-4xl mb-4">👁️</div>
                                    <h3 className="font-bold text-lg mb-2">The Example</h3>
                                    <p className="text-sm text-zinc-400 leading-relaxed mb-4">Here is what a 10/10 submission looks like. Notice the structure.</p>
                                    <div className="p-3 bg-zinc-800 rounded font-mono text-xs text-green-400 border-l-2 border-green-500">
                                        "{mission.category === 'CODING' ? 'function hero() { return "Fly"; }' : 'My hero glows with blue energy...'}"
                                    </div>
                                </div>
                                <div className="p-6 bg-zinc-900/50 border border-white/10 rounded-2xl">
                                    <div className="text-4xl mb-4">⚡</div>
                                    <h3 className="font-bold text-lg mb-2">Your Task</h3>
                                    <ul className="text-sm text-zinc-400 space-y-2">
                                        <li>1. Open the Workbench.</li>
                                        <li>2. {mission.category === 'CODING' ? 'Write the function.' : 'Draft your story.'}</li>
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
                                    onChange={(e) => { setContent(e.target.value); setFeedback(null); }}
                                    className="flex-1 bg-transparent p-6 text-zinc-300 font-mono focus:outline-none resize-none text-lg leading-relaxed"
                                    placeholder={mission.category === 'CODING' ? '// FUNCTION SPECIFICATION\n// ========================\n// Name: \n// Input: \n// Output: \n// Logic:\n\nfunction solve() {\n  // Your code here\n}' : mission.category === 'SCIENCE' ? '# FIELD REPORT\n## Executive Summary:\n\n## Observations & Data Points:\n\n## Analysis & Recommendations:\n' : mission.category === 'CREATIVE' ? '# NARRATIVE DRAFT\n## Title:\n\n## Opening Hook:\n\n## Development:\n\n## Resolution:\n' : '# SUBMISSION\n## Summary:\n\n## Details:\n\n## Conclusion:\n'}
                                    spellCheck="false"
                                />

                                {feedback && (
                                    <div className="absolute bottom-24 left-6 right-6 bg-amber-900/95 border border-amber-500/50 text-white p-4 rounded-xl backdrop-blur-md shadow-xl animate-bounce-in">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">💡</span>
                                            <div><h4 className="font-bold text-amber-300 text-xs uppercase">Coach's Feedback</h4><p className="text-sm">{feedback}</p></div>
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
                                        <button onClick={handleSubmit} disabled={isSubmitting || !content.trim()} className={`px-8 py-3 rounded-xl font-bold uppercase tracking-widest transition-all ${content.trim() ? "bg-green-500 text-black hover:bg-green-400 hover:scale-105" : "bg-zinc-800 text-zinc-500 cursor-not-allowed"}`}>
                                            {isSubmitting ? "Verifying Output..." : "Submit for Verification"}
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
