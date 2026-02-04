import { Shield, Cpu, Heart, CheckCircle2 } from 'lucide-react';

const FutureLegends = () => {
    const archetypes = [
        {
            id: 1,
            name: "The Asset Builder",
            role: "Focus: Financial Sovereignty",
            quote: "I stopped renting my time for a wage. Now, I solve problems to build a permanent portfolio of verified assets.",
            icon: <Shield className="w-6 h-6 text-indigo-400" />,
            tag: "BUILDER CLASS"
        },
        {
            id: 2,
            name: "The Truth Seeker",
            role: "Focus: Skill Mastery",
            quote: "No busy work. Sage finds challenges that force me to grow. I don't just earn; I upgrade my own potential.",
            icon: <Cpu className="w-6 h-6 text-teal-400" />,
            tag: "LEARNER CLASS"
        },
        {
            id: 3,
            name: "The Impact Maker",
            role: "Focus: Global Purpose",
            quote: "I found my tribe. My 'Synaptic Squad' helps me solve bounties that actually matter to the future of our world.",
            icon: <Heart className="w-6 h-6 text-rose-400" />,
            tag: "GIVER CLASS"
        }
    ];

    return (
        <div className="bg-slate-950 py-20 border-t border-slate-900">
            <div className="container mx-auto px-6">

                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Who Thrives in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-teal-400">World Engine?</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        We don't hire employees. We empower legends. Which path will you choose?
                    </p>
                </div>

                {/* Archetype Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {archetypes.map((profile) => (
                        <div key={profile.id} className="group relative p-8 bg-slate-900/50 border border-slate-800 rounded-2xl hover:bg-slate-800 transition-all duration-300 hover:-translate-y-2">

                            {/* Hover Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-teal-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>

                            {/* Header */}
                            <div className="flex items-start justify-between mb-6 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-800 rounded-full group-hover:bg-slate-700 transition-colors border border-slate-700">
                                        {profile.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-teal-300 transition-colors">
                                            {profile.name}
                                        </h3>
                                        <p className="text-xs font-mono text-teal-500 uppercase tracking-wider mt-1">
                                            {profile.tag}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* The "Truth" Quote */}
                            <p className="text-slate-300 leading-relaxed mb-6 relative z-10 italic">
                                "{profile.quote}"
                            </p>

                            {/* Footer Stat (Replaces Fake Earnings) */}
                            <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-auto relative z-10">
                                <span className="text-sm text-slate-500 font-medium">
                                    {profile.role}
                                </span>
                                <CheckCircle2 className="w-5 h-5 text-teal-500/50 group-hover:text-teal-400 transition-colors" />
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default FutureLegends;
