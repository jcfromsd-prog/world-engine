import React, { useState, useEffect, useRef } from 'react';
import { FounderBadge } from '../dashboard/FounderCommandPanel';

interface FounderMenuProps {
    systemHealth: number;
    onOpenCommand: () => void;
    onOpenDiscovery: () => void;
    onOpenSwarmMenu: () => void;
    onReset: () => void;
}

export const FounderMenu: React.FC<FounderMenuProps> = ({
    systemHealth,
    onOpenCommand,
    onOpenDiscovery,
    onOpenSwarmMenu,
    onReset
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className="relative" ref={menuRef}>
            {/* THE MENU TRAY (Slides Up) */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-72 bg-slate-950/90 backdrop-blur-xl border border-green-500/20 rounded-2xl p-1.5 shadow-[0_0_50px_rgba(0,255,100,0.15)] animate-in slide-in-from-bottom-4 fade-in duration-200 z-[1001] overflow-hidden">

                    {/* Header */}
                    <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center bg-white/5 rounded-t-xl mb-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500">
                            FOUNDER_OS v1.0
                        </span>
                        <div className="flex gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="flex flex-col gap-1 p-1">

                        {/* 1. DISCOVER ARCHETYPE */}
                        <button
                            onClick={() => { onOpenDiscovery(); setIsOpen(false); }}
                            className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-cyan-900/40 hover:to-transparent border border-transparent hover:border-cyan-500/30 group transition-all w-full text-left"
                        >
                            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                                🕵️‍♂️
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">Discover Archetype</div>
                                <div className="text-[10px] text-slate-500 group-hover:text-cyan-400/60">Run Neural Calibration Logic</div>
                            </div>
                        </button>

                        {/* 2. COMMAND TERMINAL */}
                        <button
                            onClick={() => { onOpenCommand(); setIsOpen(false); }}
                            className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-900/40 hover:to-transparent border border-transparent hover:border-purple-500/30 group transition-all w-full text-left"
                        >
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                                🧪
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-200 group-hover:text-purple-400 transition-colors">Simulation Control</div>
                                <div className="text-[10px] text-slate-500 group-hover:text-purple-400/60">Run Batch & View Logs</div>
                            </div>
                        </button>

                        {/* 3. SWARM DASHBOARD (NEW) */}
                        <button
                            onClick={() => { onOpenSwarmMenu(); setIsOpen(false); }}
                            className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-emerald-900/40 hover:to-transparent border border-transparent hover:border-emerald-500/30 group transition-all w-full text-left"
                        >
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                                🐝
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">Swarm Dashboard</div>
                                <div className="text-[10px] text-slate-500 group-hover:text-emerald-400/60">Live Consensus & Reputation</div>
                            </div>
                        </button>

                        {/* Divider */}
                        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-1" />

                        {/* 4. LOG OUT (Safe Exit) */}
                        <button
                            onClick={() => {
                                if (window.confirm("Sign out of current session?")) {
                                    onReset();
                                    setIsOpen(false);
                                }
                            }}
                            className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-950/30 border border-transparent hover:border-red-500/30 group transition-all w-full text-left"
                        >
                            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-lg group-hover:translate-x-1 transition-transform">
                                🚪
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-400 group-hover:text-red-400 transition-colors">Log Out</div>
                                <div className="text-[10px] text-slate-600 group-hover:text-red-400/60">Switch Pilot Identity</div>
                            </div>
                        </button>

                    </div>

                    {/* Footer Status */}
                    <div className="px-4 py-2 mt-1 bg-black/20 text-[9px] text-center text-slate-600 font-mono border-t border-white/5">
                        SYSTEM STATUS: GREEN • LATENCY: 12ms
                    </div>
                </div>
            )}

            {/* THE TRIGGER (Founder Badge) */}
            <FounderBadge
                systemHealth={systemHealth}
                onClick={() => setIsOpen(!isOpen)}
            />
        </div>
    );
};
