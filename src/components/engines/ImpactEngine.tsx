/* eslint-disable react-refresh/only-export-components */
import React from 'react';

export interface ImpactMission {
    id: string;
    title: string;
    reward: string;
    xp: string;
    difficulty: 'Low' | 'Medium' | 'High';
    tags: string[];
}

export const STARTING_MISSIONS: ImpactMission[] = [
    { id: 'M1', title: 'Neural Calibration', reward: '50 SYS', xp: '100 XP', difficulty: 'Low', tags: ['System', 'Onboarding'] },
    { id: 'M2', title: 'Debug React Component', reward: '200 SYS', xp: '500 XP', difficulty: 'Medium', tags: ['Code', 'Bugfix'] },
    { id: 'M3', title: 'Optimize Squad Algorithm', reward: '1000 SYS', xp: 'Clearance Lvl 3', difficulty: 'High', tags: ['AI', 'Algorithm'] },
];

interface ImpactEngineProps {
    onBack: () => void;
    onAccept: (missionId: string) => void;
}

export const ImpactEngine: React.FC<ImpactEngineProps> = ({ onBack, onAccept }) => {
    return (
        <div className="fixed inset-0 z-[50] bg-black/95 backdrop-blur-xl animate-fade-in overflow-y-auto">
            <div className="pt-32 min-h-screen bg-black max-w-7xl mx-auto p-6 md:p-12">

                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-2">
                            IMPACT <span className="text-blue-500">ENGINE</span>
                        </h1>
                        <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">
                            Available Contracts • Real-Time Feed
                        </p>
                    </div>
                    <button
                        onClick={onBack}
                        className="px-6 py-3 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-white font-bold"
                    >
                        ← BACK TO HUB
                    </button>
                </div>

                {/* Mission Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {STARTING_MISSIONS.map((mission) => (
                        <div key={mission.id} className="group relative p-8 bg-zinc-900/50 border border-white/5 rounded-3xl hover:bg-zinc-800 hover:border-blue-500/50 transition-all hover:-translate-y-2">
                            <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 rounded-full border border-white/10 text-[10px] text-zinc-400 font-mono uppercase">
                                {mission.difficulty} INTENSITY
                            </div>

                            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-500">
                                {mission.difficulty === 'Low' ? '🟢' : mission.difficulty === 'Medium' ? '🟡' : '🔴'}
                            </div>

                            <h3 className="text-2xl font-black text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors">
                                {mission.title}
                            </h3>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {mission.tags.map(tag => (
                                    <span key={tag} className="text-xs text-zinc-500 font-bold">#{tag}</span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between mt-auto border-t border-white/5 pt-6">
                                <div>
                                    <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">REWARD</div>
                                    <div className="text-lg font-mono text-blue-400">{mission.reward}</div>
                                </div>
                                <button
                                    onClick={() => onAccept(mission.id)}
                                    className="px-4 py-2 bg-white text-black font-bold uppercase text-xs rounded-lg hover:bg-blue-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                >
                                    Accept Contract
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};
