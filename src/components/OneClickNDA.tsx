import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OneClickNDAProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
    bountyTitle: string;
    clientName?: string;
    securityLevel?: 'standard' | 'sensitive' | 'critical';
}

const securityConfig = {
    standard: {
        icon: '🔒',
        label: 'Standard Protection',
        restrictions: ['No local storage', 'Session-based access']
    },
    sensitive: {
        icon: '🛡️',
        label: 'Sensitive Data',
        restrictions: ['Secure Sandbox only', 'PII auto-masked', 'No screenshots']
    },
    critical: {
        icon: '⚔️',
        label: 'Critical Security',
        restrictions: ['Zero-Trust environment', 'Synthetic data overlay', 'Real-time monitoring', 'Guardian Protocol active']
    }
};

const OneClickNDA: React.FC<OneClickNDAProps> = ({
    isOpen,
    onClose,
    onAccept,
    bountyTitle,
    clientName = 'Protected Client',
    securityLevel = 'sensitive'
}) => {
    const [agreed, setAgreed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const config = securityConfig[securityLevel];

    const handleAccept = async () => {
        if (!agreed) return;
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsSubmitting(false);
        setAgreed(false);
        onAccept();
    };

    if (!isOpen) return null;

    const borderColor = securityLevel === 'critical' ? 'border-red-500/30' : securityLevel === 'sensitive' ? 'border-yellow-500/30' : 'border-cyan-500/30';
    const bgColor = securityLevel === 'critical' ? 'bg-red-500/10' : securityLevel === 'sensitive' ? 'bg-yellow-500/10' : 'bg-cyan-500/10';
    const textColor = securityLevel === 'critical' ? 'text-red-400' : securityLevel === 'sensitive' ? 'text-yellow-400' : 'text-cyan-400';

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/95 backdrop-blur-md"
                />
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
                >
                    <div className={`p-4 border-b flex items-center gap-3 ${borderColor} ${bgColor}`}>
                        <span className="text-2xl">{config.icon}</span>
                        <div>
                            <h3 className={`font-bold ${textColor}`}>{config.label}</h3>
                            <p className="text-xs text-slate-400">Guardian Protocol v2.0</p>
                        </div>
                    </div>
                    <div className="p-6 space-y-5">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-2">IP Protection Agreement</h2>
                            <p className="text-slate-400 text-sm">By proceeding, you agree to secure work protocols:</p>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                            <p className="text-xs text-slate-500 mb-1">Protected Bounty</p>
                            <p className="text-white font-medium">{bountyTitle}</p>
                            <p className="text-xs text-cyan-400 mt-1">Client: {clientName}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs text-slate-500 uppercase tracking-wider">Security Restrictions</p>
                            {config.restrictions.map((r, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm">
                                    <span className="text-emerald-400">✓</span>
                                    <span className="text-slate-300">{r}</span>
                                </div>
                            ))}
                        </div>
                        <div className="bg-slate-800/30 rounded-lg p-4 text-xs text-slate-400 space-y-2 border border-slate-700/50">
                            <div className="flex gap-2">
                                <span className="text-yellow-500">⚡</span>
                                <p><strong className="text-white">Work for Hire:</strong> All IP transfers to Client upon payout.</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-purple-500">🏆</span>
                                <p><strong className="text-white">Prestige Rights:</strong> You retain Proof of Achievement.</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-red-500">⚠️</span>
                                <p><strong className="text-white">Breach Penalty:</strong> Reputation reset + payment forfeiture.</p>
                            </div>
                        </div>
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <div className="relative mt-1">
                                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="sr-only" />
                                <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${agreed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600 group-hover:border-slate-400'}`}>
                                    {agreed && <span className="text-white text-xs">✓</span>}
                                </div>
                            </div>
                            <span className="text-sm text-slate-300">I agree to the <a href="/ip-policy" className="text-cyan-400 hover:underline">IP Protection Policy</a> and understand the security requirements.</span>
                        </label>
                    </div>
                    <div className="p-6 bg-slate-800/50 border-t border-white/10 flex justify-end gap-3">
                        <button onClick={onClose} className="px-6 py-3 rounded-lg font-bold text-slate-400 hover:text-white transition">Cancel</button>
                        <button
                            onClick={handleAccept}
                            disabled={!agreed || isSubmitting}
                            className={`px-8 py-3 font-bold rounded-lg transition ${agreed ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-lg' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                        >
                            {isSubmitting ? 'Signing...' : '🔐 Sign & Proceed'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default OneClickNDA;
