import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReferralModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ReferralModal: React.FC<ReferralModalProps> = ({ isOpen, onClose }) => {
    const referralLink = "worldengine.ai/join?ref=agent_007";

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        alert("Link copied to clipboard!");
    };

    const handleShare = (platform: 'twitter' | 'linkedin') => {
        const text = encodeURIComponent("I'm earning protocol fees solving hard engineering problems on World Engine. Join my Squad:");
        const url = encodeURIComponent(referralLink);

        if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
        } else {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-800 bg-slate-900">
                            <h2 className="text-2xl font-bold text-white mb-1">Expand Your Squad</h2>
                            <p className="text-slate-400 text-sm">Earn 5% of your squad's protocol fees for 1 year.</p>
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 text-slate-500 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">

                            {/* Link Generator */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Your Unique Invite Link</label>
                                <div className="flex gap-2">
                                    <div className="flex-1 bg-black border border-slate-700 rounded-lg px-4 py-3 text-cyan-400 font-mono text-sm truncate">
                                        {referralLink}
                                    </div>
                                    <button
                                        onClick={handleCopy}
                                        className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-lg border border-slate-700 transition"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>

                            {/* Share Buttons */}
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleShare('twitter')}
                                    className="flex items-center justify-center gap-2 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] border border-[#1DA1F2]/30 font-bold py-3 rounded-xl transition"
                                >
                                    <span>🐦</span> Share on X
                                </button>
                                <button
                                    onClick={() => handleShare('linkedin')}
                                    className="flex items-center justify-center gap-2 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] border border-[#0A66C2]/30 font-bold py-3 rounded-xl transition"
                                >
                                    <span>💼</span> Share on LinkedIn
                                </button>
                            </div>

                            {/* Recent Invites */}
                            <div>
                                <h4 className="text-white font-bold text-sm mb-4">Recent Invites</h4>
                                <div className="space-y-3">
                                    {[
                                        { name: 'alex_dev', status: 'Joined', date: '2h ago', earnings: '$0.00' },
                                        { name: 'sarah_k', status: 'Pending', date: '5h ago', earnings: '-' },
                                        { name: 'crypto_nomad', status: 'Joined', date: '1d ago', earnings: '$12.50' },
                                    ].map((invite, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                                                    {invite.name[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-white text-sm font-medium">{invite.name}</div>
                                                    <div className="text-slate-500 text-xs">{invite.date}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-xs font-bold ${invite.status === 'Joined' ? 'text-emerald-400' : 'text-yellow-500'
                                                    }`}>
                                                    {invite.status}
                                                </div>
                                                {invite.status === 'Joined' && (
                                                    <div className="text-emerald-500/60 text-[10px]">{invite.earnings} Earned</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ReferralModal;
