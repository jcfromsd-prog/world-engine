import React, { useState, useRef, useEffect } from 'react';
import { classifyIntent, getAutoResponse } from '../data/sageRules';
import type { Intent } from '../data/sageRules';
import SupportTriageModal from './SupportTriageModal';

interface GuardianFABProps {
    onInitialize: () => void;
    isInitialized: boolean;
}

const GuardianFAB: React.FC<GuardianFABProps> = ({ onInitialize, isInitialized }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showHint, setShowHint] = useState(true);
    const [isSageActive, setIsSageActive] = useState(() => {
        const saved = localStorage.getItem('sage_link_status');
        return saved !== null ? JSON.parse(saved) : true;
    });

    // Chat State
    interface ChatMessage {
        sender: 'user' | 'sage';
        text: string;
        type?: 'text' | 'code-fix';
        code?: {
            title: string;
            lines: { content: string; isError?: boolean; isFixed?: boolean }[];
        };
        isFixed?: boolean;
    }

    const [input, setInput] = useState('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
        { sender: 'sage', text: "Greetings. I am Engine Sage. I solve problems. How can I help you today?", type: 'text' }
    ]);

    // Triage Modal State
    const [showTriage, setShowTriage] = useState(false);
    const [triageCategory, setTriageCategory] = useState<'MONEY' | 'BUG' | 'GENERAL'>('GENERAL');

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory, isOpen]);

    // Restore Event Listeners for Sage Status
    useEffect(() => {
        const handleStatusChange = (e: CustomEvent) => {
            setIsSageActive(e.detail);
            if (e.detail === false) {
                // If deactivated, close chat
                setIsOpen(false);
            }
        };
        // Use type assertion for custom event
        window.addEventListener('sageStatusChange' as any, handleStatusChange as any);
        return () => window.removeEventListener('sageStatusChange' as any, handleStatusChange as any);
    }, []);

    // Hide hint after 8 seconds
    useEffect(() => {
        const timer = setTimeout(() => setShowHint(false), 8000);
        return () => clearTimeout(timer);
    }, []);

    // Proactive AI Onboarding - Listen for trigger from Hero CTA
    useEffect(() => {
        const handleProactiveGreeting = () => {
            if (isInitialized && isSageActive) {
                // Auto-open chat
                setIsOpen(true);
                setShowHint(false);

                // Add proactive code challenge if not present
                setChatHistory(prev => {
                    const hasChallenge = prev.some(m => m.type === 'code-fix');
                    if (!hasChallenge) {
                        return [...prev, {
                            sender: 'sage',
                            text: "⚠️ CORRUPTION DETECTED",
                            type: 'code-fix',
                            code: {
                                title: "MODULE: SUPPLY_CHAIN_V2",
                                lines: [
                                    { content: "1 def optimize_route(nodes):" },
                                    { content: "2   path = []" },
                                    { content: "3   current = nodes[0]" },
                                    { content: "4   while current.next =!= Null: << SYNTAX ERROR", isError: true },
                                    { content: "5   path.append(current)" }
                                ]
                            }
                        }];
                    }
                    return prev;
                });
            }
        };

        window.addEventListener('onboardSage', handleProactiveGreeting);
        return () => window.removeEventListener('onboardSage', handleProactiveGreeting);
    }, [isInitialized, isSageActive]);

    const handleSend = () => {
        if (!input.trim()) return;

        // 1. Add User Message
        const userMsg = input;
        setChatHistory(prev => [...prev, { sender: 'user', text: userMsg, type: 'text' }]);
        setInput('');

        // 2. Analyze Intent (The Iron Dome)
        setTimeout(() => {
            const intent: Intent = classifyIntent(userMsg);
            const autoResponse = getAutoResponse(intent);

            if (autoResponse) {
                // Sage Solves It
                setChatHistory(prev => [...prev, { sender: 'sage', text: autoResponse, type: 'text' }]);
            } else {
                // Sage Escalate
                setChatHistory(prev => [...prev, { sender: 'sage', text: "I detect a request that requires human authorization. Opening secure channel...", type: 'text' }]);

                let category: 'MONEY' | 'BUG' | 'GENERAL' = 'GENERAL';
                if (intent === 'ESCALATE_MONEY') category = 'MONEY';
                if (intent === 'ESCALATE_BUG') category = 'BUG';

                setTriageCategory(category);
                setTimeout(() => setShowTriage(true), 1000);
            }
        }, 600);
    };

    const handleCodeFix = (index: number) => {
        setChatHistory(prev => prev.map((msg, i) => {
            if (i === index && msg.type === 'code-fix' && !msg.isFixed && msg.code) {
                // Return fixed version
                return {
                    ...msg,
                    isFixed: true,
                    code: {
                        ...msg.code,
                        lines: msg.code.lines.map(line =>
                            line.isError
                                ? { content: "4   while current.next != None:  // PATCHED", isFixed: true }
                                : line
                        )
                    }
                };
            }
            return msg;
        }));

        // Add success follow-up
        setTimeout(() => {
            setChatHistory(prev => [...prev, {
                sender: 'sage',
                text: "Patch verified. Syntax error resolved. Optimization module online.",
                type: 'text'
            }]);
        }, 800);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    const handleClick = () => {
        if (!isInitialized) {
            onInitialize();
        } else {
            setIsOpen(!isOpen);
            setShowHint(false);
        }
    };

    return (
        <>
            {/* ... (Triage Modal) */}
            <SupportTriageModal
                isOpen={showTriage}
                onClose={() => setShowTriage(false)}
                category={triageCategory}
            />

            {/* AI CORE WIDGET */}
            <div className="fixed bottom-6 right-6 z-[2000] flex flex-col items-end gap-3">
                {/* ... (Hint Bubble) */}
                {showHint && !isOpen && isInitialized && isSageActive && (
                    <div className="bg-black/90 border border-cyan-400/30 rounded-2xl px-4 py-3 max-w-[200px] text-right backdrop-blur-xl animate-fade-in">
                        <p className="text-xs text-gray-300 leading-relaxed">
                            <strong className="text-cyan-400 block mb-1">👋 Welcome, Solver.</strong>
                            Complete your profile to earn your first <span className="text-white font-bold">$5 credit</span>.
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">Click to start →</p>
                    </div>
                )}

                {/* Chat Interface */}
                {isOpen && isInitialized && (
                    <div className="bg-slate-950 border border-cyan-500/30 rounded-2xl w-80 md:w-96 overflow-hidden backdrop-blur-xl shadow-2xl shadow-cyan-500/10 animate-slide-up flex flex-col h-[500px]">
                        {/* Header */}
                        <div className="bg-slate-900/80 p-4 border-b border-cyan-500/20 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full border-2 border-cyan-400 overflow-hidden bg-cyan-900/50 relative">
                                <img src="/guardian_avatar.png" alt="Sage" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-cyan-400/20 animate-pulse"></div>
                            </div>
                            <div>
                                <p className="text-cyan-400 font-bold text-sm">Engine Sage</p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Level 7 Intelligence</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="ml-auto text-gray-500 hover:text-white transition"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Message Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={scrollRef}>
                            {chatHistory.map((msg, i) => (
                                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.type === 'code-fix' && msg.code ? (
                                        <div className="w-full max-w-[95%] bg-slate-900 border border-red-500/30 rounded-xl overflow-hidden">
                                            <div className="bg-red-950/30 p-2 border-b border-red-500/20 flex items-center gap-2">
                                                <span className="text-red-500 text-xs font-bold">⚠️ CORRUPTION DETECTED</span>
                                            </div>
                                            <div className="p-3 font-mono text-[10px] bg-black/50 text-slate-300">
                                                <div className="mb-2 text-slate-500 uppercase tracking-wider text-[9px]">{msg.code.title}</div>
                                                <div className="space-y-1">
                                                    {msg.code.lines.map((line, lIdx) => (
                                                        <div
                                                            key={lIdx}
                                                            onClick={() => line.isError && !msg.isFixed ? handleCodeFix(i) : undefined}
                                                            className={`p-1 rounded transition-colors ${line.isError
                                                                ? 'bg-red-500/10 text-red-400 border border-red-500/20 cursor-pointer hover:bg-red-500/20'
                                                                : line.isFixed
                                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                                    : ''
                                                                }`}
                                                        >
                                                            {line.content}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            {!msg.isFixed && (
                                                <div className="p-2 bg-red-900/10 text-center text-[10px] text-red-400 font-bold animate-pulse">
                                                    CLICK THE ERROR TO PATCH THE LINE
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className={`max-w-[80%] p-3 rounded-xl text-sm leading-relaxed ${msg.sender === 'user'
                                            ? 'bg-cyan-600/20 border border-cyan-500/30 text-white rounded-tr-none'
                                            : 'bg-slate-800 border border-slate-700 text-gray-300 rounded-tl-none'
                                            }`}>
                                            {msg.text}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-slate-900 border-t border-white/5">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type your query..."
                                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none"
                                />
                                <button
                                    onClick={handleSend}
                                    className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition"
                                >
                                    ➤
                                </button>
                            </div>
                            <div className="text-[10px] text-center text-slate-600 mt-2">
                                Sage Protocol v9.2 • "The Iron Dome"
                            </div>
                        </div>
                    </div>
                )}

                {/* The AI Core Orb */}
                <button
                    onClick={handleClick}
                    className={`
                        w-14 h-14 rounded-full flex items-center justify-center
                        transition-all duration-300 ease-out z-10
                        ${isInitialized
                            ? 'bg-gradient-to-br from-cyan-500 to-cyan-700 shadow-lg shadow-cyan-500/40 hover:shadow-cyan-400/60 hover:scale-110'
                            : 'bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/40 hover:shadow-red-400/60 hover:scale-110'
                        }
                        ${isOpen ? 'ring-2 ring-cyan-300 ring-offset-2 ring-offset-black' : ''}
                    `}
                    title={isInitialized ? "Talk to Sage" : "Initialize Protocol"}
                >
                    {isInitialized ? (
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping" />
                            <svg className="w-6 h-6 text-white relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="4" />
                                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                                <path d="M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                            </svg>
                        </div>
                    ) : (
                        <span className="text-xl">🔒</span>
                    )}
                </button>
            </div>

            {/* Custom Animations */}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
                .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { bg: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
            `}</style>
        </>
    );
};

export default GuardianFAB;
