import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { guardian } from '../lib/guardian';
import type { GuardianMessage } from '../lib/guardian';
import { useEngine } from '../lib/engine';

interface NeuralInterfaceProps {
    isOpen: boolean;
    onClose: () => void;
}

const NeuralInterface: React.FC<NeuralInterfaceProps> = ({ isOpen, onClose }) => {
    const { revenue, squadMembers } = useEngine();
    const [messages, setMessages] = useState<GuardianMessage[]>([]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Subscribe to Guardian Messages
    useEffect(() => {
        const unsubscribe = guardian.subscribe((msgs) => {
            setMessages(msgs);
            // If the last message is from Guardian (and recent), stop thinking
            const lastMsg = msgs[msgs.length - 1];
            if (lastMsg && lastMsg.sender === 'GUARDIAN') {
                setIsThinking(false);
            }
        });

        // Initial fetch
        setMessages(guardian.getMessages());

        return () => unsubscribe();
    }, []);

    // Proactive Analysis Loop
    useEffect(() => {
        const timer = setInterval(() => {
            if (isOpen) {
                guardian.analyzeState(revenue, squadMembers);
            }
        }, 8000);
        return () => clearInterval(timer);
    }, [isOpen, revenue, squadMembers]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        setIsThinking(true);
        guardian.sendMessage(input);
        setInput('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />

                    {/* Terminal Window */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0.5 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 w-full md:w-[500px] z-50 bg-black border-l border-cyan-900 shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col font-mono"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-cyan-900 bg-cyan-950/20 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_#06b6d4]" />
                                <span className="text-cyan-400 font-bold tracking-widest text-sm">NEURAL LINK // V1.0</span>
                            </div>
                            <button onClick={onClose} className="text-cyan-800 hover:text-cyan-400 transition-colors">
                                [CLOSE]
                            </button>
                        </div>

                        {/* Message Feed */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-cyan-900">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex flex-col ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-[10px] uppercase tracking-wider ${msg.sender === 'USER' ? 'text-slate-500' : 'text-cyan-600'}`}>
                                            {msg.sender === 'GUARDIAN' ? 'SYSTEM_AI' : msg.sender}
                                        </span>
                                        <span className="text-[10px] text-slate-700">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour12: false })}
                                        </span>
                                    </div>

                                    <div
                                        className={`max-w-[90%] p-3 rounded-lg text-sm leading-relaxed border ${msg.sender === 'USER'
                                            ? 'bg-slate-900 border-slate-700 text-slate-300'
                                            : msg.type === 'alert'
                                                ? 'bg-red-950/30 border-red-900/50 text-red-400'
                                                : 'bg-cyan-950/30 border-cyan-900/50 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                                            }`}
                                    >
                                        <p>{msg.text}</p>
                                    </div>
                                </motion.div>
                            ))}
                            {isThinking && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-start gap-2"
                                >
                                    <span className="text-[10px] uppercase tracking-wider text-cyan-600">SYSTEM_AI</span>
                                    <div className="bg-cyan-950/30 border border-cyan-900/50 rounded-lg p-2">
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSubmit} className="p-4 border-t border-cyan-900 bg-black">
                            <div className="flex gap-2 relative">
                                <span className="absolute left-3 top-3 text-cyan-600 animate-pulse">{'>'}</span>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Enter command..."
                                    className="w-full bg-cyan-950/10 border border-cyan-900/50 rounded-md py-2 pl-8 pr-4 text-cyan-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder-cyan-900/50 font-mono text-sm"
                                    autoFocus
                                />
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NeuralInterface;
