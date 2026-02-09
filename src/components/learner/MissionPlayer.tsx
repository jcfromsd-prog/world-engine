
import React, { useState } from 'react';
import { Bot, CheckCircle, X, ChevronRight, Play } from 'lucide-react'; // Using existing project icons

// --- STRICT INTERFACES ---
export interface Mission {
    id: string;
    title: string;
    type: 'VIDEO' | 'INTERACTIVE' | 'QUIZ';
    contentUrl?: string;
    difficulty?: number; // Optional metadata
}


interface MissionPlayerProps {
    mission: Mission;
    onComplete: (missionId: string) => void;
    onExit: () => void;
    simulationMode?: boolean;
}

// --- SUB-COMPONENTS (Internal) ---
const VideoPlayerPlaceholder = () => (
    <div className="w-full h-full bg-black flex items-center justify-center border-2 border-zinc-800 rounded-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/20 to-purple-900/20" />
        <Play size={64} className="text-white/80 group-hover:text-cyan-400 group-hover:scale-110 transition-all cursor-pointer" />
    </div>
);

const InteractivePlaceholder = () => (
    <div className="w-full h-full bg-zinc-900 border-2 border-dashed border-zinc-700 rounded-2xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
        <div className="text-4xl mb-4 animate-bounce">🎮</div>
        <h3 className="text-2xl font-bold text-white mb-2">Loading Simulation...</h3>
        <p className="text-zinc-500">Initializing physics engine and assets.</p>
    </div>
);

const QuizPlaceholder = () => (
    <div className="w-full h-full bg-zinc-900 border border-zinc-700 rounded-2xl p-8 flex flex-col gap-6">
        <h3 className="text-2xl font-bold text-white border-b border-zinc-800 pb-4">Knowledge Check</h3>
        <div className="space-y-4">
            {['Option A', 'Option B', 'Option C'].map((opt, i) => (
                <div key={i} className="p-4 bg-black/50 border border-zinc-700 rounded-xl hover:border-cyan-500 cursor-pointer transition-colors flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full border border-zinc-500 flex items-center justify-center text-xs text-zinc-500 font-bold">{String.fromCharCode(65 + i)}</div>
                    <span className="text-zinc-300">{opt}</span>
                </div>
            ))}
        </div>
    </div>
);

// --- MAIN COMPONENT ---
export const MissionPlayer: React.FC<MissionPlayerProps> = ({ mission, onComplete, onExit, simulationMode = false }) => {
    const [status, setStatus] = useState<'idle' | 'validating'>('idle');

    React.useEffect(() => {
        if (simulationMode) {
            // In simulation mode, OpenClaw controls timing externally, 
            // BUT we can also auto-close if needed. 
            // Actually, OpenClaw calls submitTask directly on the engine.
            // But the Player is "visual".
            // If OpenClaw is running, DOES it mount the player?
            // "Render Logic: If simulationMode === true: Render ... 🤖 OpenClaw Running..."
            // "Auto-Complete: Use useEffect to wait for the delay, then call onComplete."

            // Wait, OpenClaw in `OpenClaw.ts` calls `engine.submitTask`.
            // But if `MissionPlayer` is mounted, `LearnerMap` will render it.
            // If `simulationMode` is on, we should just show the overlay and call onComplete to close the modal?
            // "Auto-Complete: Use useEffect to wait for the delay, then call onComplete."
            // This suggests MissionPlayer is actively involved in the flow even during simulation.

            const timer = setTimeout(() => {
                onComplete(mission.id);
            }, 500); // Quick visual flash
            return () => clearTimeout(timer);
        }
    }, [simulationMode, mission.id, onComplete]);

    const handleComplete = () => {
        setStatus('validating');
        console.log("Validating work...");
        setTimeout(() => {
            onComplete(mission.id);
        }, 800);
    };

    if (simulationMode) {
        return (
            <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in">
                <div className="bg-zinc-900 border border-green-500/50 p-8 rounded-2xl shadow-[0_0_50px_rgba(34,197,94,0.2)] text-center">
                    <div className="text-4xl animate-bounce mb-4">🤖</div>
                    <h2 className="text-2xl font-black text-green-400 mb-2">OPENCLAW RUNNING</h2>
                    <p className="text-zinc-400 font-mono text-sm">Executing: {mission.title}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[1000] bg-zinc-950 flex flex-col animate-in slide-in-from-bottom duration-500">
            {/* Header */}
            <div className="flex-none h-16 border-b border-zinc-800 flex items-center px-6 justify-between bg-zinc-900/50 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs font-black uppercase tracking-widest border border-cyan-500/20">
                        {mission.type} MISSION
                    </div>
                    <h1 className="text-lg font-bold text-white">{mission.title}</h1>
                </div>
                <button
                    onClick={onExit}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Layout Body */}
            <div className="flex-1 flex overflow-hidden">
                {/* Main Stage (75%) */}
                <div className="flex-1 p-6 flex flex-col gap-6 relative">
                    <div className="flex-1 relative">
                        {mission.type === 'VIDEO' && <VideoPlayerPlaceholder />}
                        {mission.type === 'INTERACTIVE' && <InteractivePlaceholder />}
                        {mission.type === 'QUIZ' && <QuizPlaceholder />}
                        {!['VIDEO', 'INTERACTIVE', 'QUIZ'].includes(mission.type) && (
                            <div className="w-full h-full flex items-center justify-center text-red-500 font-bold">
                                TYPE NOT SUPPORTED: {mission.type}
                            </div>
                        )}
                    </div>

                    {/* Action Footer */}
                    <div className="flex-none h-20 bg-zinc-900/50 border-t border-zinc-800 -mx-6 -mb-6 p-6 flex items-center justify-between">
                        <div className="text-zinc-500 text-sm">Progress Saved.</div>
                        <button
                            onClick={handleComplete}
                            disabled={status === 'validating'}
                            className="px-8 py-3 bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {status === 'validating' ? 'Validating...' : 'I\'m Done'}
                            <CheckCircle size={20} className="group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Squad Sidebar (25%) */}
                <div className="w-80 flex-none border-l border-zinc-800 bg-zinc-900/30 p-6 flex flex-col gap-6">
                    <div>
                        <h2 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Squad Uplink
                        </h2>

                        {/* AI Mentor Fallback */}
                        <div className="p-4 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-2xl relative overflow-hidden">
                            <div className="flex items-center gap-3 mb-3 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center border-2 border-white/20">
                                    <Bot size={24} className="text-white" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">Sage AI</div>
                                    <div className="text-[10px] text-indigo-300">Mentor Active</div>
                                </div>
                            </div>
                            <p className="text-xs text-indigo-200 leading-relaxed relative z-10">
                                I'm monitoring your progress. Let me know if you need a hint! You're doing great.
                            </p>
                            {/* Abstract bg shape */}
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/20 blur-2xl rounded-full" />
                        </div>
                    </div>

                    {/* Placeholder Friend List (Empty for now to show fallback focus) */}
                    <div className="flex-1 border-t border-zinc-800/50 pt-6">
                        <div className="text-center text-zinc-600 text-xs mt-12 italic">
                            Scanning for squad mates...
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
