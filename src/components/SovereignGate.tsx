import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SovereignGateProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const SovereignGate: React.FC<SovereignGateProps> = ({ isOpen, onClose, onSuccess }) => {
    const [input, setInput] = useState('');
    const [error, setError] = useState(false);
    const [attempts, setAttempts] = useState(0);

    // Focus input on open
    useEffect(() => {
        if (isOpen) {
            const inputEl = document.getElementById('sovereign-input');
            if (inputEl) inputEl.focus();
        }
    }, [isOpen]);

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();

        // Check against Environment Variable
        // In a real production app, this would verify a hash
        const MASTER_KEY = import.meta.env.VITE_FOUNDER_SECRET || 'genesis_protocol_alpha';

        if (input === MASTER_KEY) {
            // SUCCESS
            localStorage.setItem('SOVEREIGN_ACCESS_TOKEN', 'granted_' + Date.now());
            onSuccess();
            setInput('');
            setError(false);
        } else {
            // FAILURE
            setError(true);
            setAttempts(prev => prev + 1);
            setInput('');

            // "Lockout" simulation
            if (attempts > 2) {
                setTimeout(onClose, 1000);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center font-mono">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-md p-8 border border-red-900 bg-red-950/10 relative overflow-hidden"
            >
                {/* Decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse" />
                <div className="absolute top-0 right-0 text-[200px] text-red-900/10 font-black pointer-events-none -translate-y-1/4 translate-x-1/4">🔒</div>

                <div className="text-center mb-8 relative z-10">
                    <div className="text-4xl mb-4">🛡️</div>
                    <h1 className="text-red-500 font-bold tracking-[0.2em] text-xl mb-2">SOVEREIGN GATE</h1>
                    <p className="text-red-800 text-xs text-center">RESTRICTED AREA // ID: FOUNDER_ONLY</p>
                </div>

                <form onSubmit={handleVerify} className="relative z-10">
                    <div className="mb-6">
                        <label className="block text-red-700 text-xs mb-2">ENTER GENESIS KEY</label>
                        <input
                            id="sovereign-input"
                            type="password"
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                setError(false);
                            }}
                            className="w-full bg-black border border-red-800 text-red-500 p-3 text-center tracking-[0.5em] focus:outline-none focus:border-red-500 transition-colors"
                            placeholder="••••••••••••"
                            autoComplete="off"
                        />
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-red-500 text-xs text-center mb-6 font-bold"
                        >
                            ACCESS_DENIED // ATTEMPT {attempts + 1}/3
                        </motion.div>
                    )}

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 text-red-800 border border-red-900 hover:bg-red-900/20 text-xs"
                        >
                            ABORT
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 bg-red-900/30 text-red-500 border border-red-700 hover:bg-red-800/50 hover:text-white text-xs font-bold"
                        >
                            AUTHENTICATE
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default SovereignGate;
