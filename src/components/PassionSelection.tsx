import React from 'react';

/**
 * PASSION SELECTION COMPONENT v1.2
 * Refactored for Pedagogical Realism:
 * - Sprouts (K-2): 2 choices, phenomenon-first vocabulary.
 * - Builders (3-5): 3 choices, intermediate vocabulary.
 * - Explorers+ (9+): Full 4-6 choice engine grid.
 */

interface PassionSelectionProps {
    grade: number;
    onSelect: (passion: string) => void;
    isListening?: boolean;
}

export const PassionSelection: React.FC<PassionSelectionProps> = ({ grade, onSelect, isListening }) => {
    // Determine tier
    const isSprout = grade < 3;
    const isBuilder = grade >= 3 && grade <= 5;

    // Config based on tier
    let choices = [];
    if (isSprout) {
        choices = [
            { id: "SCIENCE", title: "Nature & Animals", sub: "Explore the outdoors", icon: "🐾", color: "border-green-500/30", hover: "hover:border-green-400" },
            { id: "CODING", title: "Building & Blocks", sub: "Make your own games", icon: "🧱", color: "border-blue-500/30", hover: "hover:border-blue-400" }
        ];
    } else if (isBuilder) {
        choices = [
            { id: "CODING", title: "Games & Apps", sub: "Code your own world", icon: "💻", color: "border-blue-500/30", hover: "hover:border-blue-400" },
            { id: "SCIENCE", title: "Earth & Nature", sub: "Protect the planet", icon: "🌿", color: "border-green-500/30", hover: "hover:border-green-400" },
            { id: "CREATIVE", title: "Art & Making", sub: "Create beautiful things", icon: "🎨", color: "border-pink-500/30", hover: "hover:border-pink-400" }
        ];
    } else {
        choices = [
            { id: "CODING", title: "Technology & Code", sub: "Engineering the future", icon: "💻", color: "border-blue-500/30", hover: "hover:border-blue-400" },
            { id: "SCIENCE", title: "Life & Earth Sciences", sub: "Sustainable ecosystems", icon: "🌿", color: "border-green-500/30", hover: "hover:border-green-400" },
            { id: "CREATIVE", title: "Creative Arts & Design", sub: "Visual and digital expression", icon: "🎨", color: "border-pink-500/30", hover: "hover:border-pink-400" },
            { id: "LEADERSHIP", title: "Leadership & Teams", sub: "Guide squads to impact", icon: "🤝", color: "border-yellow-500/30", hover: "hover:border-yellow-400" }
        ];
    }

    return (
        <div className="w-full max-w-5xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-black text-white text-center mb-10 tracking-tighter italic">
                Select Your <span className="text-green-400">Primary Engine</span>
                {isListening && <span className="ml-4 text-sm font-mono text-red-500 animate-pulse">● LISTENING</span>}
            </h1>

            <div className={`grid grid-cols-1 md:grid-cols-${choices.length} gap-8`}>
                {choices.map(c => (
                    <button
                        key={c.id}
                        id={`passion-opt-${c.id.toLowerCase()}`}
                        onClick={() => onSelect(`${c.id}|${c.title}|${c.sub}|${c.icon}`)}
                        className={`group p-10 bg-zinc-900/50 border-2 ${c.color} rounded-[2.5rem] hover:bg-zinc-800 ${c.hover} hover:-translate-y-2 transition-all flex flex-col items-center relative overflow-hidden shadow-2xl`}
                    >
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="text-7xl mb-6 group-hover:scale-110 transition-transform drop-shadow-2xl">
                            {c.icon}
                        </div>

                        <h3 className="text-2xl font-black text-white text-center leading-none uppercase tracking-tighter">
                            {c.title}
                        </h3>

                        <p className="text-sm text-zinc-500 text-center mt-3 font-medium px-4 leading-snug">
                            {c.sub}
                        </p>

                        <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white bg-white/10 px-4 py-2 rounded-full border border-white/20">
                                Initialize →
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            {isSprout && (
                <p className="mt-12 text-center text-zinc-500 text-sm font-medium animate-pulse">
                    Tap the choice that looks most fun!
                </p>
            )}
        </div>
    );
};

export default PassionSelection;
