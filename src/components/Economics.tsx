import React from 'react';
import { motion } from 'framer-motion';

const Economics: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                        The Economic Charter
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Revenue as "Engine Fuel". A transparent look at how value flows through the World Engine.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="bg-slate-900 border border-slate-800 p-8 rounded-2xl"
                    >
                        <div className="text-4xl mb-4">⚡</div>
                        <h2 className="text-2xl font-bold text-white mb-4">I. WORLD HUMAN POTENTIAL ENGINE</h2>
                        <p className="text-slate-400 leading-relaxed">
                            MyBestPurpose is not a gig platform; it is the **MyBestPurpose WORLD HUMAN POTENTIAL ENGINE**. Value is created by transforming raw talent into verified **Legendary Assets**.
                        </p>
                        <p className="text-slate-400 mt-4 leading-relaxed">
                            When a Solver produces Code, Content, or Design, they are building their own "Proof of Work" record. The Engine captures this value and routes it through the **Sovereign 2.0 Protocol**, ensuring the creator, the squad, and the ecosystem all grow in tandem.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900 border border-slate-800 p-8 rounded-2xl"
                    >
                        <div className="text-4xl mb-4">🏦</div>
                        <h2 className="text-2xl font-bold text-white mb-4">II. The Sovereign Split</h2>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <span className="text-emerald-400 font-bold whitespace-nowrap">Solver (45%)</span>
                                <span className="text-sm text-slate-400">Direct reward for the Lead Architect of the solve.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-purple-400 font-bold whitespace-nowrap">Squad (15%)</span>
                                <span className="text-sm text-slate-400">Bonus for peer reviewers, analysts, and supporting roles.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-cyan-400 font-bold whitespace-nowrap">Engine Fund (40%)</span>
                                <span className="text-sm text-slate-400">Equally split: 10% Ops, 10% Legal Defense, 10% AI Compute, 10% Growth.</span>
                            </li>
                        </ul>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-slate-900 to-black border border-slate-800 rounded-3xl p-10 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-32 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

                    <h2 className="text-3xl font-bold text-white mb-8 text-center">III. Value Flow Architecture</h2>

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                            <div className="text-emerald-400 font-black text-xl mb-1">45%</div>
                            <div className="text-[10px] uppercase text-slate-500 font-bold">SOLVER</div>
                        </div>
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                            <div className="text-purple-400 font-black text-xl mb-1">15%</div>
                            <div className="text-[10px] uppercase text-slate-500 font-bold">SQUAD</div>
                        </div>
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                            <div className="text-blue-400 font-black text-xl mb-1">10%</div>
                            <div className="text-[10px] uppercase text-slate-500 font-bold">OPS</div>
                        </div>
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                            <div className="text-red-400 font-black text-xl mb-1">10%</div>
                            <div className="text-[10px] uppercase text-slate-500 font-bold">LEGAL</div>
                        </div>
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                            <div className="text-yellow-400 font-black text-xl mb-1">10%</div>
                            <div className="text-[10px] uppercase text-slate-500 font-bold">AI</div>
                        </div>
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                            <div className="text-cyan-400 font-black text-xl mb-1">10%</div>
                            <div className="text-[10px] uppercase text-slate-500 font-bold">GROWTH</div>
                        </div>
                    </div>
                </motion.div>

                <div className="mt-16 text-center">
                    <p className="text-slate-500 italic">
                        "Trust Through Transparency. By stating these rules upfront, we protect the Engine logic."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Economics;
