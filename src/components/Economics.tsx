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
                        <h2 className="text-2xl font-bold text-white mb-4">I. The Value Exchange</h2>
                        <p className="text-slate-400 leading-relaxed">
                            MyBestPurpose functions as a Neural Workforce. Value is NOT created by "gig work" but by **Verified Digital Assets**.
                        </p>
                        <p className="text-slate-400 mt-4 leading-relaxed">
                            When a Solver produces Code, Content, Design, or Research that passes the Engine Audit, they are mining efficiency for the requester. This value is captured and transferred instantly via our Smart Contract layer.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900 border border-slate-800 p-8 rounded-2xl"
                    >
                        <div className="text-4xl mb-4">🏦</div>
                        <h2 className="text-2xl font-bold text-white mb-4">II. Revenue & Fees</h2>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <span className="text-cyan-400 font-bold whitespace-nowrap">Governance Levy (10%)</span>
                                <span className="text-sm text-slate-400">A flat fee deducted from successful bounties. This funds the automated auditing system (Engine Sage) and platform security.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-purple-400 font-bold whitespace-nowrap">Commander Tier</span>
                                <span className="text-sm text-slate-400">Subscription model for power users to access high-yield "Gauntlet" events and advanced squad-building tools.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-emerald-400 font-bold whitespace-nowrap">Impact Sponsorships</span>
                                <span className="text-sm text-slate-400">Organizations fund specific "Cause-Based Bounties" (e.g., Climate). The platform takes a management fee to facilitate the crowd-sourced solution.</span>
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

                    <h2 className="text-3xl font-bold text-white mb-8 text-center">III. The Payout Protocol</h2>

                    <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                        <div className="w-full md:w-1/3 bg-slate-950 p-6 rounded-xl border border-slate-800 text-center relative z-10">
                            <div className="text-emerald-400 font-black text-2xl mb-1">Lead Solver</div>
                            <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3">Primary Execution</div>
                            <p className="text-sm text-slate-400">Receives the lion's share (70-90%) for delivering the core asset.</p>
                        </div>

                        <div className="text-2xl text-slate-600">→</div>

                        <div className="w-full md:w-1/3 bg-slate-950 p-6 rounded-xl border border-slate-800 text-center relative z-10">
                            <div className="text-purple-400 font-black text-2xl mb-1">The Squad</div>
                            <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3">Collaborator Bonus</div>
                            <p className="text-sm text-slate-400">Split among supporting roles (Reviewers, Scribes, Researchers) defined in the contract.</p>
                        </div>

                        <div className="text-2xl text-slate-600">→</div>

                        <div className="w-full md:w-1/3 bg-slate-950 p-6 rounded-xl border border-slate-800 text-center relative z-10">
                            <div className="text-cyan-400 font-black text-2xl mb-1">Platform</div>
                            <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3">System Health</div>
                            <p className="text-sm text-slate-400">Retains the Governance Levy to ensure the decentralized engine remains secure.</p>
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
