import React, { useState } from 'react';
import { Brain, Rocket, ArrowRight, CreditCard, Zap, Target, Award, Users, Shield, PlayCircle, CheckCircle } from 'lucide-react';
import LiveGovernanceTicker from './LiveGovernanceTicker';
import { useUser } from '../context/UserContext';
import { MISSION_DB, type Mission } from '../data/TaskRegistry';
import type { SoulboundProfile } from '../engine/types';

const DashboardStat: React.FC<{ icon: React.ReactNode, label: string, value: string, color: string }> = ({ icon, label, value, color }) => (
    <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 p-6 rounded-2xl hover:border-zinc-700 transition-all group">
        <div className={`${color} mb-3 group-hover:scale-110 transition-transform`}>{icon}</div>
        <div className="text-2xl font-black text-white mb-1 tracking-tight">{value}</div>
        <div className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-black">{label}</div>
    </div>
);

interface SquadMemberProps {
    name: string;
    role: string;
    status: string;
    isUser?: boolean;
}

const SquadMember: React.FC<SquadMemberProps> = ({ name, role, status, isUser }) => (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs border transition-all ${isUser ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-zinc-900 text-zinc-500 border-zinc-800 group-hover:border-zinc-700'
                }`}>{name[0].toUpperCase()}</div>
            <div className="text-left">
                <div className={`text-sm font-black ${isUser ? 'text-white' : 'text-zinc-300'}`}>{name}</div>
                <div className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">{role}</div>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${status === 'In Flow' ? 'bg-purple-500 animate-pulse shadow-[0_0_8px_#a855f7]' : 'bg-lime-500 shadow-[0_0_8px_#a3e635]'}`}></div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{status}</span>
        </div>
    </div>
);

interface SolverDashboardProps {
    profile: SoulboundProfile;
    onMissionStart: (mission: Mission) => void;
}

const SolverDashboard: React.FC<SolverDashboardProps> = ({ profile, onMissionStart }) => {
    const { userProfile, heroPath, setHeroPath, wallet, completeMission } = useUser();
    const [submittingId, setSubmittingId] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState<Mission | null>(null);

    // Fallback to local profile if context is somehow missing (though it shouldn't be)
    const userName = profile?.displayName || userProfile?.name || "Legend";
    const userRole = heroPath?.role || profile?.archetype || "Tactician";
    const userGoal = profile?.sector || "Global Impact";

    const getSageMessage = () => {
        if (userRole?.includes("Code")) return "I've detected a logic breach in the energy grid. Ready to override?";
        if (userRole?.includes("Design")) return "A narrative vacuum detected. The world needs your vision.";
        return "The board is set. The world is waiting for your move.";
    };

    // --- SMART FILTER LOGIC ---
    const getRelevantMissions = () => {
        const passion = userProfile?.passion || "General";
        const currentId = heroPath?.currentMissionId;

        return MISSION_DB.filter(mission => {
            if (mission.id === currentId) return true;

            if (passion.includes("Code") || passion.includes("Tech")) return mission.category === "Coding";
            if (passion.includes("Art") || passion.includes("Write")) return mission.category === "Humanities";
            if (passion.includes("Build") || passion.includes("Engineer")) return mission.category === "Math" || mission.category === "Science";
            if (passion.includes("Science") || passion.includes("Bio")) return mission.category === "Science";

            return true;
        });
    };

    const visibleMissions = getRelevantMissions();

    const handleActivateMission = (mission: Mission) => {
        setHeroPath(prev => prev ? ({
            ...prev,
            currentMission: mission.title,
            currentMissionId: mission.id,
            status: "Active"
        }) : null);

        // Pass to App.tsx for the modal/workspace launch
        onMissionStart(mission);
    };

    const handleSubmitMission = async (mission: Mission) => {
        setSubmittingId(mission.id);

        // --- REQUIREMENT #2: VERIFYING ANIMATION ---
        await new Promise(resolve => setTimeout(resolve, 2500));

        // Extract numeric value from GP string (e.g. "120 GP" -> 120)
        const rewardAmount = parseInt(mission.price.replace(/[^\d]/g, '')) || 0;

        completeMission(mission.xp, rewardAmount);
        setSubmittingId(null);
        setShowSuccess(mission);
    };

    return (
        <section className="relative bg-[#050505] animate-in fade-in duration-1000">
            {/* BACKGROUND DECOR */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

            {/* 0. LIVE GOVERNANCE TICKER */}
            <LiveGovernanceTicker />

            <div className="py-12 px-6 max-w-7xl mx-auto relative z-10">
                {/* 1. MORNING ALIGNMENT */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 pb-12 border-b border-zinc-900">
                    <div className="space-y-6 max-w-3xl text-left">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-2xl">
                                <Brain size={24} className="text-cyan-400 animate-pulse" />
                            </div>
                            <div>
                                <div className="text-cyan-400 font-black tracking-[0.3em] text-[10px] uppercase mb-1">Neural Connection Established</div>
                                <div className="text-zinc-600 font-mono text-[9px] uppercase tracking-widest">SAGE-7 // LATENCY: 12ms</div>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
                            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">{userName}</span>.
                        </h1>

                        <div className="flex items-center gap-3">
                            <span className="text-zinc-600 font-bold uppercase tracking-widest text-xs">Primary Objective:</span>
                            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black uppercase tracking-widest">
                                {userGoal}
                            </span>
                        </div>

                        <div className="relative">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full" />
                            <p className="text-xl md:text-2xl text-zinc-400 pl-8 font-medium italic leading-relaxed">
                                "{getSageMessage()}"
                            </p>
                        </div>
                    </div>

                    {/* 2. THE VAULT (LOSS AVERSION) */}
                    <div className="bg-zinc-900/40 backdrop-blur-2xl p-8 rounded-[2rem] border border-zinc-800 shadow-2xl text-right min-w-[280px]">
                        <div className="mb-6">
                            <div className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] mb-1">Current Focus</div>
                            <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 tracking-tighter uppercase">
                                {heroPath?.currentMission || "No Active Mission"}
                            </div>
                        </div>

                        <div className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] mb-2 flex items-center justify-end gap-2">
                            <CreditCard size={12} className="text-zinc-700" /> Wallet Balance
                        </div>
                        <div className="text-5xl font-black text-lime-500 font-mono tracking-tighter mb-2 italic">
                            {wallet?.balance || 0}<span className="text-[12px] ml-2 text-zinc-500 uppercase not-italic tracking-widest font-black">GP</span>
                        </div>
                        <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest flex items-center justify-end gap-2">
                            <Zap size={10} className="text-lime-500" /> Proof of Stake Verified
                        </div>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    <DashboardStat icon={<Shield size={20} />} label="Security Level" value={`Level 1`} color="text-cyan-400" />
                    <DashboardStat icon={<Award size={20} />} label="Operative Class" value={userRole} color="text-purple-400" />
                    <DashboardStat icon={<Target size={20} />} label="Tactical Focus" value={userGoal.split(' ')[0]} color="text-blue-400" />
                    <DashboardStat icon={<Zap size={20} />} label="Energy Stored" value={`${profile?.genesisPoints || 0} GP`} color="text-lime-400" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* LEFT: IMPACT BOARD */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <Rocket className="text-lime-400" size={24} />
                                <h2 className="text-2xl font-black text-white tracking-tight uppercase">Impact Board</h2>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] block mb-1">Recommended for:</span>
                                <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest">{userProfile?.passion || "Explorer"}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {visibleMissions.map((mission) => {
                                const isActive = heroPath?.currentMissionId === mission.id;

                                return (
                                    <div
                                        key={mission.id}
                                        className={`group relative p-8 rounded-[2rem] border transition-all duration-500 overflow-hidden ${isActive
                                            ? "bg-cyan-500/5 border-cyan-500/30 shadow-[0_0_50px_rgba(34,211,238,0.1)]"
                                            : "bg-zinc-900/40 backdrop-blur-xl border-zinc-800 hover:border-zinc-700"
                                            }`}
                                    >
                                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] uppercase font-black text-6xl -rotate-12 translate-x-8 -translate-y-8">
                                            {mission.category}
                                        </div>

                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="px-2 py-1 bg-zinc-950 border border-zinc-800 rounded font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                                                        {mission.standardId}
                                                    </span>
                                                    {isActive && (
                                                        <span className="px-2 py-1 bg-cyan-500 text-black rounded font-black text-[10px] uppercase tracking-widest animate-pulse">
                                                            ACTIVE MISSION
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className="text-2xl font-black text-white mb-2 tracking-tight group-hover:text-cyan-400 transition-colors">
                                                    {mission.title}
                                                </h3>

                                                <p className="text-zinc-500 text-sm leading-relaxed max-w-xl">
                                                    {mission.description}
                                                </p>

                                                <div className="flex items-center gap-4 mt-4">
                                                    <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-1">
                                                        <Award size={12} className="text-purple-500" /> {mission.cause}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-4 min-w-[140px]">
                                                <div className="text-right">
                                                    <div className="text-2xl font-black text-lime-400 font-mono tracking-tighter">+{mission.xp} XP</div>
                                                    <div className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">{mission.price}</div>
                                                </div>

                                                {isActive ? (
                                                    <div className="flex flex-col gap-2 w-full">
                                                        <div className="flex items-center gap-2 px-6 py-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-xl font-black text-xs uppercase tracking-widest justify-center">
                                                            <CheckCircle size={16} /> In Progress
                                                        </div>
                                                        <button
                                                            disabled={!!submittingId}
                                                            onClick={(e) => { e.stopPropagation(); handleSubmitMission(mission); }}
                                                            className={`w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${submittingId === mission.id
                                                                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                                                : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:scale-105 shadow-[0_0_20px_rgba(147,51,234,0.3)]"
                                                                }`}
                                                        >
                                                            {submittingId === mission.id ? (
                                                                <>
                                                                    <div className="w-3 h-3 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                                                                    Verifying...
                                                                </>
                                                            ) : (
                                                                <>Submit Solution <ArrowRight size={14} /></>
                                                            )}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        disabled={!!heroPath?.currentMissionId}
                                                        onClick={() => handleActivateMission(mission)}
                                                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all w-full justify-center group/btn ${heroPath?.currentMissionId
                                                            ? "bg-zinc-900 text-zinc-700 cursor-not-allowed border border-zinc-800"
                                                            : "bg-white hover:bg-cyan-400 text-black shadow-xl"
                                                            }`}
                                                    >
                                                        <PlayCircle size={16} className="group-hover/btn:scale-110 transition-transform" />
                                                        {heroPath?.currentMissionId ? "Focus Locked" : "Start Mission"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {isActive && (
                                            <div className="mt-8 h-1 w-full bg-zinc-950 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-1/3 animate-pulse shadow-[0_0_10px_#22d3ee]"></div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT: SQUAD & GROWTH */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <Users className="text-cyan-400" size={24} />
                                <h2 className="text-2xl font-black text-white tracking-tight uppercase">Active Squad</h2>
                            </div>

                            <div className="bg-zinc-900/30 backdrop-blur-xl border border-zinc-800 rounded-[2rem] p-8 shadow-2xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-4 opacity-5 uppercase font-black text-4xl -rotate-12 translate-x-4 -translate-y-4">SQUAD</div>
                                <div className="text-[10px] text-cyan-400 font-black uppercase tracking-[0.4em] mb-6 border-b border-zinc-800 pb-4">Unit: Ocean Stewards</div>
                                <div className="space-y-2 mb-8">
                                    <SquadMember name="Sarah_V" role="Architect" status="Online" />
                                    <SquadMember name="Marcus_X" role="Scribe" status="In Flow" />
                                    <SquadMember name="You" role={userRole} status="Active" isUser />
                                </div>
                                <button className="w-full py-4 bg-zinc-950 border border-zinc-800 text-white font-black uppercase tracking-[0.3em] text-[10px] hover:bg-cyan-500 hover:text-black hover:border-cyan-400 transition-all flex items-center justify-center gap-3 rounded-xl shadow-xl">
                                    Comm Link <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>

                        {/* GROWTH GAP */}
                        <div className="bg-gradient-to-br from-zinc-900/40 to-black backdrop-blur-xl border border-zinc-800 rounded-[2rem] p-8 shadow-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400">
                                    <Zap size={20} />
                                </div>
                                <h3 className="text-lg font-black text-white uppercase tracking-tight">Daily Micro-Syllabus</h3>
                            </div>
                            <p className="text-zinc-500 text-sm leading-relaxed mb-6 italic">
                                "Your data analysis is legendary, but your narrative architecture needs refinement. Study how to summarize complexity for founders."
                            </p>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-zinc-500">Mastery Progress</span>
                                    <span className="text-white">70%</span>
                                </div>
                                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                                    <div className="h-full w-[70%] bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.3)]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MISSION SUCCESS OVERLAY */}
            {showSuccess && (
                <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-500">
                    <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 p-12 rounded-[3rem] shadow-[0_0_100px_rgba(34,211,238,0.1)] text-center relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

                        <div className="w-24 h-24 bg-lime-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(132,204,22,0.4)] animate-bounce">
                            <CheckCircle size={48} className="text-black" />
                        </div>

                        <h2 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">Mission Success</h2>
                        <p className="text-zinc-500 mb-8 font-medium">"{showSuccess.title}" completed. Your impact has been recorded on the chain.</p>

                        <div className="grid grid-cols-2 gap-4 mb-10">
                            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                                <div className="text-lime-400 font-black text-2xl font-mono">+{showSuccess.xp}</div>
                                <div className="text-[8px] text-zinc-600 uppercase tracking-widest font-black">XP Gained</div>
                            </div>
                            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                                <div className="text-cyan-400 font-black text-2xl font-mono">+{showSuccess.price}</div>
                                <div className="text-[8px] text-zinc-600 uppercase tracking-widest font-black">Reward Claims</div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowSuccess(null)}
                            className="w-full py-6 bg-white hover:bg-cyan-400 text-black rounded-2xl font-black uppercase tracking-[0.4em] text-xs transition-all shadow-2xl"
                        >
                            Continue Deployment
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default SolverDashboard;


