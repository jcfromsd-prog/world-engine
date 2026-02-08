import React, { useState, useRef, useEffect } from 'react';
import { Brain, X, ArrowRight, Sparkles, Zap, Users, Target, Award, Star, Microscope, Palette, Code, Hammer, Music, Heart, PenTool, Trophy } from 'lucide-react';

// ----------------- TYPES -----------------
export interface AssessmentData {
    name: string;
    grade: number;
    passion: string;
    style: string;
}

export interface PathOption {
    role: string;
    focus: string;
    desc: string;
    pay: string;
    icon: React.ReactNode;
    mission: string;
    fit: string;
    nextUnlock: string;
}

interface AssessmentModuleProps {
    onClose: () => void;
    onComplete: (data: AssessmentData, path: PathOption) => void;
}

// ----------------- COMPONENT -----------------
const AssessmentModule: React.FC<AssessmentModuleProps> = ({ onClose, onComplete }) => {
    // MBP LOOPS: 0: Identity, 1: Grade, 2: Passion, 3: Style, 4: Result
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<AssessmentData>({ name: "", grade: 10, passion: "", style: "" });
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus input on mount
    useEffect(() => {
        if (step === 0) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [step]);

    const handleNext = (val: Partial<AssessmentData>) => {
        const nextAnswers = { ...answers, ...val };
        setAnswers(nextAnswers);
        setStep(prev => prev + 1);
        containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ----------------- UNIQUE PATH GENERATOR -----------------
    const getUniquePath = (): PathOption => {
        const { passion, style, grade } = answers;

        // Base templates based on passion
        const templates: Record<string, Partial<PathOption>> = {
            'Coding': {
                role: 'Code Breaker',
                focus: 'Algorithmic Impact',
                mission: 'Decrypt the Legacy Grid to unlock decentralized energy for the global south.',
                fit: `Your passion for ${passion.toLowerCase()} combined with ${style.toLowerCase()} makes you a perfect fit for high-stakes digital architecture.`,
                nextUnlock: 'Quantum Core Access',
                icon: <Code size={40} className="text-cyan-400" />
            },
            'Art': {
                role: 'Visual Architect',
                focus: 'Narrative Design',
                mission: 'Design the first lunar settlement interface to ensure human connection in deep space.',
                fit: `Merging your ${passion.toLowerCase()} skills with ${style.toLowerCase()} allows you to define the visual language of the future.`,
                nextUnlock: 'Holographic Media Kit',
                icon: <Palette size={40} className="text-pink-400" />
            },
            'Building': {
                role: 'Matter Shaper',
                focus: 'Hardware Systems',
                mission: 'Construct a modular reef system to restore 5 miles of dying coastline.',
                fit: `Your love for ${passion.toLowerCase()} and ${style.toLowerCase()} approach means you build the physical foundations of sanity.`,
                nextUnlock: 'Mechatronic Toolset',
                icon: <Hammer size={40} className="text-yellow-400" />
            },
            'Science': {
                role: 'Helix Guardian',
                focus: 'Bio-Ecology',
                mission: 'Engineer a carbon-sequestering moss to reverse urban heat islands.',
                fit: `Applying ${passion.toLowerCase()} via ${style.toLowerCase()} gives you the leverage to heal the planetary ecosystem.`,
                nextUnlock: 'Lab Access: Level Blue',
                icon: <Microscope size={40} className="text-green-400" />
            },
            'Helping': {
                role: 'Empathy Engine',
                focus: 'Social Architecture',
                mission: 'Coordinate a squad to deploy emergency educational pods to conflict zones.',
                fit: `Your drive for ${passion.toLowerCase()} finds its highest form through ${style.toLowerCase()}.`,
                nextUnlock: 'Squad Command Badge',
                icon: <Heart size={40} className="text-rose-400" />
            },
            'Music': {
                role: 'Sonic Strategist',
                focus: 'Acoustic Harmonics',
                mission: 'Create a vibrational frequency shield to protect marine wildlife from sonar pollution.',
                fit: `Blending ${passion.toLowerCase()} with ${style.toLowerCase()} creates a unique strategic advantage in environmental defense.`,
                nextUnlock: 'Resonance Synthesis Kit',
                icon: <Music size={40} className="text-indigo-400" />
            },
            'Sports': {
                role: 'Kinetic Captain',
                focus: 'Peak Performance',
                mission: 'Lead a high-stakes rescue simulation in zero-gravity environments.',
                fit: `Your ${passion.toLowerCase()} discipline and ${style.toLowerCase()} style make you a natural force of action.`,
                nextUnlock: 'Exo-Skeleton Rig v1',
                icon: <Trophy size={40} className="text-orange-400" />
            },
            'Writing': {
                role: 'Truth Weaver',
                focus: 'Cognitive Strategy',
                mission: 'Compose a global manifesto that overrides corporate misinformation cycles.',
                fit: `Using ${passion.toLowerCase()} through ${style.toLowerCase()} turns information into an unstoppable movement.`,
                nextUnlock: 'Cipher-Proof Quill',
                icon: <PenTool size={40} className="text-amber-400" />
            },
            'Mix': {
                role: 'Generalist Legend',
                focus: 'Cross-Disciplinary Impact',
                mission: 'Solve the first "Mystery Bounty" - a high-value task requiring every skill you have.',
                fit: `Your versatile approach to ${passion.toLowerCase()} and ${style.toLowerCase()} makes you a Swiss Army Knife for the future.`,
                nextUnlock: 'Universal Keycard',
                icon: <Zap size={40} className="text-white" />
            }
        };

        const result = templates[passion] || templates['Mix'];

        return {
            ...result,
            role: result.role || 'Initiate',
            focus: result.focus || 'Generalist',
            pay: `${grade * 50} GP + Legend XP`,
            desc: result.mission || 'Begin your journey.'
        } as PathOption;
    };

    const sessionId = React.useId().replace(/:/g, '');
    const uniquePath = step === 4 ? getUniquePath() : null;

    return (
        <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col animate-in fade-in duration-500 overflow-hidden font-sans">
            {/* ----------------- NEON BACKGROUND FLAIR ----------------- */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-600/10 blur-[150px] rounded-full" />

            {/* ----------------- PROGRESS HEADER ----------------- */}
            <div className="flex-none p-6 z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                            <Brain size={20} className="text-cyan-400 animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] leading-none">World Engine</h2>
                            <div className="text-[10px] text-zinc-500 font-mono mt-1">SAGE-IDENTITY-PROTOCOL // ACTIVATE</div>
                        </div>
                    </div>

                    {/* Step Indicators */}
                    <div className="flex items-center gap-2">
                        {[0, 1, 2, 3, 4].map((s) => (
                            <div
                                key={s}
                                className={`h-1.5 rounded-full transition-all duration-500 ${step === s ? 'w-8 bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : step > s ? 'w-4 bg-zinc-700' : 'w-2 bg-zinc-900'}`}
                            />
                        ))}
                    </div>

                    <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* ----------------- CONTENT AREA ----------------- */}
            <div ref={containerRef} className="flex-1 overflow-y-auto z-10 px-6 py-12 flex items-center justify-center">
                <div className="max-w-2xl w-full">

                    {/* STEP 0: THE CALLSIGN */}
                    {step === 0 && (
                        <div className="space-y-8 animate-in slide-in-from-bottom-12 duration-700">
                            <div className="space-y-4 text-center">
                                <span className="inline-block px-4 py-1.5 bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-cyan-500/20">Identification Required</span>
                                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Hey legend, ready to fix the world?</h1>
                                <p className="text-xl text-zinc-500">First, give us your operative callsign.</p>
                            </div>
                            <div className="relative glass-card-cyan group">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Enter callsign..."
                                    className="w-full bg-zinc-900/50 backdrop-blur-xl border-2 border-zinc-800 p-8 text-3xl font-black text-white focus:border-cyan-500 outline-none rounded-3xl transition-all placeholder:text-zinc-800 uppercase tracking-widest"
                                    onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).value && handleNext({ name: (e.target as HTMLInputElement).value })}
                                />
                                <button
                                    onClick={() => inputRef.current?.value && handleNext({ name: inputRef.current.value })}
                                    className="absolute right-4 top-4 bottom-4 px-10 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] active:scale-95"
                                >
                                    Login
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 1: GRADE/AGE */}
                    {step === 1 && (
                        <div className="space-y-8 animate-in slide-in-from-right duration-500">
                            <div className="text-center space-y-4">
                                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Phase 1: Calibration</h2>
                                <p className="text-xl text-zinc-500">What is your current training level (Grade)?</p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[7, 8, 9, 10, 11, 12, 13].map((g) => (
                                    <button
                                        key={g}
                                        onClick={() => handleNext({ grade: g })}
                                        className="p-8 bg-zinc-900/50 backdrop-blur-md border-2 border-zinc-800 hover:border-purple-500 hover:bg-purple-500/5 rounded-3xl transition-all group overflow-hidden relative"
                                    >
                                        <div className="absolute -right-4 -bottom-4 text-zinc-900 group-hover:text-purple-500/10 transition-colors font-black text-8xl leading-none">{g}</div>
                                        <div className="relative z-10 text-3xl font-black text-white">{g === 13 ? 'Uni+' : `G${g}`}</div>
                                        <div className="relative z-10 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{g > 10 ? 'Senior' : 'Junior'} Phase</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: PASSION */}
                    {step === 2 && (
                        <div className="space-y-8 animate-in slide-in-from-right duration-500">
                            <div className="text-center space-y-4">
                                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Phase 2: The Spark</h2>
                                <p className="text-xl text-zinc-500">What wakes you up in the morning?</p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[
                                    { name: 'Coding', icon: <Code />, color: 'cyan' },
                                    { name: 'Art', icon: <Palette />, color: 'pink' },
                                    { name: 'Building', icon: <Hammer />, color: 'yellow' },
                                    { name: 'Science', icon: <Microscope />, color: 'green' },
                                    { name: 'Helping', icon: <Heart />, color: 'rose' },
                                    { name: 'Writing', icon: <PenTool />, color: 'amber' },
                                    { name: 'Music', icon: <Music />, color: 'indigo' },
                                    { name: 'Sports', icon: <Trophy />, color: 'orange' },
                                    { name: 'Mix', icon: <Zap />, color: 'white' }
                                ].map((p) => (
                                    <button
                                        key={p.name}
                                        onClick={() => handleNext({ passion: p.name })}
                                        className="p-6 bg-zinc-900/50 backdrop-blur-md border-2 border-zinc-800 hover:border-white rounded-3xl flex flex-col items-center gap-4 transition-all group"
                                    >
                                        <div className={`p-4 rounded-2xl bg-zinc-950 border border-zinc-800 group-hover:scale-110 group-hover:border-white transition-all text-zinc-400 group-hover:text-white`}>
                                            {React.cloneElement(p.icon as React.ReactElement<{ size: number }>, { size: 32 })}
                                        </div>
                                        <div className="text-lg font-black text-white uppercase tracking-wider">{p.name}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: STYLE */}
                    {step === 3 && (
                        <div className="space-y-8 animate-in slide-in-from-right duration-500">
                            <div className="text-center space-y-4">
                                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Phase 3: Tactical Approach</h2>
                                <p className="text-xl text-zinc-500">How do you prefer to tackle a high-stakes mission?</p>
                            </div>
                            <div className="grid gap-4">
                                {[
                                    { id: 'Hands-on', title: 'Hands-on Ops', desc: 'I like fixing physical things and moving objects.', icon: <Hammer /> },
                                    { id: 'Logic puzzles', title: 'Logic Overrider', desc: 'I enjoy solving complex puzzles and system bugs.', icon: <Zap /> },
                                    { id: 'Team challenges', title: 'Squad Leader', desc: 'I thrive when collaborating and leading groups.', icon: <Users /> },
                                    { id: 'Solo focus', title: 'Lone Wolves', desc: 'I do my best work with deep, uninterrupted focus.', icon: <Target /> },
                                    { id: 'Mix', title: 'Hybrid Tactical', desc: 'I adapt my style to whatever the mission needs.', icon: <Award /> }
                                ].map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => handleNext({ style: s.id })}
                                        className="p-6 bg-zinc-900/50 backdrop-blur-md border-2 border-zinc-800 hover:border-cyan-400 rounded-3xl flex items-center gap-6 group transition-all text-left"
                                    >
                                        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 group-hover:border-cyan-400/50 group-hover:text-cyan-400 transition-all text-zinc-500">
                                            {React.cloneElement(s.icon as React.ReactElement<{ size: number }>, { size: 32 })}
                                        </div>
                                        <div>
                                            <div className="text-xl font-black text-white uppercase tracking-widest mb-1">{s.title}</div>
                                            <p className="text-zinc-500 group-hover:text-zinc-400 transition-colors">{s.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 4: THE UNIQUE PATH CARD */}
                    {step === 4 && uniquePath && (
                        <div className="space-y-8 animate-in zoom-in-95 duration-700">
                            <div className="text-center space-y-4">
                                <div className="flex justify-center">
                                    <div className="p-4 bg-cyan-500/10 rounded-full border border-cyan-500/30 text-cyan-400 animate-bounce">
                                        <Sparkles size={32} />
                                    </div>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Deployment Ready</h2>
                                <p className="text-xl text-zinc-500">The Sage has analyzed your DNA. Here is your unique path.</p>
                            </div>

                            {/* THE UNIQUE PATH CARD */}
                            <div className="relative">
                                {/* CARD GLOW LIGHT */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-indigo-500 rounded-[2.5rem] blur-xl opacity-20 animate-pulse" />

                                <div className="relative bg-[#0a0a0a] border-2 border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                        {uniquePath.icon}
                                    </div>

                                    {/* HEADER */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                                        <div className="flex items-center gap-4">
                                            <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center border border-zinc-800 shadow-inner">
                                                {uniquePath.icon}
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] mb-1">Path Name</div>
                                                <h3 className="text-4xl font-black text-white uppercase tracking-tight">{uniquePath.role}</h3>
                                            </div>
                                        </div>
                                        <div className="bg-zinc-900/50 border border-zinc-800 px-6 py-4 rounded-2xl text-center">
                                            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Incentive</div>
                                            <div className="text-2xl font-black text-lime-400 font-mono tracking-tighter">{uniquePath.pay}</div>
                                        </div>
                                    </div>

                                    {/* BODY */}
                                    <div className="grid md:grid-cols-2 gap-10 mb-12">
                                        <div className="space-y-6">
                                            <div>
                                                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
                                                    <Target size={12} className="text-red-500" /> First Mission
                                                </div>
                                                <p className="text-xl font-bold text-white leading-tight italic">"{uniquePath.mission}"</p>
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
                                                    <Award size={12} className="text-purple-500" /> Squad Role
                                                </div>
                                                <p className="text-white font-black uppercase tracking-widest">{uniquePath.focus}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div>
                                                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
                                                    <Zap size={12} className="text-blue-500" /> Why it Fits
                                                </div>
                                                <p className="text-zinc-400 text-sm leading-relaxed">{uniquePath.fit}</p>
                                            </div>
                                            <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-2xl flex items-center gap-4">
                                                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-zinc-600 border border-zinc-800">
                                                    <Star size={18} />
                                                </div>
                                                <div>
                                                    <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Next Unlock</div>
                                                    <div className="text-xs font-black text-white uppercase tracking-wider">{uniquePath.nextUnlock}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* FOOTER ACTION */}
                                    <div>
                                        <button
                                            onClick={() => onComplete(answers, uniquePath)}
                                            className="w-full bg-white hover:bg-zinc-200 text-black p-6 rounded-2xl font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                                        >
                                            Accept Mission <ArrowRight size={20} />
                                        </button>
                                        <p className="text-center mt-6 text-[10px] text-zinc-600 font-black uppercase tracking-[0.5em]">Your move, legend.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* MOBILE ONLY FOOTER */}
            <div className="md:hidden p-6 bg-zinc-950 border-t border-zinc-900 flex justify-center text-[8px] text-zinc-700 font-mono tracking-widest uppercase">
                Pulse-ID: {answers.name || 'ANON'}-{sessionId}
            </div>
        </div>
    );
};

export default AssessmentModule;

