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
                        CONNECT. SOLVE. EARN.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                            BUILD YOUR LEGEND.
                        </span>
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="flex flex-col items-center"
                    >
                        <br />
                        <span className="text-cyan-400 font-bold text-sm tracking-widest uppercase bg-slate-900/50 px-4 py-2 rounded-full border border-cyan-500/30 backdrop-blur-sm">
                            Executive Vision Statement
                        </span>
                    </motion.div>
                </div>
            </section>

            {/* The Vision Content Section */}
            <section className="py-24 px-6 bg-gradient-to-b from-slate-950 to-black border-y border-white/5">
                <div className="max-w-4xl mx-auto">

                    {/* Core Proposition */}
                    <div className="mb-20 text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-black mb-8 text-white tracking-tight">Core Proposition</h2>
                        <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-light">
                            Replace structured classroom education with a <span className="text-cyan-400 font-semibold">persistent, multiplayer simulation</span> where every interaction builds verifiable competence, real income, and lifelong purpose—bypassing traditional diplomas and accelerating entry into the workforce.
                        </p>
                    </div>

                    <h2 className="text-4xl font-black mb-12 text-center text-gradient uppercase tracking-widest">Platform Design</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Access & Onboarding */}
                        <div className="space-y-6 p-8 bg-slate-900/30 rounded-3xl border border-white/5 hover:border-cyan-500/30 transition-colors group">
                            <h3 className="text-2xl font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">1. Access & Onboarding</h3>
                            <p className="text-slate-400 leading-relaxed">
                                No forms. No age check. User opens browser, enters persistent world. AI mentor—Sage—opens conversation: <span className="text-white italic">"What did you finish last? Let’s build on it."</span>
                            </p>
                        </div>

                        {/* Learning Engine */}
                        <div className="space-y-6 p-8 bg-slate-900/30 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-colors group">
                            <h3 className="text-2xl font-bold text-purple-400 group-hover:text-purple-300 transition-colors">2. Learning Engine</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Curriculum emerges from live problems posted by businesses: inventory math, design fixes, simple scripts. Each task embeds national standards—<span className="text-white">algebra, civics, physics</span>—without labels.
                            </p>
                            <ul className="text-sm text-slate-500 space-y-2 list-disc pl-5 mt-4">
                                <li>Digital asset stored in Vault</li>
                                <li>Cash deposit, immediately withdrawable</li>
                                <li>Skill badge verified by peer vote and client receipt</li>
                            </ul>
                        </div>

                        {/* Revenue Distribution (Moved from Architects section context to here as requested in Platform Design or kept in Architects? Vision says Revenue Distribution is a section) */}
                        <div className="space-y-6 p-8 bg-slate-900/30 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-colors group">
                            <h3 className="text-2xl font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">3. Revenue Distribution</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Fee structure is variable. James Morris sets weekly allocations—marketing, compliance, product development, solver earnings, platform reserve—displayed in real-time dashboard for transparency and adjustment.
                            </p>
                        </div>

                        {/* Collaboration Framework */}
                        <div className="space-y-6 p-8 bg-slate-900/30 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-colors group">
                            <h3 className="text-2xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors">4. Collaboration Framework</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Users join squads based on stated mission: "Clean Energy Squad", "Food Supply Chain", "Neighborhood Code". Cross-age, cross-border teams solve one bounty together; individual roles are logged, group payout is split by contribution weight.
                            </p>
                        </div>

                        {/* Assessment Method */}
                        <div className="space-y-6 p-8 bg-slate-900/30 rounded-3xl border border-white/5 hover:border-orange-500/30 transition-colors group">
                            <h3 className="text-2xl font-bold text-orange-400 group-hover:text-orange-300 transition-colors">5. Assessment Method</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Failure is data, not shame. When output fails—bridge buckles, code crashes—Sage triggers a micro-lesson: <span className="text-white italic">"See the force vector? Forty-five seconds."</span> User decides: pay micro-hint or retry blind. Mastery is proven by reuse, not a test.
                            </p>
                        </div>

                        {/* Output & Transition */}
                        <div className="space-y-6 p-8 bg-slate-900/30 rounded-3xl border border-white/5 hover:border-yellow-500/30 transition-colors group">
                            <h3 className="text-2xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors">6. Output & Transition</h3>
                            <p className="text-slate-400 leading-relaxed">
                                By age sixteen the Vault is a resume: twenty assets, eight hundred dollars earned, client testimonials. Employers pull profiles via API. No transcript required—just evidence of solving problems that pay.
                            </p>
                        </div>
                    </div>

                    {/* UI Action Table (Legacy Feature Comparison) */}
                    <div className="mt-24 overflow-x-auto">
                        <table className="w-full text-left border-collapse border border-slate-800 rounded-xl overflow-hidden">
                            <thead>
                                <tr className="bg-slate-900">
                                    <th className="p-4 border border-slate-800 text-cyan-400 uppercase text-xs tracking-widest">Area</th>
                                    <th className="p-4 border border-slate-800 text-cyan-400 uppercase text-xs tracking-widest">Supreme Modification</th>
                                    <th className="p-4 border border-slate-800 text-cyan-400 uppercase text-xs tracking-widest">Psychological Intent</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                <tr>
                                    <td className="p-4 border border-slate-800 font-bold">Login</td>
                                    <td className="p-4 border border-slate-800 text-slate-400">Replace Form with Sage Chat</td>
                                    <td className="p-4 border border-slate-800 text-slate-500 italic">Establishes the "Mentor" relationship immediately.</td>
                                </tr>
                                <tr>
                                    <td className="p-4 border border-slate-800 font-bold">Dashboard</td>
                                    <td className="p-4 border border-slate-800 text-slate-400">Morning Alignment Widget</td>
                                    <td className="p-4 border border-slate-800 text-slate-500 italic">Ensures every day begins with Purpose.</td>
                                </tr>
                                <tr>
                                    <td className="p-4 border border-slate-800 font-bold">Wallet</td>
                                    <td className="p-4 border border-slate-800 text-slate-400">Rename to "Vault" (Locked/Unlocked)</td>
                                    <td className="p-4 border border-slate-800 text-slate-500 italic">Triggers "Loss Aversion" to motivate work.</td>
                                </tr>
                                <tr>
                                    <td className="p-4 border border-slate-800 font-bold">Job Feed</td>
                                    <td className="p-4 border border-slate-800 text-slate-400">Rename to "Skill Spark Feed"</td>
                                    <td className="p-4 border border-slate-800 text-slate-500 italic">Reframes "Labor" as "Opportunity."</td>
                                </tr>
                                <tr>
                                    <td className="p-4 border border-slate-800 font-bold">Work</td>
                                    <td className="p-4 border border-slate-800 text-slate-400">Sage Assist Sidebar</td>
                                    <td className="p-4 border border-slate-800 text-slate-500 italic">Maintains the critical "Flow State."</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* The Team / Architects Section */}
            <section className="py-24 px-6 bg-slate-950 border-t border-slate-900">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-center text-4xl font-black mb-16 tracking-tighter">THE ARCHITECTS OF THE ENGINE</h2>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Founder 1 */}
                        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                            <div className="relative group">
                                <img
                                    src="/mybestpurpose.com%20Founder%20James%20Morris.JPG"
                                    alt="James Morris - Founder"
                                    className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-white shadow-[0_4px_15px_rgba(0,0,0,0.1)] shrink-0 bg-slate-800"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        const fallback = document.getElementById('founder-fallback');
                                        if (fallback) fallback.classList.remove('hidden');
                                    }}
                                />
                                <div id="founder-fallback" className="hidden absolute inset-0 w-32 h-32 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-bold text-white border-4 border-slate-800">
                                    JM
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-white mb-1">James Morris</h3>
                                <p className="text-cyan-400 font-bold text-sm mb-3">Chief Architect & Visionary</p>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    The strategic mind behind the MyBestPurpose WORLD HUMAN POTENTIAL ENGINE. James is obsessed with transforming the "Gig Economy" into a "Sovereign Achievement Layer." He built the Engine to ensure you build your life's work, not just your resume.
                                </p>
                            </div>
                        </div>

                        {/* Founder 2 */}
                        <div className="flex gap-6 items-start">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 shrink-0 relative overflow-hidden">
                                <div className="absolute inset-0 bg-black/20 animate-pulse"></div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Sage (Ancient Technologist)</h3>
                                <p className="text-purple-400 text-sm mb-2">Neural Guardian</p>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    More than AI. Sage is your Socratic mentor. She handles the "Neural Identity Gate," optimizes your "Skill Spark" path, and ensures "Morning Alignment" leads to real Impact Velocity.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-32 px-6 bg-black text-center">
                <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter">Enter The World</h2>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
                    mybestpurpose.com is the place where users keep the same joystick thrill of Minecraft or Roblox, but leave with bank statements, not XP bars. Colleges become optional polish; purpose begins in eighth grade.
                </p>
                <Link
                    to="/"
                    className="inline-block px-12 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xl rounded-full hover:scale-105 transition-transform shadow-xl shadow-cyan-500/20"
                >
                    INITIATE ARCHETYPE DISCOVERY
                </Link>
            </section>
        </div>
    );
};

export default Manifesto;
