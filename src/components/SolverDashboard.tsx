import { Brain, Rocket, Activity, ArrowRight, Lock, Zap, CheckCircle, Crosshair, Terminal } from 'lucide-react';
import LiveGovernanceTicker from './LiveGovernanceTicker';

const DashboardStat: React.FC<{ icon: React.ReactNode, label: string, value: string, color: string }> = ({ icon, label, value, color }) => (
    <div className="bg-zinc-900/50 border border-gray-800 p-6 rounded-xl hover:border-gray-700 transition-colors">
        <div className={`${color} mb-3`}>{icon}</div>
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
        <div className="text-[10px] text-gray-500 uppercase tracking-widest">{label}</div>
    </div>
);

interface GenesisCardProps {
    title: string;
    client: string;
    impact: string;
    reward: string;
    tags: string[];
    academicSkills?: string[];
    highlight?: boolean;
}

const GenesisCard: React.FC<GenesisCardProps> = ({ title, client, impact, reward, tags, academicSkills, highlight }) => (
    <div className={`p-6 border rounded-xl transition-all cursor-pointer group relative overflow-hidden ${highlight ? 'bg-zinc-900/60 border-lime-500/50 hover:border-lime-400' : 'bg-zinc-900/20 border-gray-800 hover:border-gray-600'}`}>
        {highlight && <div className="absolute top-0 right-0 bg-lime-500 text-black text-[10px] font-bold px-3 py-1 uppercase tracking-widest">Purpose Match</div>}
        <div className="flex justify-between items-start mb-2">
            <div className="text-left">
                <h3 className={`text-lg font-bold mb-1 ${highlight ? 'text-white' : 'text-gray-300'}`}>{title}</h3>
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">{client}</div>
            </div>
            <div className={`text-xl font-mono font-bold ${highlight ? 'text-lime-400' : 'text-gray-400'}`}>{reward}</div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4 bg-black/20 p-2 rounded border border-gray-800/50 text-left">
            <Activity size={14} className={highlight ? "text-lime-400" : "text-gray-600"} />
            <span>Ripple Effect: <span className="text-gray-300">{impact}</span></span>
        </div>
        <div className="flex gap-2 flex-wrap mb-3">
            {tags.map((tag, i) => <span key={i} className="px-2 py-1 bg-black border border-gray-800 text-gray-600 text-[10px] uppercase tracking-wider">{tag}</span>)}
        </div>

        {/* THE EXECUTIVE VISION: HIDDEN SYLLABUS */}
        {academicSkills && (
            <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-800/50">
                <span className="text-[10px] font-bold text-cyan-700 uppercase tracking-widest mr-1 self-center">ACADEMIC XP:</span>
                {academicSkills.map((skill, i) => (
                    <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-cyan-950/30 border border-cyan-800/50 rounded text-cyan-400 text-[10px]">
                        <Brain size={10} />
                        {skill}
                    </span>
                ))}
            </div>
        )}
    </div>
);

interface SquadMemberProps {
    name: string;
    role: string;
    status: string;
    isUser?: boolean;
}

const SquadMember: React.FC<SquadMemberProps> = ({ name, role, status, isUser }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'}`}>{name[0]}</div>
            <div className="text-left">
                <div className={`text-sm font-bold ${isUser ? 'text-white' : 'text-gray-300'}`}>{name}</div>
                <div className="text-[10px] text-gray-600 uppercase tracking-wide">{role}</div>
            </div>
        </div>
        <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${status === 'In Flow' ? 'bg-purple-500 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-[10px] text-gray-500">{status}</span>
        </div>
    </div>
);

interface SolverDashboardProps {
    userName?: string;
    userGoal?: string;
    userArchetype?: string;
}

const SolverDashboard: React.FC<SolverDashboardProps> = ({
    userName = "James",
    userGoal = "Ocean Conservation",
    userArchetype = "Pattern Architect"
}) => {
    // Logic to determine the "Morning Alignment" message based on Archetype
    const getSageMessage = () => {
        if (userArchetype === "Pattern Architect") return "I found a structural problem that needs your system-thinking.";
        if (userArchetype === "System Medic") return "There is a critical failure in a legacy stack that requires your optimization.";
        if (userArchetype === "Code Ronin") return "There is a high-difficulty bypass that requires your precision.";
        if (userArchetype === "Impact Guardian") return "I found a Genesis Point that directly aids your conservation goal.";
        return "Ready to unlock your potential?";
    };



    // ... (Pre-existing code)

    return (
        <section className="relative bg-zinc-950 animate-in slide-in-from-bottom-10 duration-700">
            {/* 0. LIVE GOVERNANCE TICKER (The Executive Vision) */}
            <LiveGovernanceTicker />

            <div className="py-12 px-6 max-w-7xl mx-auto">
                {/* 1. MORNING ALIGNMENT (SAGE AS SOCRATIC COMPANION) */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 border-b border-gray-800 pb-8">
                    <div className="space-y-4 max-w-2xl text-left">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-900/30 border border-purple-500/50 flex items-center justify-center">
                                <Brain size={20} className="text-purple-400" />
                            </div>
                            <span className="text-purple-400 font-bold tracking-widest text-xs uppercase">Sage Connection Active</span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-light text-white leading-tight">
                            "Welcome back, <span className="font-bold text-white">{userName}</span>.
                            <br />You are targeted on <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-bold">{userGoal}</span>."
                        </h1>

                        <p className="text-gray-400 text-sm border-l-2 border-purple-500 pl-4 italic">
                            "{getSageMessage()}"
                        </p>
                    </div>

                    {/* 2. THE VAULT (LOSS AVERSION) */}
                    <div className="text-right bg-zinc-900/30 p-4 rounded-xl border border-gray-800">
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1 flex items-center justify-end gap-2 text-right">
                            <Lock size={12} /> Pending Unlock
                        </div>
                        <div className="text-4xl font-mono font-bold text-gray-600 text-right">$450.00</div>
                        <div className="text-[10px] text-green-500 mt-1 text-right">Complete 1 Genesis Point to claim</div>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    <DashboardStat icon={<CheckCircle size={20} />} label="Neural ID" value="Level 1" color="text-blue-400" />
                    <DashboardStat icon={<Activity size={20} />} label="Class" value={userArchetype} color="text-green-400" />
                    <DashboardStat icon={<Crosshair size={20} />} label="Focus" value={userGoal.split(' ')[0]} color="text-yellow-400" />
                    <DashboardStat icon={<Terminal size={20} />} label="Status" value="Sovereign" color="text-purple-400" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT: GENESIS FEED (PROBLEMS AWAITING SOLUTION) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Rocket className="text-lime-400" size={20} /> GENESIS POINTS
                            </h2>
                            <span className="text-xs text-gray-500 bg-zinc-900 px-3 py-1 rounded-full border border-gray-800">High Impact Only</span>
                        </div>

                        {/* Genesis Card 1 */}
                        <GenesisCard
                            title="Optimize Solar Grid Data"
                            client="CleanTech Global"
                            impact="Saves 400kWh/day for rural grids"
                            reward="$85.00"
                            tags={["Rust", "Data Science"]}
                            academicSkills={["Physics: Energy Systems", "Math: Linear Optimization"]}
                        />

                        {/* Genesis Card 2 */}
                        <GenesisCard
                            title="Marine Plastic Pattern Recognition"
                            client="OceanCleanup.org"
                            impact="Identifies 95% of micro-plastics"
                            reward="$120.00"
                            tags={["Vision AI", "Python"]}
                            highlight={true}
                            academicSkills={["Stats: Probability", "Bio: Ecology Models"]}
                        />
                    </div>

                    {/* RIGHT: SYNAPTIC SQUAD */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-200 flex items-center gap-2 text-left">
                                <Activity className="text-blue-400" size={20} /> SYNAPTIC SQUAD
                            </h2>
                        </div>

                        <div className="bg-zinc-900/20 border border-gray-800 rounded-xl p-6 text-left">
                            <div className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-4">The Ocean Stewards</div>
                            <div className="space-y-4 text-left">
                                <SquadMember name="Sarah_V" role="Visionary" status="Online" />
                                <SquadMember name="Marcus_Code" role="Scribe" status="In Flow" />
                                <SquadMember name="You" role={userArchetype} status="Active" isUser />
                            </div>
                            <button className="w-full mt-6 py-3 bg-blue-500/10 border border-blue-500/50 text-blue-400 hover:bg-blue-500 hover:text-white text-xs transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
                                Enter War Room <ArrowRight size={14} />
                            </button>
                        </div>

                        {/* GROWTH GAP */}
                        <div className="bg-zinc-900/20 border border-gray-800 rounded-xl p-6 text-left">
                            <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                                <Zap size={16} className="text-yellow-400" /> Daily Growth Focus
                            </h3>
                            <p className="text-sm text-gray-500 mb-4 leading-relaxed">"Your data analysis is strong, but your storytelling needs work. Try summarizing your next output for a non-technical founder."</p>
                            <div className="h-1 w-full bg-gray-800 rounded-full">
                                <div className="h-full w-[70%] bg-yellow-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SolverDashboard;
