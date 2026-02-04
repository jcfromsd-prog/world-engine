import React from 'react';
import { motion } from 'framer-motion';
import type { SquadRole } from '../types/bounty';

export interface BountyProps {
    id: string | number;
    title: string;
    reward: string;
    cause: string;
    time: string;
    difficulty: string;
    squadRoles?: SquadRole[];
    academicSkills?: string[];
    rippleEffect?: string; // NEW: Shows real-world impact (e.g., "Saves 400kWh/day")
    source?: string;
    financials?: Record<string, unknown>;
    onSolve: () => void;
    locked?: boolean;
    highlight?: boolean; // NEW: For "Purpose Match" highlighting
}

const BountyCard: React.FC<BountyProps> = ({
    title,
    reward,
    cause,
    time,
    difficulty,
    squadRoles,
    academicSkills,
    rippleEffect,
    highlight = false,
    locked = false,
    onSolve
}) => {
    const isHard = difficulty === 'Hard' || reward.includes('$5,000') || reward.includes('$1,000');

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${locked
                    ? 'bg-zinc-900/40 border-gray-800/50 grayscale opacity-70'
                    : highlight
                        ? 'bg-gradient-to-br from-lime-900/20 to-zinc-900/50 border-lime-500/50 hover:border-lime-400 hover:shadow-lg hover:shadow-lime-500/10'
                        : 'bg-slate-900/50 border-slate-800 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10'
                }`}
        >
            {/* Purpose Match Badge */}
            {highlight && !locked && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-lime-500 to-green-500 text-black text-[10px] font-black px-3 py-1 uppercase tracking-widest z-10">
                    ✨ Purpose Match
                </div>
            )}

            {/* Locked Overlay */}
            {locked && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] p-6 text-center">
                    <div className="p-3 bg-zinc-900/80 rounded-full border border-gray-700 mb-2">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black">Genesis Point Locked</span>
                    <span className="text-[9px] text-gray-600 mt-1">Complete Neural Alignment to Unlock</span>
                </div>
            )}

            <div className={`p-6 transition-all duration-300 ${locked ? 'blur-[1px] pointer-events-none' : ''}`}>
                {/* Header: Category & Time */}
                <div className="flex justify-between mb-4">
                    <span className={`text-xs px-2 py-1 rounded font-bold uppercase tracking-wider ${highlight ? 'bg-lime-500/10 text-lime-400' : 'bg-cyan-500/10 text-cyan-400'
                        }`}>
                        {cause}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{time}</span>
                </div>

                {/* Title */}
                <h3 className={`text-xl font-bold mb-2 min-h-[3rem] transition-colors pr-6 ${highlight ? 'text-white group-hover:text-lime-400' : 'text-white group-hover:text-cyan-400'
                    }`}>
                    {title}
                </h3>

                {/* Ripple Effect (Real-World Impact) */}
                {rippleEffect && (
                    <div className="flex items-center gap-2 mb-4 p-2 bg-emerald-900/20 border border-emerald-500/20 rounded-lg">
                        <span className="text-emerald-400 text-sm">🌊</span>
                        <span className="text-[11px] text-emerald-300 font-medium">
                            <span className="text-emerald-500 font-bold">Ripple Effect:</span> {rippleEffect}
                        </span>
                    </div>
                )}

                {/* Academic Skills (Stealth Syllabus) */}
                {academicSkills && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {academicSkills.map((skill, i) => (
                            <span key={i} className="text-[9px] px-1.5 py-0.5 rounded border border-purple-500/30 text-purple-400 bg-purple-500/10 uppercase tracking-wide">
                                {skill}
                            </span>
                        ))}
                    </div>
                )}

                {/* SQUAD VIEW: If roles exist */}
                {squadRoles && squadRoles.length > 0 ? (
                    <div className="mb-6 space-y-2">
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">Squad Composition</div>
                        {squadRoles.map((role) => (
                            <div key={role.id} className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{role.icon}</span>
                                    <div>
                                        <div className={`text-xs font-bold ${role.status === 'open' ? 'text-white' : 'text-slate-500'}`}>
                                            {role.title}
                                        </div>
                                        <div className="text-[10px] text-emerald-400 font-mono">{role.rewardShare}</div>
                                    </div>
                                </div>

                                {role.status === 'filled' ? (
                                    <div className="flex items-center gap-2">
                                        <img src={role.filledBy?.avatar} alt="User" className="w-5 h-5 rounded-full grayscale opacity-50" />
                                        <span className="text-[10px] text-slate-500 font-bold uppercase">FILLED</span>
                                    </div>
                                ) : (
                                    <span className="text-[10px] text-cyan-400 font-bold uppercase animate-pulse">OPEN SLOT</span>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    /* STANDARD VIEW: Just spacing */
                    <div className="mb-auto h-[100px]" />
                )}

                {/* Footer: Reward & Action */}
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-800/50">
                    <div className="text-lg font-black text-emerald-400 font-mono">
                        {reward}
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onSolve();
                        }}
                        className={`px-4 py-2 rounded text-sm font-bold transition-all ${isHard
                            ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white border border-purple-500/50'
                            : 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-400 hover:text-black border border-cyan-500/30'
                            }`}
                    >
                        {isHard ? '🛡️ Solve' : 'Solve'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default BountyCard;
