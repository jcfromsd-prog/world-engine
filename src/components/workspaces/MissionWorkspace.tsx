import React, { useState, useMemo } from 'react';

interface MissionWorkspaceProps {
    mission: any;
    onComplete: () => void;
    onCancel: () => void;
}

export const MissionWorkspace: React.FC<MissionWorkspaceProps> = ({ mission, onComplete, onCancel }) => {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);

    // SIMULATED AI GRADER (The Brain)
    const calculateQuality = (input: string) => {
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
    };

    // LIVE QUALITY SCORE (Updates as user types)
    const liveScore = useMemo(() => calculateQuality(content), [content, mission.category]);

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
                if (mission.category === 'CODING') tip = "Did you define your variables? Try adding 'const' or 'let'.";
                if (mission.category === 'SCIENCE') tip = "Scientific logs need data! What did you measure?";
                if (mission.category === 'CREATIVE') tip = "Paint a picture with words! Describe the colors and feelings.";

                if (content.length < 20) tip = "Too short! A true professional provides detailed reports. Write at least one full sentence.";

                setFeedback(tip);
            } else {
                // SUCCESS MODE (Legendary Validation)
                onComplete();
            }
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col animate-fade-in text-white font-sans">
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-900">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${mission.type === 'TRAINING' ? 'bg-purple-500' : 'bg-blue-500'}`}></span>
                        <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">{mission.type} PROTOCOL</span>
                    </div>
                    <h2 className="text-xl font-black">{mission.title}</h2>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <div className="text-xs text-zinc-500 uppercase">Reward</div>
                        <div className="text-yellow-400 font-bold">{mission.reward} GP</div>
                    </div>
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border border-zinc-700 text-zinc-400 text-xs rounded hover:text-white hover:border-white transition-all uppercase tracking-wider"
                    >
                        Abort
                    </button>
                </div>
            </div>

            {/* MAIN WORKSPACE */}
            <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full p-6 gap-6">

                {/* LEFT: INSTRUCTIONS */}
                <div className="w-full md:w-1/3 space-y-6">
                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                        <h3 className="text-lg font-bold text-white mb-4">Mission Brief</h3>
                        <p className="text-zinc-400 leading-relaxed mb-6">{mission.desc}</p>

                        <h4 className="text-sm font-bold text-zinc-300 mb-2 uppercase tracking-wide">Objectives:</h4>
                        <ul className="space-y-2 text-sm text-zinc-500 font-mono">
                            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Initialize Workspace</li>
                            <li className="flex items-center gap-2"><span className={liveScore >= 50 ? "text-green-500" : "text-zinc-600"}>{liveScore >= 50 ? "✓" : "○"}</span> {mission.category === 'CODING' ? 'Write Solution Code' : mission.category === 'CREATIVE' ? 'Create Asset' : 'Complete Observation'}</li>
                            <li className="flex items-center gap-2"><span className="text-zinc-600">○</span> Submit for Review</li>
                        </ul>
                    </div>

                    <div className="bg-blue-900/10 p-4 rounded-xl border border-blue-500/20 text-xs text-blue-200">
                        <strong className="block mb-1">💡 SAGE TIP:</strong>
                        {mission.category === 'CODING' && "Remember to handle edge cases in your function."}
                        {mission.category === 'CREATIVE' && "Focus on emotional impact and color harmony."}
                        {mission.category === 'SCIENCE' && "Record precise measurements for validation."}
                    </div>
                </div>

                {/* RIGHT: EDITOR / CANVAS */}
                <div className="w-full md:w-2/3 bg-black border border-white/10 rounded-2xl overflow-hidden flex flex-col relative">
                    <div className="bg-zinc-900 px-4 py-2 border-b border-white/10 flex items-center justify-between">
                        <span className="text-xs font-mono text-zinc-500">workspace.active</span>
                        <span className="text-xs font-mono text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> ONLINE</span>
                    </div>

                    {/* INPUT AREA */}
                    <textarea
                        value={content}
                        onChange={(e) => { setContent(e.target.value); setFeedback(null); }}
                        placeholder={mission.category === 'CODING' ? "// Write your code here..." : "Start creating here..."}
                        className="flex-1 bg-transparent p-6 text-zinc-300 font-mono focus:outline-none resize-none"
                        spellCheck="false"
                    />

                    {/* AI FEEDBACK OVERLAY (Coach's Tip - AMBER for friendly coaching) */}
                    {feedback && (
                        <div className="absolute bottom-28 left-6 right-6 bg-amber-900/95 border border-amber-500/50 text-white p-4 rounded-xl backdrop-blur-md shadow-xl">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">💡</span>
                                <div>
                                    <h4 className="font-bold text-sm uppercase text-amber-300 mb-1">Coach's Tip:</h4>
                                    <p className="text-sm text-amber-100">{feedback}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* QUALITY METER + ACTION BAR */}
                    <div className="p-4 border-t border-white/10 bg-zinc-900/50 space-y-3">
                        {/* LIVE QUALITY METER */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${scoreInfo.color} transition-all duration-300`}
                                    style={{ width: `${liveScore}%` }}
                                />
                            </div>
                            <span className={`text-xs font-mono ${scoreInfo.textColor} min-w-[80px] text-right`}>
                                {scoreInfo.label}
                            </span>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <div className="flex justify-end">
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !content.trim()}
                                className={`px-8 py-3 rounded-xl font-bold uppercase tracking-widest transition-all ${content.trim()
                                    ? "bg-green-500 text-black hover:bg-green-400 hover:scale-105 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                    }`}
                            >
                                {isSubmitting ? "Analyzing..." : "Submit Work"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
