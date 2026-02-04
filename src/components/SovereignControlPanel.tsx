import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import config from '../data/worldEngineConfig.json';
import GuildBadge from './GuildBadge';
import { ledger } from '../services/LedgerService';

const SovereignControlPanel: React.FC = () => {
    // Real-Time Financials (Zero-Base Truth)
    const grossRevenue = 0;
    const founderTake = 0;

    // UI Tick for re-renders
    const [, setTick] = useState(0);

    // Live ticker removed for launch truth
    useEffect(() => {
        // Future: Connection to Stripe Connect Webhooks
    }, []);

    // Neural Settings
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('GOOGLE_GEMINI_KEY') || import.meta.env.VITE_GOOGLE_GEMINI_KEY || '');

    const handleSaveKey = () => {
        if (!apiKey.trim()) return;
        localStorage.setItem('GOOGLE_GEMINI_KEY', apiKey);
        alert('Neural Core Connected. Key Saved.');
    };

    const formatMoney = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    // Descriptions for the tooltip/legend map
    const SPLIT_DESCRIPTIONS: Record<string, string> = {
        founderLevy: "Platform Revenue: Founder income, legal defense, and operations.",
        leadSolver: "Architect Share: The primary executor of the bounty.",
        supportSquad: "Collaboration Share: Distributed to peer-reviewers and scribes.",
        aiCompute: "AI Maintenance: Direct funding for AI API tokens (Sage/Auditor).",
        growthFund: "Growth Fund: Viral acquisition and user rewards."
    };

    return (
        <div className="min-h-screen bg-slate-950 p-8 pt-32 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto space-y-8"
            >
                {/* Header */}
                <div className="flex justify-between items-end border-b border-red-500/30 pb-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight">SOVEREIGN CONTROL PANEL</h1>
                        <p className="text-red-500 font-mono font-bold tracking-widest text-xs mt-2 uppercase">
                            {config.platformName} | Master Access Granted
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-2 justify-end mb-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-green-500 font-bold text-xs uppercase">Engine Online</span>
                        </div>
                        <div className="text-xs text-slate-500 font-mono">MyBestPurpose.com</div>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-lg">
                        <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Total Gross Volume</div>
                        <div className="text-3xl font-mono text-white font-bold">{formatMoney(grossRevenue)}</div>
                        <div className="text-[10px] text-green-500 mt-1">▲ +2.4% this week</div>
                    </div>
                    <div className="p-6 bg-slate-900/50 border border-red-900/30 rounded-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10 text-9xl">🏛️</div>
                        <div className="text-xs text-red-400 uppercase tracking-widest font-bold mb-2">Sovereign Revenue (15%)</div>
                        <div className="text-3xl font-mono text-white font-bold">{formatMoney(founderTake)}</div>
                        <div className="text-[10px] text-red-400/60 mt-1">Founder Operations & Legal</div>
                    </div>
                    <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-lg">
                        <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Active Solvers</div>
                        <div className="text-3xl font-mono text-white font-bold">1</div>
                        <div className="text-[10px] text-cyan-500 mt-1">Founder (You)</div>
                    </div>
                    <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-lg">
                        <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Verification Standard</div>
                        <div className="text-xl font-mono text-white font-bold truncate">{config.verificationStandard}</div>
                        <div className="text-[10px] text-emerald-500 mt-1">Rigid Quality Gate</div>
                    </div>
                </div>

                {/* Economic Engine Visualization */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* The Splits */}
                    <div className="p-8 bg-black border border-slate-800 rounded-xl relative">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span>💸</span> Economic Distribution Protocol
                        </h2>

                        <div className="space-y-6">
                            {Object.entries(config.economicModel).map(([key, value]) => {
                                const percentage = (value * 100);
                                return (
                                    <div key={key} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white capitalize font-bold">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                            <span className="font-mono text-cyan-400">{percentage}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${key === 'founderLevy' ? 'bg-red-500' : 'bg-cyan-500'}`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 italic">
                                            {SPLIT_DESCRIPTIONS[key] || "Economic allocation."}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Neural Workforce */}
                    <div className="p-8 bg-black border border-slate-800 rounded-xl">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span>🧠</span> Neural Workforce (Guilds)
                        </h2>
                        <div className="grid gap-4">
                            {config.guilds.map((guildId) => (
                                <GuildBadge key={guildId} id={guildId} showDescription={true} />
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-900 flex justify-between items-center text-xs text-slate-500 font-mono">
                            <span>JOB SOURCE API: ADZUNA/JOOBLE</span>
                            <span className="text-green-500">CONNECTED 🟢</span>
                        </div>
                    </div>
                </div>

                {/* NEURAL ARCHITECTURE SETTINGS */}
                <div className="border-t border-slate-900 pt-8 mt-12 mb-12">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 justify-center">
                        <span>🧬</span> Neural Architecture Settings
                    </h2>
                    <div className="max-w-xl mx-auto p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
                        <label className="block text-xs uppercase text-slate-500 font-bold mb-2">Google Gemini API Key</label>
                        <div className="flex gap-2">
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="AIzaSy..."
                                className="flex-1 bg-black border border-slate-700 rounded px-3 py-2 text-white font-mono text-sm focus:border-cyan-500 outline-none"
                            />
                            <button
                                onClick={handleSaveKey}
                                className="px-4 py-2 bg-cyan-900/20 text-cyan-500 border border-cyan-900/50 rounded font-bold text-xs hover:bg-cyan-900/40"
                            >
                                ACTIVATE
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-600 mt-2">
                            Providing a key enables "Sage" to generate dynamic responses. Key is stored locally.
                        </p>
                    </div>
                </div>

                {/* Footer / Clause */}
                <div className="border-t border-slate-900 pt-8 mt-12 text-center space-y-4">
                    <p className="text-slate-600 text-sm max-w-2xl mx-auto italic">
                        "Clause of Founder Sovereignty: The Founder retains absolute control over the platform's economic levers. Participation in the World Engine constitutes a contract for service, not equity. This is a vision-led entity, not a democracy."
                    </p>

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => {
                                const newStatus = !ledger.getSystemStatus();
                                ledger.setSystemFrozen(newStatus);
                                // Force re-render (quick hack for demo, ideally use listener)
                                setTick(prev => prev + 1);
                                alert(newStatus ? 'EMERGENCY PROTOCOL ACTIVATED: SYSTEM FROZEN' : 'SYSTEM RESTORED: ONLINE');
                            }}
                            className={`${ledger.getSystemStatus() ? 'bg-red-600 text-white animate-pulse' : 'bg-red-900/20 text-red-500 hover:bg-red-900/40'} border border-red-900/50 px-4 py-2 rounded text-xs font-bold font-mono tracking-widest uppercase transition-colors`}
                        >
                            {ledger.getSystemStatus() ? '⚠️ SYSTEM LOCKDOWN ACTIVE ⚠️' : 'Emergency Protocol: Kill Switch'}
                        </button>
                        <button className="bg-cyan-900/20 hover:bg-cyan-900/40 text-cyan-500 border border-cyan-900/50 px-4 py-2 rounded text-xs font-bold font-mono tracking-widest uppercase transition-colors">
                            Manual Calibration
                        </button>
                    </div>
                </div>
            </motion.div >
        </div >
    );
};

export default SovereignControlPanel;
