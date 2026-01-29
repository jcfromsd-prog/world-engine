import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlobalFeed from './GlobalFeed';
import AssetLadder from './AssetLadder';
import ReferralModal from './ReferralModal';
import MicroTaskFeed from './MicroTaskFeed';

type TabId = 'opportunities' | 'marketplace' | 'micro' | 'network' | 'auditor';

interface Tab {
    id: TabId;
    label: string;
    icon: string;
    description: string;
}

const tabs: Tab[] = [
    {
        id: 'opportunities',
        label: 'Opportunities',
        icon: '🎯',
        description: 'Bounties & Gauntlet Events'
    },
    {
        id: 'marketplace',
        label: 'Marketplace',
        icon: '🏪',
        description: 'Asset Workshop & Tools'
    },
    {
        id: 'micro',
        label: 'Quick Wins',
        icon: '⚡',
        description: '5-Minute Tasks for Instant Crypto'
    },
    {
        id: 'auditor',
        label: 'Quality Control',
        icon: '⚖️',
        description: 'Peer Review & Verification (Rank Required)'
    },
    {
        id: 'network',
        label: 'Network',
        icon: '👥',
        description: 'Squad & Leaderboard'
    }
];

interface TabbedDashboardProps {
    onOpenLogin?: () => void;
}

const TabbedDashboard: React.FC<TabbedDashboardProps> = ({ onOpenLogin }) => {
    const [activeTab, setActiveTab] = useState<TabId>('opportunities');
    const userRank = 4; // Mock rank for logic demonstration

    // Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All Causes');
    const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
    const [sortBy, setSortBy] = useState<'newest' | 'highest-reward'>('newest');
    const [showReferralModal, setShowReferralModal] = useState(false);

    return (
        <div className="bg-slate-950 min-h-screen">
            {/* Tab Navigation */}
            <div className="sticky top-16 z-20 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center gap-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative px-6 py-4 text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'text-white'
                                    : 'text-slate-400 hover:text-slate-200'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{tab.icon}</span>
                                    <span>{tab.label}</span>
                                </div>

                                {/* Active indicator */}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tab Description & Filters (Only for Opportunities) */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <p className="text-sm text-slate-500">
                        {tabs.find(t => t.id === activeTab)?.description}
                    </p>

                    {activeTab === 'opportunities' && (
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="relative group min-w-[200px]">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:border-cyan-500 outline-none transition-all"
                                />
                            </div>

                            {/* Category */}
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                            >
                                <option>All Causes</option>
                                <option>Development</option>
                                <option>Design</option>
                                <option>Content</option>
                                <option>Marketing</option>
                                <option>Research</option>
                                <option>Clean Energy</option>
                                <option>Education</option>
                                <option>Tech</option>
                                <option>AI/ML</option>
                                <option>DeFi</option>
                            </select>

                            {/* Difficulty */}
                            <div className="flex bg-slate-900 border border-slate-700 rounded-lg p-1">
                                {['all', 'easy', 'medium', 'hard'].map((lvl) => (
                                    <button
                                        key={lvl}
                                        onClick={() => setDifficulty(lvl as any)}
                                        className={`px-3 py-1 text-xs font-bold rounded capitalize transition-all ${difficulty === lvl
                                            ? 'bg-slate-700 text-white'
                                            : 'text-slate-500 hover:text-slate-300'
                                            }`}
                                    >
                                        {lvl}
                                    </button>
                                ))}
                            </div>

                            {/* Sort */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                            >
                                <option value="newest">Newest First</option>
                                <option value="highest-reward">Highest Reward</option>
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-6 pb-20">
                <AnimatePresence mode="wait">
                    {activeTab === 'opportunities' && (
                        <motion.div
                            key="opportunities"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Gauntlet Alert */}
                            <div className="mb-8 p-4 bg-gradient-to-r from-yellow-500/10 to-red-500/10 border border-yellow-500/30 rounded-xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">⚔️</span>
                                        <div>
                                            <h3 className="text-white font-bold">The Gauntlet: Zero-Day Defense</h3>
                                            <p className="text-sm text-slate-400">Winner Takes All • $5,000 Prize</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onOpenLogin}
                                        className="px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400"
                                    >
                                        JOIN NOW
                                    </button>
                                </div>
                            </div>

                            <GlobalFeed
                                onOpenLogin={onOpenLogin}
                                searchQuery={searchQuery}
                                category={selectedCategory}
                                difficulty={difficulty}
                                sortBy={sortBy}
                            />
                        </motion.div>
                    )}

                    {activeTab === 'marketplace' && (
                        <motion.div
                            key="marketplace"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <AssetLadder />
                        </motion.div>
                    )}

                    {activeTab === 'micro' && (
                        <motion.div
                            key="micro"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <MicroTaskFeed />
                        </motion.div>
                    )}

                    {activeTab === 'auditor' && (
                        <motion.div
                            key="auditor"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-2xl mx-auto">
                                <div className="text-5xl mb-6 opacity-40">⚖️</div>
                                <h3 className="text-2xl font-bold text-white mb-2">Peer Review Protocol</h3>
                                <p className="text-slate-400 mb-8">
                                    Quality Control is automated via the high-rank Peer Review system. Review Level-1 code to earn protocol fees.
                                </p>

                                {userRank < 5 ? (
                                    <div className="p-8 bg-black/40 border border-red-500/20 rounded-2xl">
                                        <div className="text-red-400 font-black uppercase tracking-widest text-xs mb-2">ACCESS RESTRICTED</div>
                                        <div className="text-white font-bold mb-4">Rank Level 5 Required</div>
                                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
                                            <div className="h-full bg-red-500 w-[80%]" />
                                        </div>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                                            Current Rank: Level 4 • 2,400 XP to Level 5
                                        </p>
                                    </div>
                                ) : (
                                    /* This would be the list of bounties to review */
                                    <div className="text-emerald-400">Access Granted: Reviewing Active Bounties...</div>
                                )}
                            </div>
                        </motion.div>
                    )}


                    {activeTab === 'network' && (
                        <motion.div
                            key="network"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center"
                        >
                            <div className="text-4xl mb-6">🌐</div>
                            <h3 className="text-2xl font-bold text-white mb-2">Global Impact Ledger</h3>
                            <p className="text-slate-400 mb-8 max-w-md mx-auto">
                                You are currently helping 12 Active Squads. Your contributions have saved 440+ hours of senior engineering time.
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                                    <div className="text-cyan-400 font-mono font-bold text-xl">42</div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-widest">Solutions Deployed</div>
                                </div>
                                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                                    <div className="text-purple-400 font-mono font-bold text-xl">9.8x</div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-widest">Efficiency Multiplier</div>
                                </div>
                                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                                    <div className="text-emerald-400 font-mono font-bold text-xl">$14.5k</div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-widest">Total Value Unlocked</div>
                                </div>
                                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                                    <div className="text-cyan-400 font-mono font-bold text-xl">Level 4</div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-widest">Guardian Rank</div>
                                </div>
                            </div>

                            {/* Squad Command */}
                            <div className="max-w-xl mx-auto p-8 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700">
                                <h4 className="text-white font-bold mb-2">My Squad Command</h4>
                                <p className="text-sm text-slate-400 mb-6">You have 3 active agents in your downstream network.</p>
                                <button
                                    onClick={() => setShowReferralModal(true)}
                                    className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 px-8 rounded-full shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-105"
                                >
                                    + INVITE NEW AGENT
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <ReferralModal isOpen={showReferralModal} onClose={() => setShowReferralModal(false)} />
        </div>
    );
};

export default TabbedDashboard;
