/* =============================================================================
   ELEVATION MOMENT: The Growth & Progression Loop
   Philosophy: Verifiable growth is its own reward, but direction is key.
   ============================================================================= */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { onElevationMoment } from '../services/PayoutEngine';
import type { ElevationEvent } from '../services/PayoutEngine';
import { CheckCircle2, TrendingUp, Sparkles, Map as MapIcon, ArrowRight } from 'lucide-react';

export const ElevationMoment: React.FC = () => {
    const [lastElevation, setLastElevation] = useState<ElevationEvent | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const unsub = onElevationMoment((event) => {
            setLastElevation(event);
            setIsVisible(true);
        });

        return unsub;
    }, []);

    if (!isVisible || !lastElevation) return null;

    const isIntake = lastElevation.missionId === 'INTAKE_VERIFICATION';

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="max-w-2xl w-full bg-slate-900 border border-emerald-500/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.15)] relative"
                >
                    {/* Glowing Accent */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500" />

                    {/* Header: Motivational */}
                    <div className="p-8 pb-6 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20"
                        >
                            <Sparkles className="w-8 h-8 text-emerald-400" />
                        </motion.div>
                        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
                            {isIntake ? "Baseline Mapped" : "Mastery Achieved!"}
                        </h2>
                        <p className="text-slate-400 text-lg">
                            {isIntake
                                ? "Your starting coordinates are locked. Now it's time to build."
                                : "You've successfully leveled up your capabilities."}
                        </p>
                    </div>

                    {/* Body: The Facts of Growth */}
                    <div className="px-8 pb-8 space-y-6">

                        {/* Competencies Added / Gaps Detected */}
                        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-emerald-400" />
                                {isIntake ? "Identified Targets" : "New Skills Unlocked"}
                            </h3>
                            <div className="grid gap-3">
                                {lastElevation.verifiedCompetencies.slice(0, 3).map((comp, idx) => (
                                    <motion.div
                                        key={comp.competencyId}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 + (idx * 0.1) }}
                                        className="flex items-center gap-4 bg-slate-900/80 p-3 rounded-lg border border-slate-700/50"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-200 text-sm">{comp.title}</div>
                                        </div>
                                    </motion.div>
                                ))}
                                {lastElevation.verifiedCompetencies.length > 3 && (
                                    <div className="text-xs text-slate-500 text-center uppercase tracking-widest font-bold mt-2">
                                        + {lastElevation.verifiedCompetencies.length - 3} More
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Motivational Call to Action */}
                        <div className="pt-4">
                            <button
                                onClick={() => setIsVisible(false)}
                                className="w-full group relative px-8 py-5 bg-emerald-500 text-black font-black text-xl rounded-xl overflow-hidden hover:scale-[1.02] shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-3"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {isIntake ? <MapIcon className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
                                    {isIntake ? "VIEW MY SKILL GRAPH" : "CONTINUE JOURNEY"}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                            <p className="text-center text-xs text-slate-500 mt-4 uppercase tracking-widest">
                                Data permanently secured to your Soulbound Profile
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
