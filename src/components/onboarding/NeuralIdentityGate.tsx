import { supabase } from "../../lib/supabase";

// ... (existing imports)

export const NeuralIdentityGate: React.FC<NeuralGateProps> = ({ onComplete, onCancel }) => {
    const [stage, setStage] = useState<"INTRO" | "QUESTION" | "ANALYSIS" | "RESULT" | "AUTH">("INTRO");
    // ... (existing state)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    // ... (existing effects and helper functions)

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
        setTimeout(() => {
            determineArchetype(userInput);
            setStage("RESULT");
        }, 2500);
    };

    const goToAuth = () => {
        setStage("AUTH");
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        setIsRegistering(true);
        setAuthError(null);

        try {
            // 1. Create Supabase User
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: userInput.substring(0, 20) || "Initiate",
                        archetype: ARCHETYPES[archetype].title,
                        squad: archetype
                    }
                }
            });

            if (error) throw error;

            if (data.user) {
                // 2. Complete Onboarding with REAL ID
                onComplete({
                    name: userInput.substring(0, 20) || "Initiate",
                    grade: "Level 1",
                    passion: ARCHETYPES[archetype].title,
                    squad: `The ${ARCHETYPES[archetype].title} Squad`
                });
            } else {
                throw new Error("Registration failed. Please try again.");
            }

        } catch (err: any) {
            console.error("Auth Error:", err);
            setAuthError(err.message || "Connection refused. Check credentials.");
            setIsRegistering(false);
        }
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
                    // ... (existing INTRO rendering)
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
                            onClick={goToAuth}
                            className={`w-full py-4 bg-zinc-800 ${ARCHETYPES[archetype].border} border text-white font-bold rounded-xl hover:bg-zinc-700 transition-all uppercase tracking-widest text-sm`}
                        >
                            Confirm Identity
                        </button>
                    </motion.div>
                )}

                {stage === "AUTH" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-zinc-900/90 border border-cyan-500/30 p-8 rounded-3xl w-full max-w-md backdrop-blur-xl shadow-2xl"
                    >
                        <h2 className="text-cyan-400 text-xs uppercase tracking-[0.2em] mb-6 animate-pulse">Neural Link Required</h2>

                        {authError && (
                            <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded text-red-200 text-xs">
                                {authError}
                            </div>
                        )}

                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label className="block text-left text-[10px] uppercase text-zinc-500 font-bold mb-1">Neural ID (Email)</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none transition-colors font-mono"
                                    placeholder="initiate@world.engine"
                                />
                            </div>
                            <div>
                                <label className="block text-left text-[10px] uppercase text-zinc-500 font-bold mb-1">Access Key (Password)</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none transition-colors font-mono"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isRegistering}
                                className="w-full py-4 mt-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(8,145,178,0.4)]"
                            >
                                {isRegistering ? "Establishing Link..." : "Initialize Link"}
                            </button>
                        </form>
                    </motion.div>
                )}
            </div>

            <button onClick={onCancel} className="fixed top-6 right-6 text-zinc-600 hover:text-white text-[10px] uppercase tracking-widest transition-colors">
                Abort Sequence
            </button>
        </div>
    );
};
