import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ArrowLeft, CheckCircle2, RotateCcw, Sparkles, Binary, GraduationCap } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface LearnViewProps {
    onBack: () => void;
}

const LearnView: React.FC<LearnViewProps> = ({ onBack }) => {
    const { knowledge, updateMastery, synapseCount, userProfile } = useUser();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Filter knowledge based on user passion if available, otherwise show all
    const relevantNodes = useMemo(() => {
        const passion = userProfile?.passion?.toLowerCase() || '';
        return knowledge.filter(node =>
            node.category.toLowerCase().includes(passion) ||
            passion.includes(node.category.toLowerCase()) ||
            passion === ''
        );
    }, [knowledge, userProfile]);

    const currentNode = relevantNodes[currentIndex];

    const handleAction = (correct: boolean) => {
        if (!currentNode) return;
        updateMastery(currentNode.id, correct);

        // Move to next card after a small delay
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % relevantNodes.length);
        }, 300);
    };

    if (relevantNodes.length === 0) {
        return (
            <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-6 text-center">
                <GraduationCap size={64} className="text-zinc-800 mb-6" />
                <h2 className="text-2xl font-black text-white uppercase mb-2">No Nodes Available</h2>
                <p className="text-zinc-600 mb-8">Synchronize your path to unlock domain-specific knowledge.</p>
                <button onClick={onBack} className="px-8 py-3 bg-white text-black font-black rounded-xl uppercase tracking-widest text-xs hover:bg-cyan-400 transition-all">
                    Return to Hub
                </button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[150] bg-[#050505] overflow-hidden flex flex-col">
            {/* Header */}
            <header className="p-6 md:p-8 flex items-center justify-between border-b border-white/5">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-black uppercase tracking-widest text-xs">Exit Session</span>
                </button>

                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 text-purple-400 mb-1">
                        <Brain size={16} className="animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Neural Tutor</span>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <div className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Neural Sync</div>
                    <div className="text-xl font-black text-white font-mono">{synapseCount}<span className="text-[10px] ml-1 text-purple-500">SYN</span></div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentNode.id}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.05, y: -20 }}
                        className="w-full max-w-xl bg-zinc-900/40 backdrop-blur-3xl border border-zinc-800 rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden"
                    >
                        {/* Bloom Level Badge */}
                        <div className="absolute top-10 right-10 flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                            <Binary size={12} className="text-purple-400" />
                            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Level 0{currentNode.bloomLevel}</span>
                        </div>

                        {/* Category */}
                        <div className="text-purple-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                            {currentNode.category} // Core Module
                        </div>

                        <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter leading-none">
                            {currentNode.title}
                        </h2>

                        <p className="text-zinc-400 text-lg mb-8 leading-relaxed font-medium capitalize">
                            {currentNode.concept}
                        </p>

                        <div className="bg-black/40 border border-white/5 rounded-2xl p-6 mb-12">
                            <div className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Sparkles size={10} className="text-yellow-500" /> Neural Context
                            </div>
                            <code className="text-purple-300 font-mono text-sm leading-relaxed block italic">
                                "{currentNode.example}"
                            </code>
                        </div>

                        {/* Mastery Progress */}
                        <div className="flex flex-col items-center gap-4 mb-8">
                            <div className="relative w-20 h-20">
                                <svg className="w-full h-full -rotate-90">
                                    <circle
                                        cx="40" cy="40" r="36"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        className="text-zinc-800"
                                    />
                                    <motion.circle
                                        cx="40" cy="40" r="36"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        strokeDasharray="226.2"
                                        initial={{ strokeDashoffset: 226.2 }}
                                        animate={{ strokeDashoffset: 226.2 * (1 - currentNode.mastery / 100) }}
                                        className="text-purple-500"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-white">
                                    {currentNode.mastery}%
                                </div>
                            </div>
                            <div className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Mastery Sync Status</div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleAction(false)}
                                className="group h-20 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-1 hover:border-red-500/50 hover:bg-red-500/5 transition-all"
                            >
                                <RotateCcw size={20} className="text-zinc-600 group-hover:text-red-500 transition-colors" />
                                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-red-500 transition-colors">Review Later</span>
                            </button>
                            <button
                                onClick={() => handleAction(true)}
                                className="group h-20 bg-white rounded-2xl flex flex-col items-center justify-center gap-1 hover:bg-purple-500 transition-all shadow-xl"
                            >
                                <CheckCircle2 size={20} className="text-black group-hover:text-white transition-colors" />
                                <span className="text-[9px] font-black text-black uppercase tracking-widest group-hover:text-white transition-colors">I Know This</span>
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Session Stats */}
            <footer className="p-8 border-t border-white/5 flex justify-center gap-12">
                <div className="flex flex-col items-center">
                    <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Queue Progress</span>
                    <span className="text-white font-black text-sm">{currentIndex + 1} / {relevantNodes.length}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Complexity Level</span>
                    <span className="text-white font-black text-sm">Deep Neural</span>
                </div>
            </footer>
        </div>
    );
};

export default LearnView;
