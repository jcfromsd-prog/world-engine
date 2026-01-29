import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StatsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<'categories' | 'recent'>('categories');

    const categories = [
        { name: 'Technology', amount: '$18.5M', percent: 41, color: 'cyan' },
        { name: 'Clean Energy', amount: '$12.2M', percent: 27, color: 'green' },
        { name: 'Healthcare', amount: '$8.1M', percent: 18, color: 'purple' },
        { name: 'Education', amount: '$4.2M', percent: 9, color: 'yellow' },
        { name: 'Other', amount: '$2.0M', percent: 5, color: 'gray' },
    ];

    const recentPayouts = [
        { solver: 'quantum_dev', bounty: 'Neural API Optimization', amount: '$12,500', time: '2h ago' },
        { solver: 'climate_coder', bounty: 'Carbon Tracking Module', amount: '$8,200', time: '5h ago' },
        { solver: 'data_sage', bounty: 'ML Pipeline Refactor', amount: '$15,000', time: '8h ago' },
        { solver: 'secure_ops', bounty: 'Zero-Day Patch', amount: '$25,000', time: '12h ago' },
        { solver: 'frontend_ace', bounty: 'Dashboard Redesign', amount: '$6,800', time: '1d ago' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg mx-4 overflow-hidden"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 p-6 border-b border-slate-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-purple-400 uppercase tracking-widest font-bold">Total Distributed</p>
                                    <h2 className="text-4xl font-black text-white mt-1">$45,000,000</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-slate-400 hover:text-white transition p-2"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-slate-700">
                            <button
                                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition ${activeTab === 'categories'
                                        ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-400/5'
                                        : 'text-slate-500 hover:text-white'
                                    }`}
                                onClick={() => setActiveTab('categories')}
                            >
                                By Category
                            </button>
                            <button
                                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition ${activeTab === 'recent'
                                        ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-400/5'
                                        : 'text-slate-500 hover:text-white'
                                    }`}
                                onClick={() => setActiveTab('recent')}
                            >
                                Recent Payouts
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 max-h-80 overflow-y-auto">
                            {activeTab === 'categories' ? (
                                <div className="space-y-4">
                                    {categories.map((cat, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-300 font-medium">{cat.name}</span>
                                                <span className="text-white font-bold">{cat.amount}</span>
                                            </div>
                                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <motion.div
                                                    className={`h-full rounded-full ${cat.color === 'cyan' ? 'bg-cyan-500' :
                                                            cat.color === 'green' ? 'bg-green-500' :
                                                                cat.color === 'purple' ? 'bg-purple-500' :
                                                                    cat.color === 'yellow' ? 'bg-yellow-500' : 'bg-gray-500'
                                                        }`}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${cat.percent}%` }}
                                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentPayouts.map((payout, i) => (
                                        <motion.div
                                            key={i}
                                            className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <div>
                                                <p className="text-white font-medium text-sm">{payout.bounty}</p>
                                                <p className="text-xs text-slate-500">@{payout.solver} • {payout.time}</p>
                                            </div>
                                            <span className="text-green-400 font-bold">{payout.amount}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-slate-700 bg-slate-800/50">
                            <p className="text-xs text-slate-500 text-center">
                                Live data from the World Engine Treasury • Updated every 15 minutes
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StatsModal;
