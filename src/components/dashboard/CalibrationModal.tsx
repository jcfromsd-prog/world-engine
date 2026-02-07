/* ==========================================================================
   CALIBRATION MODAL (Skills Assessment)
   ========================================================================== */
import React, { useState, useEffect } from 'react';

interface CalibrationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CalibrationModal: React.FC<CalibrationModalProps> = ({ isOpen, onClose }) => {
    const [progress, setProgress] = useState(0);
    const [stage, setStage] = useState('INITIALIZING SCAN');

    useEffect(() => {
        if (!isOpen) {
            setProgress(0);
            setStage('INITIALIZING SCAN');
            return;
        }

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }

                // Update stage text based on progress
                if (prev === 20) setStage('ANALYZING BIO-RHYTHMS');
                if (prev === 50) setStage('CALIBRATING NEURAL LINK');
                if (prev === 80) setStage('OPTIMIZING MATCH ALGORITHMS');

                return prev + 1;
            });
        }, 30);

        return () => clearInterval(interval);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[250] animate-fade-in">
            <div className="w-full max-w-md bg-zinc-900 border border-blue-500/50 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.2)]">

                {/* DECORATIVE SCANNER LINE */}
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-scan-line opacity-50"></div>

                <div className="text-center mb-8">
                    <div className="text-6xl mb-4 animate-pulse">🧬</div>
                    <h2 className="text-2xl font-black text-white italic tracking-tighter">SKILLS CALIBRATION</h2>
                    <p className="text-blue-400 font-mono text-xs mt-2 uppercase tracking-widest">{stage}...</p>
                </div>

                {/* PROGRESS BAR */}
                <div className="w-full h-4 bg-black rounded-full border border-blue-500/30 overflow-hidden mb-6 relative">
                    <div
                        className="h-full bg-blue-500 transition-all duration-75 relative"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute top-0 right-0 h-full w-2 bg-white/50 blur-[2px]"></div>
                    </div>
                </div>

                <div className="flex justify-between text-xs font-mono text-zinc-500 mb-8">
                    <span>ACCURACY: 99.9%</span>
                    <span>{progress}% COMPLETE</span>
                </div>

                {progress === 100 ? (
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-black font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/20 animate-bounce-in"
                    >
                        ACTIVATE OPTIMIZED PROFILE
                    </button>
                ) : (
                    <div className="w-full py-4 text-center text-zinc-600 font-mono text-xs animate-pulse">
                        PLEASE WAIT...
                    </div>
                )}
            </div>
        </div>
    );
};
