import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Target, Users, Zap, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { useUser, type Psychometrics } from '../context/UserContext';
import PsychometricGraph from './PsychometricGraph';

interface IdentityViewProps {
    onBack: () => void;
}

const IdentityView: React.FC<IdentityViewProps> = ({ onBack }) => {
    const { psychometrics, updatePsychometrics } = useUser();
    const [activeFeedback, setActiveFeedback] = useState<{ id: string, msg: string } | null>(null);

    const handleUpdate = (vector: keyof Psychometrics, amount: number, msg: string, id: string) => {
        updatePsychometrics(vector, amount);
        setActiveFeedback({ id, msg });
        setTimeout(() => setActiveFeedback(null), 3000);
    };

    const protocols = [
        {
            id: 'autonomy',
            title: 'Autonomy Protocol',
            icon: <Target className="text-pink-400" size={24} />,
            desc: 'Demonstrate agency. Select a mission vector to initialize your path.',
            color: 'from-pink-500/10 to-pink-500/5',
            borderColor: 'border-pink-500/20',
            vector: 'autonomy' as keyof Psychometrics,
            choices: [
                { label: 'Math Logic', amount: 25, msg: 'Path Logic Integrated. Autonomy Vector +25%' },
                { label: 'Science Core', amount: 25, msg: 'Scientific Method Integrated. Autonomy Vector +25%' },
                { label: 'History Data', amount: 25, msg: 'Historical Analysis Integrated. Autonomy Vector +25%' }
            ]
        },
        {
            id: 'competence',
            title: 'Competence Drills',
            icon: <Zap className="text-blue-400" size={24} />,
            desc: 'Test your growth mindset. Challenges are data points for improvement.',
            color: 'from-blue-500/10 to-blue-500/5',
            borderColor: 'border-blue-500/20',
            vector: 'competence' as keyof Psychometrics,
            choices: [
                { label: 'Failure is Data', amount: 30, msg: 'Correct. Growth mindset confirmed. Competence +30%' },
                { label: 'Mastery Loop', amount: 20, msg: 'Iteration sequence complete. Competence +20%' }
            ]
        }
    ];

    return (
        <div className="fixed inset-0 z-[150] bg-[#050505] overflow-y-auto">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5 p-6 md:p-8 flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-black uppercase tracking-widest text-xs">Return to Core</span>
                </button>

                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 text-cyan-400 mb-1">
                        <Shield size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Identity Protocol</span>
                    </div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">Neural Engine // v0.7</h1>
                </div>

                <div className="w-[100px]" />
            </header>

            <main className="max-w-7xl mx-auto p-6 pt-12">
                {/* 1. Psychometric Visualization Section */}
                <section className="mb-12 bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800 rounded-[3rem] p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] font-black text-9xl -rotate-12 translate-x-12 -translate-y-12 select-none">DATA</div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-3">
                                <Sparkles className="text-yellow-500" size={24} /> Psychometric Analysis
                            </h2>
                            <p className="text-zinc-500 font-medium mb-8 leading-relaxed">
                                Real-time cognitive growth visualization based on Self-Determination Theory (SDT). Your behavior within the engine shapes your digital identity.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { label: 'Autonomy', color: 'bg-pink-500', val: psychometrics.autonomy, desc: 'Your agency to choose paths and self-organize.' },
                                    { label: 'Competence', color: 'bg-blue-500', val: psychometrics.competence, desc: 'Your mastery of skills and technical efficiency.' },
                                    { label: 'Relatedness', color: 'bg-green-500', val: psychometrics.relatedness, desc: 'Your synchronization with the collective squad.' }
                                ].map((stat) => (
                                    <div key={stat.label}>
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <span className="text-xs font-black text-white uppercase tracking-widest">{stat.label}</span>
                                                <p className="text-[10px] text-zinc-600 font-bold">{stat.desc}</p>
                                            </div>
                                            <span className="font-mono text-white font-black">{stat.val}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${stat.val}%` }}
                                                className={`h-full ${stat.color} shadow-[0_0_10px_#fff3]`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-center p-8 bg-black/40 rounded-[2.5rem] border border-white/5 relative">
                            <PsychometricGraph data={psychometrics} width={400} height={400} />
                            <div className="absolute bottom-6 flex gap-4 text-[9px] font-black text-zinc-700 uppercase tracking-[0.2em]">
                                <span>Ref: SDT-2026.4</span>
                                <span>Ver: Identity_v7.0</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Calibration Modules */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {protocols.map((p) => (
                        <div key={p.id} className={`bg-gradient-to-br ${p.color} border ${p.borderColor} rounded-[2.5rem] p-8 flex flex-col`}>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-black/40 rounded-2xl flex items-center justify-center border border-white/5">
                                    {p.icon}
                                </div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tight">{p.title}</h3>
                            </div>

                            <p className="text-zinc-500 text-sm mb-8 flex-1 leading-relaxed">
                                {p.desc}
                            </p>

                            <div className="flex flex-wrap gap-3">
                                {p.choices.map((choice) => (
                                    <button
                                        key={choice.label}
                                        onClick={() => handleUpdate(p.vector, choice.amount, choice.msg, p.id)}
                                        className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-white hover:text-black hover:border-white transition-all transform active:scale-95"
                                    >
                                        {choice.label}
                                    </button>
                                ))}
                            </div>

                            <AnimatePresence>
                                {activeFeedback?.id === p.id && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3 text-green-400 text-[10px] font-black uppercase tracking-widest"
                                    >
                                        <CheckCircle2 size={14} />
                                        {activeFeedback.msg}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                {/* 3. Squad Post Section (Relatedness) */}
                <section className="mt-8 bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-10">
                    <div className="flex items-center gap-4 mb-8">
                        <Users className="text-green-400" size={24} />
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">Signal Broadcast (Relatedness Sync)</h3>
                    </div>

                    <div className="flex flex-col gap-6">
                        <textarea
                            placeholder="Broadcast your current alignment status to the squad..."
                            className="w-full h-32 bg-black/40 border border-white/5 rounded-2xl p-6 text-white text-sm focus:border-green-500/50 outline-none transition-all resize-none"
                        />
                        <button
                            onClick={() => handleUpdate('relatedness', 30, 'Signal Broadcasted. Squad Sync (Relatedness) +30%', 'squad')}
                            className="h-16 bg-white text-black font-black uppercase tracking-[0.3em] text-xs rounded-2xl hover:bg-green-400 transition-all shadow-xl"
                        >
                            Broadcast Signal
                        </button>

                        <AnimatePresence>
                            {activeFeedback?.id === 'squad' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-center text-[10px] font-black uppercase tracking-widest"
                                >
                                    {activeFeedback.msg}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default IdentityView;
