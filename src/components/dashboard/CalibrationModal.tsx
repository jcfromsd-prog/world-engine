/* ==========================================================================
   CALIBRATION MODAL (Skills Assessment)
   ========================================================================== */
import React, { useState } from 'react';

interface CalibrationModalProps {
    isOpen: boolean;
    onClose: (score: number) => void;
    grade: string;
}

type Stage = 'INTRO' | 'MATH' | 'SCIENCE' | 'ENGLISH' | 'COMPLETE';

const QUESTIONS = {
    'K-5': {
        MATH: { q: 'If you have 3 Engines and build 4 more, how many do you have?', a: ['6', '7', '8'], correct: '7', icon: '⚙️' },
        SCIENCE: { q: 'What do plants need to grow?', a: ['Sunlight', 'Moonlight', 'Starlight'], correct: 'Sunlight', icon: '🔎' },
        ENGLISH: { q: 'Which word is a verb?', a: ['Pilot', 'Fly', 'Sky'], correct: 'Fly', icon: '🎯' }
    },
    '6+': {
        MATH: { q: 'Solve for x: 2x + 4 = 12', a: ['3', '4', '6'], correct: '4', icon: '⚙️' },
        SCIENCE: { q: 'What is the powerhouse of the cell?', a: ['Nucleus', 'Mitochondria', 'Ribosome'], correct: 'Mitochondria', icon: '🔎' },
        ENGLISH: { q: 'Select the synonym for "Resilient".', a: ['Weak', 'Robust', 'Fragile'], correct: 'Robust', icon: '🎯' }
    }
};

export const CalibrationModal: React.FC<CalibrationModalProps> = ({ isOpen, onClose, grade }) => {
    const [stage, setStage] = useState<Stage>('INTRO');
    const [progress, setProgress] = useState(0);
    const [score, setScore] = useState(0);

    // Determine Logic Level
    const level = (parseInt(grade) || 5) <= 5 ? 'K-5' : '6+';
    const deck = QUESTIONS[level];

    const handleAnswer = (answer: string, correct: string) => {
        if (answer === correct) setScore(prev => prev + 1);

        // Progress Logic
        if (stage === 'MATH') { setStage('SCIENCE'); setProgress(33); }
        if (stage === 'SCIENCE') { setStage('ENGLISH'); setProgress(66); }
        if (stage === 'ENGLISH') { setStage('COMPLETE'); setProgress(100); }
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
                        <div className="text-8xl mb-6">🧬</div>
                        <h2 className="text-4xl font-black text-white mb-4 italic tracking-tighter">LOGIC-LINK <span className="text-blue-500">REQUIRED</span></h2>
                        <p className="text-xl text-zinc-400 mb-12 max-w-lg mx-auto">
                            To activate your World Engine, we must calibrate your reasoning matrix.
                            <br /><br />
                            <span className="text-white font-bold">3 MODULES:</span> Logic, Observation, Language.
                        </p>
                        <button onClick={() => setStage('MATH')} className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl text-xl transition-all hover:scale-105 shadow-lg shadow-blue-500/20">
                            INITIATE SCAN 🚀
                        </button>
                    </div>
                )}

                {(stage === 'MATH' || stage === 'SCIENCE' || stage === 'ENGLISH') && (
                    <div className="text-center animate-fade-in-up">
                        <div className="text-6xl mb-6 bg-zinc-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto border border-white/10">
                            {deck[stage].icon}
                        </div>
                        <h3 className="text-blue-400 font-bold tracking-widest text-sm mb-2">{stage} MODULE</h3>
                        <h2 className="text-3xl font-bold text-white mb-10">{deck[stage].q}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {deck[stage].a.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => handleAnswer(opt, deck[stage].correct)}
                                    className="p-6 bg-zinc-800 border border-white/5 rounded-2xl hover:bg-zinc-700 hover:border-blue-500 transition-all text-xl font-bold text-white active:scale-95"
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
