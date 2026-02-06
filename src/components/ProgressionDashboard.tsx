import React from 'react';
import {
    Users, Flame, Target,
    TrendingUp, Award, ChevronRight,
    Lock, Unlock
} from 'lucide-react';
import type { SoulboundProfile, SkillCategory, MasteryTier } from '../engine/types';

// ----------------- TYPES -----------------
interface ProgressionDashboardProps {
    profile: SoulboundProfile;
    onOpenMission?: () => void;
    onJoinSquad?: () => void;
}

// ----------------- HELPER COMPONENTS -----------------

const TierBadge: React.FC<{ tier: MasteryTier }> = ({ tier }) => {
    const tierStyles: Record<MasteryTier, string> = {
        novice: 'bg-gray-800 text-gray-400 border-gray-700',
        apprentice: 'bg-green-900/30 text-green-400 border-green-700/50',
        journeyman: 'bg-blue-900/30 text-blue-400 border-blue-700/50',
        expert: 'bg-purple-900/30 text-purple-400 border-purple-700/50',
        master: 'bg-amber-900/30 text-amber-400 border-amber-700/50'
    };

    return (
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${tierStyles[tier]}`}>
            {tier}
        </span>
    );
};

const SkillBar: React.FC<{
    category: SkillCategory;
    level: number;
    xp: number;
    xpToNext: number;
    tier: MasteryTier;
}> = ({ category, level, xp, xpToNext, tier }) => {
    const progress = (xp / xpToNext) * 100;

    const categoryColors: Record<SkillCategory, string> = {
        logic: 'from-cyan-500 to-blue-500',
        creativity: 'from-pink-500 to-purple-500',
        engineering: 'from-yellow-500 to-orange-500',
        leadership: 'from-orange-500 to-red-500',
        nature: 'from-green-500 to-emerald-500',
        social: 'from-rose-500 to-pink-500'
    };

    const categoryIcons: Record<SkillCategory, string> = {
        logic: '🧠',
        creativity: '🎨',
        engineering: '⚙️',
        leadership: '👑',
        nature: '🌿',
        social: '🤝'
    };

    return (
        <div className="bg-zinc-900/50 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-lg">{categoryIcons[category]}</span>
                    <span className="text-white font-bold capitalize text-sm">{category}</span>
                </div>
                <div className="flex items-center gap-2">
                    <TierBadge tier={tier} />
                    <span className="text-gray-400 font-mono text-sm">Lv.{level}</span>
                </div>
            </div>
            <div className="h-2 bg-black rounded-full overflow-hidden">
                <div
                    className={`h-full bg-gradient-to-r ${categoryColors[category]} rounded-full transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="flex justify-between mt-1">
                <span className="text-[10px] text-gray-600">{xp} XP</span>
                <span className="text-[10px] text-gray-600">{xpToNext} to next</span>
            </div>
        </div>
    );
};

// ----------------- MAIN COMPONENT -----------------

const ProgressionDashboard: React.FC<ProgressionDashboardProps> = ({
    profile,
    onOpenMission,
    onJoinSquad
}) => {
    if (!profile) return null;
    const { skillGraph, dailyStreak, longestStreak, genesisPoints, verifiedSolverBadge } = profile;

    // Calculate overall progress
    const avgLevel = Object.values(skillGraph.skills).reduce((sum, s) => sum + s.level, 0) / 6;
    const canAccessBounties = verifiedSolverBadge && avgLevel >= 10;

    return (
        <div className="bg-black border border-gray-800 rounded-2xl overflow-hidden">
            {/* HEADER */}
            <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-purple-900/20 to-cyan-900/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-purple-500/30">
                            {profile?.displayName?.[0] || 'L'}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white">{profile?.displayName || 'Legend'}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-purple-400 font-bold uppercase tracking-wider">{profile.archetype}</span>
                                <span className="text-gray-600">•</span>
                                <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">{profile.sector}</span>
                            </div>
                        </div>
                    </div>

                    {/* STREAK INDICATOR */}
                    <div className="text-center">
                        <div className="flex items-center gap-1 text-orange-400">
                            <Flame size={20} className="animate-pulse" />
                            <span className="text-2xl font-black">{dailyStreak}</span>
                        </div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">Day Streak</div>
                    </div>
                </div>
            </div>

            {/* STATS BAR */}
            <div className="grid grid-cols-4 border-b border-gray-800">
                <div className="p-4 text-center border-r border-gray-800">
                    <div className="text-xl font-black text-white">{Math.round(avgLevel)}</div>
                    <div className="text-[9px] text-gray-500 uppercase tracking-widest">Avg Level</div>
                </div>
                <div className="p-4 text-center border-r border-gray-800">
                    <div className="text-xl font-black text-lime-400">{genesisPoints}</div>
                    <div className="text-[9px] text-gray-500 uppercase tracking-widest">GP</div>
                </div>
                <div className="p-4 text-center border-r border-gray-800">
                    <div className="text-xl font-black text-cyan-400">{profile.completedNodes.length}</div>
                    <div className="text-[9px] text-gray-500 uppercase tracking-widest">Missions</div>
                </div>
                <div className="p-4 text-center">
                    <div className="text-xl font-black text-orange-400">{longestStreak}</div>
                    <div className="text-[9px] text-gray-500 uppercase tracking-widest">Best Streak</div>
                </div>
            </div>

            {/* SKILL GRAPH */}
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                        <TrendingUp size={14} className="text-green-400" />
                        Skill Graph
                    </h3>
                    <span className="text-[10px] text-gray-500">
                        Dominant: <span className="text-green-400 font-bold capitalize">{skillGraph.dominantSkill}</span>
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {Object.entries(skillGraph.skills).map(([category, skill]) => (
                        <SkillBar
                            key={category}
                            category={category as SkillCategory}
                            level={skill.level}
                            xp={skill.xp}
                            xpToNext={skill.xpToNext}
                            tier={skill.tier}
                        />
                    ))}
                </div>
            </div>

            {/* PROGRESSION GATES */}
            <div className="px-6 pb-6 space-y-3">
                {/* Squad Gate */}
                <div className={`p-4 rounded-xl border ${profile.squadId ? 'bg-green-900/10 border-green-800/50' : 'bg-zinc-900/50 border-gray-800'}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${profile.squadId ? 'bg-green-900/30' : 'bg-gray-800'}`}>
                                <Users size={20} className={profile.squadId ? 'text-green-400' : 'text-gray-500'} />
                            </div>
                            <div>
                                <div className="text-white font-bold text-sm">Squad Status</div>
                                <div className="text-[10px] text-gray-500">
                                    {profile.squadId ? 'Connected to Squad' : 'Solo Mode (Level 5 Cap)'}
                                </div>
                            </div>
                        </div>
                        {!profile.squadId && (
                            <button
                                onClick={onJoinSquad}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                            >
                                Find Squad
                            </button>
                        )}
                    </div>
                </div>

                {/* Bounty Gate */}
                <div className={`p-4 rounded-xl border ${canAccessBounties ? 'bg-lime-900/10 border-lime-800/50' : 'bg-zinc-900/50 border-gray-800'}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${canAccessBounties ? 'bg-lime-900/30' : 'bg-gray-800'}`}>
                                {canAccessBounties ? (
                                    <Unlock size={20} className="text-lime-400" />
                                ) : (
                                    <Lock size={20} className="text-gray-500" />
                                )}
                            </div>
                            <div>
                                <div className="text-white font-bold text-sm">Bounty Board</div>
                                <div className="text-[10px] text-gray-500">
                                    {canAccessBounties
                                        ? 'Real client missions available!'
                                        : `Requires: Verified Badge + Level 10 (${Math.round(avgLevel)}/10)`}
                                </div>
                            </div>
                        </div>
                        {verifiedSolverBadge && (
                            <Award size={20} className="text-amber-400" />
                        )}
                    </div>
                    {!canAccessBounties && (
                        <div className="mt-3">
                            <div className="h-2 bg-black rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-gray-600 to-gray-500 rounded-full transition-all"
                                    style={{ width: `${Math.min((avgLevel / 10) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* CTA */}
            <div className="p-6 border-t border-gray-800 bg-gradient-to-r from-green-900/10 to-transparent">
                <button
                    onClick={onOpenMission}
                    className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-black font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                >
                    <Target size={20} />
                    Start Next Mission
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default ProgressionDashboard;
