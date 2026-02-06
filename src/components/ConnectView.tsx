import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ArrowLeft, Search, CheckCircle, Users2, Zap } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { SQUAD_REGISTRY, type SquadDefinition } from '../data/SquadRegistry';

interface ConnectViewProps {
    onBack: () => void;
}

const ConnectView: React.FC<ConnectViewProps> = ({ onBack }) => {
    const { userProfile, heroPath, joinSquad, squad } = useUser();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterByMatch, setFilterByMatch] = useState(true);
    const [joiningId, setJoiningId] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState<SquadDefinition | null>(null);

    // Smart Matching Logic
    const filteredSquads = useMemo(() => {
        return SQUAD_REGISTRY.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

            if (!filterByMatch) return matchesSearch;

            // Smart Match: Check user passion in tags OR user role in requiredRole
            const userPassion = userProfile?.passion?.toLowerCase() || '';
            const userRole = heroPath?.role?.toLowerCase() || '';

            const passionMatch = s.tags.some(t => t.toLowerCase() === userPassion);
            const roleMatch = s.requiredRole.toLowerCase().includes(userRole) || userRole.includes(s.requiredRole.toLowerCase());

            return matchesSearch && (passionMatch || roleMatch);
        });
    }, [searchTerm, filterByMatch, userProfile, heroPath]);

    const handleJoin = async (squadDef: SquadDefinition) => {
        setJoiningId(squadDef.id);

        // Simulate network handshake
        await new Promise(resolve => setTimeout(resolve, 2000));

        joinSquad({
            id: squadDef.id,
            name: squadDef.name,
            role: squadDef.requiredRole
        });

        setJoiningId(null);
        setShowSuccess(squadDef);
    };

    return (
        <div className="fixed inset-0 z-[150] bg-[#050505] overflow-y-auto">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5 p-6 md:p-8 flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-black uppercase tracking-widest text-xs">Back to Hub</span>
                </button>

                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 text-indigo-400 mb-1">
                        <Users2 size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Connect Protocol</span>
                    </div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Squad Matchmaking</h1>
                </div>

                <div className="w-[100px]" /> {/* Spacer */}
            </header>

            <main className="max-w-7xl mx-auto p-6 pt-12">
                {/* Search & Intelligence Controls */}
                <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
                    <div className="relative w-full md:max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search by mission or tag..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-14 bg-zinc-900/50 border border-zinc-800 rounded-2xl pl-12 pr-6 text-white font-medium outline-none focus:border-indigo-500/50 transition-all"
                        />
                    </div>

                    <button
                        onClick={() => setFilterByMatch(!filterByMatch)}
                        className={`flex items-center gap-3 px-6 h-14 rounded-2xl border transition-all font-black uppercase tracking-widest text-[10px] ${filterByMatch
                            ? "bg-indigo-500/10 border-indigo-500/50 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                            : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                            }`}
                    >
                        <Zap size={14} className={filterByMatch ? "animate-pulse" : ""} />
                        {filterByMatch ? "Smart Match Active" : "All Squads"}
                    </button>
                </div>

                {/* Subtitle / Context */}
                <div className="mb-8">
                    <h2 className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                        {filterByMatch ? `Squads optimized for a ${userProfile?.passion} ${heroPath?.role}` : "Available Commercial & Impact Squads"}
                    </h2>
                </div>

                {/* Squad Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredSquads.map((s, i) => (
                        <motion.div
                            key={s.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`group relative bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-[2.5rem] p-8 hover:border-indigo-500/30 transition-all hover:bg-zinc-900/60 flex flex-col ${squad?.id === s.id ? "border-green-500/50 bg-green-500/5" : ""
                                }`}
                        >
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {s.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-zinc-950 border border-zinc-800 text-zinc-500 text-[9px] font-black uppercase tracking-widest rounded-full group-hover:border-zinc-700 transition-colors">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <h3 className="text-2xl font-black text-white mb-2 leading-tight uppercase tracking-tighter">{s.name}</h3>
                            <p className="text-zinc-500 text-sm mb-8 flex-1 leading-relaxed">
                                {s.mission}
                            </p>

                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                                <div>
                                    <div className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Required Role</div>
                                    <div className="text-indigo-400 font-bold text-xs">{s.requiredRole}</div>
                                </div>

                                {squad?.id === s.id ? (
                                    <div className="flex items-center gap-2 text-green-500 font-black uppercase tracking-widest text-[10px]">
                                        <CheckCircle size={14} /> Joined
                                    </div>
                                ) : (
                                    <button
                                        disabled={joiningId !== null || !!squad}
                                        onClick={() => handleJoin(s)}
                                        className={`px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${joiningId === s.id
                                            ? "bg-zinc-800 text-zinc-600 animate-pulse"
                                            : !!squad
                                                ? "bg-zinc-900/50 text-zinc-700 cursor-not-allowed border border-zinc-800"
                                                : "bg-white text-black hover:bg-indigo-400 hover:scale-105"
                                            }`}
                                    >
                                        {joiningId === s.id ? "Handshake..." : "Request to Join"}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {filteredSquads.length === 0 && (
                        <div className="col-span-full py-24 text-center">
                            <div className="text-4xl mb-4 opacity-50">📡</div>
                            <h3 className="text-zinc-500 font-black uppercase tracking-widest text-sm">No Squads Found in this Sector</h3>
                            <button
                                onClick={() => { setSearchTerm(''); setFilterByMatch(false); }}
                                className="mt-4 text-indigo-400 hover:text-white transition-colors text-xs font-bold"
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Success Overlay */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="w-full max-w-lg bg-zinc-950 border border-zinc-800 p-12 rounded-[3.5rem] shadow-[0_0_100px_rgba(99,102,241,0.2)] text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

                            <div className="w-24 h-24 bg-indigo-500 rounded-full mx-auto flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(99,102,241,0.4)]">
                                <Users size={48} className="text-black" />
                            </div>

                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Neural Link Established</h2>
                            <p className="text-zinc-500 mb-10 leading-relaxed">
                                You are now a deployed operative of <span className="text-indigo-400 font-bold">{showSuccess.name}</span>.
                                Syncing encrypted comms channels...
                            </p>

                            <button
                                onClick={() => { setShowSuccess(null); onBack(); }}
                                className="w-full py-6 bg-white hover:bg-indigo-400 text-black rounded-2xl font-black uppercase tracking-[0.4em] text-xs transition-all shadow-2xl"
                            >
                                Initiate Deployment
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ConnectView;
