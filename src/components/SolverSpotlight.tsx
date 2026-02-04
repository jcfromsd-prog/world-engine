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
        <div className="space-y-4">
            {TOP_SOLVERS.map((solver, index) => (
                <motion.div
                    key={solver.name}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-zinc-900/20 border border-gray-800 hover:bg-zinc-900/40 transition-colors cursor-pointer group"
                >
                    <div className="text-xl font-black text-gray-800 group-hover:text-green-500/50 transition-colors italic">
                        #{solver.rank}
                    </div>
                    <div className="flex-1">
                        <div className="font-bold text-gray-300 group-hover:text-white transition-colors">
                            {solver.name}
                        </div>
                        <div className="text-[10px] text-gray-600 uppercase tracking-wide leading-none mt-1">
                            {solver.specialty}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-mono text-green-500 font-bold">
                            {solver.earnings}
                        </div>
                        <div className="flex justify-end gap-1 mt-1">
                            {solver.badges.map((badge, i) => (
                                <span key={i} className="text-[9px] text-gray-500 px-1 border border-gray-800 bg-black/50">
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default SolverSpotlight;
