
import React from 'react';

// --- TYPES & MOCK DATA ---
interface MissionEntry {
    id: string;
    title: string;
    completedAt: string; // Using string for simple display (e.g., "Today", "Yesterday")
    score: number;
    icon: string;
}

const MOCK_HISTORY: MissionEntry[] = [
    { id: 'm-101', title: 'Phonics Warm-up', completedAt: 'Today', score: 100, icon: '🌟' },
    { id: 'm-102', title: 'Login Flow Mastery', completedAt: 'Yesterday', score: 95, icon: '🔑' },
    { id: 'm-103', title: 'Number Sense I', completedAt: '2 days ago', score: 100, icon: '🔢' }
];

export const MissionLog: React.FC = () => {
    const history = MOCK_HISTORY;

    const handleReplay = (id: string) => {
        console.log(`[MissionLog] Replay requested for mission: ${id}`);
        // Future: trigger replay logic
    };

    return (
        <div className="bg-zinc-900/80 border border-white/10 rounded-3xl p-6 backdrop-blur-md w-full animate-in slide-in-from-right duration-700">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <span className="text-2xl">📜</span> My Journey
                </h2>
                <div className="text-xs font-mono text-zinc-500 bg-black/50 px-3 py-1 rounded-full border border-white/5">
                    LEVEL 3
                </div>
            </div>

            <div className="space-y-4">
                {history.map((mission) => (
                    <div
                        key={mission.id}
                        onClick={() => handleReplay(mission.id)}
                        className="group flex items-center gap-4 p-4 bg-black/40 border border-white/5 rounded-2xl hover:bg-zinc-800 hover:border-cyan-500/30 transition-all cursor-pointer relative overflow-hidden"
                    >
                        {/* Hover Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/0 group-hover:via-cyan-500/5 transition-all" />

                        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                            {mission.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-white text-sm truncate group-hover:text-cyan-400 transition-colors">
                                {mission.title}
                            </h3>
                            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
                                <span>{mission.completedAt}</span>
                                <span className="text-zinc-700">•</span>
                                <span className="text-green-400">Score: {mission.score}%</span>
                            </div>
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12l14 0" />
                                <path d="M13 18l6 -6" />
                                <path d="M13 6l6 6" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-center">
                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-white transition-colors">
                    View Full Archives
                </button>
            </div>
        </div>
    );
};
