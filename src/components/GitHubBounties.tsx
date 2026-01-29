import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchGitHubBounties, type ParsedBounty } from '../lib/github';

interface GitHubBountiesProps {
    limit?: number;
    onBountyClick?: (bounty: ParsedBounty) => void;
}

const difficultyColors = {
    Easy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Hard: 'bg-red-500/20 text-red-400 border-red-500/30'
};

const languageColors: Record<string, string> = {
    TypeScript: 'text-blue-400',
    JavaScript: 'text-yellow-400',
    Python: 'text-green-400',
    Rust: 'text-orange-400',
    Go: 'text-cyan-400',
    Solidity: 'text-purple-400',
    default: 'text-slate-400'
};

const GitHubBounties: React.FC<GitHubBountiesProps> = ({ limit = 10, onBountyClick }) => {
    const [bounties, setBounties] = useState<ParsedBounty[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadBounties = async () => {
            try {
                setIsLoading(true);
                const data = await fetchGitHubBounties({ limit });
                setBounties(data);
            } catch (err) {
                setError('Failed to load GitHub bounties');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadBounties();
    }, [limit]);

    if (isLoading) {
        return (
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                    <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                        alt="GitHub Logo" className="w-6 h-6 invert" />
                    <h3 className="text-white font-bold">GitHub Bounties</h3>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse">
                            <div className="h-4 bg-slate-700 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-slate-800 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error || bounties.length === 0) {
        return (
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 text-center">
                <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                    alt="GitHub" className="w-10 h-10 invert mx-auto mb-4 opacity-50" />
                <p className="text-slate-500 text-sm">
                    {error || 'No GitHub bounties available'}
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 text-xs bg-slate-800 text-slate-400 px-4 py-2 rounded-lg hover:text-white transition"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                        alt="GitHub Logo" className="w-5 h-5 invert" />
                    <h3 className="text-white font-bold">Live GitHub Bounties</h3>
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                        {bounties.length} Open
                    </span>
                </div>
                <span className="text-xs text-slate-500">Updated live</span>
            </div>

            {/* Bounty List */}
            <div className="divide-y divide-slate-800 max-h-[500px] overflow-y-auto">
                <AnimatePresence>
                    {bounties.map((bounty, i) => (
                        <motion.a
                            key={bounty.id}
                            href={bounty.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="block p-4 hover:bg-slate-800/50 transition cursor-pointer"
                            onClick={(e) => {
                                if (onBountyClick) {
                                    e.preventDefault();
                                    onBountyClick(bounty);
                                }
                            }}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    {/* Title */}
                                    <h4 className="text-sm font-medium text-white truncate mb-1">
                                        {bounty.title}
                                    </h4>

                                    {/* Repo & Meta */}
                                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                                        <span className="flex items-center gap-1">
                                            <span>📁</span>
                                            <span className="text-cyan-400">{bounty.repo}</span>
                                        </span>
                                        {bounty.repoStars > 0 && (
                                            <span className="flex items-center gap-1">
                                                <span>⭐</span>
                                                {bounty.repoStars.toLocaleString()}
                                            </span>
                                        )}
                                        <span className={languageColors[bounty.language] || languageColors.default}>
                                            {bounty.language}
                                        </span>
                                    </div>

                                    {/* Labels */}
                                    <div className="flex flex-wrap gap-1">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${difficultyColors[bounty.difficulty]}`}>
                                            {bounty.difficulty}
                                        </span>
                                        {bounty.labels.slice(0, 2).map((label, j) => (
                                            <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                                                {label}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Reward */}
                                <div className="text-right flex-shrink-0">
                                    <span className={`font-mono font-bold ${bounty.rewardAmount > 0 ? 'text-emerald-400' : 'text-slate-400'
                                        }`}>
                                        {bounty.reward}
                                    </span>
                                    <p className="text-[10px] text-slate-500 mt-1">
                                        #{bounty.issueNumber}
                                    </p>
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-800/50 border-t border-slate-700 text-center">
                <a
                    href="https://github.com/search?q=label%3Abounty+is%3Aopen&type=Issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition"
                >
                    View all on GitHub →
                </a>
            </div>
        </div>
    );
};

export default GitHubBounties;
