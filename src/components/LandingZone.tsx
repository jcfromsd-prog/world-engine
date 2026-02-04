import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import SkillSparkEngine from './SkillSparkEngine';
import SolverSpotlight from './SolverSpotlight';
import TrustTestimonials from './TrustTestimonials';
import MorningAlignment from './MorningAlignment';
import FutureLegends from './FutureLegends';
import { Zap, Shield, Lock } from 'lucide-react';
import { getProfile, type Profile } from '../lib/supabase';
import Header from './Header'; // Assuming Header component exists and is imported
import SolveAndEarnButton from './SolveAndEarnButton';

const LandingZone = ({
    onOpenDiscovery,
    viewMode,
    setViewMode,
    isLocked = false,
    onToggleNeural,
    isAdmin = false
}: {
    onOpenDiscovery?: () => void;
    viewMode?: 'solver' | 'client';
    setViewMode?: (mode: 'solver' | 'client') => void;
    isLocked?: boolean;
    onToggleNeural?: () => void;
    isAdmin?: boolean;
}) => {
    const { isAuthenticated, user } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        if (isAuthenticated && user) {
            getProfile(user.id).then(data => {
                if (data) setProfile(data);
            });
        }
    }, [isAuthenticated, user]);

    return (
        <div className="min-h-screen bg-black text-white font-mono selection:bg-green-900 selection:text-green-50">

            {/* 1. HERO SECTION (Only for unauthenticated) */}
            <Header
                onOpenDiscovery={onOpenDiscovery}
                viewMode={viewMode || 'solver'}
                setViewMode={setViewMode || (() => { })}
                squadActive={isAdmin} // Use logic to show S or CC
                onToggleNeural={onToggleNeural}
            />

            {!isAuthenticated && (
                <section className="relative py-24 md:py-32 px-6 border-b border-gray-900 bg-black overflow-hidden animate-in fade-in duration-700">
                    <div className="relative z-10 max-w-7xl mx-auto text-center">

                        {/* 1. THE BIG NEON WORDS */}
                        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 mb-12 font-black text-4xl md:text-6xl lg:text-7xl tracking-tighter leading-tight">
                            <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                                CONNECT
                            </span>
                            <span className="text-gray-800 font-light text-2xl md:text-5xl mx-2">/</span>

                            <span className="text-indigo-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                                LEARN
                            </span>
                            <span className="text-gray-800 font-light text-2xl md:text-5xl mx-2">/</span>

                            <span className="text-fuchsia-500 drop-shadow-[0_0_15px_rgba(217,70,239,0.4)]">
                                SOLVE
                            </span>
                            <span className="text-gray-800 font-light text-2xl md:text-5xl mx-2">/</span>

                            <span className="text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                                EARN
                            </span>
                        </div>

                        {/* 2. THE RADIOACTIVE "SOLVE & EARN" BUTTON */}
                        <SolveAndEarnButton onClick={() => onOpenDiscovery?.()} />

                        {/* 3. SUB-LINKS */}
                        <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-[10px] md:text-xs text-gray-400 font-bold tracking-widest uppercase mb-16">
                            <span className="hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                                LEARN (AI-TUTORED)
                            </span>
                            <span className="text-gray-800">•</span>
                            <span className="hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                                SQUAD (TEAM UP)
                            </span>
                            <span className="text-gray-800">•</span>
                            <span className="hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                                EARN (CASH XP)
                            </span>
                        </div>

                        <div className="text-gray-700 text-[10px] tracking-[0.4em] uppercase font-mono">
                            Built with the Global Innovation Stack
                        </div>
                    </div>
                </section>
            )}

            {/* STATS BAR */}
            <div className="bg-black border-b border-gray-900 py-6 text-center text-[10px] text-gray-600 tracking-widest flex flex-wrap justify-center gap-10 px-4 uppercase">
                <span className="hover:text-gray-400 transition-colors cursor-help">Zero Data Leaks</span>
                <span className="hidden md:inline text-gray-900">•</span>
                <span className="hover:text-gray-400 transition-colors cursor-help">Instant Payouts</span>
                <span className="hidden md:inline text-gray-900">•</span>
                <span className="hover:text-gray-400 transition-colors cursor-help">Sovereign Architecture</span>
            </div>

            {/* 2. CORE ENGINE (2-Column Layout) */}
            <main id="feed" className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">

                {/* LEFT COLUMN: BOUNTY FEED */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Morning Alignment integration */}
                    {isAuthenticated && (
                        <div className="mb-8">
                            <MorningAlignment
                                userName={profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || "Sovereign"}
                                userGoal={profile?.goal || "Master your craft"}
                                userLevel={profile ? Math.floor((profile.reputation_points || 0) / 100) + 1 : 1}
                            />
                        </div>
                    )}

                    <div className="mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2 uppercase">
                            <Zap className="text-yellow-400" /> Global Skill Spark Feed
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">
                            Real-time streams of capital waiting for sovereign deployment.
                            Zero interviews. Pure execution.
                        </p>
                    </div>

                    {/* Feed Container */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <div className="relative">
                            <SkillSparkEngine isLocked={isLocked} />
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: LEADERBOARD & SPOTLIGHT */}
                <div className="space-y-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-200 uppercase tracking-tight italic">
                            Weekly Top Solvers
                        </h2>
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest">
                            The most impactful engineers on the network this week.
                        </p>
                    </div>

                    <SolverSpotlight />

                    <button className="w-full py-2 border border-gray-700 text-gray-400 hover:bg-gray-800 text-xs transition-colors font-mono uppercase tracking-widest">
                        View Full Leaderboard →
                    </button>
                </div>
            </main>

            {/* 3. THE ARCHETYPES */}
            <div className="border-t border-gray-800">
                <FutureLegends />
            </div>

            {/* 4. TRUST & CREDIBILITY (Testimonials) */}
            <TrustTestimonials />

            {/* FOOTER */}
            <footer className="border-t border-gray-900 p-10 text-center mt-12 bg-black">
                <div className="flex justify-center gap-6 mb-6">
                    <div className="p-3 bg-zinc-900/50 rounded-full text-gray-500 hover:bg-green-500 hover:text-black transition-all cursor-pointer">
                        <Shield size={18} />
                    </div>
                    <div className="p-3 bg-zinc-900/50 rounded-full text-gray-500 hover:bg-green-500 hover:text-black transition-all cursor-pointer">
                        <Zap size={18} />
                    </div>
                    <div className="p-3 bg-zinc-900/50 rounded-full text-gray-500 hover:bg-green-500 hover:text-black transition-all cursor-pointer">
                        <Lock size={18} />
                    </div>
                </div>
                <p className="text-gray-700 text-xs">© 2026 MyBestPurpose. All rights reserved.</p>
            </footer>

        </div>
    );
};

export default LandingZone;
