import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SupportTriageModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: 'MONEY' | 'BUG' | 'GENERAL';
}

const SupportTriageModal: React.FC<SupportTriageModalProps> = ({ isOpen, onClose, category }) => {
    const [email, setEmail] = useState('');
    const [details, setDetails] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    // Initial message based on category (Sage Handoff)
    const getHeadline = () => {
        if (category === 'MONEY') return "Priority Escalation: Enterprise/Billing";
        if (category === 'BUG') return "System Report: Technical Fault";
        return "Founder Channel: Direct Access";
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSent(true);
        setTimeout(() => {
            onClose();
            setIsSent(false); // Reset for next time
            setEmail('');
            setDetails('');
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/95 backdrop-blur-md"
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {isSent ? (
                        <div className="p-12 text-center">
                            <div className="text-6xl mb-4 animate-bounce">📡</div>
                            <h2 className="text-2xl font-bold text-white mb-2">Signal Received.</h2>
                            <p className="text-slate-400">The Founder has been alerted. Expect a transmission within 24 hours.</p>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className={`p-6 border-b ${category === 'MONEY' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-900 border-white/10'}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className={`text-xl font-bold ${category === 'MONEY' ? 'text-amber-400' : 'text-white'}`}>
                                            {getHeadline()}
                                        </h2>
                                        <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
                                            Sage Protocol: <span className="text-white">Human Intervention Required</span>
                                        </p>
                                    </div>
                                    <button onClick={onClose} className="text-slate-500 hover:text-white">✕</button>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="p-6 space-y-4">
                                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                                    <p className="text-sm text-slate-300 italic">
                                        "I have analyzed your query and determined it requires human authority. Please confirm your details below." — Engine Sage
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Your Classification</label>
                                    <select
                                        className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white outline-none focus:border-cyan-500"
                                        defaultValue={category}
                                        disabled
                                    >
                                        <option value="MONEY">Enterprise / Billing (High Priority)</option>
                                        <option value="BUG">Technical Bug / Error</option>
                                        <option value="GENERAL">General Inquiry</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contact Frequency (Email)</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="founder@example.com"
                                        className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white outline-none focus:border-cyan-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mission Critical Details</label>
                                    <textarea
                                        value={details}
                                        onChange={(e) => setDetails(e.target.value)}
                                        placeholder="Describe the anomaly or requirement..."
                                        rows={4}
                                        className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white outline-none focus:border-cyan-500 resize-none"
                                    />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-white/5 bg-slate-950 flex justify-end">
                                <button
                                    onClick={handleSubmit}
                                    className={`px-6 py-3 rounded-lg font-bold text-white transition-all ${category === 'MONEY'
                                            ? 'bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-500/20'
                                            : 'bg-cyan-600 hover:bg-cyan-500 shadow-lg shadow-cyan-500/20'
                                        }`}
                                >
                                    {isSubmitting ? "TRANSMITTING..." : "OPEN SECURE CHANNEL"}
                                </button>
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default SupportTriageModal;
