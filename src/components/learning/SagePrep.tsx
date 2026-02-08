import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LiveMission } from "../../lib/MissionGenerator";

interface SagePrepProps {
    mission: LiveMission | any; // Use more specific type if possible
    sageContent: any; // RecommendationResult | null
    onComplete: () => void;
    onCancel: () => void;
}

export const SagePrep: React.FC<SagePrepProps> = ({ mission, sageContent, onComplete, onCancel }) => {
    const [progress, setProgress] = useState(0);
    const [canEnter, setCanEnter] = useState(false);

    // Simulate "downloading knowledge" progress
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setCanEnter(true);
                    return 100;
                }
                return prev + 2; // Adjust speed here (2 = 50 steps * interval)
            });
        }, 40); // 40ms * 50 = 2000ms duration roughly
        return () => clearInterval(timer);
    }, []);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-6"
            >
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Ambient background effect - subtle pulsing gradient */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-blue-900/20"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>

                <motion.div
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.1 }}
                    className="relative max-w-2xl w-full bg-zinc-950 border border-blue-500/30 rounded-3xl p-8 md:p-12 shadow-[0_0_100px_rgba(59,130,246,0.15)] overflow-hidden"
                >
                    {/* Scanning Line Effect */}
                    <motion.div
                        className="absolute top-0 left-0 w-full h-1 bg-blue-500/50 blur-sm z-10"
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />

                    <div className="flex flex-col items-center text-center mb-8 relative z-20">
                        <motion.div
                            className="w-16 h-16 rounded-full bg-black/50 border border-blue-500 flex items-center justify-center mb-6"
                            animate={{ boxShadow: ["0 0 0px rgba(59,130,246,0)", "0 0 20px rgba(59,130,246,0.5)", "0 0 0px rgba(59,130,246,0)"] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <span className="text-3xl">🧠</span>
                        </motion.div>

                        <h2 className="text-sm font-mono text-blue-400 uppercase tracking-[0.2em] mb-2">
                            Identity Calibration Sequence
                        </h2>
                        <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                            {mission.title || "Unknown Protocol"}
                        </h1>

                        {/* Probability Badge */}
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-zinc-500 font-bold uppercase">Success Probability:</span>
                            <span className="text-green-400 font-mono font-bold">
                                {Math.round((sageContent?.successProbability || 0.85) * 100)}%
                            </span>
                        </div>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="w-full bg-zinc-900/50 rounded-full h-2 mb-8 border border-white/5 relative overflow-hidden">
                        <motion.div
                            className={`h-full ${progress === 100 ? "bg-green-500" : "bg-blue-500"}`}
                            style={{ width: `${progress}%` }}
                            layoutId="progressBar"
                        />
                    </div>

                    {/* Content Area - Staggered Reveal */}
                    <motion.div
                        className="bg-black/40 rounded-2xl p-6 border border-white/5 mb-8 text-left"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.1 }
                            }
                        }}
                    >
                        <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}>
                            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                <span className="text-blue-400">⚡</span> Core Concept
                            </h3>
                            <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                                {sageContent?.node?.content || "Synchronizing neural pathways for optimal performance. Remember: Focus on the architectural patterns before implementation."}
                            </p>
                        </motion.div>

                        <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="flex flex-wrap gap-2 mt-4">
                            {(sageContent?.node?.tags || ["Logic", "Pattern", "System"]).map((tag: string, i: number) => (
                                <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-zinc-400">
                                    #{tag}
                                </span>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Action Area */}
                    <div className="flex gap-4">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-4 bg-transparent border border-white/10 text-zinc-500 font-bold uppercase tracking-wider rounded-xl hover:bg-white/5 hover:text-white transition-colors"
                        >
                            Abort
                        </button>

                        <button
                            onClick={onComplete}
                            disabled={!canEnter}
                            className={`flex-[2] py-4 font-black uppercase tracking-widest rounded-xl transition-all duration-300 shadow-lg ${canEnter
                                ? "bg-white text-black hover:bg-blue-50 hover:scale-[1.02] shadow-blue-500/20 cursor-pointer"
                                : "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
                                }`}
                        >
                            {canEnter ? "Initialize Mission" : `Calibrating... ${progress}%`}
                        </button>
                    </div>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
