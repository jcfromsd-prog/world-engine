import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import EditProfileModal from './EditProfileModal';

const Profile: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'badges'>('overview');
    const [isEditOpen, setIsEditOpen] = useState(false);

    const [user, setUser] = useState({
        username: "cosmic_coder",
        rank: "Level 4 Guardian",
        earnings: "$12,450",
        bountiesSolved: 14,
        impactScore: 98,
        bio: "Full-stack architect specializing in high-velocity DeFi protocols and AI agents. Building the future of work.",
        skills: ["React", "Rust", "Solidity", "Python", "System Design"],
        badges: [
            { name: "Speed Demon", icon: "⚡", desc: "Solved 3 bounties < 24h" },
            { name: "Bug Hunter", icon: "🐞", desc: "Found critical vulnerability" },
            { name: "Architect", icon: "🏗️", desc: "System Design Level 5" },
            { name: "Early Adopter", icon: "🚀", desc: "Joined via waitlist" }
        ],
        portfolio: [
            { title: "Optimize zk-Rollup Sequencer", reward: "$2,500", date: "2 days ago", verified: true },
            { title: "Dashboard Performance Fix", reward: "$450", date: "1 week ago", verified: true },
            { title: "Safe Smart Account Integration", reward: "$1,200", date: "2 weeks ago", verified: true },
        ]
    });

    const handleSaveProfile = (updatedData: any) => {
        setUser(prev => ({ ...prev, ...updatedData }));
    };

    return (
        <div className="min-h-screen bg-black text-white pt-20 pb-20">
            <EditProfileModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                user={user}
                onSave={handleSaveProfile}
            />

            {/* Header / Identity Card */}
            <div className="max-w-4xl mx-auto px-6 mb-8">
                <div className="relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
                    {/* Banner */}
                    <div className="h-32 bg-gradient-to-r from-cyan-900 to-purple-900 opacity-50" />

                    <div className="px-8 pb-8 flex flex-col md:flex-row items-end -mt-12 gap-6">
                        {/* Avatar */}
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-slate-900 bg-slate-800 shadow-xl overflow-hidden relative group cursor-pointer" onClick={() => setIsEditOpen(true)}>
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                <span className="text-xs font-bold text-white">EDIT</span>
                            </div>
                        </div>

                        {/* Identity */}
                        <div className="flex-1 mb-2">
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl md:text-3xl font-black text-white">{user.username}</h1>
                                <span className="px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold tracking-widest uppercase">
                                    {user.rank}
                                </span>
                            </div>
                            <p className="text-slate-400 text-sm max-w-lg">{user.bio}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mb-2">
                            <button
                                onClick={() => setIsEditOpen(true)}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm font-bold transition"
                            >
                                Edit Profile
                            </button>
                            <Link
                                to={`/u/${user.username}`}
                                className="px-4 py-2 bg-white text-black hover:bg-cyan-400 border border-transparent rounded-lg text-sm font-bold transition flex items-center justify-center"
                            >
                                Share
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="max-w-4xl mx-auto px-6 mb-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Earnings", value: user.earnings, color: "text-emerald-400", link: "/earnings" },
                    { label: "Bounties Solved", value: user.bountiesSolved, color: "text-white" },
                    { label: "Reputation Score", value: user.impactScore, color: "text-purple-400" },
                    { label: "Completion Rate", value: "100%", color: "text-cyan-400" },
                ].map((stat, i) => (
                    stat.link ? (
                        <Link key={i} to={stat.link} className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-center hover:bg-slate-800 transition-colors cursor-pointer group">
                            <div className={`text-2xl font-black font-mono mb-1 ${stat.color} group-hover:scale-110 transition-transform`}>{stat.value}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold flex items-center justify-center gap-1">
                                {stat.label} <span className="text-cyan-500">↗</span>
                            </div>
                        </Link>
                    ) : (
                        <div key={i} className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-center">
                            <div className={`text-2xl font-black font-mono mb-1 ${stat.color}`}>{stat.value}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{stat.label}</div>
                        </div>
                    )
                ))}
            </div>

            {/* Tabs & Content */}
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex items-center gap-8 border-b border-slate-800 mb-8">
                    {['overview', 'portfolio', 'badges'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === tab ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div layoutId="activeProfileTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="min-h-[300px]">
                    {activeTab === 'overview' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-4">Tech Stack</h3>
                                <div className="flex flex-wrap gap-2">
                                    {user.skills.map((skill: string) => (
                                        <span key={skill} className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-4">Contribution Graph</h3>
                                <div className="p-8 bg-slate-900/30 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-sm italic">
                                    [GitHub Contribution Graph Visualization Placeholder]
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'portfolio' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            {user.portfolio.map((item, i) => (
                                <div key={i} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between group hover:border-slate-600 transition-all">
                                    <div>
                                        <h4 className="font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{item.title}</h4>
                                        <div className="flex items-center gap-3 text-xs text-slate-500">
                                            <span>{item.date}</span>
                                            {item.verified && (
                                                <span className="text-emerald-500 flex items-center gap-1">
                                                    ✓ Verified Completion
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-mono font-bold text-emerald-400">{item.reward}</div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'badges' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {user.badges.map((badge, i) => (
                                <div key={i} className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl text-center group hover:bg-slate-800 transition-all">
                                    <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">{badge.icon}</div>
                                    <div className="font-bold text-white text-sm mb-1">{badge.name}</div>
                                    <div className="text-[10px] text-slate-500">{badge.desc}</div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
