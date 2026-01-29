import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Manifesto: React.FC = () => {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center mix-blend-difference">
                <Link to="/" className="font-bold text-xl tracking-tighter hover:text-cyan-400 transition">
                    ← WORLD ENGINE
                </Link>
            </nav>

            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black" />

                <div className="relative z-10 max-w-4xl px-6 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-none"
                    >
                        DEPLOY CAPITAL.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                            IGNITE TALENT.
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="text-xl md:text-2xl text-slate-400 font-light max-w-2xl mx-auto"
                    >
                        We are building the operating system for the next generation of problem solvers.
                    </motion.p>
                </div>
            </section>

            {/* The Problem */}
            <section className="py-24 px-6 bg-slate-950 border-t border-slate-900">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-sm font-mono text-cyan-400 mb-8 uppercase tracking-widest">01 / The Disconnect</h2>
                    <p className="text-2xl md:text-4xl font-serif text-slate-200 leading-tight mb-12">
                        Talent is equally distributed. Opportunity is not.
                        Millions of brilliant engineers are stuck in "tutorial hell" or dead-end maintenance jobs,
                        while climate startups and deep-tech founders are starving for capability.
                    </p>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        The old way (resumes, 5-round interviews, 9-to-5 contracts) is too slow for the speed of modern innovation.
                        The World Engine is a liquid marketplace where proof of work replaces credentials, and micro-bounties replace bureaucracy.
                    </p>
                </div>
            </section>

            {/* The Solution */}
            <section className="py-24 px-6 bg-black">
                <div className="max-w-3xl mx-auto text-right">
                    <h2 className="text-sm font-mono text-purple-400 mb-8 uppercase tracking-widest">02 / The Engine</h2>
                    <p className="text-2xl md:text-4xl font-serif text-slate-200 leading-tight mb-12">
                        We don't just match. We verify.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        <div className="p-6 border border-slate-800 rounded-2xl hover:border-purple-500/50 transition duration-500">
                            <h3 className="font-bold text-xl mb-4 text-white">For Solvers</h3>
                            <p className="text-slate-400">
                                Stop building todo-list apps. Build real features for real companies.
                                Earn Verified Credentials that actually mean something. Get paid instantly.
                            </p>
                        </div>
                        <div className="p-6 border border-slate-800 rounded-2xl hover:border-cyan-500/50 transition duration-500">
                            <h3 className="font-bold text-xl mb-4 text-white">For Founders</h3>
                            <p className="text-slate-400">
                                Treat your backlog like a stock market. Upload "dirty data" or stuck features,
                                set a bounty price, and watch the global swarm solve it while you sleep.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Team / Bios */}
            <section className="py-24 px-6 bg-slate-950 border-t border-slate-900">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-center text-3xl font-bold mb-16">The Architects</h2>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Founder 1 */}
                        <div className="flex gap-6 items-start">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shrink-0" />
                            <div>
                                <h3 className="text-xl font-bold text-white">J. C. (The Architect)</h3>
                                <p className="text-cyan-400 text-sm mb-2">Founder & Lead Engineer</p>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Obsessed with efficiency and "flow states." Built the Guardian Protocol to ensure
                                    that code quality scales linearly with the number of contributors. Believes the future
                                    of work looks more like an MMORPG than a corporation.
                                </p>
                            </div>
                        </div>

                        {/* Founder 2 */}
                        <div className="flex gap-6 items-start">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 shrink-0" />
                            <div>
                                <h3 className="text-xl font-bold text-white">Sage (The AI)</h3>
                                <p className="text-purple-400 text-sm mb-2">Head of Operations</p>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Not just a chatbot. Sage is the first AGI co-founder, handling 24/7 verification,
                                    dispute resolution, and solver onboarding. She never sleeps, and she reads every line of code.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-32 px-6 bg-black text-center">
                <h2 className="text-4xl md:text-6xl font-black mb-8">READY TO LOG IN?</h2>
                <Link
                    to="/"
                    className="inline-block px-12 py-5 bg-white text-black font-bold text-xl rounded-full hover:scale-105 transition-transform"
                >
                    ENTER THE ENGINE
                </Link>
            </section>
        </div>
    );
};

export default Manifesto;
