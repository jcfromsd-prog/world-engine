/* ==========================================================================
   MYBESTPURPOSE: WORLD ENGINE
   ========================================================================== */
import React, { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, GraduationCap, LogOut, Activity } from 'lucide-react';
import { SimulationEngine, getTargetPersonaKey } from "./services/SimulationEngine";
import { FounderCheckModal } from "./components/dashboard/FounderCheckModal";

// Lazy Load Large Components
const SolverWorkspace = React.lazy(() => import('./components/SolverWorkspace'));
const ConnectView = React.lazy(() => import('./components/ConnectView'));
const LearnView = React.lazy(() => import('./components/LearnView'));
const IdentityView = React.lazy(() => import('./components/IdentityView'));

// --- TYPES ---
export type UIMission = {
  id: string;
  title: string;
  price: string;
  desc: string;
  tags?: string[];
  locked?: boolean;
  highlight?: boolean;
  type?: string;
  difficulty?: string;
  rewards?: Record<string, number | string>;
};

interface SageProfile {
  name: string;
  grade: string;
  gradeLevel: number;
  passion: string;
  squad: string;
  archetype: string;
  genesisPoints: number;
  xp: number;
  level: number;
  skillTheta: number;
}

const IMPACT_MISSIONS = [
  { id: "CS.ALG.01", title: "Clean Energy Algorithm", desc: "Optimize load-balancing for a decentralized solar grid in East Africa.", category: "CODING", tag: "GREENTECH INITIATIVE", xp: 250, gp: 120, color: "text-green-400" },
  { id: "SCI.BIO.04", title: "Bio-Diversity Mapper", desc: "Analyze drone footage to identify endangered species in the Amazon basin.", category: "SCIENCE", tag: "WILDLIFE PROTECT", xp: 300, gp: 150, color: "text-emerald-400" },
  { id: "MATH.PHY.09", title: "Urban Water Flow Logic", desc: "Calculate pressure distributions for sustainable rainwater systems.", category: "MATH", tag: "SMART CITIES", xp: 200, gp: 90, color: "text-blue-400" },
  { id: "HUM.SOC.02", title: "Policy Narrative Design", desc: "Draft a compelling policy proposal for universal connectivity.", category: "HUMANITIES", tag: "GLOBAL CONNECT", xp: 180, gp: 80, color: "text-purple-400" },
  { id: "CS.SEC.07", title: "Quantum Encryption Override", desc: "Protect medical records in a simulated quantum cyber-attack.", category: "CODING", tag: "HEALTHGUARD", xp: 400, gp: 200, color: "text-rose-400" }
];

// Grade level parser
function parseGradeLevel(gradeStr: string): number {
  const str = gradeStr.toLowerCase().trim();
  if (str.includes('k') || str.includes('kinder')) return 0;
  if (str.includes('college') || str.includes('university')) return 13;
  if (str.includes('grad') || str.includes('masters') || str.includes('phd')) return 16;
  const num = parseInt(str.replace(/[^0-9]/g, ''));
  if (!isNaN(num) && num >= 1 && num <= 12) return num;
  if (str.includes('fresh')) return 9;
  if (str.includes('soph')) return 10;
  if (str.includes('junior')) return 11;
  if (str.includes('senior')) return 12;
  return 8; // Default to middle school
}

// Archetype mapper
function getArchetype(passion: string): string {
  const p = passion.toLowerCase();
  if (p.includes('code') || p.includes('tech') || p.includes('program')) return "Code Wizard";
  if (p.includes('creat') || p.includes('art') || p.includes('design')) return "Design Alchemist";
  if (p.includes('sci') || p.includes('bio') || p.includes('chem')) return "Lab Explorer";
  if (p.includes('lead') || p.includes('strateg') || p.includes('business')) return "Impact Architect";
  if (p.includes('math') || p.includes('logic') || p.includes('analyt')) return "Logic Master";
  return "Generalist";
}

// Squad matcher
function matchSquad(passion: string): string {
  const p = passion.toLowerCase();
  if (p.includes('code') || p.includes('tech')) return "The Algo-Rhythm";
  if (p.includes('sci') || p.includes('bio') || p.includes('nature')) return "Ocean Cleanup Crew";
  if (p.includes('creat') || p.includes('art') || p.includes('design')) return "The Visionaries";
  if (p.includes('lead') || p.includes('strateg')) return "Impact Architects";
  if (p.includes('math') || p.includes('logic')) return "Neural Net Guild";
  return "The Generalists";
}

// Skill theta based on grade
function calculateInitialTheta(gradeLevel: number): number {
  if (gradeLevel <= 5) return -1.5;
  if (gradeLevel <= 8) return -0.5;
  if (gradeLevel <= 10) return 0.0;
  if (gradeLevel <= 12) return 0.5;
  return 1.0;
}

/* ==========================================================================
   COMPONENT: ASSESSMENT MODULE (Graphical UI)
   ========================================================================== */
function AssessmentModule({ onClose, onComplete }: { onClose: () => void, onComplete: (profile: SageProfile) => void }) {
  const [step, setStep] = useState<"NAME" | "GRADE" | "PASSION">("NAME");
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");

  const handleComplete = (passion: string) => {
    const gradeLevel = parseGradeLevel(grade);
    const archetype = getArchetype(passion);
    const squad = matchSquad(passion);

    onComplete({
      name,
      grade,
      gradeLevel,
      passion,
      squad,
      archetype,
      genesisPoints: 50,
      xp: 0,
      level: 1,
      skillTheta: calculateInitialTheta(gradeLevel)
    });
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl">

        {/* Close Button */}
        <button onClick={onClose} className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors">
          <X size={24} />
        </button>

        {/* Progress System */}
        <div className="flex items-center gap-4 mb-12">
          {["NAME", "GRADE", "PASSION"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${(step === s) ? "bg-blue-500 shadow-[0_0_10px_#3b82f6]" :
                  (["NAME", "GRADE", "PASSION"].indexOf(step) > i) ? "bg-green-500" : "bg-zinc-800"
                }`} />
              <span className={`text-[10px] font-black uppercase tracking-widest ${step === s ? "text-white" : "text-zinc-600"}`}>
                {s}
              </span>
              {i < 2 && <div className="w-8 h-px bg-zinc-800" />}
            </div>
          ))}
        </div>

        {/* STEP 1: NAME */}
        {step === "NAME" && (
          <div className="animate-in fade-in slide-in-from-right duration-500">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
              What's your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Legend Name?</span>
            </h2>
            <p className="text-zinc-400 text-lg mb-8 font-medium">This is how you'll be known in the World Engine.</p>
            <div className="flex gap-4">
              <input
                autoFocus
                type="text"
                placeholder="Enter Codename..."
                className="flex-1 bg-black/50 border-2 border-zinc-800 focus:border-blue-500 rounded-2xl px-6 py-4 text-2xl font-bold text-white outline-none transition-all placeholder-zinc-700"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && name && setStep("GRADE")}
              />
              <button
                disabled={!name}
                onClick={() => setStep("GRADE")}
                className="px-8 bg-white disabled:opacity-50 disabled:cursor-not-allowed text-black font-black text-xl rounded-2xl hover:bg-blue-400 transition-all uppercase tracking-widest"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: GRADE */}
        {step === "GRADE" && (
          <div className="animate-in fade-in slide-in-from-right duration-500">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
              Current <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Power Level?</span>
            </h2>
            <p className="text-zinc-400 text-lg mb-8 font-medium">Select your current grade to calibrate missions.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Grade 1-5", "Grade 6-8", "Grade 9-10", "Grade 11-12", "College", "Pro"].map((g) => (
                <button
                  key={g}
                  onClick={() => { setGrade(g); setStep("PASSION"); }}
                  className="p-6 bg-zinc-800/50 border border-zinc-700 hover:border-green-500 hover:bg-green-500/10 rounded-2xl flex flex-col items-center gap-2 transition-all group"
                >
                  <GraduationCap className="text-zinc-500 group-hover:text-green-400" size={32} />
                  <span className="text-sm font-black text-white uppercase tracking-wider">{g}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: PASSION */}
        {step === "PASSION" && (
          <div className="animate-in fade-in slide-in-from-right duration-500">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
              Choose your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Path</span>
            </h2>
            <p className="text-zinc-400 text-lg mb-8 font-medium">What kind of missions do you want to solve?</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Coding & Tech", icon: "💻", color: "blue", desc: "Build apps, secure networks, and write algorithms." },
                { label: "Creative & Design", icon: "🎨", color: "pink", desc: "Design cities, create art, and visualize data." },
                { label: "Science & Nature", icon: "🌱", color: "green", desc: "Protect wildlife, solve climate issues, and explore." }
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => handleComplete(p.label)}
                  className="relative p-8 bg-zinc-800/50 border border-zinc-700 hover:border-white rounded-3xl text-left transition-all hover:-translate-y-1 hover:shadow-2xl group overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-110 transition-transform`}>{p.icon}</div>
                  <div className="relative z-10">
                    <div className="text-4xl mb-4">{p.icon}</div>
                    <h3 className="text-xl font-black text-white uppercase tracking-wide mb-2">{p.label}</h3>
                    <p className="text-zinc-400 text-sm font-medium leading-relaxed">{p.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ==========================================================================
   COMPONENT: MISSION MODAL
   ========================================================================== */
function MissionModal({ mission, onClose, onLaunch }: { mission: UIMission, onClose: () => void, onLaunch: () => void }) {
  const [status, setStatus] = useState('initializing');

  useEffect(() => {
    const t1 = setTimeout(() => setStatus('connected'), 800);
    const t2 = setTimeout(() => setStatus('active'), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-2xl flex items-center justify-center p-6 shadow-2xl">
      <div className="w-full max-w-xl text-center">
        {status === 'initializing' && (
          <div className="space-y-8 animate-pulse text-cyan-400">
            <Activity size={96} className="mx-auto" />
            <h2 className="text-2xl font-black uppercase tracking-[0.3em]">Neural Link</h2>
          </div>
        )}

        {status === 'connected' && (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-lime-500 rounded-full mx-auto flex items-center justify-center animate-in zoom-in">
              <CheckCircle size={40} className="text-black" />
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Uplink Stable</h2>
          </div>
        )}

        {status === 'active' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="absolute top-0 right-0 p-8 opacity-5 uppercase font-black text-6xl -rotate-12 translate-x-8 -translate-y-8">MISSION</div>
            <div className="relative z-10 text-left">
              <h2 className="text-4xl font-black text-white mb-2 tracking-tight">{mission.title}</h2>
              <div className="text-2xl font-black text-lime-400 mb-8 font-mono">{mission.price}</div>
              <p className="text-zinc-400 mb-10 text-lg leading-relaxed">{mission.desc}</p>
              <div className="flex flex-col gap-3">
                <button onClick={onLaunch} className="h-16 bg-white text-black font-black text-lg rounded-2xl uppercase tracking-[0.2em] hover:bg-cyan-400 transition-all">Launch</button>
                <button onClick={onClose} className="text-zinc-600 hover:text-white font-black text-[10px] uppercase tracking-[0.4em]">Abort</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   COMPONENT: HERO SECTION
   ========================================================================== */
function HeroSection({
  userName,
  onSolveEarn,
  onOpenConnect,
  onOpenLearn,
  onOpenIdentity
}: {
  userName: string;
  onSolveEarn: () => void;
  onOpenConnect: () => void;
  onOpenLearn: () => void;
  onOpenIdentity: () => void;
}) {
  return (
    <main className="relative pt-40 pb-20 px-4 flex flex-col items-center justify-center min-h-[70vh] text-center z-10">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Welcome Badge */}
      <div className="mb-6 animate-in fade-in zoom-in duration-700">
        <span className="px-4 py-2 bg-zinc-900 rounded-full text-xs text-green-400 border border-green-500/30 font-mono tracking-widest">
          WELCOME, {userName.toUpperCase()} • LEGEND STATUS: ACTIVE
        </span>
      </div>

      {/* HERO TEXT */}
      <div className="mb-8 animate-in fade-in zoom-in duration-1000">
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white drop-shadow-2xl uppercase">
          Solve <span className="text-zinc-700 font-thin mx-4">/</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Impact</span>
        </h1>
      </div>

      {/* PILLAR NAVIGATION */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-4 mb-10 w-full max-w-6xl animate-in slide-in-from-bottom duration-1000">
        <div className="group cursor-pointer flex flex-col items-center" onClick={onOpenIdentity}>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-105 transition-transform duration-300">IDENTITY</h2>
          <p className="mt-1 text-[9px] text-pink-500 font-mono opacity-0 group-hover:opacity-100 transition-opacity tracking-widest uppercase">/// NEURAL ENGINE</p>
        </div>
        <div className="hidden md:block w-px h-8 bg-zinc-800/50 mx-2" />
        <div className="group cursor-pointer flex flex-col items-center" onClick={onOpenConnect}>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 hover:scale-105 transition-transform duration-300">CONNECT</h2>
          <p className="mt-1 text-[9px] text-cyan-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity tracking-widest uppercase">/// WITH A SQUAD</p>
        </div>
        <div className="hidden md:block w-px h-8 bg-zinc-800/50 mx-2" />
        <div className="group cursor-pointer flex flex-col items-center" onClick={onOpenLearn}>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 hover:scale-105 transition-transform duration-300">LEARN</h2>
          <p className="mt-1 text-[9px] text-purple-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity tracking-widest uppercase">/// WITH AI SPEED</p>
        </div>
        <div className="hidden md:block w-px h-8 bg-zinc-800/50 mx-2" />
        <div className="group cursor-pointer flex flex-col items-center" onClick={onSolveEarn}>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white hover:text-[#39FF14] hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.05)]">SOLVE</h2>
          <p className="mt-1 text-[9px] text-white font-mono opacity-0 group-hover:opacity-100 transition-opacity tracking-widest uppercase">/// FOR IMPACT</p>
        </div>
        <div className="hidden md:block w-px h-8 bg-zinc-800/50 mx-2" />
        <div className="group cursor-pointer flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 hover:scale-105 transition-transform duration-300">EARN</h2>
          <p className="mt-1 text-[9px] text-yellow-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity tracking-widest uppercase">/// YOUR LEGEND</p>
        </div>
      </div>

      {/* TAGLINE */}
      <div className="max-w-2xl mx-auto mb-8 px-4 text-center">
        <p className="text-lg md:text-xl text-zinc-300 font-medium leading-relaxed">
          The world's first <span className="text-blue-400 font-bold">Impact Engine</span>.
          <br className="hidden md:block" />
          <span className="text-zinc-500 text-sm mt-1 block">Solve real-world challenges, earn direct payouts, and build your legend.</span>
        </p>
      </div>

      {/* GREEN BUTTON */}
      <div>
        <button
          onClick={onSolveEarn}
          className="px-16 py-5 bg-gradient-to-r from-[#a3e635] to-[#4ade80] text-black font-black text-xl tracking-widest rounded-lg shadow-[0_0_50px_rgba(74,222,128,0.4)] hover:shadow-[0_0_80px_rgba(74,222,128,0.6)] hover:scale-105 transition-all flex items-center gap-3 mx-auto uppercase"
        >
          <span>🚀</span> SOLVE & EARN
        </button>
      </div>
    </main>
  );
}

/* ==========================================================================
   COMPONENT: IMPACT BOARD
   ========================================================================== */
function ImpactBoard({ onMissionStart }: { onMissionStart: (mission: UIMission) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {IMPACT_MISSIONS.map((mission) => (
        <div key={mission.id} className="group relative p-8 bg-zinc-900/40 border border-white/5 hover:border-white/20 rounded-2xl transition-all hover:bg-zinc-900/60 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-6">
            <span className={`text-[10px] font-black tracking-widest uppercase ${mission.color} bg-white/5 px-2 py-1 rounded`}>{mission.category}</span>
            <span className="text-[10px] font-mono text-zinc-600">{mission.id}</span>
          </div>
          <h3 className="text-2xl font-black text-white mb-3 group-hover:text-blue-200 transition-colors uppercase italic leading-none">{mission.title}</h3>
          <p className="text-sm text-zinc-400 leading-relaxed mb-8 font-medium">{mission.desc}</p>
          <div className="flex items-center justify-between border-t border-white/5 pt-6">
            <div>
              <span className="block text-[9px] text-zinc-500 font-black tracking-widest uppercase mb-1">Potential Reward</span>
              <span className="text-sm font-bold text-white">{mission.xp} XP <span className="text-zinc-700 mx-2">|</span> <span className="text-yellow-400 font-mono tracking-tighter">{mission.gp} GP</span></span>
            </div>
            <button
              onClick={() => onMissionStart({
                id: mission.id,
                title: mission.title,
                desc: mission.desc,
                price: `${mission.gp} GP`,
                type: mission.category,
                tags: [mission.tag],
                rewards: { xp: mission.xp, gp: mission.gp }
              })}
              className="px-6 py-2 bg-white text-black text-xs font-black uppercase tracking-widest rounded hover:bg-zinc-200 transition-all shadow-xl"
            >
              Start
            </button>
          </div>
        </div>
      ))}

      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-900/50 rounded-2xl hover:border-zinc-800 hover:bg-zinc-900/20 transition-all cursor-pointer min-h-[300px] group">
        <div className="h-14 w-14 rounded-full bg-zinc-900 flex items-center justify-center mb-4 text-zinc-600 group-hover:bg-white group-hover:text-black transition-all">
          <span className="text-3xl font-bold">+</span>
        </div>
        <span className="text-[11px] font-black tracking-widest text-zinc-600 uppercase group-hover:text-white transition-all italic">Explore More Missions</span>
      </div>
    </div>
  );
}

/* ==========================================================================
   MAIN APP COMPONENT
   ========================================================================== */
const App: React.FC = () => {
  // Check if user has already onboarded
  const [hasOnboarded, setHasOnboarded] = useState(() => {
    const saved = localStorage.getItem('mbp_sage_profile');
    return !!saved;
  });

  const [userProfile, setUserProfile] = useState<SageProfile | null>(() => {
    const saved = localStorage.getItem('mbp_sage_profile');
    return saved ? JSON.parse(saved) : null;
  });

  // View States
  const [showAssessment, setShowAssessment] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const [showLearn, setShowLearn] = useState(false);
  const [showIdentity, setShowIdentity] = useState(false);
  const [activeMission, setActiveMission] = useState<UIMission | null>(null);
  const [activeQuest, setActiveQuest] = useState<UIMission | null>(null);

  // Simulation States
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showFounderModal, setShowFounderModal] = useState(false);

  const handleOnboardingComplete = (profile: SageProfile) => {
    setUserProfile(profile);
    localStorage.setItem('mbp_sage_profile', JSON.stringify(profile));
    setHasOnboarded(true);
    setShowAssessment(false);

    // Auto-scroll to Impact Board to show action
    setTimeout(() => {
      handleSolveEarn();
    }, 500);
  };

  const handleLaunchMission = () => {
    setActiveQuest(activeMission);
    setActiveMission(null);
  };

  const handleReturnToDash = (rewards?: { xp: number, balance: number }) => {
    setActiveQuest(null);
    if (rewards && userProfile) {
      const updatedProfile = {
        ...userProfile,
        xp: userProfile.xp + rewards.xp,
        genesisPoints: userProfile.genesisPoints + rewards.balance,
        level: Math.floor((userProfile.xp + rewards.xp) / 500) + 1
      };
      setUserProfile(updatedProfile);
      localStorage.setItem('mbp_sage_profile', JSON.stringify(updatedProfile));
    }
  };

  // The main action button handler
  const handleSolveEarn = () => {
    if (!hasOnboarded) {
      // If not onboarded, show generic fun assessment
      setShowAssessment(true);
      return;
    }

    // If onboarded, scroll to impact board
    const impactSection = document.getElementById('impact-board');
    if (impactSection) {
      impactSection.scrollIntoView({ behavior: 'smooth' });
    }
    // Also open mission modal example
    setActiveMission({
      id: 'CS.ALG.01',
      title: 'Clean Energy Algorithm',
      desc: 'Optimize the load-balancing logic for a decentralized solar grid in East Africa.',
      price: '120 GP',
      type: 'CODING',
      tags: ['GREENTECH', 'ALGORITHM'],
      rewards: { xp: 250, gp: 120 }
    });
  };

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    setSimulationLog([]);
    const personaKey = getTargetPersonaKey();
    await SimulationEngine.runSimulation(personaKey, (msg) => {
      setSimulationLog(prev => [...prev, msg]);
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('mbp_sage_profile');
    setUserProfile(null);
    setHasOnboarded(false);
  };

  // IF IN SOLVER WORKSPACE (Separate View)
  if (activeQuest) {
    return (
      <div className="min-h-screen bg-black text-white font-mono">
        <Suspense fallback={<div className="p-10 text-center">Loading Workspace...</div>}>
          <SolverWorkspace onBack={() => handleReturnToDash()} onSolve={(rewards) => handleReturnToDash(rewards)} />
        </Suspense>
      </div>
    );
  }

  // MAIN DASHBOARD (Visible to Everyone, but personalized if onboarded)
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-neon-green selection:text-black relative overflow-x-hidden animate-fade-in">

      {/* ASSESSMENT OVERLAY (For New Users) */}
      {showAssessment && (
        <AssessmentModule onClose={() => setShowAssessment(false)} onComplete={handleOnboardingComplete} />
      )}

      {/* Simulation Window */}
      <AnimatePresence>
        {isSimulating && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-24 left-6 w-[500px] max-h-[500px] overflow-y-auto bg-black/95 border border-blue-500/50 rounded-2xl p-6 font-mono text-xs text-blue-300 shadow-2xl z-[120]"
          >
            <div className="sticky top-0 bg-black/95 pb-3 border-b border-blue-500/20 mb-3 font-bold text-blue-400 flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span className="animate-pulse text-green-500">●</span>
                {'>'} NEURAL_PATH_SIM_v3.0
              </span>
              <button
                onClick={() => setIsSimulating(false)}
                className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded text-[10px] uppercase tracking-wider transition-colors"
              >
                ✕ Close
              </button>
            </div>
            <div className="space-y-1">
              {simulationLog.map((log, i) => (
                <div key={i} className="leading-relaxed whitespace-pre-wrap">
                  <span className="text-zinc-600 text-[10px]">[{String(i).padStart(2, '0')}]</span>{' '}
                  <span className={
                    log.includes('✅') || log.includes('COMPLETE') || log.includes('MASTERED') ? 'text-green-400' :
                      log.includes('⚠️') || log.includes('Stall') ? 'text-yellow-400' :
                        log.includes('═') || log.includes('🚀') || log.includes('🏁') ? 'text-white font-bold' :
                          log.includes('🛡️') || log.includes('👥') || log.includes('🧠') || log.includes('⚡') || log.includes('💰') ? 'text-cyan-400 font-semibold' :
                            'text-blue-300'
                  }>{log}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FounderCheckModal isOpen={showFounderModal} onClose={() => setShowFounderModal(false)} />

      {/* VIEW OVERLAYS */}
      {showConnect && (
        <Suspense fallback={null}><ConnectView onBack={() => setShowConnect(false)} /></Suspense>
      )}
      {showLearn && (
        <Suspense fallback={null}><LearnView onBack={() => setShowLearn(false)} /></Suspense>
      )}
      {showIdentity && (
        <Suspense fallback={null}><IdentityView onBack={() => setShowIdentity(false)} /></Suspense>
      )}

      {/* MISSION MODAL */}
      {activeMission && (
        <MissionModal mission={activeMission} onClose={() => setActiveMission(null)} onLaunch={handleLaunchMission} />
      )}

      {/* HEADER */}
      <nav className="fixed top-0 w-full z-[140] p-6 flex justify-between items-center bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            MBP // WORLD ENGINE
          </span>
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        </div>
        <div className="flex gap-2 bg-zinc-900/80 p-1 rounded-full border border-white/10">
          <button className="px-6 py-2 rounded-full bg-white text-black font-bold text-xs tracking-widest">SOLVER</button>
          <button className="px-6 py-2 rounded-full text-gray-400 font-bold text-xs tracking-widest hover:text-white transition-all">CLIENT</button>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-red-900/50 border border-zinc-800 hover:border-red-500/50 rounded-xl text-zinc-400 hover:text-red-400 text-xs font-bold transition-all"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <HeroSection
        userName={userProfile?.name || "Legend"}
        onSolveEarn={handleSolveEarn}
        onOpenConnect={() => setShowConnect(true)}
        onOpenLearn={() => setShowLearn(true)}
        onOpenIdentity={() => setShowIdentity(true)}
      />

      {/* DASHBOARD STATS */}
      <section className="px-4 md:px-10 pb-20 z-20 relative">
        <div className="max-w-[95rem] mx-auto grid grid-cols-1 md:grid-cols-5 gap-6">

          {/* 1. IDENTITY */}
          <div
            className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col justify-between h-56 group hover:border-white/30 transition-all relative overflow-hidden cursor-pointer"
            onClick={() => setShowIdentity(true)}
          >
            <div className="absolute -right-4 -top-4 text-[100px] font-black text-white/5 pointer-events-none select-none">ID</div>
            <div className="flex justify-between items-start">
              <div className="p-3 bg-zinc-900/80 rounded-2xl border border-white/5 text-cyan-400 shadow-inner">🛡️</div>
              <div className="text-[10px] font-bold text-zinc-500 text-right uppercase tracking-wider leading-tight">Neural<br />Engine</div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-white tracking-wide uppercase">Identity</h3>
              <div className="text-lg font-bold text-cyan-400 mt-2">
                {userProfile?.archetype || "Unknown"}
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6 h-1.5 bg-zinc-800/50 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500" />
            </div>
          </div>

          {/* 2. CONNECT */}
          <div
            className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col justify-between h-56 group hover:border-white/30 transition-all relative overflow-hidden cursor-pointer"
            onClick={() => setShowConnect(true)}
          >
            <div className="absolute -right-4 -top-4 text-[100px] font-black text-white/5 pointer-events-none select-none">SQ</div>
            <div className="flex justify-between items-start">
              <div className="p-3 bg-zinc-900/80 rounded-2xl border border-white/5 text-blue-400 shadow-inner">👥</div>
              <div className="text-[10px] font-bold text-zinc-500 text-right uppercase tracking-wider leading-tight">Social<br />Link</div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-white tracking-wide uppercase">Connect</h3>
              <div className="text-sm font-bold text-blue-300 mt-2 leading-tight uppercase tracking-wide">
                {userProfile?.squad || "Unassigned"}
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6 h-1.5 bg-zinc-800/50 rounded-full overflow-hidden">
              <div className="h-full w-full bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.5)]" />
            </div>
          </div>

          {/* 3. LEARN */}
          <div
            className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col justify-between h-56 group hover:border-white/30 transition-all relative overflow-hidden cursor-pointer"
            onClick={() => setShowLearn(true)}
          >
            <div className="absolute -right-4 -top-4 text-[100px] font-black text-white/5 pointer-events-none select-none">BR</div>
            <div className="flex justify-between items-start">
              <div className="p-3 bg-zinc-900/80 rounded-2xl border border-white/5 text-purple-400 shadow-inner">🧠</div>
              <div className="text-[10px] font-bold text-zinc-500 text-right uppercase tracking-wider leading-tight">Grade<br />{userProfile?.grade || "N/A"}</div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-white tracking-wide uppercase">Learn</h3>
              <div className="text-3xl font-bold text-purple-400 mt-2 font-mono italic">
                {userProfile?.xp || 0} <span className="text-sm font-mono text-zinc-500 not-italic font-sans">XP</span>
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6 flex gap-1">
              <div className="h-1.5 w-full bg-purple-600/30 rounded-full" />
              <div className="h-1.5 w-1/3 bg-purple-600 rounded-full" />
            </div>
          </div>

          {/* 4. SOLVE */}
          <div
            className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col justify-between h-56 group hover:border-white/30 transition-all relative overflow-hidden cursor-pointer"
            onClick={handleSolveEarn}
          >
            <div className="absolute -right-4 -top-4 text-[100px] font-black text-white/5 pointer-events-none select-none">AC</div>
            <div className="flex justify-between items-start">
              <div className="p-3 bg-zinc-900/80 rounded-2xl border border-white/5 text-green-400 shadow-inner">⚡</div>
              <div className="text-[10px] font-bold text-zinc-500 text-right uppercase tracking-wider leading-tight">Live<br />Status</div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-white tracking-wide uppercase">Solve</h3>
              <div className="text-3xl font-bold text-white mt-2 font-mono italic">
                {userProfile?.level || 1} <span className="text-xs text-green-500 font-bold uppercase ml-2 animate-pulse">● Level</span>
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6 h-1.5 bg-zinc-800/50 rounded-full overflow-hidden text-cyan-400">
              <div className="h-full w-1/4 bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]" />
            </div>
          </div>

          {/* 5. EARN */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col justify-between h-56 group hover:border-white/30 transition-all relative overflow-hidden cursor-pointer">
            <div className="absolute -right-4 -top-4 text-[100px] font-black text-white/5 pointer-events-none select-none">GP</div>
            <div className="flex justify-between items-start">
              <div className="p-3 bg-zinc-900/80 rounded-2xl border border-white/5 text-yellow-400 shadow-inner">💳</div>
              <div className="text-[10px] font-bold text-zinc-500 text-right uppercase tracking-wider leading-tight">Verified<br />Payouts</div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-white tracking-wide uppercase">Earn</h3>
              <div className="text-3xl font-bold text-yellow-400 mt-2 font-mono italic">
                {userProfile?.genesisPoints || 0} <span className="text-sm font-mono text-zinc-500 not-italic font-sans">GP</span>
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6 h-1.5 bg-zinc-800/50 rounded-full overflow-hidden text-yellow-400">
              <div className="h-full w-full bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT BOARD */}
      <section id="impact-board" className="relative py-20 px-4 md:px-10 bg-gradient-to-b from-black/0 to-zinc-900/20 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic">Impact Board</h2>
            <div className="h-px flex-1 bg-white/10" />
            <span className="px-4 py-1 bg-zinc-900 text-xs font-mono text-zinc-500 rounded-full border border-zinc-800">
              PASSION: {userProfile?.passion?.toUpperCase() || "ALL"}
            </span>
          </div>
          <ImpactBoard onMissionStart={setActiveMission} />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="fixed bottom-0 w-full p-4 border-t border-white/5 bg-black/80 backdrop-blur-xl flex justify-between items-center z-50">
        <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-600">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          SAGE PROTOCOL • {userProfile?.name?.toUpperCase() || "LEGEND"} • LEVEL {userProfile?.level || 1}
        </div>
        <div className="flex gap-4">
          <div className="hidden md:flex items-center gap-3 px-4 py-1.5 bg-zinc-900/80 rounded border border-white/5">
            <span className="text-yellow-500 text-xs">⚡</span>
            <span className="font-mono font-bold text-zinc-300 text-xs">{userProfile?.genesisPoints || 0} GP</span>
          </div>
          <button onClick={() => setShowFounderModal(true)} className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[10px] font-bold text-white uppercase tracking-wider rounded transition-all">
            Founder Check
          </button>
          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="px-4 py-2 border border-blue-500/30 bg-blue-500/10 text-[10px] font-bold text-blue-400 uppercase tracking-wider rounded hover:bg-blue-500/20 transition-all"
          >
            {isSimulating ? "● Running..." : "📈 Run Path Simulation"}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
