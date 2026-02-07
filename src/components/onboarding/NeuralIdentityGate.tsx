import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface NeuralGateProps {
    onComplete: (profile: any) => void;
    onCancel: () => void;
}

const ARCHETYPES = {
    BUILDER: { title: "Construct", icon: "🛠️", color: "text-blue-400", border: "border-blue-500" },
    EXPLORER: { title: "Discover", icon: "🔭", color: "text-purple-400", border: "border-purple-500" },
    FIXER: { title: "Repair", icon: "🔧", color: "text-green-400", border: "border-green-500" },
    LEADER: { title: "Guide", icon: "👑", color: "text-yellow-400", border: "border-yellow-500" },
};

const SCRIPT = [
    "I am Sage. I have been waiting for a mind like yours.",
    "The world is full of noise. We are here to find the signal.",
    "Tell me, what is the one problem you see in the world that you desperately want to fix?"
];

export const NeuralIdentityGate: React.FC<NeuralGateProps> = ({ onComplete, onCancel }) => {
    const [stage, setStage] = useState<"INTRO" | "QUESTION" | "ANALYSIS" | "RESULT">("INTRO");
    const [dialogueIndex, setDialogueIndex] = useState(0);
    const [typedText, setTypedText] = useState("");
    const [userInput, setUserInput] = useState("");
    const [archetype, setArchetype] = useState<keyof typeof ARCHETYPES>("BUILDER");

    // Typing Effect
    useEffect(() => {
        if (stage === "INTRO") {
            const currentLine = SCRIPT[dialogueIndex];
            let i = 0;
            setTypedText("");
            const interval = setInterval(() => {
                setTypedText(currentLine.substring(0, i + 1));
                i++;
                if (i === currentLine.length) clearInterval(interval);
            }, 30);
            return () => clearInterval(interval);
        }
    }, [dialogueIndex, stage]);

    const determineArchetype = (input: string) => {
        const lower = input.toLowerCase();
        if (lower.includes("build") || lower.includes("create") || lower.includes("make") || lower.includes("code")) {
            setArchetype("BUILDER");
        } else if (lower.includes("find") || lower.includes("search") || lower.includes("learn") || lower.includes("why")) {
            setArchetype("EXPLORER");
        } else if (lower.includes("fix") || lower.includes("help") || lower.includes("people") || lower.includes("world")) {
            setArchetype("FIXER");
        } else {
            setArchetype("LEADER");
        }
    };

    const handleNext = () => {
        if (dialogueIndex < SCRIPT.length - 1) {
            setDialogueIndex(prev => prev + 1);
        } else {
            setStage("QUESTION");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        setStage("ANALYSIS");

        // Simulate Analysis
        setTimeout(() => {
            determineArchetype(userInput);
            setStage("RESULT");
        }, 2500);
    };

    const finalizeIdentity = () => {
        onComplete({
            name: "Initiate_01",
            grade: "Level 1",
            passion: ARCHETYPES[archetype].title,
            squad: `The ${ARCHETYPES[archetype].title} Squad`
        });
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 font-mono text-center">

            {/* SAGE AVATAR */}
            <motion.div layoutId="sage-avatar" className="mb-8 relative">
                <div className="w-24 h-24 bg-black rounded-full border border-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                    <div className={`w-12 h-12 bg-cyan-400 rounded-full blur-md animate-pulse ${stage === 'ANALYSIS' ? 'animate-ping' : ''}`} />
                </div>
            </motion.div>

            {/* TEXT AREA */}
            <div className="min-h-[180px] w-full max-w-2xl flex flex-col items-center">
                {stage === "INTRO" && (
                    <>
                        <p className="text-xl md:text-3xl text-cyan-50 drop-shadow-md mb-8 leading-relaxed">
                            {typedText}<span className="animate-pulse text-cyan-400">_</span>
                        </p>
                        {typedText === SCRIPT[dialogueIndex] && (
                            <button
                                onClick={handleNext}
                                className="animate-fade-in px-8 py-3 border border-cyan-900/50 hover:bg-cyan-900/20 rounded-full text-cyan-400 text-xs uppercase tracking-[0.2em] transition-all"
                            >
                                {dialogueIndex < SCRIPT.length - 1 ? "Initialize" : "Respond"}
                            </button>
                        )}
                    </>
                )}

                {stage === "QUESTION" && (
                    <motion.form
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        onSubmit={handleSubmit}
                        className="w-full max-w-lg"
                    >
                        <p className="text-2xl md:text-3xl text-white mb-8">
                            {SCRIPT[2]}
                        </p>
                        <input
                            autoFocus
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            className="w-full bg-transparent border-b border-cyan-500/30 py-4 text-2xl text-center text-white focus:outline-none focus:border-cyan-400 transition-all font-light"
                            placeholder="Type your answer..."
                        />
                    </motion.form>
                )}

                {stage === "ANALYSIS" && (
                    <div className="flex flex-col items-center">
                        <div className="text-cyan-400 text-xs tracking-[0.3em] animate-pulse mb-4">ANALYZING NEURAL PATTERNS</div>
                        <div className="h-1 w-64 bg-cyan-900/30 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2 }}
                                className="h-full bg-cyan-400"
                            />
                        </div>
                    </div>
                )}

                {stage === "RESULT" && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-zinc-900/80 border border-white/10 p-8 rounded-3xl w-full max-w-lg backdrop-blur-md"
                    >
                        <h2 className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] mb-6">Identity Assigned</h2>
                        <div className="text-6xl mb-4">{ARCHETYPES[archetype].icon}</div>
                        <h1 className={`text-4xl font-black ${ARCHETYPES[archetype].color} mb-2`}>{archetype}</h1>
                        <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                            Your response indicates a high compatibility with the
                            <strong className={`block mt-1 ${ARCHETYPES[archetype].color}`}> {ARCHETYPES[archetype].title} Protocol </strong>
                        </p>
                        <button
                            onClick={finalizeIdentity}
                            className={`w-full py-4 bg-zinc-800 ${ARCHETYPES[archetype].border} border text-white font-bold rounded-xl hover:bg-zinc-700 transition-all uppercase tracking-widest text-sm`}
                        >
                            Enter The Engine
                        </button>
                    </motion.div>
                )}
            </div>

            <button onClick={onCancel} className="fixed top-6 right-6 text-zinc-600 hover:text-white text-[10px] uppercase tracking-widest transition-colors">
                Abort Sequence
            </button>
        </div>
    );
};
