import React, { useState, useRef, useEffect } from 'react';
import { Brain, X, ArrowRight, CheckCircle, Hammer, Terminal, Globe, Cpu, PenTool, Gamepad2, Shield, Users, Palette, Briefcase, Heart, Sparkles, Lightbulb } from 'lucide-react';

// ----------------- TYPES -----------------
export interface AssessmentData {
    name: string;
    style: string;
    interest: string;
}

export interface PathOption {
    role: string;
    focus: string;
    desc: string;
    pay: string;
    icon: React.ReactNode;
}

interface AssessmentModuleProps {
    onClose: () => void;
    onComplete: (data: AssessmentData, path: PathOption) => void;
}

// ----------------- COMPONENT -----------------
const AssessmentModule: React.FC<AssessmentModuleProps> = ({ onClose, onComplete }) => {
    const [step, setStep] = useState(0); // 0: Identity, 1: Style, 2: Target, 3: Mission
    const [answers, setAnswers] = useState<AssessmentData>({ name: "", style: "", interest: "" });
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Archetype determines mission complexity and style
    // Engineer/Architect = Technical, Creator = Artistic, Commander = Leadership
    const getArchetypeMode = () => {
        if (answers.style === 'Engineer') return 'hands-on';
        if (answers.style === 'Architect') return 'systems';
        if (answers.style === 'Creator') return 'creative';
        if (answers.style === 'Commander') return 'leadership';
        return 'general';
    };

    // Auto-focus input on mount
    useEffect(() => {
        if (step === 0) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [step]);

    const handleNext = (val: Partial<AssessmentData>) => {
        const nextAnswers = { ...answers, ...val };
        setAnswers(nextAnswers);
        if (step < 3) {
            setStep(step + 1);
            // Scroll top top for next step
            containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // ----------------- PATH GENERATION LOGIC (ARCHETYPE-AWARE) -----------------
    const getPaths = (): PathOption[] => {
        const mode = getArchetypeMode();

        // NATURE SECTOR
        if (answers.interest === "Nature") {
            if (mode === 'hands-on') return [
                { role: "Field Engineer", focus: "Sensor Networks", desc: "Deploy IoT sensors to monitor wildlife migration patterns.", pay: "$450 Start", icon: <Cpu size={32} className="text-green-400" /> },
                { role: "Eco Builder", focus: "Habitat Restoration", desc: "Construct artificial reefs and nesting structures.", pay: "$400 Start", icon: <Hammer size={32} className="text-yellow-400" /> }
            ];
            if (mode === 'systems') return [
                { role: "Bio Architect", focus: "Climate Modeling", desc: "Build predictive models for ecosystem health.", pay: "$600 Start", icon: <Terminal size={32} className="text-cyan-400" /> },
                { role: "Data Ecologist", focus: "Species Analytics", desc: "Analyze biodiversity data to guide conservation.", pay: "$550 Start", icon: <Globe size={32} className="text-blue-400" /> }
            ];
            if (mode === 'creative') return [
                { role: "Nature Storyteller", focus: "Documentary Media", desc: "Create compelling content for wildlife awareness.", pay: "$350 Start", icon: <Palette size={32} className="text-pink-400" /> },
                { role: "Eco Designer", focus: "Campaign Visuals", desc: "Design graphics for environmental movements.", pay: "$300 Start", icon: <PenTool size={32} className="text-purple-400" /> }
            ];
            // Commander / Leadership
            return [
                { role: "Eco Strategist", focus: "Conservation Planning", desc: "Coordinate multi-team restoration initiatives.", pay: "$700 Start", icon: <Users size={32} className="text-orange-400" /> },
                { role: "Policy Architect", focus: "Environmental Law", desc: "Draft proposals for sustainable legislation.", pay: "$650 Start", icon: <Briefcase size={32} className="text-amber-400" /> }
            ];
        }

        // TECH SECTOR
        if (answers.interest === "Tech") {
            if (mode === 'hands-on') return [
                { role: "Robotics Engineer", focus: "Hardware Assembly", desc: "Build and calibrate autonomous drones.", pay: "$600 Start", icon: <Gamepad2 size={32} className="text-purple-400" /> },
                { role: "Maker Specialist", focus: "Prototyping", desc: "Fabricate custom components for R&D teams.", pay: "$500 Start", icon: <Hammer size={32} className="text-yellow-400" /> }
            ];
            if (mode === 'systems') return [
                { role: "Code Ronin", focus: "Full-Stack Dev", desc: "Architect scalable applications from scratch.", pay: "$800 Start", icon: <Terminal size={32} className="text-cyan-400" /> },
                { role: "Logic Warden", focus: "Cyber Security", desc: "Defend networks against sophisticated threats.", pay: "$900 Start", icon: <Shield size={32} className="text-red-400" /> }
            ];
            if (mode === 'creative') return [
                { role: "UX Architect", focus: "Interface Design", desc: "Craft intuitive user experiences for apps.", pay: "$450 Start", icon: <Sparkles size={32} className="text-pink-400" /> },
                { role: "Brand Alchemist", focus: "Tech Marketing", desc: "Design visual identities for startups.", pay: "$400 Start", icon: <Palette size={32} className="text-purple-400" /> }
            ];
            // Commander
            return [
                { role: "Grid Commander", focus: "Systems Ops Lead", desc: "Orchestrate complex digital infrastructure.", pay: "$950 Start", icon: <Users size={32} className="text-orange-400" /> },
                { role: "Product Visionary", focus: "Roadmap Design", desc: "Define product vision and prioritize features.", pay: "$850 Start", icon: <Lightbulb size={32} className="text-amber-400" /> }
            ];
        }

        // PEOPLE SECTOR (Default / Humanities)
        if (mode === 'hands-on') return [
            { role: "Community Builder", focus: "Event Production", desc: "Organize workshops and networking events.", pay: "$300 Start", icon: <Heart size={32} className="text-rose-400" /> },
            { role: "Support Specialist", focus: "Customer Success", desc: "Help users navigate complex platforms.", pay: "$350 Start", icon: <Users size={32} className="text-green-400" /> }
        ];
        if (mode === 'systems') return [
            { role: "Operations Analyst", focus: "Process Optimization", desc: "Streamline workflows for maximum efficiency.", pay: "$500 Start", icon: <Briefcase size={32} className="text-blue-400" /> },
            { role: "Data Storyteller", focus: "Analytics & Insights", desc: "Transform metrics into actionable narratives.", pay: "$550 Start", icon: <Terminal size={32} className="text-cyan-400" /> }
        ];
        if (mode === 'creative') return [
            { role: "Pixel Weaver", focus: "Digital Asset Creation", desc: "Create generative assets for the metaverse.", pay: "$350 Start", icon: <Palette size={32} className="text-pink-400" /> },
            { role: "Story Smith", focus: "Narrative Design", desc: "Write compelling narratives that convert.", pay: "$350 Start", icon: <PenTool size={32} className="text-purple-400" /> }
        ];
        // Commander
        return [
            { role: "Squad Captain", focus: "Team Leadership", desc: "Motivate and mentor junior operatives.", pay: "$600 Start", icon: <Users size={32} className="text-orange-400" /> },
            { role: "Growth Hacker", focus: "Strategy & Ops", desc: "Drive user acquisition and retention.", pay: "$650 Start", icon: <Lightbulb size={32} className="text-amber-400" /> }
        ];
    };

    const recommendedPaths = getPaths();

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
            {/* ----------------- STICKY HEADER WITH BREADCRUMBS ----------------- */}
            <div className="flex-none bg-black/95 backdrop-blur-md border-b border-gray-800/50 pb-4 pt-6 px-6 z-50">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Title */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-900/20 flex items-center justify-center border border-purple-500/30">
                            <Brain size={20} className="text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-white uppercase tracking-widest">Neural Initialization</h2>
                            <div className="text-[10px] text-gray-500 font-mono">GATEWAY PROTOCOL v2.0</div>
                        </div>
                    </div>

                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-3 md:gap-4">
                        {['Identity', 'Archetype', 'Sector', 'Path'].map((label, idx) => {
                            const isActive = step === idx;
                            const isCompleted = step > idx;
                            return (
                                <div key={idx} className="flex items-center gap-2">
                                    <div className={`
                                        w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-300
                                        ${isActive ? 'bg-purple-600 border-purple-400 text-white scale-110 shadow-[0_0_15px_rgba(168,85,247,0.5)]' :
                                            isCompleted ? 'bg-zinc-800 border-green-500 text-green-500' : 'bg-black border-zinc-800 text-zinc-700'}
                                    `}>
                                        {isCompleted ? <CheckCircle size={14} /> : idx + 1}
                                    </div>
                                    <span className={`text-[10px] uppercase font-bold tracking-wider ${isActive ? 'text-white' : isCompleted ? 'text-gray-500' : 'text-zinc-700 hidden sm:block'}`}>
                                        {label}
                                    </span>
                                    {idx < 3 && <div className={`w-4 md:w-8 h-[2px] rounded-full ${isCompleted ? 'bg-green-500/30' : 'bg-zinc-900'}`} />}
                                </div>
                            );
                        })}
                    </div>

                    {/* Close */}
                    <button onClick={onClose} className="hidden md:flex p-2 hover:bg-zinc-900 rounded-full transition-colors text-gray-500 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* ----------------- SCROLLABLE CONTENT AREA ----------------- */}
            <div ref={containerRef} className="flex-1 overflow-y-auto overflow-x-hidden">
                <div className="max-w-2xl mx-auto px-6 py-12 min-h-full flex flex-col justify-center">

                    {/* STEP 0: IDENTITY */}
                    {step === 0 && (
                        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
                            <div className="space-y-2 text-center md:text-left">
                                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">Identify Yourself</h1>
                                <p className="text-xl text-gray-400">Enter your operative callsign to begin.</p>
                            </div>
                            <div className="relative group">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="e.g. Neo..."
                                    className="w-full bg-zinc-900 border-2 border-zinc-800 p-6 text-3xl font-bold text-white focus:border-purple-500 outline-none rounded-2xl transition-all placeholder:text-zinc-700"
                                    onKeyDown={(e) => e.key === 'Enter' && handleNext({ name: (e.target as HTMLInputElement).value })}
                                />
                                <button
                                    onClick={() => handleNext({ name: inputRef.current?.value })}
                                    className="absolute right-3 top-3 bottom-3 px-8 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-widest rounded-xl transition-all hover:scale-105 active:scale-95"
                                >
                                    Set
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 1: ARCHETYPE SELECTION (THE TRIAD+ METHOD) */}
                    {step === 1 && (
                        <div className="space-y-8 animate-in slide-in-from-right duration-500">
                            <div className="space-y-2 text-center">
                                <h1 className="text-3xl md:text-5xl font-black text-white">How Do You Want to Impact the World?</h1>
                                <p className="text-xl text-gray-400">Choose your primary mode of contribution.</p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {/* THE ENGINEER */}
                                <button onClick={() => handleNext({ style: "Engineer" })} className="p-6 border-2 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-yellow-500 rounded-2xl flex flex-col items-center gap-3 group transition-all duration-300">
                                    <div className="p-4 bg-yellow-500/10 rounded-full group-hover:scale-110 transition-transform">
                                        <Hammer className="text-yellow-500" size={40} />
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-white mb-1">I Build</div>
                                        <p className="text-xs text-gray-500">Hardware & Hands-On</p>
                                    </div>
                                    <div className="text-[9px] text-yellow-600 font-bold uppercase tracking-wider mt-2 opacity-0 group-hover:opacity-100 transition-opacity">The Engineer</div>
                                </button>

                                {/* THE ARCHITECT */}
                                <button onClick={() => handleNext({ style: "Architect" })} className="p-6 border-2 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-cyan-500 rounded-2xl flex flex-col items-center gap-3 group transition-all duration-300">
                                    <div className="p-4 bg-cyan-500/10 rounded-full group-hover:scale-110 transition-transform">
                                        <Terminal className="text-cyan-500" size={40} />
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-white mb-1">I Code</div>
                                        <p className="text-xs text-gray-500">Software & Systems</p>
                                    </div>
                                    <div className="text-[9px] text-cyan-600 font-bold uppercase tracking-wider mt-2 opacity-0 group-hover:opacity-100 transition-opacity">The Architect</div>
                                </button>

                                {/* THE CREATOR */}
                                <button onClick={() => handleNext({ style: "Creator" })} className="p-6 border-2 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-pink-500 rounded-2xl flex flex-col items-center gap-3 group transition-all duration-300">
                                    <div className="p-4 bg-pink-500/10 rounded-full group-hover:scale-110 transition-transform">
                                        <Palette className="text-pink-500" size={40} />
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-white mb-1">I Design</div>
                                        <p className="text-xs text-gray-500">Art, UX & Media</p>
                                    </div>
                                    <div className="text-[9px] text-pink-600 font-bold uppercase tracking-wider mt-2 opacity-0 group-hover:opacity-100 transition-opacity">The Creator</div>
                                </button>

                                {/* THE COMMANDER */}
                                <button onClick={() => handleNext({ style: "Commander" })} className="p-6 border-2 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-orange-500 rounded-2xl flex flex-col items-center gap-3 group transition-all duration-300">
                                    <div className="p-4 bg-orange-500/10 rounded-full group-hover:scale-110 transition-transform">
                                        <Users className="text-orange-500" size={40} />
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-white mb-1">I Lead</div>
                                        <p className="text-xs text-gray-500">Strategy & Teams</p>
                                    </div>
                                    <div className="text-[9px] text-orange-600 font-bold uppercase tracking-wider mt-2 opacity-0 group-hover:opacity-100 transition-opacity">The Commander</div>
                                </button>
                            </div>

                            {/* BARTLE TAXONOMY HINT */}
                            <div className="text-center text-[10px] text-gray-600 mt-4">
                                <span className="opacity-50">Based on Bartle's Player Types & Real-World Career Sectors</span>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: TARGET SECTOR */}
                    {step === 2 && (
                        <div className="space-y-8 animate-in slide-in-from-right duration-500">
                            <div className="space-y-2 text-center">
                                <h1 className="text-3xl md:text-5xl font-black text-white">Where Will You Make Your Mark?</h1>
                                <p className="text-xl text-gray-400">Select your target sector.</p>
                            </div>
                            <div className="grid gap-4">
                                <InterestButton
                                    icon={<Globe size={24} />}
                                    color="green"
                                    title="Planet & Nature"
                                    desc="Conservation, sustainability, and eco-systems."
                                    onClick={() => handleNext({ interest: "Nature" })}
                                />
                                <InterestButton
                                    icon={<Cpu size={24} />}
                                    color="blue"
                                    title="Technology & Systems"
                                    desc="Software, hardware, AI, and automation."
                                    onClick={() => handleNext({ interest: "Tech" })}
                                />
                                <InterestButton
                                    icon={<Heart size={24} />}
                                    color="rose"
                                    title="People & Society"
                                    desc="Community, education, and human connection."
                                    onClick={() => handleNext({ interest: "People" })}
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 3: MISSION SELECTION */}
                    {step === 3 && (
                        <div className="space-y-8 animate-in slide-in-from-right duration-500">
                            <div className="space-y-2 text-center">
                                <h1 className="text-3xl md:text-5xl font-black text-white">Your Path Awaits</h1>
                                <p className="text-xl text-gray-400">Recommended roles for {answers.style}s in {answers.interest}.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {recommendedPaths.map((path, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => onComplete(answers, path)}
                                        className="group text-left p-8 bg-zinc-900 border-2 border-zinc-800 rounded-3xl hover:border-purple-500 transition-all hover:translate-y-[-4px] relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            {path.icon}
                                        </div>
                                        <div className="mb-6 p-4 bg-black rounded-2xl w-fit border border-gray-800 group-hover:border-purple-500/50 transition-colors">
                                            {path.icon}
                                        </div>
                                        <div className="space-y-2 mb-8">
                                            <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">{path.role}</h3>
                                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{path.focus}</div>
                                            <p className="text-gray-400 leading-relaxed">{path.desc}</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-purple-400 font-black text-xs uppercase tracking-widest">
                                            <span>Initialize Path</span>
                                            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
            {/* Mobile Close Button (Bottom) */}
            <button onClick={onClose} className="md:hidden absolute top-6 right-6 p-2 bg-black/50 backdrop-blur rounded-full text-white border border-gray-700 z-[60]">
                <X size={20} />
            </button>
        </div>
    );
};

// Helper for Interest Buttons
const InterestButton = ({ icon, color, title, desc, onClick }: { icon: any, color: string, title: string, desc: string, onClick: () => void }) => {
    const colorClasses: Record<string, string> = {
        green: "text-green-500 bg-green-900/20 group-hover:bg-green-500 group-hover:text-black border-green-900/50 group-hover:border-green-500",
        blue: "text-blue-500 bg-blue-900/20 group-hover:bg-blue-500 group-hover:text-black border-blue-900/50 group-hover:border-blue-500",
        pink: "text-pink-500 bg-pink-900/20 group-hover:bg-pink-500 group-hover:text-black border-pink-900/50 group-hover:border-pink-500",
    };

    return (
        <button onClick={onClick} className="w-full p-6 bg-zinc-900 border-2 border-zinc-800 hover:border-gray-500 rounded-2xl flex items-center gap-6 group transition-all text-left">
            <div className={`p-4 rounded-xl border ${colorClasses[color]} transition-colors`}>
                {icon}
            </div>
            <div>
                <div className="text-xl font-bold text-white mb-1">{title}</div>
                <div className="text-gray-500 group-hover:text-gray-300">{desc}</div>
            </div>
        </button>
    );
}

export default AssessmentModule;
