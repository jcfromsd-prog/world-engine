import React, { useState, useEffect, useCallback } from 'react';
import { MissionGenerator } from '../../lib/MissionGenerator';
import type { LiveMission } from '../../lib/MissionGenerator';

interface GenesisFeedProps {
    onMissionSelect: (mission: LiveMission) => void;
    userTrack: string; // CHANGED: Replaced grade with track (e.g. 'CODING')
    onCalibrate: () => void;
}

type CategoryFilter = 'ALL' | 'CODING' | 'CREATIVE' | 'SCIENCE' | 'LEADERSHIP';

export const GenesisFeed: React.FC<GenesisFeedProps> = ({ onMissionSelect, userTrack, onCalibrate }) => {
    const [missions, setMissions] = useState<LiveMission[]>([]);
    const [filter, setFilter] = useState<CategoryFilter>('ALL');
    const [isLoading, setIsLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(() => Date.now());

    // Helper: Sort missions by Relevance (Track Match) then Reward (High->Low)
    const sortMissions = useCallback((list: LiveMission[]) => {
        return [...list].sort((a, b) => {
            // 1. Relevance: User's Track gets priority
            const aMatch = a.category === userTrack ? 1 : 0;
            const bMatch = b.category === userTrack ? 1 : 0;
            if (aMatch !== bMatch) return bMatch - aMatch;

            // 2. Reward: High to Low
            return b.reward - a.reward;
        });
    }, [userTrack]);

    // Initialize feed
    useEffect(() => {
        setTimeout(() => {
            const initial = MissionGenerator.generateInitialFeed(8);
            setMissions(sortMissions(initial));
            setIsLoading(false);
        }, 800);
    }, [sortMissions]);

    // Update currentTime every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Simulate new missions dropping in
    useEffect(() => {
        const interval = setInterval(() => {
            setMissions(prev => {
                const now = Date.now();
                let updated = prev.map(m => {
                    if (m.status === 'CLAIMED') return m;
                    if (m.expiresAt < now) return MissionGenerator.claimMission(m);
                    if (Math.random() < 0.01) return MissionGenerator.claimMission(m);
                    return m;
                });

                // Add new mission
                if (Math.random() < 0.2 && updated.filter(m => m.status !== 'CLAIMED').length < 10) {
                    updated = [...updated, MissionGenerator.generateMission()];
                }

                // Remove old claimed
                const claimed = updated.filter(m => m.status === 'CLAIMED');
                const active = updated.filter(m => m.status !== 'CLAIMED');

                // Sort active by RELEVANCE
                const sortedActive = sortMissions(active);

                return [...sortedActive, ...claimed.slice(-3)];
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [sortMissions]);

    const filteredMissions = missions.filter(m =>
        (filter === 'ALL' || m.category === filter) && m.status !== 'CLAIMED'
    );

    const claimedMissions = missions.filter(m => m.status === 'CLAIMED').slice(-3);

    const getStatusBadge = useCallback((mission: LiveMission) => {
        const remaining = Math.max(0, Math.floor((mission.expiresAt - currentTime) / 1000));
        switch (mission.status) {
            case 'TRENDING': return <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-[10px] font-bold rounded-full animate-pulse">🔥 TRENDING</span>;
            case 'EXPIRING': return <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold rounded-full">⏳ {remaining}s</span>;
            case 'CLAIMED': return <span className="px-2 py-0.5 bg-zinc-700 text-zinc-500 text-[10px] font-bold rounded-full">CLAIMED</span>;
            default: return <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold rounded-full animate-pulse">🔴 LIVE</span>;
        }
    }, [currentTime]);

    const handleClaim = useCallback((mission: LiveMission) => {
        // Mark as claimed by current user (visually)
        setMissions(prev => prev.filter(m => m.id !== mission.id));
        onMissionSelect(mission);
    }, [onMissionSelect]);

    return (
        <div className="pt-32 px-6 pb-24 animate-fade-in">
            {/* HEADER */}
            <div className="max-w-6xl mx-auto mb-8">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 mb-2">
                            GENESIS FEED
                        </h1>
                        <p className="text-zinc-500 text-sm font-mono flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            LIVE • {filteredMissions.length} CONTRACTS AVAILABLE • SORTED BY REWARD
                        </p>
                    </div>

                    {/* FILTERS */}
                    <div className="flex gap-2 flex-wrap">
                        {(['ALL', 'CODING', 'CREATIVE', 'SCIENCE', 'LEADERSHIP'] as CategoryFilter[]).map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${filter === cat
                                    ? 'bg-white text-black'
                                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600'
                                    }`}
                            >
                                {cat === 'ALL' ? '🌐 ALL' : cat === 'CODING' ? '💻 CODE' : cat === 'CREATIVE' ? '🎨 DESIGN' : cat === 'SCIENCE' ? '🔬 SCIENCE' : '🤝 LEAD'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* LOADING STATE */}
            {isLoading && (
                <div className="max-w-6xl mx-auto text-center py-20">
                    <div className="text-4xl animate-spin mb-4">⚙️</div>
                    <p className="text-zinc-500 font-mono text-sm">CONNECTING TO GLOBAL NETWORK...</p>
                </div>
            )}

            {/* CTA: COMPLETE PROFILE (Priority: Critical) */}
            {!isLoading && (
                <div className="max-w-6xl mx-auto mb-8 animate-slide-up">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 bg-blue-500 h-full"></div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-xl">🧬</div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Complete Your Profile</h3>
                                <p className="text-xs text-blue-200">Confidence: 15% • Take the refined skills check for better matches.</p>
                            </div>
                        </div>
                        <button
                            id="btn-calibrate"
                            onClick={onCalibrate}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                        >
                            CALIBRATE
                        </button>
                    </div>
                </div>
            )}

            {/* MISSION FEED */}
            {!isLoading && (
                <div className="max-w-6xl mx-auto space-y-4">
                    {filteredMissions.map((mission, idx) => (
                        <div
                            key={mission.id}
                            className={`group relative flex items-center justify-between p-5 bg-zinc-900/60 border border-white/5 hover:border-white/20 rounded-xl transition-all hover:bg-zinc-800/60 ${idx === 0 ? 'ring-2 ring-yellow-500/30' : ''}`}
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            {/* LEFT: INFO */}
                            <div className="flex items-center gap-5">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${mission.category === 'CODING' ? 'bg-blue-500/20' :
                                    mission.category === 'CREATIVE' ? 'bg-pink-500/20' :
                                        mission.category === 'SCIENCE' ? 'bg-green-500/20' : 'bg-purple-500/20'
                                    }`}>
                                    {mission.category === 'CODING' ? '💻' : mission.category === 'CREATIVE' ? '🎨' : mission.category === 'SCIENCE' ? '🔬' : '🤝'}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-bold text-white group-hover:text-blue-200 transition-colors">{mission.title}</h3>
                                        {getStatusBadge(mission)}
                                        {/* RECOMMENDATION BADGE */}
                                        {mission.category === userTrack && (
                                            <span className="px-2 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-pulse">
                                                ✨ RECOMMENDED
                                            </span>
                                        )}
                                        {idx === 0 && mission.category !== userTrack && <span className="text-[10px] text-yellow-400 font-bold">⭐ TOP REWARD</span>}
                                    </div>
                                    <p className="text-xs text-zinc-500">{mission.client} • {mission.desc}</p>
                                </div>
                            </div>

                            {/* RIGHT: REWARD + ACTION */}
                            <div className="flex items-center gap-6">
                                <div className="text-right hidden md:block">
                                    <div className="text-xs text-zinc-600 uppercase">Reward</div>
                                    <div className="text-xl font-black text-yellow-400">{mission.reward} GP</div>
                                </div>
                                <button
                                    onClick={() => handleClaim(mission)}
                                    className="px-5 py-2.5 bg-white text-black font-black text-xs uppercase rounded-lg hover:bg-green-400 hover:scale-105 transition-all shadow-lg"
                                >
                                    CLAIM
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredMissions.length === 0 && !isLoading && (
                        <div className="text-center py-16 text-zinc-600">
                            <div className="text-4xl mb-4">🔍</div>
                            <p>No missions in this category. Check back soon!</p>
                        </div>
                    )}
                </div>
            )}

            {/* RECENTLY CLAIMED (Ghost Trail) */}
            {claimedMissions.length > 0 && (
                <div className="max-w-6xl mx-auto mt-12">
                    <h3 className="text-xs font-mono text-zinc-600 uppercase tracking-widest mb-4">RECENTLY CLAIMED BY OTHERS</h3>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {claimedMissions.map(m => (
                            <div key={m.id} className="flex-shrink-0 px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg opacity-50">
                                <div className="text-sm text-zinc-500 line-through">{m.title}</div>
                                <div className="text-[10px] text-zinc-600">Claimed by {m.claimedBy}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
