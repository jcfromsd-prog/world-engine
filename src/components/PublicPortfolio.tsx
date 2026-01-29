import React from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';

const PublicPortfolio: React.FC = () => {
    const { username } = useParams<{ username: string }>();

    // Mock Data (In real app, fetch from Supabase by username)
    // Using slightly different data to simulate a "public read-only" view
    const profile = {
        username: username || "cosmic_coder",
        rank: "Level 4 Guardian",
        joinedDate: "October 2025",
        bio: "Full-stack architect specializing in high-velocity DeFi protocols and AI agents. Building the future of work.",
        topSkills: ["React", "Rust", "Solidity", "System Design"],
        stats: {
            totalEarnings: "12.4k", // Abbreviated for public view
            bountiesSolved: 14,
            reputation: 98
        },
        verifiedWork: [
            { title: "Optimize zk-Rollup Sequencer", reward: "$2,500", date: "Oct 27, 2025", tags: ["Rust", "ZK-Proofs"] },
            { title: "Dashboard Performance Fix", reward: "$450", date: "Oct 20, 2025", tags: ["React", "Performance"] },
            { title: "Safe Smart Account Integration", reward: "$1,200", date: "Oct 12, 2025", tags: ["Solidity", "Security"] },
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
            {/* Minimal Header */}
            <nav className="border-b border-slate-900 py-4 px-6 flex justify-between items-center bg-black/80 backdrop-blur-md sticky top-0 z-50">
                <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
                    <span className="font-bold tracking-widest text-xs md:text-sm">WORLD ENGINE</span>
                </Link>
                <Link to="/" className="text-xs font-bold text-slate-500 hover:text-white transition-colors">
                    Login / Join
                </Link>
            </nav>

            <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">

                {/* Hero / Identity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full border-4 border-slate-900 bg-slate-800 shadow-2xl mb-6 relative">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`}
                            alt={profile.username}
                            className="w-full h-full object-cover rounded-full"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-slate-900 rounded-full p-1.5 border border-slate-800" title="Verified Human">
                            <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tight">
                        {profile.username}
                    </h1>
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold uppercase tracking-widest">
                            {profile.rank}
                        </span>
                        <span className="text-slate-500 text-sm">•</span>
                        <span className="text-slate-500 text-sm">Joined {profile.joinedDate}</span>
                    </div>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
                        {profile.bio}
                    </p>

                    <div className="mt-8 flex justify-center gap-4">
                        <button className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-cyan-400 transition-all shadow-lg hover:scale-105">
                            Hire {profile.username}
                        </button>
                        <button className="px-6 py-3 border border-slate-700 text-slate-300 font-bold rounded-lg hover:bg-slate-800 hover:text-white transition-all">
                            Copy Profile Link
                        </button>
                    </div>
                </motion.div>

                {/* Verified Stats */}
                <div className="grid grid-cols-3 gap-4 mb-16 border-y border-slate-900 py-8">
                    <div className="text-center border-r border-slate-900 last:border-0">
                        <div className="text-2xl md:text-3xl font-black font-mono text-emerald-400">${profile.stats.totalEarnings}</div>
                        <div className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Verified Earnings</div>
                    </div>
                    <div className="text-center border-r border-slate-900 last:border-0">
                        <div className="text-2xl md:text-3xl font-black font-mono text-white">{profile.stats.bountiesSolved}</div>
                        <div className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Bounties Solved</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl md:text-3xl font-black font-mono text-purple-400">{profile.stats.reputation}</div>
                        <div className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Reputation</div>
                    </div>
                </div>

                {/* Proof of Work */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                        <span>Verified Work History</span>
                        <div className="h-px bg-slate-900 flex-1 ml-4" />
                    </h2>

                    <div className="space-y-6">
                        {profile.verifiedWork.map((job, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-6 bg-slate-900/40 border border-slate-800 hover:border-cyan-500/30 rounded-xl transition-all"
                            >
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                                                {job.title}
                                            </h3>
                                            <span className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500" title="Verified Complete">
                                                ✓
                                            </span>
                                        </div>
                                        <div className="flex gap-2 mb-4">
                                            {job.tags.map(tag => (
                                                <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono border border-slate-700">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <div className="font-mono font-bold text-emerald-400">{job.reward}</div>
                                            <div className="text-xs text-slate-600 font-mono">{job.date}</div>
                                        </div>
                                        <button className="hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold border border-slate-700 rounded px-3 py-1.5 hover:bg-slate-700">
                                            View Code
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <p className="text-slate-600 text-xs">
                        This profile is cryptographically verified by World Engine. <br />
                        <Link to="/" className="underline hover:text-slate-400">Learn more about our Zero-Trust verification.</Link>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default PublicPortfolio;
