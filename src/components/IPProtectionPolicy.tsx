import React from 'react';
import { Link } from 'react-router-dom';

const IPProtectionPolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white py-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <Link to="/" className="text-cyan-400 hover:text-cyan-300 text-sm mb-4 inline-block">← Back to Home</Link>
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-4xl">🛡️</span>
                        <h1 className="text-4xl font-black">IP Protection Policy</h1>
                    </div>
                    <p className="text-slate-400">World Engine's Zero-Trust architecture for sensitive data.</p>
                    <p className="text-xs text-slate-600 mt-2">Last updated: January 2026 • Guardian Protocol v2.0</p>
                </div>

                {/* Content */}
                <div className="space-y-10">
                    {/* Section 1 */}
                    <section className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800">
                        <h2 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-3">
                            <span className="text-3xl">🔒</span> 1. Data Compartmentalization
                        </h2>
                        <div className="space-y-4 text-slate-300">
                            <div className="bg-slate-800/50 rounded-lg p-4 border-l-4 border-cyan-500">
                                <h3 className="font-bold text-white mb-1">Secure Environment</h3>
                                <p className="text-sm">All work on sensitive bounties must be performed within the Secure Sandbox Environment provided by the World Engine.</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-4 border-l-4 border-yellow-500">
                                <h3 className="font-bold text-white mb-1">No Local Storage</h3>
                                <p className="text-sm">Solvers are strictly prohibited from downloading, exporting, or locally storing any raw dataset provided by a Client.</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-4 border-l-4 border-emerald-500">
                                <h3 className="font-bold text-white mb-1">Ephemeral Access</h3>
                                <p className="text-sm">Access to sensitive data is session-based and automatically revoked once a bounty is submitted or the timer expires.</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800">
                        <h2 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-3">
                            <span className="text-3xl">🤖</span> 2. Automated Sanitization
                        </h2>
                        <div className="space-y-4 text-slate-300">
                            <div className="bg-slate-800/50 rounded-lg p-4 border-l-4 border-purple-500">
                                <h3 className="font-bold text-white mb-1">PII Masking</h3>
                                <p className="text-sm">Before a dataset is released to the Global Feed, Engine Sage automatically scrubs all Personally Identifiable Information (PII) to ensure privacy compliance.</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-4 border-l-4 border-purple-500">
                                <h3 className="font-bold text-white mb-1">Synthetic Overlays</h3>
                                <p className="text-sm">For highly sensitive cybersecurity tasks, the World Engine may use synthetic data overlays that allow Solvers to fix logic errors without seeing actual production secrets.</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800">
                        <h2 className="text-2xl font-bold text-emerald-400 mb-4 flex items-center gap-3">
                            <span className="text-3xl">📜</span> 3. Ownership & Transfer
                        </h2>
                        <div className="space-y-4 text-slate-300">
                            <div className="bg-slate-800/50 rounded-lg p-4 border-l-4 border-emerald-500">
                                <h3 className="font-bold text-white mb-1">Work for Hire</h3>
                                <p className="text-sm">All solutions created on the World Engine are considered "Work for Hire." Full Intellectual Property rights transfer to the Client immediately upon Stripe payout.</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-4 border-l-4 border-emerald-500">
                                <h3 className="font-bold text-white mb-1">Prestige Rights</h3>
                                <p className="text-sm">The Solver retains a "Proof of Achievement" (non-disclosable prestige) which serves as their verifiable record of skill without revealing the Client's proprietary logic.</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section className="bg-slate-900/50 rounded-2xl p-8 border border-red-900/50">
                        <h2 className="text-2xl font-bold text-red-400 mb-4 flex items-center gap-3">
                            <span className="text-3xl">⚔️</span> 4. Enforcement (Guardian Protocol)
                        </h2>
                        <div className="space-y-4 text-slate-300">
                            <div className="bg-red-900/20 rounded-lg p-4 border-l-4 border-red-500">
                                <h3 className="font-bold text-white mb-1">Real-Time Monitoring</h3>
                                <p className="text-sm">The Guardian Protocol monitors for "Data Exfiltration" patterns including unauthorized copy-pasting or screenshots.</p>
                            </div>
                            <div className="bg-red-900/20 rounded-lg p-4 border-l-4 border-red-500">
                                <h3 className="font-bold text-white mb-1">Penalty Logic</h3>
                                <p className="text-sm">Any breach of this IP policy results in an <strong>immediate Reputation Reset</strong> and <strong>forfeiture of all pending Bounty Payments</strong>.</p>
                            </div>
                        </div>
                    </section>

                    {/* Security Levels */}
                    <section className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800">
                        <h2 className="text-2xl font-bold text-white mb-6">Security Levels</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 text-center">
                                <span className="text-3xl">🔒</span>
                                <h3 className="font-bold text-cyan-400 mt-2">Standard</h3>
                                <p className="text-xs text-slate-400 mt-1">Session-based access, no local storage</p>
                            </div>
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
                                <span className="text-3xl">🛡️</span>
                                <h3 className="font-bold text-yellow-400 mt-2">Sensitive</h3>
                                <p className="text-xs text-slate-400 mt-1">Sandbox required, PII masked</p>
                            </div>
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
                                <span className="text-3xl">⚔️</span>
                                <h3 className="font-bold text-red-400 mt-2">Critical</h3>
                                <p className="text-xs text-slate-400 mt-1">Zero-Trust, synthetic data, Guardian active</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-slate-800 text-center">
                    <p className="text-slate-500 text-sm">Questions about our security policy?</p>
                    <a href="mailto:security@worldengine.io" className="text-cyan-400 hover:underline">security@worldengine.io</a>
                </div>
            </div>
        </div>
    );
};

export default IPProtectionPolicy;
