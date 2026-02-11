
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { postCalibrate } from '../../api/calibrate';
import type { CalibrationPayload, MirrorReport } from '../../services/CalibrationService';
import type { LearnerProfile } from '../../engines/world-engine/LearnerModel';

interface CalibrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: LearnerProfile;
    onComplete: (report: MirrorReport) => void;
}

export const CalibrationModal: React.FC<CalibrationModalProps> = ({ isOpen, onClose, profile, onComplete }) => {
    const [step, setStep] = useState(1);
    const [grade, setGrade] = useState<number>(profile.currentGrade || 5);
    const [domain, setDomain] = useState<'Code' | 'Design' | 'Science'>('Code');
    const [style, setStyle] = useState<'Visual' | 'Logic' | 'Team'>('Logic');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [report, setReport] = useState<MirrorReport | null>(null);

    if (!isOpen) return null;

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // CALL API (Bridged to Service Layer)
            const result = await postCalibrate(profile, {
                grade,
                domain,
                style
            }, { id: 'current-user', isAdmin: false }, profile.version);

            setReport(result);
        } catch (error: any) {
            alert(`Calibration Failed: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-lg bg-zinc-900 border border-blue-500/30 rounded-2xl overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center text-white">
                    <div>
                        <h2 className="text-xl font-bold">Identity Calibration</h2>
                        <p className="text-xs text-zinc-500 font-mono">
                            {report ? 'CALIBRATION COMPLETE' : `STEP ${step} OF 3`}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white">✕</button>
                </div>

                {/* Progress Bar */}
                {!report && (
                    <div className="h-1 w-full bg-zinc-800">
                        <motion.div
                            className="h-full bg-blue-500"
                            animate={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>
                )}

                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {report ? (
                            <motion.div
                                key="report"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="space-y-6 text-center"
                            >
                                <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                                    ✓
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Protocol Verified</h3>
                                    <p className="text-sm text-zinc-400">Confidence raised to <span className="text-green-400 font-bold">{report.after}%</span></p>
                                </div>
                                <div className="bg-black/40 border border-white/5 rounded-xl p-4 text-left font-mono text-[10px] space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500 uppercase">Trace ID</span>
                                        <span className="text-zinc-300">{report.traceId.slice(0, 8)}...</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500 uppercase">Tasks Unlocked</span>
                                        <span className="text-blue-400">{report.unlockedTasks.length} (Tier 0)</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500 uppercase">Version</span>
                                        <span className="text-zinc-300">v{report.version}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onComplete(report)}
                                    className="w-full py-3 bg-white text-black font-black rounded-xl hover:bg-green-400 transition-colors"
                                >
                                    RETURN TO FEED
                                </button>
                            </motion.div>
                        ) : (
                            <>
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -20, opacity: 0 }}
                                        className="space-y-6"
                                    >
                                        <div>
                                            <label className="block text-sm font-bold text-zinc-400 mb-4 uppercase tracking-widest">Academic Grade</label>
                                            <div className="grid grid-cols-4 gap-3">
                                                {Array.from({ length: 12 }, (_, i) => i + 1).map(g => (
                                                    <button
                                                        key={g}
                                                        onClick={() => setGrade(g)}
                                                        className={`py-3 rounded-lg border text-sm font-bold transition-all ${grade === g
                                                                ? 'bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/20'
                                                                : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                                                            }`}
                                                    >
                                                        {g}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -20, opacity: 0 }}
                                        className="space-y-6"
                                    >
                                        <label className="block text-sm font-bold text-zinc-400 mb-4 uppercase tracking-widest">Primary Domain</label>
                                        <div className="space-y-3">
                                            {(['Code', 'Design', 'Science'] as const).map(d => (
                                                <button
                                                    key={d}
                                                    onClick={() => setDomain(d)}
                                                    className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${domain === d
                                                            ? 'bg-blue-500/10 border-blue-500 text-white'
                                                            : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                                                        }`}
                                                >
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${domain === d ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-500'
                                                        }`}>
                                                        {d === 'Code' ? '💻' : d === 'Design' ? '🎨' : '🔬'}
                                                    </div>
                                                    <div className="text-left font-bold">{d} Engineering</div>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -20, opacity: 0 }}
                                        className="space-y-6"
                                    >
                                        <label className="block text-sm font-bold text-zinc-400 mb-4 uppercase tracking-widest">Execution Style</label>
                                        <div className="grid grid-cols-1 gap-3">
                                            {(['Visual', 'Logic', 'Team'] as const).map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => setStyle(s)}
                                                    className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${style === s
                                                            ? 'bg-purple-500/10 border-purple-500 text-white'
                                                            : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${style === s ? 'bg-purple-500 text-white' : 'bg-zinc-800 text-zinc-500'
                                                            }`}>
                                                            {s === 'Visual' ? '👁️' : s === 'Logic' ? '🧠' : '🤝'}
                                                        </div>
                                                        <div className="text-left font-bold">{s} Heavy</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Footer Actions */}
                                <div className="mt-8 pt-6 border-t border-zinc-800 flex justify-between gap-4">
                                    {step > 1 ? (
                                        <button
                                            disabled={isSubmitting}
                                            onClick={handleBack}
                                            className="px-6 py-2 text-zinc-500 hover:text-white font-bold transition-colors"
                                        >
                                            BACK
                                        </button>
                                    ) : <div />}

                                    {step < 3 ? (
                                        <button
                                            onClick={handleNext}
                                            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all font-mono text-xs"
                                        >
                                            PROCEED →
                                        </button>
                                    ) : (
                                        <button
                                            disabled={isSubmitting}
                                            onClick={handleSubmit}
                                            className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black rounded-xl shadow-lg shadow-purple-500/20 transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                                        >
                                            {isSubmitting ? 'VERIFYING...' : 'FINALIZE CALIBRATION'}
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};
