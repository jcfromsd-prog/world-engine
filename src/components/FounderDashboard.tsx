import { motion } from 'framer-motion';
import { useEngine } from '../lib/engine';

interface RevenueMetric {
    label: string;
    value: string;
    change: string;
    isPositive: boolean;
    icon: string;
}

interface FounderDashboardProps {
    onClose: () => void;
}

const FounderDashboard: React.FC<FounderDashboardProps> = ({ onClose }) => {
    const { revenue } = useEngine();

    const hourlyVelocity = revenue.velocity;
    const escrowBalance = 156780; // Keeping this static for now, or could compute from Fees

    const metrics: RevenueMetric[] = [
        {
            label: "Monthly Recurring Revenue",
            value: `$${revenue.mrr.toLocaleString()}`,
            change: "+12.4%",
            isPositive: true,
            icon: "📊"
        },
        {
            label: "Active Engine Pass Subs",
            value: "50",
            change: "+8 this week",
            isPositive: true,
            icon: "💳"
        },
        {
            label: "Transaction Fees (MTD)",
            value: `$${revenue.fees.toLocaleString()}`,
            change: "+$1,200 today",
            isPositive: true,
            icon: "💸"
        },
        {
            label: "Marketplace GMV",
            value: `$${revenue.gmv.toLocaleString()}`,
            change: "20% take rate",
            isPositive: true,
            icon: "🏪"
        }
    ];

    const recentTransactions = revenue.transactions;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl overflow-y-auto"
        >
            {/* Header */}
            <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-slate-800 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-3xl">👁️</span>
                        <div>
                            <h1 className="text-2xl font-black text-white">Founder Dashboard</h1>
                            <p className="text-xs text-slate-500 font-mono tracking-wider">GOD MODE • ADMIN ONLY</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
                    >
                        Exit God Mode
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Live Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {/* Hourly Velocity */}
                    <motion.div
                        className="bg-gradient-to-br from-emerald-500/20 to-emerald-900/20 border border-emerald-500/30 rounded-2xl p-6"
                        animate={{ boxShadow: ["0 0 20px rgba(16,185,129,0.2)", "0 0 40px rgba(16,185,129,0.4)", "0 0 20px rgba(16,185,129,0.2)"] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-emerald-400 font-bold tracking-widest">⚡ LIVE VELOCITY</span>
                            <span className="text-xs text-emerald-400 animate-pulse">● LIVE</span>
                        </div>
                        <div className="text-4xl font-mono font-bold text-white mb-1">
                            ${hourlyVelocity.toLocaleString()}
                        </div>
                        <p className="text-sm text-slate-400">Revenue in the last 60 minutes</p>
                    </motion.div>

                    {/* Escrow Balance */}
                    <motion.div
                        className="bg-gradient-to-br from-purple-500/20 to-purple-900/20 border border-purple-500/30 rounded-2xl p-6"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-purple-400 font-bold tracking-widest">🔒 ESCROW BALANCE</span>
                            <span className="text-xs text-purple-400">Held for active bounties</span>
                        </div>
                        <div className="text-4xl font-mono font-bold text-white mb-1">
                            ${escrowBalance.toLocaleString()}
                        </div>
                        <p className="text-sm text-slate-400">Includes $5,000 Gauntlet prize pool</p>
                    </motion.div>
                </div>

                {/* Revenue Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {metrics.map((metric, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-slate-900/50 border border-slate-800 rounded-xl p-5"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">{metric.icon}</span>
                                <span className="text-xs text-slate-500 uppercase tracking-wider">{metric.label}</span>
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
                            <div className={`text-sm ${metric.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                                {metric.change}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Revenue Breakdown Chart Placeholder */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Revenue Split */}
                    <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Revenue Split</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-400">Engine Pass Subscriptions</span>
                                    <span className="text-white font-mono">$24,950 (59%)</span>
                                </div>
                                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: '59%' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-400">Transaction Fees</span>
                                    <span className="text-white font-mono">$8,420 (20%)</span>
                                </div>
                                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '20%' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-400">Marketplace Commissions</span>
                                    <span className="text-white font-mono">$8,820 (21%)</span>
                                </div>
                                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '21%' }} />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-800">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Total Revenue (MTD)</span>
                                <span className="text-2xl font-bold text-white">$42,190</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Live Feed</h3>
                        <div className="space-y-3">
                            {recentTransactions.map((tx, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${tx.type === 'sub' ? 'bg-cyan-400' :
                                            tx.type === 'bounty' ? 'bg-purple-400' : 'bg-emerald-400'
                                            }`} />
                                        <div>
                                            <div className="text-sm text-white">
                                                {tx.company || tx.creator}
                                            </div>
                                            <div className="text-xs text-slate-500">{tx.time}</div>
                                        </div>
                                    </div>
                                    <span className="text-sm font-mono text-emerald-400">{tx.amount}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Platform Health */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Platform Health</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-cyan-400">847</div>
                            <div className="text-xs text-slate-500">Active Solvers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-400">23</div>
                            <div className="text-xs text-slate-500">Active Bounties</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-emerald-400">98.7%</div>
                            <div className="text-xs text-slate-500">Completion Rate</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-yellow-400">4.2h</div>
                            <div className="text-xs text-slate-500">Avg. Time to Solve</div>
                        </div>
                    </div>
                </div>

            </div>
        </motion.div>
    );
};

export default FounderDashboard;
