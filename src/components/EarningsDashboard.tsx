import React, { useState } from 'react';
import { motion } from 'framer-motion';

const EarningsDashboard: React.FC = () => {
    const [timeRange, setTimeRange] = useState<'1M' | '6M' | '1Y'>('6M');

    // Mock Data
    const financialState = {
        availableBalance: "$2,450.00",
        pendingBalance: "$850.00",
        totalEarnings: "$14,500.00",
        stripeStatus: 'connected', // 'connected' | 'pending' | 'marketing'
    };

    const transactions = [
        { id: 'tx_1', type: 'payout', amount: '-$1,200.00', status: 'processed', date: 'Oct 24, 2025', desc: 'Transfer to Bank •••• 4242' },
        { id: 'tx_2', type: 'reward', amount: '+$850.00', status: 'pending', date: 'Oct 22, 2025', desc: 'Bounty: Quantum Resistant Ledger' },
        { id: 'tx_3', type: 'reward', amount: '+$2,500.00', status: 'processed', date: 'Oct 15, 2025', desc: 'Bounty: Optimize zk-Rollup' },
        { id: 'tx_4', type: 'reward', amount: '+$450.00', status: 'processed', date: 'Oct 01, 2025', desc: 'fix: Dashboard Performance' },
    ];

    // Simple Bar Chart Visualization (Mock)
    const chartData = [35, 60, 25, 80, 50, 95]; // Heights relative to 100%

    return (
        <div className="min-h-screen bg-black text-white pt-20 pb-20">
            <div className="max-w-5xl mx-auto px-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-black text-white mb-2">Financial Command Center</h1>
                        <p className="text-slate-400">Manage your earnings, payouts, and tax documents.</p>
                    </div>
                    {financialState.stripeStatus === 'connected' ? (
                        <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-sm font-bold text-emerald-400">Stripe Connected</span>
                        </div>
                    ) : (
                        <button className="px-6 py-3 bg-[#635BFF] hover:bg-[#5851DF] text-white font-bold rounded-lg transition-all shadow-lg shadow-[#635BFF]/20 flex items-center gap-2">
                            <span>Connect Stripe</span>
                        </button>
                    )}
                </div>

                {/* Balance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Available */}
                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-24 h-24 text-cyan-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05 1.18 1.91 2.53 1.91 1.29 0 2.13-.72 2.13-1.55 0-.8-.67-1.17-1.98-1.48l-.99-.23c-2.2-.52-3.28-1.75-3.28-3.35 0-1.76 1.29-3.04 2.91-3.38V4h2.67v1.9c1.71.36 3.09 1.58 3.09 3.51h-1.99c-.1-1.23-1.24-1.95-2.6-1.95-1.39 0-2.09.77-2.09 1.57 0 .9.81 1.3 2.14 1.6l.99.23c2.4.58 3.12 1.8 3.12 3.23 0 1.86-1.46 3.05-3.14 3.4z" /></svg>
                        </div>
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Available for Payout</h3>
                        <div className="text-4xl font-mono font-black text-white mb-4">{financialState.availableBalance}</div>
                        <button className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-cyan-400 transition-colors">
                            Internal Transfer
                        </button>
                    </div>

                    {/* Pending */}
                    <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Pending Clearance</h3>
                        <div className="text-4xl font-mono font-black text-slate-400 mb-4">{financialState.pendingBalance}</div>
                        <div className="text-xs text-slate-500">
                            Funds are held in escrow for 7 days after bounty approval.
                        </div>
                    </div>

                    {/* Lifetime */}
                    <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Lifetime Earnings</h3>
                        <div className="text-4xl font-mono font-black text-purple-400 mb-4">{financialState.totalEarnings}</div>
                        <div className="text-xs text-slate-500">
                            Top 5% of Solvers this year.
                        </div>
                    </div>
                </div>

                {/* Main Content Grid: Chart & History */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Col: Analytics */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Chart Container */}
                        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-bold text-white">Income Analysis</h3>
                                <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
                                    {['1M', '6M', '1Y'].map((range) => (
                                        <button
                                            key={range}
                                            onClick={() => setTimeRange(range as any)}
                                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${timeRange === range ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-white'
                                                }`}
                                        >
                                            {range}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Mock Chart Visualization */}
                            <div className="h-64 flex items-end justify-between px-4 gap-4">
                                {chartData.map((height, i) => (
                                    <div key={i} className="w-full bg-slate-800 rounded-t-lg relative group">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${height}%` }}
                                            transition={{ duration: 0.5, delay: i * 0.1 }}
                                            className="w-full bg-gradient-to-t from-cyan-900 to-cyan-500 rounded-t-lg absolute bottom-0 opacity-80 group-hover:opacity-100 transition-opacity"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-4 text-xs font-mono text-slate-500 uppercase">
                                <span>May</span>
                                <span>Jun</span>
                                <span>Jul</span>
                                <span>Aug</span>
                                <span>Sep</span>
                                <span>Oct</span>
                            </div>
                        </div>

                        {/* Payout Methods */}
                        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-white">Payout Methods</h3>
                                <button className="text-cyan-400 text-sm font-bold hover:underline">Manage in Stripe ↗</button>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-slate-950 border border-slate-800 rounded-xl">
                                <div className="w-10 h-6 bg-slate-700 rounded flex items-center justify-center text-[10px] font-bold text-white">BANK</div>
                                <div className="flex-1">
                                    <div className="text-white font-mono text-sm">Chase Bank •••• 4242</div>
                                    <div className="text-xs text-slate-500">Instant Payouts Enabled</div>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Transaction List */}
                    <div className="lg:col-span-1">
                        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl h-full">
                            <h3 className="font-bold text-white mb-6">Recent Transactions</h3>
                            <div className="space-y-4">
                                {transactions.map((tx) => (
                                    <div key={tx.id} className="flex items-start justify-between pb-4 border-b border-slate-800 last:border-0 last:pb-0">
                                        <div>
                                            <div className="text-white font-bold text-sm mb-1">{tx.desc}</div>
                                            <div className="text-xs text-slate-500 mb-1">{tx.date}</div>
                                            <div className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded inline-block ${tx.status === 'processed'
                                                ? 'bg-emerald-500/10 text-emerald-400'
                                                : 'bg-yellow-500/10 text-yellow-400'
                                                }`}>
                                                {tx.status}
                                            </div>
                                        </div>
                                        <div className={`font-mono font-bold ${tx.type === 'payout' ? 'text-slate-400' : 'text-white'
                                            }`}>
                                            {tx.amount}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-2 border border-slate-700 rounded-lg text-slate-400 text-sm font-bold hover:text-white hover:bg-slate-800 transition-colors">
                                View All History
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EarningsDashboard;
