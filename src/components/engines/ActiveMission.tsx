import React, { useState, useEffect } from 'react';

interface ActiveMissionProps {
    missionId: string;
    onComplete: (reward: number) => void;
    onExit: () => void;
}

export const ActiveMission: React.FC<ActiveMissionProps> = ({ missionId, onComplete, onExit }) => {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [logs, setLogs] = useState<string[]>(['> SYSTEM INITIALIZED', '> WAITING FOR CALIBRATION...']);

    const handleCalibrate = () => {
        if (isComplete) return;

        const newProgress = Math.min(100, progress + 34);
        setProgress(newProgress);
        setLogs(prev => [...prev, `> CALIBRATING... ${newProgress}%`]);

        if (newProgress >= 100) {
            setIsComplete(true);
            setLogs(prev => [...prev, '> MISSION COMPLETE: NEURAL ARRAYS ALIGNED', '> REWARD READY FOR CLAIM']);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] bg-black font-mono text-green-500 flex flex-col items-center justify-center p-6 animate-fade-in">
            {/* Header */}
            <div className="absolute top-0 left-0 w-full p-6 border-b border-green-500/30 bg-black/90 backdrop-blur flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold tracking-widest">MISSION: NEURAL CALIBRATION // STATUS: ACTIVE</h1>
                    <p className="text-xs text-green-500/70">ID: {missionId} • PRIORITY: HIGH</p>
                </div>
                <button onClick={onExit} className="text-green-500 hover:text-white transition-colors text-xs uppercase tracking-widest border border-green-500/30 px-4 py-2 rounded">
                    Abort Mission
                </button>
            </div>

            {/* Main Terminal */}
            <div className="w-full max-w-3xl border border-green-500/20 bg-black/80 rounded-xl p-8 shadow-[0_0_50px_rgba(34,197,94,0.1)] relative overflow-hidden">
                {/* Scanline Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_4px,6px_100%]"></div>

                <h2 className="text-2xl font-bold mb-6 text-center text-white">OBJECTIVE: ALIGN NEURAL ARRAYS</h2>

                {/* Progress Bar */}
                <div className="w-full h-8 bg-green-900/20 border border-green-500/50 rounded-sm mb-8 relative">
                    <div
                        className="h-full bg-green-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white mix-blend-difference">
                        {progress}% EFFICIENCY
                    </div>
                </div>

                {/* Logs */}
                <div className="h-48 overflow-y-auto mb-8 font-mono text-xs space-y-1 p-4 bg-black/50 border border-green-500/10 rounded">
                    {logs.map((log, i) => (
                        <div key={i} className="opacity-80">{log}</div>
                    ))}
                    <div className="animate-pulse">_</div>
                </div>

                {/* Controls */}
                <div className="flex justify-center z-20 relative">
                    {!isComplete ? (
                        <button
                            onClick={handleCalibrate}
                            className="px-8 py-4 bg-green-900/20 border border-green-500 text-green-400 font-bold text-xl rounded hover:bg-green-500 hover:text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                        >
                            [ ██ CALIBRATE ██ ]
                        </button>
                    ) : (
                        <button
                            onClick={() => onComplete(50)}
                            className="px-8 py-4 bg-white text-black font-black text-xl rounded animate-pulse hover:scale-105 transition-transform shadow-[0_0_50px_rgba(255,255,255,0.5)]"
                        >
                            CLAIM REWARD (50 SYS)
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
