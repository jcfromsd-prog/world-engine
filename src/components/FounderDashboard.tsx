import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GOVERNANCE_PARAMETERS } from '../utils/economics';

interface SovereignDashboardProps {
    onClose: () => void;
}

const SovereignDashboard: React.FC<SovereignDashboardProps> = ({ onClose }) => {
    // State for the "Master Dials"
    const [params, setParams] = useState(GOVERNANCE_PARAMETERS);
    const [engineStatus, setEngineStatus] = useState<"ACTIVE" | "MAINTENANCE" | "LOCKED">("ACTIVE");
    const [activeTab, setActiveTab] = useState<'pulse' | 'control' | 'flow'>('pulse');

    // Mock Data for Financial Pulse
    const financialPulse = {
        gnv: 100000,
        revenue: 15000,
        compute: 5000,
        growth: 5000,
        payouts: 75000
    };

    // Mock Data for Ledger
    const ledger = [
        { id: 'TX_992', source: 'CleanEnergy Corp', amount: 100, task: 'Data Cleanup', time: '14:02:11' },
        { id: 'TX_993', source: 'Stripe Open Source', amount: 450, task: 'Security Audit', time: '14:05:33' },
        { id: 'TX_994', source: 'GreenPeace', amount: 1200, task: 'Platform Migration', time: '14:12:05' },
    ];

    return (
        <div className="fixed inset-0 z-[100] bg-black text-green-500 font-mono overflow-y-auto selection:bg-green-900 selection:text-white">
            {/* TERMINAL HEADER */}
            <div className="sticky top-0 bg-black border-b border-green-900/50 p-4 flex justify-between items-center px-6 z-20">
                <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <div>
                        <h1 className="text-xl font-bold tracking-widest uppercase">Sovereign Command Center</h1>
                        <p className="text-[10px] text-green-700">ROOT ACCESS_GRANTED // ID: FOUNDER_01</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                        <div className="text-xs text-green-800">SYSTEM TIME</div>
                        <div className="text-sm">2026-01-29T15:39:42</div>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-green-700 hover:bg-green-900/40 text-xs uppercase"
                    >
                        [ Exit God Mode ]
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT COLUMN: NAVIGATION & STATUS */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="border border-green-900 p-4 bg-green-950/5">
                        <div className="text-xs text-green-700 mb-2 uppercase">Engine Status</div>
                        <div className={`text-2xl font-black mb-4 ${engineStatus === 'ACTIVE' ? 'text-green-400' :
                                engineStatus === 'MAINTENANCE' ? 'text-yellow-400' : 'text-red-500'
                            }`}>
                            {engineStatus}
                        </div>
                        <div className="flex gap-2">
                            {['ACTIVE', 'MAINTENANCE', 'LOCKED'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setEngineStatus(status as any)}
                                    className={`flex-1 py-1 text-[10px] border ${engineStatus === status ? 'bg-green-500 text-black border-green-500' : 'border-green-800 text-green-800 hover:border-green-600'
                                        }`}
                                >
                                    {status.substring(0, 4)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {[
                            { id: 'pulse', label: '1. Financial Pulse', icon: '📊' },
                            { id: 'control', label: '2. Sovereign Control', icon: '🎛️' },
                            { id: 'flow', label: '3. Tactical Ledger', icon: '💸' },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as any)}
                                className={`w-full text-left p-3 border-l-2 transition-all ${activeTab === item.id
                                        ? 'border-green-500 bg-green-900/20 text-green-400'
                                        : 'border-transparent text-green-800 hover:text-green-600'
                                    }`}
                            >
                                <span className="mr-3">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="border border-green-900 p-4 mt-auto">
                        <h3 className="text-xs text-green-700 mb-3 border-b border-green-900 pb-1">ALERTS_LOG</h3>
                        <div className="space-y-2 text-[10px]">
                            <div className="flex justify-between text-yellow-600">
                                <span>[WARN]</span>
                                <span>Leakage Alert: Task #442</span>
                            </div>
                            <div className="flex justify-between text-green-800">
                                <span>[INFO]</span>
                                <span>New Node: GreenPeace</span>
                            </div>
                            <div className="flex justify-between text-green-800">
                                <span>[INFO]</span>
                                <span>Payout Batch #992 Executed</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT AREA */}
                <div className="lg:col-span-9 min-h-[600px] border border-green-900 p-8 bg-black relative">
                    {/* Background Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,50,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,50,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                    <AnimatePresence mode="wait">

                        {/* VIEW 1: FINANCIAL PULSE */}
                        {activeTab === 'pulse' && (
                            <motion.div
                                key="pulse"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="relative z-10"
                            >
                                <h2 className="text-2xl mb-8 border-b border-green-800 pb-2 flex justify-between">
                                    <span>MACRO_FINANCIAL_VIEW</span>
                                    <span className="text-sm self-end">GNV: ${financialPulse.gnv.toLocaleString()}</span>
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                                    <div className="border border-green-500 p-4 bg-green-900/10">
                                        <div className="text-xs text-green-400 mb-1">FOUNDER REVENUE (15%)</div>
                                        <div className="text-3xl font-bold">${financialPulse.revenue.toLocaleString()}</div>
                                        <div className="text-[10px] text-green-700 mt-2">OPERATIONS_VAULT</div>
                                    </div>
                                    <div className="border border-green-800 p-4">
                                        <div className="text-xs text-green-600 mb-1">COMPUTE TREASURY (5%)</div>
                                        <div className="text-2xl font-bold text-green-700">${financialPulse.compute.toLocaleString()}</div>
                                        <div className="text-[10px] text-green-800 mt-2">OPENAI / ANTHROPIC</div>
                                    </div>
                                    <div className="border border-green-800 p-4">
                                        <div className="text-xs text-green-600 mb-1">GROWTH FUND (5%)</div>
                                        <div className="text-2xl font-bold text-green-700">${financialPulse.growth.toLocaleString()}</div>
                                        <div className="text-[10px] text-green-800 mt-2">USER_ACQUISITION</div>
                                    </div>
                                    <div className="border border-green-800 p-4">
                                        <div className="text-xs text-green-600 mb-1">SOLVER PAYOUTS (75%)</div>
                                        <div className="text-2xl font-bold text-green-700">${financialPulse.payouts.toLocaleString()}</div>
                                        <div className="text-[10px] text-green-800 mt-2">DISTRIBUTED_VALUE</div>
                                    </div>
                                </div>

                                <div className="border border-green-900 p-6">
                                    <h3 className="text-sm mb-4 text-green-400">BENEFICIARY_TRACKER</h3>
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-green-900 text-green-700">
                                                <th className="pb-2">ORGANIZATION</th>
                                                <th className="pb-2">SOLVES</th>
                                                <th className="pb-2">VALUE_CREATED</th>
                                                <th className="pb-2 text-right">STATUS</th>
                                            </tr>
                                        </thead>
                                        <tbody className="font-mono">
                                            <tr className="border-b border-green-900/30">
                                                <td className="py-3">Stripe Open Source</td>
                                                <td>8</td>
                                                <td>$12,000.00</td>
                                                <td className="text-right text-green-400">ACTIVE</td>
                                            </tr>
                                            <tr className="border-b border-green-900/30">
                                                <td className="py-3">GreenPeace</td>
                                                <td>12</td>
                                                <td>$4,500.00</td>
                                                <td className="text-right text-green-400">ACTIVE</td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 text-yellow-600">CleanEnergy Corp</td>
                                                <td className="text-yellow-600">1</td>
                                                <td className="text-yellow-600">$100.00</td>
                                                <td className="text-right text-yellow-600">PENDING</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}

                        {/* VIEW 2: SOVEREIGN CONTROL */}
                        {activeTab === 'control' && (
                            <motion.div
                                key="control"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="relative z-10"
                            >
                                <h2 className="text-2xl mb-8 border-b border-green-800 pb-2">MASTER_DIALS (CONFIG_WRITE_ACCESS)</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        <div>
                                            <label className="flex justify-between text-sm mb-2">
                                                <span>FOUNDER_PLATFORM_FEE</span>
                                                <span className="text-green-400 font-bold">{(params.PLATFORM_FEE * 100).toFixed(0)}%</span>
                                            </label>
                                            <input
                                                type="range"
                                                min="0.05" max="0.50" step="0.01"
                                                value={params.PLATFORM_FEE}
                                                onChange={(e) => setParams({ ...params, PLATFORM_FEE: parseFloat(e.target.value) })}
                                                className="w-full accent-green-500 h-2 bg-green-900 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <p className="text-[10px] text-green-700 mt-1">Direct operational revenue.</p>
                                        </div>

                                        <div>
                                            <label className="flex justify-between text-sm mb-2">
                                                <span>LEAD_SOLVER_SHARE</span>
                                                <span className="text-green-400 font-bold">{(params.LEAD_SOLVER_SHARE * 100).toFixed(0)}%</span>
                                            </label>
                                            <input
                                                type="range"
                                                min="0.30" max="0.80" step="0.01"
                                                value={params.LEAD_SOLVER_SHARE}
                                                onChange={(e) => setParams({ ...params, LEAD_SOLVER_SHARE: parseFloat(e.target.value) })}
                                                className="w-full accent-green-500 h-2 bg-green-900 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <p className="text-[10px] text-green-700 mt-1">Incentive for primary architects.</p>
                                        </div>

                                        <div>
                                            <label className="flex justify-between text-sm mb-2">
                                                <span>ENGINE_COMPUTE_TREASURY</span>
                                                <span className="text-green-400 font-bold">{(params.COMPUTE_FEE * 100).toFixed(0)}%</span>
                                            </label>
                                            <input
                                                type="range"
                                                min="0.01" max="0.20" step="0.01"
                                                value={params.COMPUTE_FEE}
                                                onChange={(e) => setParams({ ...params, COMPUTE_FEE: parseFloat(e.target.value) })}
                                                className="w-full accent-green-500 h-2 bg-green-900 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <p className="text-[10px] text-green-700 mt-1">Reserve for AI API costs.</p>
                                        </div>
                                    </div>

                                    <div className="border border-green-900 p-6 flex flex-col justify-center items-center text-center bg-black">
                                        <div className="text-4xl mb-4">⚠️</div>
                                        <h3 className="text-lg font-bold text-red-500 mb-2">DANGER ZONE</h3>
                                        <p className="text-xs text-green-700 mb-6 max-w-xs">
                                            Changing parameters will immediately affect Smart Contract logic for all NEW bounties. Existing escrows remain locked.
                                        </p>
                                        <button className="px-8 py-4 bg-red-900/20 text-red-500 border border-red-900 hover:bg-red-900/40 uppercase tracking-widest font-bold">
                                            EXECUTE PARAMETER SWAP
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* VIEW 3: TACTICAL LEDGER */}
                        {activeTab === 'flow' && (
                            <motion.div
                                key="flow"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="relative z-10"
                            >
                                <h2 className="text-2xl mb-8 border-b border-green-800 pb-2">TACTICAL_TRIPLE_ENTRY_LEDGER</h2>

                                <div className="space-y-4">
                                    {ledger.map((tx) => (
                                        <div key={tx.id} className="border border-green-900 p-4 bg-green-950/10 font-mono text-xs">
                                            {/* HEADER */}
                                            <div className="flex justify-between border-b border-green-900 pb-2 mb-3 text-green-700">
                                                <span>[{tx.id}] {tx.time}</span>
                                                <span>SOURCE: {tx.source}</span>
                                                <span className="text-white font-bold">${tx.amount.toFixed(2)}</span>
                                            </div>

                                            {/* FLOW VISUALIZATION */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-80">
                                                <div className="p-2 border-l border-green-800 pl-4">
                                                    <div className="text-[10px] text-green-600 mb-1">INFLOW</div>
                                                    <div className="text-white">${tx.amount.toFixed(2)}</div>
                                                    <div className="text-green-800 italic">{tx.task}</div>
                                                </div>

                                                <div className="p-2 border-l border-green-800 pl-4">
                                                    <div className="text-[10px] text-green-600 mb-1">INTERNAL SPLIT</div>
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between">
                                                            <span>Founder</span>
                                                            <span>${(tx.amount * params.PLATFORM_FEE).toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-green-700">
                                                            <span>Compute</span>
                                                            <span>${(tx.amount * params.COMPUTE_FEE).toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-2 border-l border-green-800 pl-4">
                                                    <div className="text-[10px] text-green-600 mb-1">OUTFLOW</div>
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-white">
                                                            <span>Lead</span>
                                                            <span>${(tx.amount * params.LEAD_SOLVER_SHARE).toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-green-700">
                                                            <span>Squad</span>
                                                            <span>${(tx.amount * params.SQUAD_SHARE).toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default SovereignDashboard;
