/* ==========================================================================
   CALIBRATION MODAL (Skills Assessment)
   ========================================================================== */
import React, { useState } from 'react';

interface CalibrationModalProps {
    isOpen: boolean;
    onClose: (score: number) => void;
    grade: string;
}

type Stage = 'INTRO' | 'LOGIC' | 'OBSERVATION' | 'ANALYSIS' | 'COMPLETE';

const SCENARIOS = {
    'K-5': {
        name: "PROJECT: TREEHOUSE",
        LOGIC: { q: 'To build the floor, you need 8 planks. You have 3. How many more do you need?', a: ['4', '5', '11'], correct: '5', icon: '🪵' },
        OBSERVATION: { q: 'Which location is best for the treehouse?', a: ['Dead Branch', 'Strong Oak', 'Sapling'], correct: 'Strong Oak', icon: '🌳' },
        ANALYSIS: { q: 'Choose the sign for your door:', a: ['Privet Keep Out', 'Private Keep Out', 'Privit Keep Out'], correct: 'Private Keep Out', icon: '🚪' }
    },
    '6+': {
        name: "PROJECT: MARS BASE",
        LOGIC: { q: 'Rations per day: 2. Crew: 4. Days: 10. Total rations needed?', a: ['20', '40', '80'], correct: '80', icon: '🥫' },
        OBSERVATION: { q: 'Solar panels are covered in dust. Energy output is:', a: ['Rising', 'Stable', 'Falling'], correct: 'Falling', icon: '📉' },
        ANALYSIS: { q: 'Decode the incoming transmission: "Sys_em F_ilure".', a: ['System Failure', 'System Fillure', 'Systim Failure'], correct: 'System Failure', icon: '📡' }
    }
};

export const CalibrationModal: React.FC<CalibrationModalProps> = ({ isOpen, onClose, grade }) => {
    const [stage, setStage] = useState<Stage>('INTRO');
    const [progress, setProgress] = useState(0);
    const [score, setScore] = useState(0);

    // Determine Logic Level
    const level = (parseInt(grade) || 5) <= 5 ? 'K-5' : '6+';
    const mission = SCENARIOS[level];

    const handleAnswer = (answer: string, correct: string) => {
        if (answer === correct) setScore(prev => prev + 1);

        // Progress Logic
        if (stage === 'LOGIC') { setStage('OBSERVATION'); setProgress(33); }
        if (stage === 'OBSERVATION') { setStage('ANALYSIS'); setProgress(66); }
        if (stage === 'ANALYSIS') { setStage('COMPLETE'); setProgress(100); }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[250] animate-fade-in font-sans">
            <div className="w-full max-w-2xl bg-zinc-900 border border-blue-500/30 rounded-3xl p-10 relative overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.2)]">

                {/* PROGRESS BAR */}
                <div className="absolute top-0 left-0 w-full h-2 bg-zinc-800">
                    <div className="h-full bg-blue-500 transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div>
                </div>

                {/* CONTENT SWITCHER */}
                {stage === 'INTRO' && (
                    <div className="text-center animate-slide-up">
                        <div className="text-8xl mb-6">🚀</div>
                        <h2 className="text-4xl font-black text-white mb-2 italic tracking-tighter">MISSION: <span className="text-emerald-500">{mission.name}</span></h2>
                        <p className="text-xl text-zinc-400 mb-12 max-w-lg mx-auto">
                            To launch this project, you must solve 3 field challenges using your Logic, Observation, and Language skills.
                        </p>
                        <button onClick={() => setStage('LOGIC')} className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xl transition-all hover:scale-105 shadow-lg shadow-emerald-500/20">
                            START CHALLENGE
                        </button>
                    </div>
                )}

                {(stage === 'LOGIC' || stage === 'OBSERVATION' || stage === 'ANALYSIS') && (
                    <div className="text-center animate-fade-in-up">
                        <div className="text-6xl mb-6 bg-zinc-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto border border-white/10">
                            {mission[stage].icon}
                        </div>
                        <h3 className="text-emerald-400 font-bold tracking-widest text-sm mb-2">{stage} CHECK</h3>
                        <h2 className="text-3xl font-bold text-white mb-10">{mission[stage].q}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {mission[stage].a.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => handleAnswer(opt, mission[stage].correct)}
                                    className="p-6 bg-zinc-800 border border-white/5 rounded-2xl hover:bg-zinc-700 hover:border-emerald-500 transition-all text-xl font-bold text-white active:scale-95"
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {stage === 'COMPLETE' && (
                    <div className="text-center animate-scale-in">
                        <div className="text-8xl mb-6">✅</div>
                        <h2 className="text-4xl font-black text-white mb-4">CALIBRATION <span className="text-green-400">COMPLETE</span></h2>
                        <p className="text-zinc-400 mb-8 text-xl">
                            Systems Optimized. Verification Code: <span className="font-mono text-white">{score}/3</span>
                        </p>
                        <button
                            onClick={() => onClose(Math.round((score / 3) * 100))}
                            className="w-full py-5 bg-green-500 hover:bg-green-400 text-black font-black text-2xl rounded-xl transition-all shadow-[0_0_30px_rgba(34,197,94,0.4)]"
                        >
                            ENTER WORKSPACE
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};
