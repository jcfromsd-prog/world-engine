import React from 'react';
import { motion } from 'framer-motion';

const TrustTestimonials: React.FC = () => {
    const testimonials = [
        {
            name: "Neon_Architect",
            earnings: "$12,450",
            role: "Full Stack Solver",
            quote: "I paid off my student loans in 3 months just by solving weekend bounties. The instant verification is a game changer."
        },
        {
            name: "Cyber_Sentinel",
            earnings: "$8,200",
            role: "Security Researcher",
            quote: "Finally, a platform that respects zero-trust security. I don't have to sign 10 NDAs just to fix a vulnerability."
        },
        {
            name: "Bio_Hacker",
            earnings: "$5,100",
            role: "Data Scientist",
            quote: "I use the World Engine to fund my PhD research. The 'Clean Energy' bounties let me work on what actually matters."
        }
    ];

    return (
        <section className="border-t border-gray-800 bg-zinc-900/50 p-8 py-20">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-center text-3xl font-bold mb-10 tracking-tight uppercase">
                    REAL PEOPLE. REAL EARNINGS.
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-zinc-900 border border-gray-800 p-8 relative group hover:border-green-500/30 transition-all"
                        >
                            {/* Verified Badge */}
                            <div className="absolute -top-3 left-6 px-2 py-0.5 bg-black text-green-500 text-[10px] font-bold border border-green-900 uppercase tracking-widest z-10">
                                ✓ VERIFIED
                            </div>

                            <div className="mb-4">
                                <h4 className="font-black text-lg text-white group-hover:text-green-400 transition-colors uppercase italic">
                                    {t.name}
                                </h4>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-none mt-1">
                                    {t.role}
                                </p>
                            </div>

                            <p className="text-gray-300 italic mb-8 leading-relaxed text-sm">
                                "{t.quote}"
                            </p>

                            <div className="pt-4 border-t border-gray-800 flex justify-between items-center">
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total Earned:</span>
                                <span className="font-mono text-green-400 font-bold">{t.earnings}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustTestimonials;
