import './Header.css';


import CreditBalance from './CreditBalance';

interface HeaderProps {
    onConnectWallet: () => void;
    walletBalance?: string;
    onToggleCompanyMode?: (mode: boolean) => void;
    viewMode: 'solver' | 'client';
    setViewMode: (mode: 'solver' | 'client') => void;
    onToggleNeural?: () => void;
    clientCredits?: number;
    onOpenCapitalModal?: () => void;
    onOpenPostBounty?: () => void;
    onOpenCommandCenter?: () => void;
    isAdmin?: boolean;
}

const Header: React.FC<HeaderProps> = ({
    onConnectWallet,
    walletBalance,
    onToggleCompanyMode,
    viewMode,
    setViewMode,
    onToggleNeural,
    clientCredits = 0,
    onOpenCapitalModal,
    onOpenCommandCenter,
    isAdmin = false
}) => {
    // Local state removed, using props

    const handleModeSwitch = (mode: 'solver' | 'client') => {
        setViewMode(mode);
        // If switching to client, we can treat it similar to "Company Mode" or just change current view
        if (onToggleCompanyMode) {
            onToggleCompanyMode(mode === 'client');
        }
    };

    const handleStripeDashboard = () => {
        window.open('https://dashboard.stripe.com', '_blank');
    };

    return (
        <nav className="header-nav">

            {/* --- LEFT SIDE: PURE BRANDING --- */}
            <div className="header-left flex items-center gap-4">
                {/* 1. Main Logo Container: Add 'flex items-center gap-3' to align text and dot horizontally */}
                <div className="flex items-center gap-3">

                    {/* The Logo Text Group */}
                    <div className="flex flex-col leading-none">
                        <span className="text-[10px] font-bold tracking-widest text-gray-400">
                            MYBESTPURPOSE
                        </span>
                        <span className="text-lg font-black tracking-tighter text-cyan-400">
                            WORLD ENGINE
                        </span>
                    </div>

                    {/* The Pulsating Dot (Moved here) */}
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

            {/* --- CENTER: VIEW MODE TOGGLE --- */}
            <div className="header-center absolute left-1/2 transform -translate-x-1/2">
                <div className="bg-slate-900 p-1 rounded-full border border-slate-700 flex items-center">
                    <button
                        onClick={() => handleModeSwitch('solver')}
                        className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${viewMode === 'solver'
                            ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        SOLVER
                    </button>
                    <button
                        onClick={() => handleModeSwitch('client')}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'client'
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
                {/* Stats Group - CONDITIONAL SWAP */}
                <div className="hidden md:flex items-center gap-4 mr-2">
                    {isAdmin ? (
                        /* FOUNDER COCKPIT METRICs */
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
                            <div className="w-px h-8 bg-red-900/50" />
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-red-500 uppercase tracking-wider font-bold">Burn</span>
                                <span className="text-red-400 font-mono font-bold text-sm">$14.5k</span>
                            </div>
                        </>
                    ) : (
                        /* STANDARD USER METRICS */
                        viewMode === 'client' ? (
                            <>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">BUDGET DEPLOYED</span>
                                    <span className="text-purple-400 font-mono font-bold text-lg leading-tight">$0.00</span>
                                </div>
                                <div className="w-px h-8 bg-white/10 mx-2" />
                                <div className="hidden sm:flex flex-col items-center">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">ACTIVE SQUADS</span>
                                    <span className="text-white font-mono font-bold text-lg leading-tight">0</span>
                                </div>
                            </>
                        ) : (
                            /* Only show solver stats if "logged in" (has balance) */
                            walletBalance && (
                                <>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">EARNINGS</span>
                                        <span className="text-emerald-400 font-mono font-bold text-lg leading-tight">{walletBalance}</span>
                                    </div>
                                    <div className="w-px h-8 bg-white/10 mx-2" />
                                    <div className="hidden sm:flex flex-col items-center">
                                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">IMPACT</span>
                                        <span className="text-purple-400 font-mono font-bold text-lg leading-tight">Level 4</span>
                                    </div>
                                </>
                            )
                        )
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {viewMode === 'client' ? (
                        <>
                            <CreditBalance balance={clientCredits} onClick={() => onOpenCapitalModal?.()} />
                            {/* POST BOUNTY hidden here for clients to force focus on Hero center CTA per user guidance */}
                        </>
                    ) : (
                        !isAdmin && !walletBalance && (
                            <button
                                onClick={onConnectWallet}
                                className="px-5 py-2 rounded-full border border-cyan-500/30 text-cyan-400 text-xs font-bold hover:bg-cyan-500/10 transition flex items-center gap-2"
                            >
                                LOG IN
                            </button>
                        )
                    )}

                    {/* Common Action Trigger (Renamed for Client View) */}
                    <button
                        onClick={isAdmin ? handleStripeDashboard : onOpenCommandCenter}
                        className={`relative px-4 h-10 flex items-center gap-2 rounded-lg border-2 transition-all group overflow-hidden ${isAdmin
                            ? 'bg-red-950/50 border-red-500 text-red-500 hover:bg-red-900 hover:text-white'
                            : viewMode === 'client'
                                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-purple-500/50 hover:text-purple-400'
                                : 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:border-cyan-500/50 hover:text-cyan-400'
                            }`}
                        title={isAdmin ? "Open Stripe Treasury" : viewMode === 'client' ? "Open Analytics Dashboard" : "Open Command Center"}
                    >
                        <span className={`absolute inset-0 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity ${isAdmin ? 'bg-red-500/20' : viewMode === 'client' ? 'bg-purple-500/10' : 'bg-cyan-500/10'}`}></span>

                        {/* Conditional Icon/Text */}
                        {viewMode === 'client' ? (
                            <>
                                <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <span className="text-[10px] font-black uppercase tracking-widest relative z-10 hidden sm:inline">Reports</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 011-1V4z" />
                                </svg>
                                <span className="text-[10px] font-black uppercase tracking-widest relative z-10 hidden sm:inline">Command Center</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

        </nav>
    );
};

export default Header;
