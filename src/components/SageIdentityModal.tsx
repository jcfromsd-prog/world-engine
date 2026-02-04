import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Brain, Sparkles, ShieldCheck, ChevronRight } from 'lucide-react';

export interface NeuralIdentity {
    role: string;
    squad: string;
    trait: string;
}

interface SageIdentityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete?: (identity: NeuralIdentity) => void;
}

const SageIdentityModal: React.FC<SageIdentityModalProps> = ({ isOpen, onClose, onComplete }) => {
    const [step, setStep] = useState(0); // 0: Intro, 1-3: Questions, 4: Processing, 5: Result
    const [input, setInput] = useState('');
    const [answers, setAnswers] = useState({ love: '', skill: '', problem: '' });
    const [identity, setIdentity] = useState<NeuralIdentity | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [step]);

    if (!isOpen) return null;

    const handleNext = () => {
        const trimmedInput = input.trim();
        if (!trimmedInput && step > 0 && step < 4) return;

        // Save answers based on step
        setAnswers(prev => ({
            ...prev,
            ...(step === 1 && { love: trimmedInput }),
            ...(step === 2 && { skill: trimmedInput }),
            ...(step === 3 && { problem: trimmedInput }),
        }));

        setInput('');

        // Move to next step
        if (step === 3) {
            setStep(4);
            // Simulate AI Processing
            setTimeout(() => {
                generateIdentity();
                setStep(5);
            }, 3000);
        } else {
            setStep(prev => prev + 1);
        }
    };

    const generateIdentity = () => {
        // In a real app, this would be your Gemini API call based on their answers
        console.log("Analyzing answers:", answers);

        // For now, we simulate a "Supreme" match
        const newIdentity = {
            role: "Level 1 Architect",
            squad: "The Visionaries",
            trait: "Systems Thinker"
        };
        setIdentity(newIdentity);
        if (onComplete) {
            onComplete(newIdentity);
        }
    };

    // The Script - "Sage's Voice"
    const renderContent = () => {
        switch (step) {
            case 0:
                return (
                    <div className="text-center space-y-6 animate-fade-in">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <Brain className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">I am Sage.</h3>
                        <p className="text-slate-300 text-lg leading-relaxed">
                            I do not care about your resume. I care about your <span className="text-teal-400 font-semibold">potential</span>.
                            <br /><br />
                            Answer 3 questions, and I will assign your <span className="text-white">Neural Identity</span> within the World Engine.
                        </p>
                        <button
                            onClick={() => setStep(1)}
                            className="mt-4 px-8 py-3 bg-teal-500 text-white font-bold rounded-full hover:bg-teal-400 transition-all flex items-center gap-2 mx-auto animate-discovery-pulse hover:animate-none shadow-lg shadow-teal-500/30"
                        >
                            INITIALIZE DISCOVERY <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                );

            case 1:
                return <ChatBubble question="What did you finish last? Let’s build on it." input={input} setInput={setInput} onNext={handleNext} />;
            case 2:
                return <ChatBubble question="What is a problem in the world that makes you angry? That you wish you could fix?" input={input} setInput={setInput} onNext={handleNext} />;
            case 3:
                return <ChatBubble question="What is one skill you have now—coding, writing, math—that you want to master?" input={input} setInput={setInput} onNext={handleNext} />;

            case 4:
                return (
                    <div className="flex flex-col items-center justify-center h-64 space-y-6 animate-pulse">
                        <Brain className="w-16 h-16 text-teal-400 animate-bounce" />
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-white">Analyzing Psychographics...</h3>
                            <p className="text-slate-400 mt-2">Calibrating Sovereign Vault...</p>
                            <p className="text-slate-400">Matching Synaptic Squad...</p>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="text-center space-y-6 animate-scale-in">
                        <div className="inline-block p-4 rounded-full bg-teal-500/20 border border-teal-500/50 mb-2">
                            <ShieldCheck className="w-12 h-12 text-teal-400" />
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight">IDENTITY CONFIRMED</h2>

                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 max-w-sm mx-auto backdrop-blur-sm">
                            <div className="text-sm text-slate-400 uppercase tracking-widest mb-1">Assigned Class</div>
                            <div className="text-2xl font-bold text-white mb-4 text-shadow-glow">{identity?.role}</div>

                            <div className="grid grid-cols-2 gap-4 text-left">
                                <div>
                                    <div className="text-xs text-slate-500 uppercase">Squad</div>
                                    <div className="text-indigo-300 font-medium">{identity?.squad}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 uppercase">Trait</div>
                                    <div className="text-purple-300 font-medium">{identity?.trait}</div>
                                </div>
                            </div>
                        </div>

                        <p className="text-slate-300">
                            Your vault is open. Your squad is waiting.
                        </p>

                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-teal-600 text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg"
                        >
                            ENTER THE DASHBOARD
                        </button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={onClose}></div>

            {/* CUSTOM PULSE STYLE */}
            <style>{`
                @keyframes discovery-pulse {
                    0%, 100% {
                        transform: scale(1);
                        box-shadow: 0 0 20px rgba(20, 184, 166, 0.5);
                    }
                    50% {
                        transform: scale(1.05);
                        box-shadow: 0 0 35px rgba(20, 184, 166, 0.8);
                    }
                }
                .animate-discovery-pulse {
                    animation: discovery-pulse 3s infinite ease-in-out;
                }
            `}</style>

            {/* Modal Container */}
            <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-teal-400" />
                        <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Neural Link Established</span>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Dynamic Content Area */}
                <div className="p-6 md:p-8 overflow-y-auto min-h-[400px] flex flex-col justify-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-5">
                    {renderContent()}
                    <div ref={messagesEndRef} />
                </div>
            </div>
        </div>
    );
};

// --- STABLE HELPER COMPONENTS (Defined outside to prevent re-renders on every keystroke) ---

interface ChatBubbleProps {
    question: string;
    input: string;
    setInput: (val: string) => void;
    onNext: () => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ question, input, setInput, onNext }) => (
    <div className="flex flex-col h-full justify-between animate-slide-up">
        <div className="flex gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl rounded-tl-none border border-slate-700 text-slate-200 shadow-sm">
                {question}
            </div>
        </div>

        <div className="relative mt-4">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && onNext()}
                placeholder="Type your answer..."
                className="w-full bg-slate-900/50 border border-slate-700 text-white p-4 pr-12 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                autoFocus
            />
            <button
                onClick={onNext}
                disabled={!input.trim()}
                className="absolute right-2 top-2 p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <Send className="w-4 h-4" />
            </button>
        </div>
    </div>
);

export default SageIdentityModal;
