import React from 'react';
import { motion } from 'framer-motion';

export interface SquadRole {
    id: string;
    title: string;
    icon: string;
    rewardShare: string; // e.g. "$250"
    status: 'open' | 'filled';
    filledBy?: {
        name: string;
        avatar: string;
    };
}

export interface BountyProps {
    id: string | number;
    title: string;
    reward: string;
    cause: string;
    time: string;
    difficulty: string;
    squadRoles?: SquadRole[]; // Optional: If present, renders as Squad Card
    onSolve: () => void;
}

const BountyCard: React.FC<BountyProps> = ({
    title,
    reward,
    cause,
    time,
    difficulty,
    squadRoles,
    onSolve
}) => {
    const isHard = difficulty === 'Hard' || reward.includes('$5,000') || reward.includes('$1,000');

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass p-6 transition-all cursor-pointer border border-slate-800 hover:border-cyan-500/30 group bg-slate-900/40"
        >
            {/* Header: Category & Time */}
            <div className="flex justify-between mb-4">
                <span className="text-xs px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 font-bold uppercase tracking-wider">
                    {cause}
                </span>
                <span className="text-xs text-slate-500 font-mono">{time}</span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-white mb-4 min-h-[3rem] group-hover:text-cyan-400 transition-colors">
                {title}
            </h3>

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
                <div className="mb-auto" />
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
        </motion.div>
    );
};

export default BountyCard;
