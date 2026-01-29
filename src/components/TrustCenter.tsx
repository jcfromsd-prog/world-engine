import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TrustCenter: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans pt-20 pb-20">
            <div className="max-w-6xl mx-auto px-4">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-block bg-emerald-900/30 border border-emerald-500/30 rounded-full px-4 py-1 mb-6">
                        <span className="text-emerald-400 text-xs font-bold tracking-widest uppercase">World Engine Trust & Safety</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6">
                        BUILT ON <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">ZERO TRUST</span>.
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        We don't ask you to trust us. We use cryptographic proofs, escrowed funds, and isolated sandboxes so you don't have to.
                    </p>
                </motion.div>

                {/* Live Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
                    {[
                        { label: 'Avg Payout Time', value: '24 Hours', icon: '⚡', color: 'text-yellow-400' },
                        { label: 'Dispute Rate', value: '< 0.8%', icon: '⚖️', color: 'text-emerald-400' },
                        { label: 'Funds in Escrow', value: '$450k+', icon: '🔒', color: 'text-cyan-400' },
                        { label: 'Uptime', value: '99.99%', icon: '🟢', color: 'text-purple-400' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl text-center"
                        >
                            <div className="text-2xl mb-2">{stat.icon}</div>
                            <div className={`text-2xl md:text-3xl font-black ${stat.color} mb-1`}>{stat.value}</div>
                            <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Core Pillars */}
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    {/* Financial Security */}
                    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-emerald-500/30 transition-all group">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Escrowed Payments</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            Funds are locked in Stripe Connect Escrow before work begins. Clients cannot "ghost" you. Upon code approval, funds are released to your wallet instantly.
                        </p>
                        <ul className="text-xs text-slate-500 space-y-2">
                            <li className="flex items-center gap-2">✓ Stripe Identity Verification</li>
                            <li className="flex items-center gap-2">✓ USDC / USD Settlement</li>
                        </ul>
                    </div>

                    {/* Data Security */}
                    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-cyan-500/30 transition-all group">
                        <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors">
                            <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Ephemeral Sandboxes</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            You never touch the client's production DB. All code runs in isolated Firecracker microVMs with synthetic data overlays.
                        </p>
                        <ul className="text-xs text-slate-500 space-y-2">
                            <li className="flex items-center gap-2">✓ Auto-Sanitized Logs</li>
                            <li className="flex items-center gap-2">✓ 15-Minute Session Timeouts</li>
                        </ul>
                    </div>

                    {/* Legal Security */}
                    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-purple-500/30 transition-all group">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Fair IP Transfer</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            Standardized "Work for Hire" contracts. You retain "Prestige Rights" (proof you solved it) while the client gets the IP.
                        </p>
                        <ul className="text-xs text-slate-500 space-y-2">
                            <li className="flex items-center gap-2">✓ Automated 1099 Generation</li>
                            <li className="flex items-center gap-2">✓ Dispute Resolution Council</li>
                        </ul>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {[
                            { q: "When do I get paid?", a: "Funds are released immediately to your World Engine wallet upon code approval. You can withdraw to Bank or Crypto instantly." },
                            { q: "What happens if a client rejects my work?", a: "If you believe the rejection is unfair, you can escalate to the 'Guardian Council' for a peer review. If your code meets spec, you get paid from the escrow." },
                            { q: "Is this legal in my country?", a: "Yes. We operate under US Law as a marketplace. You are responsible for local taxes, but we provide all necessary export documentation." },
                            { q: "How does the rep system work?", a: "Your reputation is stored on-chain. It cannot be edited by us or clients. It is mathematically derived from your successful merges." }
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
                                <h4 className="text-white font-bold mb-2">{item.q}</h4>
                                <p className="text-slate-400 text-sm">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="text-center mt-20">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition">
                        <span>← Back to Mission Control</span>
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default TrustCenter;
