import React, { useState, useEffect, useCallback } from 'react';
import { MissionGenerator } from '../../lib/missionGenerator';
import type { LiveMission } from '../../lib/missionGenerator';

interface GenesisFeedProps {
    onMissionSelect: (mission: LiveMission) => void;
    userGrade: number;
}

type CategoryFilter = 'ALL' | 'CODING' | 'CREATIVE' | 'SCIENCE' | 'LEADERSHIP';

export const GenesisFeed: React.FC<GenesisFeedProps> = ({ onMissionSelect, userGrade: _userGrade }) => {
    const [missions, setMissions] = useState<LiveMission[]>([]);
    const [filter, setFilter] = useState<CategoryFilter>('ALL');
    const [isLoading, setIsLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(() => Date.now());

    // Initialize feed
    useEffect(() => {
        setTimeout(() => {
            setMissions(MissionGenerator.generateInitialFeed(8));
            setIsLoading(false);
        }, 800);
    }, []);

    // Update currentTime every second for countdown display
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Simulate new missions dropping in
    useEffect(() => {
        const interval = setInterval(() => {
            setMissions(prev => {
                // Remove expired or randomly claimed missions
                const now = Date.now();
                let updated = prev.map(m => {
                    if (m.status === 'CLAIMED') return m;
                    if (m.expiresAt < now) return MissionGenerator.claimMission(m);
                    // Random chance another user claims it (1% per tick)
                    if (Math.random() < 0.01) return MissionGenerator.claimMission(m);
                    return m;
                });

                // Add new mission occasionally (20% chance per tick)
                if (Math.random() < 0.2 && updated.filter(m => m.status !== 'CLAIMED').length < 10) {
                    updated = [...updated, MissionGenerator.generateMission()];
                }

                // Remove old claimed missions (keep last 3)
                const claimed = updated.filter(m => m.status === 'CLAIMED');
                const active = updated.filter(m => m.status !== 'CLAIMED');
                return [...active.sort((a, b) => b.reward - a.reward), ...claimed.slice(-3)];
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

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
                                        {idx === 0 && <span className="text-[10px] text-yellow-400 font-bold">⭐ TOP REWARD</span>}
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
