import React from 'react';
import { motion } from 'framer-motion';

const TOP_SOLVERS = [
    {
        rank: 1,
        name: "Neon_Architect",
        earnings: "$12,450",
        specialty: "Smart Contracts",
        avatar: "bg-purple-500",
        badges: ["🛡️ Audit King", "⚡ Speed Demon"]
    },
    {
        rank: 2,
        name: "ZeroPoint_Energy",
        earnings: "$8,900",
        specialty: "Rust / Embedded",
        avatar: "bg-emerald-500",
        badges: ["🌱 Carbon Comp"]
    },
    {
        rank: 3,
        name: "Dev_Null",
        earnings: "$6,200",
        specialty: "Frontend/UI",
        avatar: "bg-cyan-500",
        badges: ["🎨 Pixel Perfect"]
    }
];

const SolverSpotlight: React.FC = () => {
    return (
        <section className="py-20 bg-slate-900/50 border-y border-slate-800">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-black text-white mb-2">WEEKLY TOP SOLVERS</h2>
                        <p className="text-slate-400">The most impactful engineers on the network this week.</p>
                    </div>
                    <button className="text-cyan-400 font-mono text-sm hover:text-cyan-300 transition">
                        VIEW FULL LEADERBOARD →
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TOP_SOLVERS.map((solver, index) => (
                        <motion.div
                            key={solver.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative group p-6 rounded-2xl bg-black border border-slate-800 hover:border-cyan-500/50 transition-all duration-300"
                        >
                            {/* Rank Badge */}
                            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-black border border-slate-700 text-white shadow-lg z-10">
                                #{solver.rank}
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-14 h-14 rounded-full ${solver.avatar} shadow-[0_0_15px_rgba(0,0,0,0.3)]`} />
                                <div>
                                    <h3 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">
                                        {solver.name}
                                    </h3>
                                    <p className="text-xs text-slate-500 font-mono">{solver.specialty}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-end border-t border-slate-800 pt-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-slate-500">EARNINGS</p>
                                    <p className="font-mono font-bold text-white">{solver.earnings}</p>
                                </div>
                                <div className="flex gap-2">
                                    {solver.badges.map(badge => (
                                        <span key={badge} className="text-[10px] bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-300">
                                            {badge}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SolverSpotlight;
