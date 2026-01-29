import { motion } from 'framer-motion';

const EnterpriseHero = () => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">

            {/* PROFESSIONAL NAV - ENHANCED */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 w-full">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                    {/* 1. LOGO (with hover animation) */}
                    <div className="flex items-center gap-2 cursor-pointer group">
                        <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-300 transition-all duration-200">
                            W
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-800">
                            World Engine <span className="text-blue-600 font-medium">Enterprise</span>
                        </span>
                    </div>

                    {/* 2. LINKS (Centered & Clean - with Demo) */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                        <a href="#" className="hover:text-blue-700 transition">Security</a>
                        <a href="#" className="hover:text-blue-700 transition">Case Studies</a>
                        <a href="#" className="hover:text-blue-700 transition">Pricing</a>
                        <a href="#" className="text-blue-600 font-semibold hover:text-blue-800 transition flex items-center gap-1">
                            Watch Demo <span className="text-xs">→</span>
                        </a>
                    </div>

                    {/* 3. ACTIONS (Login + CTA + Mobile Menu) */}
                    <div className="flex items-center gap-4">
                        {/* Desktop: Log in link */}
                        <a href="#" className="hidden sm:block text-sm font-semibold text-slate-900 hover:text-blue-700 transition">
                            Log in
                        </a>

                        {/* Outline Style CTA to avoid fighting with Hero primary */}
                        <button className="hidden sm:block px-5 py-2.5 border-2 border-blue-600 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-50 transition-all">
                            Talk to Sales
                        </button>

                        {/* Mobile Hamburger Menu */}
                        <button className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition">
                            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* HERO SECTION */}
            <div className="w-full max-w-7xl mx-auto px-6 pt-20 pb-32 grid lg:grid-cols-2 gap-16 items-center">

                {/* LEFT: The Pitch */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-block px-3 py-1 mb-6 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
                        Trusted by Fortune 500 R&D Teams
                    </div>

                    <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
                        Clear your backlog. <br />
                        <span className="text-blue-700">Without the headcount.</span>
                    </h1>

                    <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                        Deploy capital, not contracts. Access a vetted global swarm of AI-augmented engineers who treat your technical debt as a paid asset.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition shadow-xl shadow-emerald-200 flex items-center justify-center gap-2">
                            Book a Meeting
                            <span>→</span>
                        </button>
                        <button className="px-8 py-4 bg-white border border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition flex items-center justify-center gap-2 group">
                            Engine Pass <span className="text-slate-400 font-normal">($499/mo)</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>

                    <div className="mt-10 flex items-center gap-4 text-sm text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                            <span className="text-green-500 text-lg">✓</span> SOC2 Type II Compliant
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="text-green-500 text-lg">✓</span> IP Indemnification
                        </span>
                    </div>
                </motion.div>

                {/* RIGHT: The Visual Proof (Clean Interface Mockup) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="relative"
                >
                    {/* Abstract Blue Blob Background */}
                    <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-full blur-3xl opacity-70 z-0"></div>

                    {/* Card: The "Savings Math" */}
                    <div className="relative z-10 bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Cost Comparison</span>
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                            </div>
                        </div>

                        <div className="p-8 grid gap-8">
                            {/* Traditional Way */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="font-semibold text-slate-900">Your Senior Engineer</span>
                                    <span className="text-red-500 font-mono font-bold">$120 / hr</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className="bg-slate-300 h-2 rounded-full w-full"></div>
                                </div>
                                <p className="text-xs text-slate-400 mt-2">Burnt out on maintenance & data cleaning</p>
                            </div>

                            {/* The Engine Way */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="font-semibold text-blue-700 flex items-center gap-2">
                                        Engine Solver
                                        <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full">AI Augmented</span>
                                    </span>
                                    <span className="text-green-600 font-mono font-bold">$20 / Fixed</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full w-[15%]"></div>
                                </div>
                                <p className="text-xs text-slate-400 mt-2">Paid only upon verified solution (100% Success Rate)</p>
                            </div>
                        </div>

                        <div className="bg-green-50 p-4 border-t border-green-100 text-center">
                            <p className="text-green-800 font-bold text-sm">
                                Total Savings: 85% per ticket
                            </p>
                        </div>
                    </div>
                </motion.div>

            </div>

            {/* TRUST TICKER (Clean Greyscale) */}
            <div className="border-t border-slate-200 bg-slate-50 py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.3em] mb-10">
                        Built on Industry Leading Infrastructure
                    </p>
                    <div className="flex flex-wrap justify-center gap-16 opacity-100 grayscale transition hover:grayscale-0 items-center">
                        <span className="text-2xl font-black text-slate-600 font-mono tracking-tighter">stripe</span>
                        <span className="text-2xl font-bold text-slate-600 font-sans tracking-tight">supabase</span>
                        <span className="text-2xl font-black text-slate-600 font-serif lowercase italic">openai</span>
                        <span className="text-2xl font-bold text-slate-600 font-sans uppercase tracking-[0.2em]">framer</span>
                        <span className="text-2xl font-black text-slate-600 font-mono">vercel</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default EnterpriseHero;
