import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface SproutsLandingProps {
    onStart: () => void;
}

const SproutsLanding: React.FC<SproutsLandingProps> = ({ onStart }) => {
    useEffect(() => {
        // Voice-First Scaffolding: Play welcome audio on mount
        const audio = new Audio('/assets/audio/welcome_sprouts.mp3'); // Placeholder path
        audio.play().catch(e => console.log("Audio play blocked (user gesture needed):", e));

        // DOM Scrub of technical terms
        const scrubConfig = ['.technical-term', '.governance-stat', '.financial-metric'];

        scrubConfig.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.setAttribute('aria-hidden', 'true');
                (el as HTMLElement).style.display = 'none';
            });
        });

        // Cleanup on unmount (optional, but good practice if we want to restore for other users)
        return () => {
            scrubConfig.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    el.removeAttribute('aria-hidden');
                    (el as HTMLElement).style.display = '';
                });
            });
        };
    }, []);

    return (
        <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-10 left-10 text-9xl">🌱</div>
                <div className="absolute bottom-10 right-10 text-9xl">☀️</div>
            </div>

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="z-10 bg-white rounded-3xl p-8 shadow-2xl max-w-lg text-center border-4 border-yellow-400"
            >
                <div className="text-6xl mb-4 animate-bounce">👋</div>

                <h1 className="text-4xl font-black text-blue-500 mb-2 font-comic">
                    Welcome, Legend!
                </h1>

                <p className="text-2xl text-slate-600 mb-8 font-medium">
                    Ready to help the world today?
                </p>

                <button
                    onClick={onStart}
                    className="w-full py-6 bg-green-500 hover:bg-green-400 text-white text-3xl font-black rounded-2xl shadow-[0_10px_0_rgb(21,128,61)] active:shadow-none active:translate-y-2 transition-all flex items-center justify-center gap-4"
                >
                    <span>🚀</span>
                    <span>LET'S GO!</span>
                </button>

                {/* Visual Audio Cue */}
                <button className="mt-6 p-4 bg-blue-100 rounded-full text-blue-500 hover:scale-110 transition-transform" aria-label="Listen to instructions">
                    🔊 Listen
                </button>
            </motion.div>

            {/* Safety/Privacy Indicator for Parents (Hidden from Sprout view mostly) */}
            <div className="absolute bottom-4 text-slate-400 text-xs flex items-center gap-2">
                <span>🔒 Safe Mode Active</span>
                <span>•</span>
                <span>No Chat</span>
            </div>
        </div>
    );
};

export default SproutsLanding;
