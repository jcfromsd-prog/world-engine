import React from 'react';
import { motion } from 'framer-motion';

const TrustTestimonials: React.FC = () => {
    const testimonials = [
        {
            name: "Neon_Architect",
            handle: "@neon_arch",
            earnings: "$12,450",
            role: "Full Stack Solver",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neon",
            quote: "I paid off my student loans in 3 months just by solving weekend bounties. The instant verification is a game changer."
        },
        {
            name: "Cyber_Sentinel",
            handle: "@sec_ops",
            earnings: "$8,200",
            role: "Security Researcher",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cyber",
            quote: "Finally, a platform that respects zero-trust security. I don't have to sign 10 NDAs just to fix a vulnerability."
        },
        {
            name: "Bio_Hacker",
            handle: "@dna_solver",
            earnings: "$5,100",
            role: "Data Scientist",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bio",
            quote: "I use the World Engine to fund my PhD research. The 'Clean Energy' bounties let me work on what actually matters."
        }
    ];

    return (
        <section className="w-full bg-slate-950 py-16 px-4 border-b border-slate-900">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <span className="text-emerald-400 font-mono text-xs tracking-widest uppercase mb-2 block">Trusted by 14,500+ Solvers</span>
                    <h2 className="text-3xl font-black text-white">
                        REAL PEOPLE. <span className="text-emerald-400">REAL EARNINGS.</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative hover:border-emerald-500/30 transition-all group"
                        >
                            {/* Verified Badge */}
                            <div className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 border border-emerald-500/20">
                                <span>✓</span> VERIFIED
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full border-2 border-slate-700 bg-slate-800" />
                                <div>
                                    <h4 className="text-white font-bold text-sm">{t.name}</h4>
                                    <p className="text-slate-500 text-xs">{t.role}</p>
                                </div>
                            </div>

                            <p className="text-slate-300 text-sm italic mb-6 leading-relaxed">
                                "{t.quote}"
                            </p>

                            <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
                                <span className="text-slate-500 text-xs">Total Earned:</span>
                                <span className="text-emerald-400 font-mono font-bold text-lg">{t.earnings}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Badges */}
                <div className="mt-16 pt-8 border-t border-slate-900 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="flex items-center gap-2 text-slate-300 font-bold text-lg"><span className="text-2xl">🔒</span> Stripe Identity</div>
                    <div className="flex items-center gap-2 text-slate-300 font-bold text-lg"><span className="text-2xl">🛡️</span> SOC2 Compliant</div>
                    <div className="flex items-center gap-2 text-slate-300 font-bold text-lg"><span className="text-2xl">⚡</span> Lightning Network</div>
                </div>
            </div>
        </section>
    );
};

export default TrustTestimonials;
