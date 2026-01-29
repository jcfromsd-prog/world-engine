import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ExplainerVideo: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <section className="w-full bg-black py-16 px-4 border-b border-slate-900">
            <div className="max-w-5xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-8"
                >
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                        HOW THE <span className="text-cyan-400">WORLD ENGINE</span> WORKS
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Turn your code into capital in 3 simple steps. No interviews. No contracts. Just solve.
                    </p>
                </motion.div>

                {/* Video Container */}
                <motion.div
                    className="relative w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl shadow-cyan-900/10 group cursor-pointer"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    onClick={() => setIsPlaying(true)}
                >
                    {!isPlaying ? (
                        <>
                            {/* Thumbnail Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

                            {/* Placeholder Grid Background */}
                            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(34,211,238,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />

                            {/* Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="w-20 h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all group-hover:bg-cyan-500/20 group-hover:border-cyan-400"
                                >
                                    <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[24px] border-l-white border-b-[12px] border-b-transparent ml-2 group-hover:border-l-cyan-400" />
                                </motion.div>
                            </div>

                            {/* Text Overlay */}
                            <div className="absolute bottom-6 left-6 z-20 text-left">
                                <span className="bg-cyan-500 text-black text-xs font-bold px-2 py-1 rounded mb-2 inline-block">WATCH DEMO</span>
                                <h3 className="text-white font-bold text-xl">The Solver's Journey: From Zero to $10k</h3>
                            </div>
                        </>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-black">
                            <p className="text-cyan-400 animate-pulse font-mono">Loading Video Module...</p>
                            {/* In production, this would be an actual <video> or <iframe src="..."> */}
                        </div>
                    )}
                </motion.div>

                {/* Steps */}
                <div className="grid md:grid-cols-3 gap-8 mt-12 text-left">
                    {[
                        { icon: '🔍', title: '1. Find a Bounty', desc: 'Browse the feed for problems that match your skills.' },
                        { icon: '⚡', title: '2. Submit Solution', desc: 'Push your code. Our "Engine Sage" AI reviews it instantly.' },
                        { icon: '💰', title: '3. Get Paid', desc: 'Funds are released to your wallet via Stripe Escrow.' }
                    ].map((step, i) => (
                        <div key={i} className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition">
                            <div className="text-4xl mb-4">{step.icon}</div>
                            <h3 className="text-white font-bold mb-2">{step.title}</h3>
                            <p className="text-slate-400 text-sm">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ExplainerVideo;
