import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface SquadInviteModalProps {
    isOpen: boolean;
    onClose: () => void;
    userRank?: number; // Percentile rank (e.g., 5 = top 5%)
}

const SquadInviteModal: React.FC<SquadInviteModalProps> = ({ isOpen, onClose, userRank = 5 }) => {
    const squad = {
        name: 'Squad Alpha',
        bounty: '$2,500',
        mission: 'Climate Data Analysis',
        members: [
            { name: 'quantum_dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=quantum', role: 'Lead' },
            { name: 'data_sage', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sage', role: 'Analyst' },
            { name: 'climate_coder', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=climate', role: 'Engineer' },
        ],
        openSlots: 2,
        deadline: '48 hours',
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="relative w-full max-w-lg bg-slate-900 border border-purple-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/20"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Top Accent */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500" />

                        {/* Celebration Header */}
                        <div className="p-6 text-center bg-gradient-to-b from-purple-900/30 to-transparent">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.2 }}
                                className="text-6xl mb-4"
                            >
                                🏆
                            </motion.div>
                            <h2 className="text-2xl font-black text-white mb-2">
                                Exceptional Performance!
                            </h2>
                            <p className="text-purple-400 font-bold">
                                You ranked in the <span className="text-cyan-400">top {userRank}%</span> for this task
                            </p>
                        </div>

                        {/* Squad Invitation Card */}
                        <div className="px-6 pb-6 space-y-4">
                            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <span className="text-xs text-purple-400 uppercase tracking-wider font-bold">You're Invited To</span>
                                        <h3 className="text-xl font-bold text-white">{squad.name}</h3>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-slate-500">Group Bounty</span>
                                        <p className="text-2xl font-mono font-bold text-emerald-400">{squad.bounty}</p>
                                    </div>
                                </div>

                                <div className="bg-slate-900 rounded-lg p-3 mb-4">
                                    <span className="text-xs text-slate-500">Mission:</span>
                                    <p className="text-white font-medium">{squad.mission}</p>
                                </div>

                                {/* Current Members */}
                                <div className="mb-4">
                                    <span className="text-xs text-slate-500 block mb-2">Current Squad Members:</span>
                                    <div className="flex items-center gap-3">
                                        {squad.members.map((member, i) => (
                                            <div key={i} className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg">
                                                <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full" />
                                                <div>
                                                    <p className="text-xs text-white font-medium">@{member.name}</p>
                                                    <p className="text-[10px] text-slate-500">{member.role}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-cyan-400">
                                        🎯 {squad.openSlots} slots remaining
                                    </span>
                                    <span className="text-slate-500">
                                        ⏱️ Closes in {squad.deadline}
                                    </span>
                                </div>
                            </div>

                            {/* What You Get */}
                            <div className="bg-gradient-to-r from-emerald-900/20 to-cyan-900/20 border border-emerald-500/20 rounded-xl p-4">
                                <h4 className="text-sm font-bold text-emerald-400 mb-2">If You Join:</h4>
                                <ul className="text-sm text-slate-300 space-y-1">
                                    <li>💰 Share of {squad.bounty} bounty pool</li>
                                    <li>⭐ +100 Reputation for squad completion</li>
                                    <li>🔓 Access to Premium Squad Channels</li>
                                </ul>
                            </div>

                            {/* CTAs */}
                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3 bg-slate-800 text-slate-400 font-bold rounded-xl hover:text-white transition"
                                >
                                    Maybe Later
                                </button>
                                <Link
                                    to="/"
                                    onClick={onClose}
                                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-xl text-center hover:shadow-lg hover:shadow-purple-500/25 transition"
                                >
                                    Join Squad Alpha
                                </Link>
                            </div>

                            <p className="text-center text-[10px] text-slate-600">
                                Squad Bounties require verified Solvers with 90%+ audit scores
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SquadInviteModal;
