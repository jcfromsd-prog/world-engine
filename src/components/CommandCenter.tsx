import { motion, AnimatePresence } from 'framer-motion';

import { useEngine } from '../lib/engine';

interface LeaderboardEntry {
    rank: number;
    name: string;
    earnings: string;
    velocity: string;
}

interface CommandCenterProps {
    userRank?: number;
    userEarnings?: string;
    userVelocity?: string;
    isOpen: boolean;
    onClose: () => void;
}

const CommandCenter: React.FC<CommandCenterProps> = ({
    userRank = 14,
    userEarnings = "$14,500",
    userVelocity = "9.8x",
    isOpen,
    onClose
}) => {
    // REAL-TIME ENGINE HOOK
    const { thunderdomeTime, squadMembers, isMock, isConnected } = useEngine();



    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const leaderboardTarget: LeaderboardEntry = {
        rank: 3,
        name: "Eco_Axe",
        earnings: "$76,200",
        velocity: "11.5x"
    };

    const idleMembers = squadMembers.filter(m => m.status === 'idle');
    const publishingMembers = squadMembers.filter(m => m.status === 'publishing');

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />

                    {/* Slide-out Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full md:w-80 bg-slate-900/95 border-l border-cyan-500/20 shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/95 sticky top-0 z-10">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">🎮</span>
                                <h2 className="text-lg font-bold text-white uppercase tracking-wider">Command Center</h2>
                            </div>
                            <button onClick={onClose} className="text-slate-500 hover:text-white transition">✕</button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="overflow-y-auto flex-1 custom-scrollbar">
                            <div className="px-4 py-2 flex items-center gap-2 border-b border-white/5">
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="text-xs text-slate-500">Strategic AI Insights</p>
                                    <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                    {isMock && <span className="text-[10px] bg-slate-800 text-slate-400 px-1 rounded">SIMULATION</span>}
                                </div>
                            </div>

                            <div className="p-4 space-y-4">

                                {/* 🚨 PRIORITY ALERT: Gauntlet */}
                                <motion.div
                                    className={`rounded-xl p-4 border ${thunderdomeTime < 60 ? 'bg-red-500/10 border-red-500/50 animate-pulse' : 'bg-yellow-500/10 border-yellow-500/30'}`}
                                    animate={thunderdomeTime < 60 ? { scale: [1, 1.02, 1] } : {}}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-yellow-400 tracking-widest">🚨 PRIORITY</span>
                                        <span className={`font-mono text-xl font-bold ${thunderdomeTime < 60 ? 'text-red-400' : 'text-yellow-400'}`}>
                                            {formatTime(thunderdomeTime)}
                                        </span>
                                    </div>
                                    <h3 className="text-white font-bold mb-1">The Gauntlet: Zero-Day Defense</h3>
                                    <p className="text-xs text-slate-400 mb-3">Winner Takes All • $5,000 Prize</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500">Req: Level 5 Architect</span>
                                        <button className="px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded hover:bg-yellow-400">
                                            PREPARE NOW
                                        </button>
                                    </div>
                                </motion.div>

                                {/* 👥 SQUAD EFFICIENCY */}
                                <div className="rounded-xl p-4 bg-slate-800/50 border border-slate-700">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-bold text-purple-400 tracking-widest">👥 SQUAD STATUS</span>
                                        {idleMembers.length > 0 && (
                                            <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                                                {idleMembers.length} Idle
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        {squadMembers.map((member, i) => (
                                            <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/50">
                                                <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm text-white font-medium">{member.name}</div>
                                                    <div className={`text-xs truncate ${member.status === 'idle' ? 'text-orange-400' :
                                                        member.status === 'publishing' ? 'text-cyan-400' : 'text-green-400'
                                                        }`}>
                                                        {member.status === 'idle' ? '⚠️ Idle' : member.task}
                                                    </div>
                                                </div>
                                                {member.status === 'idle' && (
                                                    <button className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded hover:bg-purple-500/30">
                                                        Ping
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {idleMembers.length > 0 && (
                                        <div className="mt-3 p-2 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                                            <p className="text-xs text-orange-300">
                                                💡 <strong>Quick Bounty:</strong> "Clean Climate Data" ($15, 10 mins) fits idle capacity
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* 🧠 ASSET STRATEGY */}
                                <div className="rounded-xl p-4 bg-slate-800/50 border border-slate-700">
                                    <span className="text-xs font-bold text-cyan-400 tracking-widest">🧠 ASSET INSIGHTS</span>

                                    {publishingMembers.length > 0 && (
                                        <div className="mt-3 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <img src={publishingMembers[0].avatar} alt="" className="w-6 h-6 rounded-full" />
                                                <span className="text-sm text-white">{publishingMembers[0].name}</span>
                                            </div>
                                            <p className="text-xs text-slate-400 mb-2">Publishing: <span className="text-cyan-400">{publishingMembers[0].task?.replace('Publishing Asset: ', '')}</span></p>
                                            <p className="text-xs text-emerald-400">✓ Ensure docs are solid for 5-star ratings</p>
                                        </div>
                                    )}

                                    <div className="mt-3 p-3 bg-slate-900/50 rounded-lg">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="text-sm text-white font-medium">Python Data Scraper v4</div>
                                                <div className="text-xs text-slate-500">by Architect_X • 2.4k subs</div>
                                            </div>
                                            <span className="text-xs text-emerald-400">★ 4.8</span>
                                        </div>
                                        <p className="text-xs text-slate-400 mb-2">Speeds up data bounties by 40%</p>
                                        <button className="w-full py-1.5 bg-slate-700 text-white text-xs rounded hover:bg-slate-600">
                                            VIEW IN WORKSHOP
                                        </button>
                                    </div>
                                </div>

                                {/* 📈 LEADERBOARD GAP */}
                                <div className="rounded-xl p-4 bg-slate-800/50 border border-slate-700">
                                    <span className="text-xs font-bold text-emerald-400 tracking-widest">📈 RANK ANALYSIS</span>

                                    <div className="mt-3 flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                                        <div>
                                            <div className="text-2xl font-bold text-white">#{userRank}</div>
                                            <div className="text-xs text-slate-500">Your Rank</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-mono text-emerald-400">{userEarnings}</div>
                                            <div className="text-xs text-slate-500">{userVelocity} velocity</div>
                                        </div>
                                    </div>

                                    <div className="mt-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-slate-400">Target: #{leaderboardTarget.rank}</span>
                                            <span className="text-sm font-bold text-white">{leaderboardTarget.name}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-emerald-400">{leaderboardTarget.earnings}</span>
                                            <span className="text-slate-500">{leaderboardTarget.velocity} velocity</span>
                                        </div>
                                    </div>

                                    <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                        <p className="text-xs text-blue-300">
                                            💡 <strong>Strategy:</strong> Focus on "Architect" tier—build assets to boost velocity multiplier
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CommandCenter;
