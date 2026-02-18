import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, X, ShieldCheck } from 'lucide-react';
import type { BountyTask } from './ApprenticeQueue';
import confetti from 'canvas-confetti';

interface ContractWorkspaceProps {
    task: BountyTask;
    onComplete: () => void;
    onCancel: () => void;
}

export const ContractWorkspace: React.FC<ContractWorkspaceProps> = ({ task, onComplete, onCancel }) => {
    const [status, setStatus] = useState<'IDLE' | 'REVIEWING' | 'APPROVED'>('IDLE');
    const [deliverables, setDeliverables] = useState('');
    const [progress, setProgress] = useState(0);

    const handleSubmit = () => {
        if (!deliverables.trim()) {
            alert("Please submit your proof of work (link or description).");
            return;
        }

        setStatus('REVIEWING');

        // Audit Simulation (3 seconds)
        let p = 0;
        const interval = setInterval(() => {
            p += Math.random() * 10;
            if (p >= 100) {
                p = 100;
                clearInterval(interval);
                setStatus('APPROVED');
                triggerCelebration();
                // Wait for celebration to finish before closing
                setTimeout(onComplete, 2000);
            }
            setProgress(Math.min(p, 100));
        }, 300);
    };

    const triggerCelebration = () => {
        const duration = 2000;
        const end = Date.now() + duration;
        const colors = ['#10b981', '#fbbf24']; // Emerald + Gold (Professional Palette)

        (function frame() {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative"
            >
                {/* Header */}
                <div className="bg-slate-950 p-6 border-b border-slate-800 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                                Active Contract
                            </span>
                            <span className="text-slate-500 text-xs font-mono">ID: {task.id}</span>
                        </div>
                        <h2 className="text-xl font-bold text-white">{task.title}</h2>
                        <p className="text-slate-400 text-sm mt-1">Client: {task.client}</p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-500 hover:text-white"
                        disabled={status !== 'IDLE'}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8">
                    {status === 'IDLE' && (
                        <div className="space-y-6">
                            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                <h3 className="text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                    Submission Requirements
                                </h3>
                                <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside ml-2">
                                    <li>Provide a direct link to the artifact (Github, Figma, Doc).</li>
                                    <li>Ensure access permissions are set to 'Public' or 'Simulacra Client'.</li>
                                    <li>Include a brief summary of changes.</li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-200">Proof of Work</label>
                                <textarea
                                    value={deliverables}
                                    onChange={(e) => setDeliverables(e.target.value)}
                                    placeholder="Paste link to artifact or describe your solution..."
                                    className="w-full h-32 bg-black/30 border border-slate-700 rounded-lg p-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={onCancel}
                                    className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-emerald-900/20 flex items-center gap-2 transition-all hover:scale-105"
                                >
                                    <Send className="w-4 h-4" />
                                    SUBMIT FOR AUDIT
                                </button>
                            </div>
                        </div>
                    )}

                    {status === 'REVIEWING' && (
                        <div className="py-12 text-center space-y-6">
                            <div className="relative w-24 h-24 mx-auto">
                                <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
                                <div
                                    className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"
                                ></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xs font-mono font-bold text-emerald-400">{Math.round(progress)}%</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">Client Review in Progress</h3>
                                <p className="text-sm text-slate-400 max-w-xs mx-auto animate-pulse">
                                    Verifying artifact integrity against requirements...
                                </p>
                            </div>

                            {/* Simulated Terminal Output */}
                            <div className="max-w-xs mx-auto bg-black/50 p-3 rounded font-mono text-[10px] text-left text-green-400/80 space-y-1">
                                <div className="opacity-50">&gt; Initiating handshake...</div>
                                {progress > 30 && <div className="opacity-70">&gt; Validating checksums...</div>}
                                {progress > 60 && <div className="opacity-90">&gt; Scanning for quality metrics...</div>}
                                {progress > 90 && <div className="text-emerald-400">&gt; CONTRACT FULFILLED.</div>}
                            </div>
                        </div>
                    )}

                    {status === 'APPROVED' && (
                        <div className="py-12 text-center space-y-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-24 h-24 bg-emerald-500 rounded-full mx-auto flex items-center justify-center shadow-2xl shadow-emerald-500/50"
                            >
                                <CheckCircle className="w-12 h-12 text-white" />
                            </motion.div>

                            <div>
                                <h3 className="text-2xl font-black text-white mb-2">PAYMENT RELEASED</h3>
                                <p className="text-emerald-400 font-mono">
                                    Escrow funds transferred to wallet.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};
