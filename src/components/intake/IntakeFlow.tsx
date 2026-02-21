
import React, { useState, useEffect } from 'react';
import { IntakeEngine } from '../../engines/intake/IntakeEngine';
import type { DiagnosticQuestion, MasteryMap } from '../../engines/intake/IntakeRegistry';
import { SquadOrchestrator } from '../../engines/intake/SquadOrchestrator';
import { PurposeLedger } from '../../services/PurposeLedger';
import { emitAssessmentElevation } from '../../services/PayoutEngine';
import { Shield, CheckCircle2, ChevronRight, Activity, Brain } from 'lucide-react';

interface IntakeFlowProps {
    onComplete: (masteryMap: MasteryMap) => void;
    onCancel: () => void;
    userId: string;
}

export const IntakeFlow: React.FC<IntakeFlowProps> = ({ onComplete, onCancel, userId }) => {
    const [engine] = useState(() => new IntakeEngine());
    const [currentQuestion, setCurrentQuestion] = useState<DiagnosticQuestion | null>(null);
    const [progress, setProgress] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        setCurrentQuestion(engine.getNextQuestion());
    }, [engine]);

    const handleAnswer = (optionIndex: number) => {
        if (!currentQuestion || isProcessing) return;

        setIsProcessing(true);
        engine.submitResponse(currentQuestion.id, optionIndex);

        // Brief stall for "Data Processing" feel
        setTimeout(() => {
            if (engine.isComplete()) {
                handleFinish();
            } else {
                setCurrentQuestion(engine.getNextQuestion());
                setProgress((prev) => prev + 10);
                setIsProcessing(false);
            }
        }, 600);
    };

    const handleFinish = async () => {
        const masteryMap = engine.generateMasteryMap();

        // Phase 3: Squad Orchestration
        const orchestrator = new SquadOrchestrator();
        await orchestrator.orchestrateSquad(userId);

        // Phase 4: Log to PurposeLedger
        await PurposeLedger.addEntry({
            user_id: userId,
            mission_id: 'SYSTEM_INTAKE_001',
            verified_outputs: ['SkillGraph Assessment Complete', 'CA Standards Mapped'],
            impact_metrics: {
                portfolio_items_added: 0,
                skills_demonstrated: Object.keys(masteryMap.zpd),
                real_value_created: 0,
                engine_progress: { impact_to_legend: 1.0 }
            }
        });

        emitAssessmentElevation(masteryMap);
        onComplete(masteryMap);
    };

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
