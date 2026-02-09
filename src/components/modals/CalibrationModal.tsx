
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalibrationService } from '../../services/CalibrationService';
import type { CalibrationDomain, CalibrationStyle } from '../../services/CalibrationService';
import type { LearnerProfile } from '../../engines/world-engine/LearnerModel';

interface CalibrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: LearnerProfile;
    onComplete: (traceId: string) => void;
}

export const CalibrationModal: React.FC<CalibrationModalProps> = ({ isOpen, onClose, profile, onComplete }) => {
    const [step, setStep] = useState(1);
    const [grade, setGrade] = useState<number>(profile.currentGrade || 5);
    const [domain, setDomain] = useState<CalibrationDomain>('Code');
    const [style, setStyle] = useState<CalibrationStyle>('Logic');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Simulated network delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const report = CalibrationService.runCalibration(profile, {
                grade,
                domain,
                style
            });

            onComplete(report.traceId);
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
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white">Identity Calibration</h2>
                        <p className="text-xs text-zinc-500 font-mono">STEP {step} OF 3</p>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white">✕</button>
                </div>

                {/* Progress Bar */}
                <div className="h-1 w-full bg-zinc-800">
                    <motion.div
                        className="h-full bg-blue-500"
                        animate={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-bold text-zinc-400 mb-4">Select Your Academic Grade (1-12)</label>
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
                                <label className="block text-sm font-bold text-zinc-400 mb-4">Choose Your Primary Domain</label>
                                <div className="space-y-3">
                                    {(['Code', 'Design', 'Science'] as CalibrationDomain[]).map(d => (
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
                                            <div className="text-left">
                                                <div className="font-bold">{d}</div>
                                                <div className="text-[10px] opacity-60">High-tier contracts available.</div>
                                            </div>
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
                                <label className="block text-sm font-bold text-zinc-400 mb-4">Define Your Execution Style</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {(['Visual', 'Logic', 'Team'] as CalibrationStyle[]).map(s => (
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
                                                <div className="text-left font-bold">{s} Oriented</div>
                                            </div>
                                            {style === s && <span className="text-purple-400">✓</span>}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-zinc-950/50 border-t border-zinc-800 flex justify-between gap-4">
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
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all"
                        >
                            NEXT STEP
                        </button>
                    ) : (
                        <button
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                            className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black rounded-xl shadow-lg shadow-purple-500/20 transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                        >
                            {isSubmitting ? 'CALIBRATING...' : 'FINALIZE CALIBRATION'}
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
