
import React, { useState } from 'react';
import { Sparkles, Check, Zap } from 'lucide-react';
import { devTelemetry } from '../../../engines/logic-link/ObservabilityLayer';

interface SproutsInterfaceProps {
    onComplete: () => void;
    activeTask?: { id: string; title: string };
}

/**
 * SPROUTS INTERFACE (K-2)
 * DESIGN LAW: "Single Action, Immediate Feedback"
 * 
 * This component represents the "Body" of the learning loop.
 * It is wired to the "Brain" (DevTelemetry) to visualize the Logic-Link.
 */
export const SproutsInterface: React.FC<SproutsInterfaceProps> = ({ onComplete, activeTask }) => {
    const [stage, setStage] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS'>('IDLE');

    const handleInteraction = () => {
        if (stage !== 'IDLE') return;

        // 1. ACTION PHASE ⚡
        setStage('PROCESSING');
        devTelemetry.trackEvent('ACTION', `Child tapped interaction button`, 'neutral', { taskId: activeTask?.id });

        // Simulate Processing & Validation (The "Check" Phase)
        setTimeout(() => {
            // 2. CHECK PHASE 🛡️
            const success = Math.random() > 0.1; // 90% Success Rate for K-2 (High Motivation)

            if (success) {
                devTelemetry.trackEvent('CHECK', 'Action Validated', 'success');
                setStage('SUCCESS');

                // 3. PAYOFF PHASE 🎁
                setTimeout(() => {
                    devTelemetry.trackEvent('PAYOFF', 'Reward Issued: Star Burst', 'success');
                    onComplete(); // Advance
                }, 1000);

            } else {
                devTelemetry.trackEvent('CHECK', 'Action Invalid - Retry', 'failure');
                setStage('IDLE'); // Reset to try again
            }
        }, 600);
    };

    return (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-[1000]">
            <div className="relative">

                {/* PULSING OUTER RING (Attractor) */}
                {stage === 'IDLE' && (
                    <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping pointer-events-none"></div>
                )}

                {/* INTERACTION BUTTON */}
                <button
                    onClick={handleInteraction}
                    className={`
            relative w-48 h-48 rounded-full flex items-center justify-center
            transition-all duration-300 transform
            ${stage === 'IDLE' ? 'bg-gradient-to-br from-green-400 to-green-600 scale-100 hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(74,222,128,0.5)]' : ''}
            ${stage === 'PROCESSING' ? 'bg-yellow-400 scale-90 animate-pulse' : ''}
            ${stage === 'SUCCESS' ? 'bg-indigo-500 scale-125 shadow-[0_0_100px_rgba(99,102,241,0.8)]' : ''}
          `}
                >
                    {stage === 'IDLE' && <Zap size={80} className="text-white drop-shadow-lg" />}
                    {stage === 'PROCESSING' && <Sparkles size={80} className="text-white animate-spin" />}
                    {stage === 'SUCCESS' && <Check size={100} className="text-white animate-bounce" />}
                </button>

                {/* DEBUG LABEL (Optional, for Devs) */}
                <div className="absolute -bottom-16 w-full text-center text-zinc-500 font-mono text-xs">
                    {stage === 'IDLE' && "WAITING FOR INPUT..."}
                    {stage === 'PROCESSING' && "NEURAL LINK ACTIVE..."}
                    {stage === 'SUCCESS' && "MASTERY RECORDED!"}
                </div>
            </div>
        </div>
    );
};
