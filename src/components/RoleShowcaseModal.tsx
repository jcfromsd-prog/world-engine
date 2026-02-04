import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RoleShowcaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectRole?: (role: string) => void;
}

const ROLES = [
    {
        category: "Writing & Content",
        roleId: "Scribe",
        platforms: "ServiceScape, ProBlogger",
        tasks: "Grant writing, blog posts, white papers, SEO copywriting.",
        icon: "✍️",
        color: "text-emerald-400",
        borderColor: "border-emerald-500/30",
        bgGradient: "from-emerald-900/40 to-slate-900"
    },
    {
        category: "Design & Creative",
        roleId: "Visionary",
        platforms: "99designs, Designhill, Dribbble",
        tasks: "Brand identity, social media graphics, UI/UX audits, pitch decks.",
        icon: "🎨",
        color: "text-pink-400",
        borderColor: "border-pink-500/30",
        bgGradient: "from-pink-900/40 to-slate-900"
    },
    {
        category: "Marketing & SEO",
        roleId: "Strategist",
        platforms: "Aquent, Fiverr",
        tasks: "Ad campaign setup, keyword research, newsletter automation.",
        icon: "🚀",
        color: "text-orange-400",
        borderColor: "border-orange-500/30",
        bgGradient: "from-orange-900/40 to-slate-900"
    },
    {
        category: "Research & Admin",
        roleId: "Strategist", // Using Strategist for general admin/research unless new role needed
        platforms: "Time etc, Belay",
        tasks: "Lead generation, market research, data entry, CRM management.",
        icon: "🔍",
        color: "text-cyan-400",
        borderColor: "border-cyan-500/30",
        bgGradient: "from-cyan-900/40 to-slate-900"
    },
    {
        category: "Social Impact",
        roleId: "Scribe", // Grouping under Scribe or Strategist? Let's use Strategist for 'Strategy'
        platforms: "Goodgigs, Catchafire",
        tasks: "Non-profit strategy, impact reporting, donor outreach.",
        icon: "❤️",
        color: "text-purple-400",
        borderColor: "border-purple-500/30",
        bgGradient: "from-purple-900/40 to-slate-900"
    }
];

const RoleShowcaseModal: React.FC<RoleShowcaseModalProps> = ({ isOpen, onClose, onSelectRole }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-4xl bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Available Opportunity Types</h2>
                            <p className="text-slate-400 text-sm">Select a path to begin your contribution.</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Content Grid */}
                    <div className="p-6 overflow-y-auto grid md:grid-cols-2 gap-4">
                        {ROLES.map((role, idx) => (
                            <motion.div
                                key={role.category}
                                onClick={() => onSelectRole && onSelectRole(role.roleId)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`p-5 rounded-xl border ${role.borderColor} bg-gradient-to-br ${role.bgGradient} relative overflow-hidden group hover:border-white/20 transition-all cursor-pointer hover:scale-[1.02]`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">{role.icon}</span>
                                        <h3 className={`font-bold text-lg ${role.color}`}>{role.category}</h3>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Common Paid Tasks</p>
                                        <p className="text-slate-200 text-sm leading-relaxed">{role.tasks}</p>
                                    </div>

                                    <div className="pt-3 border-t border-white/5">
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Standard Rates</p>
                                        <p className="text-white text-xs font-mono">$25 - $150 per bounty</p>
                                    </div>
                                </div>

                                {/* Hover Effect */}
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </motion.div>
                        ))}
                    </div>

                    {/* Footer CTA */}
                    <div className="p-6 bg-slate-900 border-t border-slate-800 text-center">
                        <button
                            onClick={() => {
                                onClose();
                                const feed = document.getElementById('feed');
                                if (feed) feed.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-cyan-400 transition-colors shadow-lg shadow-white/10"
                        >
                            Explore All Open Bounties
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default RoleShowcaseModal;
