import React, { useState } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';


import CreditBalance from './CreditBalance';

interface HeaderProps {
    walletBalance?: string;
    onToggleCompanyMode?: (mode: boolean) => void;
    viewMode?: 'solver' | 'client';
    setViewMode?: (mode: 'solver' | 'client') => void;
    onToggleNeural?: () => void;
    clientCredits?: number;
    onOpenCapitalModal?: () => void;
    onOpenPostBounty?: () => void;
    onOpenCommandCenter?: () => void;
    onOpenDiscovery?: () => void;
    isAdmin?: boolean;
    squadActive?: boolean;
}

const Header: React.FC<HeaderProps> = ({
    walletBalance,
    onToggleCompanyMode,
    viewMode = 'solver',
    setViewMode = () => { },
    onToggleNeural,
    clientCredits = 0,
    onOpenCapitalModal,
    onOpenCommandCenter,
    onOpenDiscovery,
    isAdmin = false,
    squadActive = false
}) => {
    // Local state removed, using props

    const handleModeSwitch = (mode: 'solver' | 'client') => {
        setViewMode(mode);
        // If switching to client, we can treat it similar to "Company Mode" or just change current view
        if (onToggleCompanyMode) {
            onToggleCompanyMode(mode === 'client');
        }
    };

    // Local state for Mobile Menu
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="header-nav">

            {/* --- LEFT SIDE: PURE BRANDING --- */}
            <div className="header-left flex items-center gap-4">
                {/* 1. Main Logo Container */}
                <div className="flex items-center gap-3">
                    <Link to="/" className="flex flex-col items-start leading-none group transition-opacity cursor-pointer">
                        {/* Top Line: Small Cyan Text */}
                        <span className="text-cyan-400 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-1 ml-0.5 group-hover:text-cyan-300 transition-colors">
                            MYBESTPURPOSE
                        </span>

                        {/* Bottom Line: Large White Text */}
                        <span className="text-white text-xl md:text-2xl font-bold tracking-widest group-hover:text-gray-100 transition-colors">
                            WORLD ENGINE
                        </span>
                    </Link>

                    {/* The Pulsating Dot */}
                    <div
                        className="relative flex h-3 w-3 cursor-pointer"
                        onClick={onToggleNeural}
                        title={isAdmin ? "Deactivate God Mode" : "Initialize Neural Link"}
                    >
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAdmin ? 'bg-red-500' : 'bg-green-400'}`}></span>
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${isAdmin ? 'bg-red-600' : 'bg-green-500'}`}></span>
                    </div>
                </div>
            </div>

            {/* --- CENTER: VIEW MODE TOGGLE (ALWAYS VISIBLE) --- */}
            <div className="flex header-center absolute left-1/2 transform -translate-x-1/2">
                <div className="bg-slate-900 p-1 rounded-full border border-slate-700 flex items-center">
                    <button
                        onClick={() => handleModeSwitch('solver')}
                        className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest transition-all ${viewMode === 'solver'
                            ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        SOLVER
                    </button>
                    <button
                        onClick={() => handleModeSwitch('client')}
                        className={`px-6 py-1 rounded-full text-[10px] font-black tracking-widest transition-all ${viewMode === 'client'
                            ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        CLIENT
                    </button>
                </div>
            </div>

            {/* RIGHT - Actions Cluster */}
            <div className="flex items-center gap-4">
                {/* DESKTOP: User Profile Link */}
                <div
                    onClick={onToggleNeural}
                    className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 hover:border-cyan-500/50 transition-all cursor-pointer group mr-2"
                >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white relative">
                        {squadActive ? 'S' : 'CC'}
                        {/* Supreme Vision Indicator */}
                        {(walletBalance || localStorage.getItem('sovereign_purpose_discovered') === 'true') && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black shadow-lg animate-pulse" />
                        )}
                    </div>
                    <span className="text-xs font-bold text-slate-300 group-hover:text-white">
                        {squadActive ? 'SQUAD ALPHA' : 'Level 4'}
                    </span>
                </div>

                {/* DESKTOP: Stats Group */}
                <div className="hidden md:flex items-center gap-4 mr-2">
                    {/* ... (Existing Desktop Stats Code - kept clean by relying on original logic if pasted, but here we replace block) ... */}
                    {/* Re-inserting the conditional stats logic for brevity in replace tool I will assume existing logic. */}
                    {/* Wait, I need to provide the FULL content for the replacement block. I will copy the stats logic from lines 116-164 */}
                    {isAdmin ? (
                        <>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-red-500 uppercase tracking-wider font-bold">MRR (Est)</span>
                                <span className="text-white font-mono font-bold text-sm">$4,990</span>
                            </div>
                            <div className="w-px h-8 bg-red-900/50" />
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-red-500 uppercase tracking-wider font-bold">Net Revenue</span>
                                <span className="text-white font-mono font-bold text-sm">$2,400</span>
                            </div>
                        </>
                    ) : (
                        viewMode === 'client' ? (
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">BUDGET DEPLOYED</span>
                                <span className="text-purple-400 font-mono font-bold text-lg leading-tight">$0.00</span>
                            </div>
                        ) : (
                            walletBalance && (
                                <Link to="/earnings" className="flex flex-col items-end hover:opacity-80 transition-opacity cursor-pointer">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">EARNINGS</span>
                                    <span className="text-emerald-400 font-mono font-bold text-lg leading-tight">{walletBalance}</span>
                                </Link>
                            )
                        )
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {viewMode === 'client' ? (
                        <>
                            <CreditBalance balance={clientCredits} onClick={() => onOpenCapitalModal?.()} />
                        </>
                    ) : (
                        /* DISCOVERY ARCHETYPE Button */
                        !walletBalance && !isAdmin && (
                            <button
                                onClick={onOpenDiscovery}
                                className="hidden md:flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-black rounded-full transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95"
                            >
                                <span>DISCOVER ARCHETYPE</span>
                            </button>
                        )
                    )}

                    {/* Command Center Trigger (Always Visible) */}
                    <button
                        onClick={onOpenCommandCenter}
                        className={`hidden md:flex relative px-4 h-10 items-center gap-2 rounded-lg border-2 transition-all group overflow-hidden ${isAdmin
                            ? 'bg-red-950/50 border-red-500 text-red-500 hover:bg-red-900 hover:text-white'
                            : 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:border-cyan-500/50 hover:text-cyan-400'
                            }`}
                        title="Open Command Center"
                    >
                        <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 011-1V4z" />
                        </svg>
                        <span className="text-[10px] font-black uppercase tracking-widest relative z-10">Command</span>
                    </button>

                    {/* MOBILE HAMBURGER */}
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="md:hidden p-2 text-slate-300 hover:text-white border border-slate-700 rounded-lg bg-slate-900"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                </div>
            </div>

            {/* --- MOBILE FULL SCREEN MENU --- */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col p-8 animate-in slide-in-from-right duration-200">
                    <div className="flex justify-between items-center mb-12">
                        <span className="text-xl font-black text-cyan-400 tracking-tighter">NAVIGATE</span>
                        <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <div className="space-y-8 flex-1">
                        {/* Mobile View Mode */}
                        <div className="bg-slate-900/50 p-2 rounded-xl grid grid-cols-2 gap-2 border border-slate-800">
                            <button
                                onClick={() => { handleModeSwitch('solver'); setMobileMenuOpen(false); }}
                                className={`py-3 rounded-lg font-bold text-center ${viewMode === 'solver' ? 'bg-cyan-500 text-black' : 'text-slate-400'}`}
                            >SOLVER</button>
                            <button
                                onClick={() => { handleModeSwitch('client'); setMobileMenuOpen(false); }}
                                className={`py-3 rounded-lg font-bold text-center ${viewMode === 'client' ? 'bg-purple-500 text-white' : 'text-slate-400'}`}
                            >CLIENT</button>
                        </div>

                        {/* Mobile Stats */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <span className="text-slate-500 font-bold tracking-widest text-sm">BALANCE</span>
                                <span className="text-2xl font-mono text-emerald-400">
                                    {walletBalance || '$0.00'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <span className="text-slate-500 font-bold tracking-widest text-sm">STATUS</span>
                                <span className="text-xl font-mono text-white">Level 4</span>
                            </div>
                        </div>

                        {/* Mobile Links */}
                        <div className="space-y-2">
                            <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block p-4 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold text-lg">
                                👤 My Profile
                            </Link>
                            <button onClick={onOpenCommandCenter} className="w-full text-left block p-4 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold text-lg">
                                ⚡ Command Center
                            </button>
                        </div>

                        {/* Mobile Action */}
                        {!walletBalance && (
                            <button
                                onClick={() => { onOpenDiscovery?.(); setMobileMenuOpen(false); }}
                                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xl rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                            >
                                DISCOVER ARCHETYPE
                            </button>
                        )}
                    </div>
                </div>
            )}

        </nav >
    );
};

export default Header;
