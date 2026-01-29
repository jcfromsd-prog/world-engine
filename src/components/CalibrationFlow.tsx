import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ARCHETYPES, ONBOARDING_BOUNTIES, SUGGESTED_TEAMMATES, determineArchetype } from '../data/gameData';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../lib/supabase';

interface CalibrationFlowProps {
    onClose: () => void;
    onComplete: (archetypeId: string) => void;
}

type Step = 'intro' | 'puzzle' | 'analyzing' | 'result';

const CalibrationFlow: React.FC<CalibrationFlowProps> = ({ onClose, onComplete }) => {
    const { user } = useAuth();
    const [step, setStep] = useState<Step>('intro');
    const [glitchFixed, setGlitchFixed] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [result, setResult] = useState<typeof ARCHETYPES[keyof typeof ARCHETYPES] | null>(null);
    const startTimeRef = useRef<number>(Date.now());

    // Intro timer
    useEffect(() => {
        if (step === 'intro') {
            const timer = setTimeout(() => {
                startTimeRef.current = Date.now();
                setStep('puzzle');
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [step]);

    // Analysis simulation
    useEffect(() => {
        if (step === 'analyzing') {
            const interval = setInterval(() => {
                setAnalysisProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setStep('result');
                        return 100;
                    }
                    return prev + 3;
                });
            }, 50);
            return () => clearInterval(interval);
        }
    }, [step]);

    const handleGlitchFix = async () => {
        const timeToSolve = Date.now() - startTimeRef.current;
        setGlitchFixed(true);

        // Determine archetype based on speed
        const archetypeKey = determineArchetype(timeToSolve, true);
        setResult(ARCHETYPES[archetypeKey]);

        // Store in localStorage for persistence
        localStorage.setItem('user_archetype', archetypeKey);
        localStorage.setItem('calibration_complete', 'true');

        // Store in Supabase if logged in
        if (user) {
            try {
                await updateProfile(user.id, { archetype: ARCHETYPES[archetypeKey].title });
            } catch (err) {
                console.error('Failed to save archetype to profile:', err);
            }
        }

        setTimeout(() => setStep('analyzing'), 800);
    };

    const handleAcceptBounty = () => {
        if (result) {
            onComplete(result.id);
        }
        onClose();
    };

    const bounty = result ? ONBOARDING_BOUNTIES[result.id] : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl relative"
            >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white text-xl z-10"
                >
                    ✕
                </button>

                <div className="p-8 min-h-[450px] flex flex-col items-center justify-center text-center">

                    <AnimatePresence mode="wait">

                        {/* STAGE 1: INTRO */}
                        {step === 'intro' && (
                            <motion.div
                                key="intro"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
                                className="text-center"
                            >
                                <h1 className="text-4xl md:text-5xl font-black text-cyan-400 tracking-tighter mb-4">
                                    INITIALIZING LINK...
                                </h1>
                                <p className="text-cyan-600 text-sm tracking-[0.5em] animate-pulse">
                                    CALIBRATING NEURAL HANDSHAKE
                                </p>
                            </motion.div>
                        )}

                        {/* STAGE 2: THE PUZZLE */}
                        {step === 'puzzle' && (
                            <motion.div
                                key="puzzle"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="w-full"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-white">
                                        <span className="text-red-500 mr-2">⚠</span> CORRUPTION DETECTED
                                    </h2>
                                    <span className="text-xs text-slate-400 font-mono">MODULE: SUPPLY_CHAIN_V2</span>
                                </div>

                                <div className="font-mono text-sm md:text-base space-y-2 mb-6 bg-black/50 p-6 rounded-lg border border-slate-800 text-left">
                                    <div className="text-slate-500">1  def optimize_route(nodes):</div>
                                    <div className="text-slate-500">2      path = []</div>
                                    <div className="text-slate-500">3      current = nodes[0]</div>

                                    {/* THE GLITCH LINE */}
                                    <div
                                        onClick={handleGlitchFix}
                                        className={`cursor-pointer transition-all duration-300 p-2 rounded ${glitchFixed
                                            ? "bg-green-500/20 text-green-400 border border-green-500/50"
                                            : "bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse hover:bg-red-500/30"
                                            }`}
                                    >
                                        4      {glitchFixed ? "while current.next != None:" : "while current.next =!= Null:  << SYNTAX ERROR"}
                                    </div>

                                    <div className="text-slate-500">5          path.append(current)</div>
                                </div>

                                {/* EDUCATIONAL EXPLAINER - Shows after fix */}
                                <AnimatePresence>
                                    {glitchFixed && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="mb-6 p-4 bg-gradient-to-r from-green-900/30 to-cyan-900/30 border border-green-500/30 rounded-xl"
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="text-2xl">🎓</span>
                                                <div className="text-left">
                                                    <h4 className="text-green-400 font-bold text-sm mb-1">What You Fixed:</h4>
                                                    <p className="text-slate-300 text-sm leading-relaxed">
                                                        The bug was <code className="bg-red-900/30 text-red-400 px-1 rounded">=!=</code> —
                                                        an invalid comparison operator in Python. The correct syntax is
                                                        <code className="bg-green-900/30 text-green-400 px-1 rounded ml-1">!=</code> (not equal).
                                                    </p>
                                                    <p className="text-slate-400 text-xs mt-2">
                                                        Also: Python uses <code className="text-cyan-400">None</code> instead of <code className="text-slate-500">Null</code>.
                                                        This is a common mistake when switching from JavaScript or Java.
                                                    </p>
                                                    <div className="mt-3 flex items-center gap-2">
                                                        <span className="text-xs text-emerald-400 font-bold">+10 XP</span>
                                                        <span className="text-xs text-slate-500">•</span>
                                                        <span className="text-xs text-cyan-400">Skill Unlocked: Python Syntax</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <p className="text-slate-400 text-sm">
                                    {glitchFixed ? "✓ CORRECTION APPLIED — Analyzing your response time..." : "CLICK THE ERROR TO PATCH THE LINE"}
                                </p>
                            </motion.div>
                        )}

                        {/* STAGE 3: ANALYZING */}
                        {step === 'analyzing' && (
                            <motion.div
                                key="analyzing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center w-full max-w-md"
                            >
                                <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-6" />

                                <h3 className="text-xl font-bold text-white mb-2">
                                    Sage is analyzing your neural pattern...
                                </h3>
                                <p className="text-sm text-slate-500 mb-6 font-mono">
                                    Comparing against 14,000 active solvers...
                                </p>

                                <div className="w-full space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1 text-cyan-400">
                                            <span>COGNITIVE VELOCITY</span>
                                            <span>{Math.min(analysisProgress * 1.2, 98).toFixed(0)}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-cyan-500"
                                                style={{ width: `${Math.min(analysisProgress * 1.2, 98)}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-xs mb-1 text-purple-400">
                                            <span>PATTERN RECOGNITION</span>
                                            <span>{Math.min(analysisProgress * 0.9, 92).toFixed(0)}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-purple-500"
                                                style={{ width: `${Math.min(analysisProgress * 0.9, 92)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STAGE 4: RESULT + FIRST BOUNTY */}
                        {step === 'result' && result && bounty && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full text-center"
                            >
                                <div className="inline-block p-4 rounded-full bg-slate-800 text-5xl mb-4">
                                    {result.icon}
                                </div>

                                <h2 className="text-3xl font-black text-white mb-2">
                                    You are a <span className={result.color}>{result.title}</span>
                                </h2>
                                <p className="text-slate-400 mb-6 max-w-md mx-auto">{result.description}</p>

                                {/* Skills */}
                                <div className="flex justify-center gap-2 mb-8">
                                    {result.skills.map((skill, i) => (
                                        <span key={i} className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-full">
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                {/* THE FIRST BOUNTY CARD */}
                                <div className={`border-2 ${result.borderColor} bg-slate-900/80 rounded-xl p-6 relative overflow-hidden text-left mx-auto max-w-md`}>
                                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${result.gradient}`} />

                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="text-xs font-bold text-white bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">
                                                🎯 PERFECT MATCH
                                            </span>
                                            <h3 className="text-lg font-bold text-white mt-2">{bounty.title}</h3>
                                        </div>
                                        <span className="text-2xl font-mono text-emerald-400 font-bold">{bounty.reward}</span>
                                    </div>

                                    <p className="text-sm text-slate-400 mb-4">
                                        {bounty.description}
                                    </p>

                                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                                        <span>⏱️ {bounty.time}</span>
                                        <span>📊 {bounty.difficulty}</span>
                                        <span className="text-cyan-400">♥ {bounty.livesImpacted} lives</span>
                                    </div>

                                    {/* Suggested Teammates Preview */}
                                    <div className="flex items-center gap-2 mb-4 p-3 bg-slate-800/50 rounded-lg">
                                        <span className="text-xs text-slate-400">Suggested Squad:</span>
                                        <div className="flex -space-x-2">
                                            {SUGGESTED_TEAMMATES.slice(0, 3).map(tm => (
                                                <img
                                                    key={tm.id}
                                                    src={tm.avatar}
                                                    alt={tm.name}
                                                    className="w-6 h-6 rounded-full border-2 border-slate-700"
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs text-emerald-400">+{SUGGESTED_TEAMMATES.length} compatible</span>
                                    </div>

                                    {/* PAYOUT BREAKDOWN TOOLTIP */}
                                    <div className="mb-4 flex items-center gap-2 text-[10px] text-slate-500 justify-end group relative">
                                        <span className="underline decoration-dotted cursor-help">Payout Breakdown (?)</span>
                                        <div className="absolute bottom-full right-0 mb-2 w-48 bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                            <div className="flex justify-between text-slate-300 mb-1">
                                                <span>Lead Solver (You)</span>
                                                <span className="text-emerald-400">$40.00</span>
                                            </div>
                                            <div className="flex justify-between text-slate-400 mb-1">
                                                <span>Squad Split</span>
                                                <span>$10.00</span>
                                            </div>
                                            <div className="flex justify-between text-slate-500 border-t border-slate-700 pt-1 mt-1">
                                                <span>Platform Fee</span>
                                                <span>$10.00</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* CONTRACT TRIGGER NOTIFICATION */}
                                    <AnimatePresence>
                                        {glitchFixed && step === 'result' && (
                                            <div className="relative">
                                                {/* Success Overlay */}
                                                {/* We reuse the button logic below for state, but if we need a toast, we place it here */}
                                            </div>
                                        )}
                                    </AnimatePresence>

                                    <button
                                        onClick={() => {
                                            const btn = document.getElementById('accept-btn');
                                            if (btn) {
                                                btn.innerText = "INITIALIZING SMART CONTRACT...";
                                                btn.classList.add('animate-pulse', 'bg-emerald-600', 'text-white');
                                                btn.classList.remove('bg-cyan-400'); // Assuming default was different
                                            }

                                            // Show Notification
                                            const notif = document.createElement('div');
                                            notif.className = 'fixed top-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-6 py-3 rounded-full font-bold shadow-2xl z-[100] flex items-center gap-3 animate-fade-in-down';
                                            notif.innerHTML = '<span>🚀</span> <span>Contract initialized. $5.00 Founding Credit pending completion.</span>';
                                            document.body.appendChild(notif);

                                            setTimeout(() => {
                                                if (document.body.contains(notif)) document.body.removeChild(notif);
                                                handleAcceptBounty();
                                            }, 2000);
                                        }}
                                        id="accept-btn"
                                        className={`w-full py-3 ${result.bgColor} text-black font-bold rounded-lg hover:opacity-90 transition relative overflow-hidden`}
                                    >
                                        ACCEPT FIRST CONTRACT
                                    </button>

                                    {/* TRUST & SECURITY TEXT */}
                                    <div className="mt-3 text-center">
                                        <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
                                            <span>🔒</span> Payments secured by Stripe. Funds released upon successful audit.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </motion.div>

            <style>{`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translate(-50%, -20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
                .animate-fade-in-down {
                    animation: fadeInDown 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default CalibrationFlow;
