import React, { useState } from 'react';
import { IntakeEngine } from '../../engines/intake/IntakeEngine';
import type { DiagnosticQuestion, MasteryMap } from '../../engines/intake/IntakeRegistry';
import { calculateAgeTier } from '../../engines/intake/IntakeRegistry';
import { SquadOrchestrator } from '../../engines/intake/SquadOrchestrator';
import { PurposeLedger } from '../../services/PurposeLedger';
import { emitAssessmentElevation } from '../../services/PayoutEngine';
import { Shield, CheckCircle2, ChevronRight, Activity, Brain } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface IntakeFlowProps {
    onComplete: (masteryMap: MasteryMap) => void;
    onCancel: () => void;
    userId: string;
    grade?: string;
}

const getTierCopy = (tier: number) => {
    if (tier <= 1) { // Sprouts (K-2)
        return {
            intro: "System ready! We want to learn how you think so we can give you the most fun missions. Take your time!",
            report: "You did it! You are great at numbers. Let's play some more games."
        };
    } else if (tier === 2) { // Builders (3-5)
        return {
            intro: "System Initialization. Let's find your baseline logic skills so we can assign the right missions. Accuracy is key.",
            report: "Calibration complete. You have a strong logic baseline."
        };
    } else { // Trailblazers, Explorers, Voyagers (6+)
        return {
            intro: "System Initialization. To assign your first live contracts, we must calibrate your cognitive load. You will be tested on Language, Logic, and Systems. Accuracy is valued over speed.",
            report: "Baseline Established. You are ready for multi-step reasoning. We will adapt your contracts to your growth edge."
        };
    }
};

export const IntakeFlow: React.FC<IntakeFlowProps> = ({ onComplete, onCancel, userId, grade = "5" }) => {
    const [engine] = useState(() => new IntakeEngine(parseInt(grade)));
    const [currentQuestion, setCurrentQuestion] = useState<DiagnosticQuestion | null>(null);
    const [progress, setProgress] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    // NEW STATE: 3-Phase Flow
    const [flowState, setFlowState] = useState<'intro' | 'assessment' | 'report'>('intro');
    const [finalMasteryMap, setFinalMasteryMap] = useState<MasteryMap | null>(null);

    // Determine initial tier for intro copy
    const initialTier = calculateAgeTier(parseInt(grade));
    // Determine report tier from map or fallback to initial
    const currentTier = finalMasteryMap ? calculateAgeTier(Math.round(Object.values(finalMasteryMap.zpd).reduce((a, b) => a + b, 0) / 3)) : initialTier;
    const copy = getTierCopy(currentTier);

    const startCalibration = () => {
        setCurrentQuestion(engine.getNextQuestion());
        setFlowState('assessment');
    };

    const handleAnswer = async (optionIndex: number) => {
        if (!currentQuestion || isProcessing) return;

        setIsProcessing(true);
        await engine.submitResponse(userId, currentQuestion.id, optionIndex);

        // Brief stall for "Data Processing" feel
        setTimeout(async () => {
            if (engine.isComplete()) {
                await processFinish();
            } else {
                setCurrentQuestion(engine.getNextQuestion());
                setProgress((prev) => prev + 10);
                setIsProcessing(false);
            }
        }, 600);
    };

    const processFinish = async () => {
        const masteryMap = engine.generateMasteryMap();
        const avgGrade = Math.round(Object.values(masteryMap.zpd).reduce((a, b) => a + b, 0) / 3);
        const ageTier = calculateAgeTier(avgGrade);
        masteryMap.ageTier = ageTier;

        setFinalMasteryMap(masteryMap);
        setFlowState('report');
        setIsProcessing(false);
    };

    const handleFinalize = async () => {
        if (!finalMasteryMap) return;
        setIsProcessing(true);

        const ageTier = finalMasteryMap.ageTier!;

        // Phase 3: Squad Orchestration
        const orchestrator = new SquadOrchestrator();
        await orchestrator.orchestrateSquad(userId);

        // Phase 4: Log to PurposeLedger
        await PurposeLedger.addEntry({
            user_id: userId,
            mission_id: 'SYSTEM_INTAKE_001',
            verified_outputs: ['SkillGraph Assessment Complete', 'CA Standards Mapped', `Tier ${ageTier} Verified`],
            impact_metrics: {
                portfolio_items_added: 0,
                skills_demonstrated: Object.keys(finalMasteryMap.zpd),
                real_value_created: 0,
                engine_progress: { impact_to_legend: 1.0 }
            }
        });

        // Supabase: Upsert Age Tier into the valid users record
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId);
        if (isUUID) {
            try {
                const { error } = await supabase
                    .from('users')
                    .update({ age_tier: ageTier })
                    .eq('id', userId);

                if (error) console.error("TIER SYNC ERROR:", error.message);
                else console.log(`[Eligibility Gate] User ${userId} locked to Tier ${ageTier}`);
            } catch (err) {
                console.error("TIER SYNC ERROR - FATAL", err);
            }
        }

        emitAssessmentElevation(finalMasteryMap);
        onComplete(finalMasteryMap);
    };

    if (flowState === 'intro') {
        return (
            <div className="fixed inset-0 z-[150] bg-slate-950 flex flex-col items-center justify-center p-6 font-sans">
                <div className="max-w-2xl w-full text-center">
                    <div className="flex justify-center mb-6">
                        <Shield className="text-emerald-500 w-16 h-16" />
                    </div>
                    <h1 className="text-4xl font-black text-white mb-6 tracking-tight">Mission Calibration</h1>
                    <p className="text-xl text-slate-400 mb-12 font-mono leading-relaxed px-8">
                        {copy.intro}
                    </p>
                    <button
                        onClick={startCalibration}
                        className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xl tracking-widest uppercase rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                    >
                        [COMMENCE CALIBRATION]
                    </button>
                    <button onClick={onCancel} className="block w-full mt-6 text-slate-600 hover:text-slate-400 text-xs font-mono">
                        [TAB_OUT]
                    </button>
                </div>
            </div>
        );
    }

    if (flowState === 'report' && finalMasteryMap) {
        return (
            <div className="fixed inset-0 z-[150] bg-slate-950 flex flex-col items-center justify-center p-6 font-sans">
                <div className="max-w-3xl w-full bg-slate-900/50 border border-emerald-500/20 rounded-3xl p-10 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-6">
                        <Brain className="text-emerald-500 w-10 h-10" />
                        <div>
                            <h2 className="text-3xl font-black text-white">The Mirror</h2>
                            <p className="text-sm font-mono text-emerald-400/80 uppercase tracking-widest">Baseline Mapped</p>
                        </div>
                    </div>

                    <p className="text-xl text-slate-300 mb-8 font-medium">
                        {copy.report}
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-10">
                        {Object.entries(finalMasteryMap.zpd).map(([subject, level]) => (
                            <div key={subject} className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-center shadow-inner">
                                <div className="text-xs font-mono text-slate-500 mb-2 uppercase tracking-widest">{subject}</div>
                                <div className="text-4xl font-black text-emerald-400">Lvl {level}</div>
                            </div>
                        ))}
                    </div>

                    {finalMasteryMap.gaps.length > 0 && (
                        <div className="mb-10 px-6 py-4 bg-red-950/20 border border-red-900/30 rounded-xl">
                            <h3 className="text-xs font-black text-red-500 uppercase tracking-widest mb-3">Identified Growth Edges</h3>
                            <ul className="text-sm text-slate-400 space-y-2">
                                {finalMasteryMap.gaps.slice(0, 3).map((gap, i) => (
                                    <li key={i} className="flex gap-2">
                                        <span className="text-red-500/60">•</span>
                                        {gap.description}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <button
                        onClick={handleFinalize}
                        disabled={isProcessing}
                        className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black text-xl tracking-widest uppercase rounded-xl transition-all shadow-lg shadow-blue-500/20"
                    >
                        {isProcessing ? "PROCESSING SECURE LOG..." : "[ENTER IMPACT ENGINE]"}
                    </button>
                </div>
            </div>
        );
    }

    if (!currentQuestion) return null;

    return (
        <div className="fixed inset-0 z-[150] bg-slate-950 flex flex-col items-center justify-center p-6 font-sans">
            {/* Verification Header */}
            <div className="max-w-4xl w-full flex justify-between items-center mb-12 border-b border-slate-800 pb-6">
                <div className="flex items-center gap-3">
                    <Shield className="text-emerald-500 w-6 h-6" />
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">System Calibration Active</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Progress Vector</span>
                        <div className="w-32 h-1 bg-slate-900 rounded-full mt-1 overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                    <button onClick={onCancel} className="text-slate-600 hover:text-slate-400 text-xs font-mono">[TERMINATE]</button>
                </div>
            </div>

            {/* Question Core */}
            <div className="max-w-2xl w-full">
                <div className="mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-400" />
                    <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">
                        DOMAIN: {currentQuestion.subject.toUpperCase()} • LEVEL {currentQuestion.difficulty}
                    </span>
                </div>
                <h1 className="text-3xl font-bold text-slate-100 mb-10 leading-tight">
                    {currentQuestion.text}
                </h1>

                <div className="grid gap-4">
                    {currentQuestion.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            disabled={isProcessing}
                            className="group flex justify-between items-center p-6 bg-slate-900 border border-slate-800 rounded-xl hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all text-left"
                        >
                            <span className="text-lg text-slate-300 group-hover:text-white transition-colors">{option}</span>
                            <div className="w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center group-hover:border-emerald-500 group-hover:bg-emerald-500/10 transition-all">
                                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Factual Context */}
            <div className="mt-20 max-w-2xl w-full grid grid-cols-2 gap-8 border-t border-slate-900 pt-8">
                <div className="flex gap-3">
                    <Brain className="w-5 h-5 text-slate-700" />
                    <div>
                        <div className="text-[9px] text-slate-600 uppercase font-black tracking-widest mb-1">Adaptive Logic</div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                            Engine difficulty adjusts in real-time based on recursive accuracy checks. No static grade defaults.
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-slate-700" />
                    <div>
                        <div className="text-[9px] text-slate-600 uppercase font-black tracking-widest mb-1">Standard Alignment</div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                            Mapping to CA CCSS and NGSS manifests for verified placement.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};