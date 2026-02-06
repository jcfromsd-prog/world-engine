import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Lock, ArrowRight, Flame } from 'lucide-react';

export interface BountyProps {
    id: string | number;
    title: string;
    reward: string;
    cause: string;
    desc?: string; // Standardized desc
    tags?: string[];
    time?: string;
    difficulty?: string;
    rippleEffect?: string;
    highlight?: boolean;
    locked?: boolean;
    onSolve: () => void;
}

const BountyCard: React.FC<BountyProps> = ({
    title,
    reward,
    cause,
    desc,
    tags = [],
    time,
    rippleEffect,
    highlight = false,
    locked = false,
    onSolve
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={!locked ? { y: -5, transition: { duration: 0.2 } } : {}}
            className={`group relative overflow-hidden rounded-[2rem] border transition-all duration-300 ${locked
                ? 'bg-zinc-900/40 border-zinc-800/50 grayscale opacity-70'
                : highlight
                    ? 'bg-zinc-900/30 backdrop-blur-xl border-lime-500/30 hover:border-lime-400 hover:shadow-[0_0_30px_rgba(132,204,22,0.15)]'
                    : 'bg-zinc-900/30 backdrop-blur-xl border-zinc-800 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]'
                }`}
        >
            {/* BACKGROUND FLAIR */}
            <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full transition-opacity duration-500 ${highlight ? 'bg-lime-500/5 opacity-0 group-hover:opacity-100' : 'bg-cyan-500/5 opacity-0 group-hover:opacity-100'
                }`} />

            {/* Purpose Match Badge */}
            {highlight && !locked && (
                <div className="absolute top-0 right-0 bg-lime-500 text-black text-[10px] font-black px-4 py-1.5 uppercase tracking-[0.2em] z-10 rounded-bl-2xl shadow-lg shadow-lime-500/20">
                    <div className="flex items-center gap-1">
                        <Flame size={10} strokeWidth={3} /> Purpose Match
                    </div>
                </div>
            )}

            {/* Locked Overlay */}
            {locked && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[4px] p-6 text-center border-2 border-dashed border-zinc-800 rounded-[2rem]">
                    <div className="p-4 bg-zinc-900/90 rounded-2xl border border-zinc-700 mb-4 shadow-2xl">
                        <Lock className="w-6 h-6 text-zinc-500" />
                    </div>
                    <span className="text-[11px] text-zinc-400 uppercase tracking-[0.3em] font-black">Level Restricted</span>
                    <span className="text-[10px] text-zinc-600 mt-2 font-mono">NEURAL LINK LEVEL 5 REQUIRED</span>
                </div>
            )}

            <div className={`p-8 flex flex-col h-full transition-all duration-300 ${locked ? 'blur-[2px] pointer-events-none' : ''}`}>
                {/* Header: Category & Meta */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${highlight ? 'bg-lime-400 shadow-[0_0_8px_#a3e635]' : 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${highlight ? 'text-lime-400' : 'text-zinc-500'}`}>
                            {cause}
                        </span>
                    </div>
                    {time && <span className="text-[10px] text-zinc-600 font-mono font-bold uppercase tracking-widest">{time}</span>}
                </div>

                {/* Title & Desc */}
                <div className="mb-6">
                    <h3 className={`text-2xl font-black mb-3 leading-tight tracking-tight transition-colors ${highlight ? 'text-white group-hover:text-lime-400' : 'text-white group-hover:text-cyan-400'
                        }`}>
                        {title}
                    </h3>
                    {desc && <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2 group-hover:text-zinc-400 transition-colors">{desc}</p>}
                </div>

                {/* Tags */}
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                        {tags.map((tag, i) => (
                            <span key={i} className="text-[9px] px-2.5 py-1 rounded-lg border border-zinc-800 text-zinc-500 bg-zinc-900/50 uppercase tracking-widest font-bold group-hover:border-zinc-700 transition-colors">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Ripple Effect (Real-World Impact) */}
                {rippleEffect && (
                    <div className="mb-6 p-3 bg-zinc-950/50 border border-zinc-800 rounded-xl flex items-center gap-3">
                        <Zap size={14} className="text-lime-400" />
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                            Impact: {rippleEffect}
                        </span>
                    </div>
                )}

                {/* Footer: Reward & Action */}
                <div className="flex justify-between items-center pt-6 border-t border-zinc-800/50 mt-auto">
                    <div>
                        <div className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Potential Reward</div>
                        <div className={`text-2xl font-black font-mono tracking-tighter ${highlight ? 'text-lime-400' : 'text-white'}`}>
                            {reward}
                        </div>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onSolve();
                        }}
                        className={`group/btn h-12 px-6 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center gap-2 ${highlight
                            ? 'bg-lime-500 text-black hover:bg-lime-400 shadow-lg shadow-lime-500/20'
                            : 'bg-white text-black hover:bg-zinc-200 shadow-lg shadow-white/5'
                            }`}
                    >
                        <span>{highlight ? 'Initiate' : 'Launch'}</span>
                        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default BountyCard;

