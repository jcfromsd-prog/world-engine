import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, CheckCircle, GraduationCap, LogOut, Activity, Users } from 'lucide-react';
import { useSageMemory } from './hooks/useSageMemory';
import { useUser } from './context/UserContext';
import { SimulationEngine, getTargetPersonaKey } from "./services/SimulationEngine";
import { FounderCheckModal } from "./components/dashboard/FounderCheckModal";
import SolverDashboard from './components/SolverDashboard';
import { addGenesisPoints } from './engine/ProgressionEngine';

// Lazy Load Large Components
const SolverWorkspace = React.lazy(() => import('./components/SolverWorkspace'));
const AssessmentModule = React.lazy(() => import('./components/AssessmentModule'));
const ConnectView = React.lazy(() => import('./components/ConnectView'));
const LearnView = React.lazy(() => import('./components/LearnView'));
const IdentityView = React.lazy(() => import('./components/IdentityView'));

// ----------------- DATA: Impact Missions -----------------
const IMPACT_MISSIONS = [
  {
    id: "CS.ALG.01",
    title: "Clean Energy Algorithm",
    desc: "Optimize the load-balancing logic for a decentralized solar grid in East Africa.",
    category: "CODING",
    tag: "GREENTECH INITIATIVE",
    xp: 250,
    gp: 120,
    color: "text-green-400"
  },
  {
    id: "SCI.BIO.04",
    title: "Bio-Diversity Mapper",
    desc: "Analyze drone footage to identify endangered species in the Amazon basin.",
    category: "SCIENCE",
    tag: "WILDLIFE PROTECT",
    xp: 300,
    gp: 150,
    color: "text-emerald-400"
  },
  {
    id: "MATH.PHY.09",
    title: "Urban Water Flow Logic",
    desc: "Calculate the pressure distributions for a modular rainwater harvesting system.",
    category: "MATH",
    tag: "H2O ACCESS",
    xp: 200,
    gp: 90,
    color: "text-blue-400"
  },
  {
    id: "HUM.SOC.02",
    title: "Policy Narrative Design",
    desc: "Draft a compelling policy proposal for universal basic connectivity in rural zones.",
    category: "HUMANITIES",
    tag: "GLOBAL CONNECT",
    xp: 180,
    gp: 80,
    color: "text-purple-400"
  },
  {
    id: "CS.SEC.07",
    title: "Quantum Encryption Override",
    desc: "Protect medical records in a simulated quantum attack scenario.",
    category: "CODING",
    tag: "HEALTHGUARD",
    xp: 400,
    gp: 200,
    color: "text-rose-400"
  }
];

// ----------------- TYPES -----------------
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

// ----------------- SUB-COMPONENTS -----------------
function MenuLink({ icon, label, onClick, active }: { icon: React.ReactNode, label: string, onClick: () => void, active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${active
        ? 'bg-zinc-900 text-white border-l-2 border-cyan-500'
        : 'text-gray-400 hover:text-white hover:bg-zinc-900'
        }`}
    >
      {icon}
      <span className="font-bold tracking-widest uppercase text-xs">{label}</span>
    </button>
  );
}

// ----------------- COMPONENT: MISSION MODAL -----------------
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

// ----------------- COMPONENT: HERO SECTION (5-Step Power Bar) -----------------


// ----------------- COMPONENT: HERO SECTION (Tighter Power Bar) -----------------
function HeroSection({ onStart, onOpenConnect, onOpenLearn, onOpenIdentity }: { onStart: () => void, onOpenConnect: () => void, onOpenLearn: () => void, onOpenIdentity: () => void }) {
  return (
    <main className="relative pt-40 pb-20 px-4 flex flex-col items-center justify-center min-h-[70vh] text-center z-10">

      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* HERO TEXT: SOLVE / IMPACT */}
      <div className="mb-8 animate-in fade-in zoom-in duration-1000">
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white drop-shadow-2xl uppercase">
          Solve <span className="text-zinc-700 font-thin mx-4">/</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Impact</span>
        </h1>
      </div>

      {/* HORIZONTAL STACK CONTAINER (Gap Reduced and Font Scaled) */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-4 mb-10 w-full max-w-6xl animate-in slide-in-from-bottom duration-1000">

        {/* 1. IDENTITY */}
        <div className="group cursor-pointer flex flex-col items-center" onClick={onOpenIdentity}>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-105 transition-transform duration-300">
            IDENTITY
          </h1>
          <p className="mt-1 text-[9px] text-pink-500 font-mono opacity-0 group-hover:opacity-100 transition-opacity tracking-widest uppercase">
            /// NEURAL ENGINE
          </p>
        </div>

        <div className="hidden md:block w-px h-8 bg-zinc-800/50 mx-2" />

        {/* 2. CONNECT */}
        <div className="group cursor-pointer flex flex-col items-center" onClick={onOpenConnect}>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 hover:scale-105 transition-transform duration-300">
            CONNECT
          </h1>
          <p className="mt-1 text-[9px] text-cyan-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity tracking-widest uppercase">
            /// WITH A SQUAD
          </p>
        </div>

        <div className="hidden md:block w-px h-8 bg-zinc-800/50 mx-2" />

        {/* 3. LEARN */}
        <div className="group cursor-pointer flex flex-col items-center" onClick={onOpenLearn}>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 hover:scale-105 transition-transform duration-300">
            LEARN
          </h1>
          <p className="mt-1 text-[9px] text-purple-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity tracking-widest uppercase">
            /// WITH AI SPEED
          </p>
        </div>

        <div className="hidden md:block w-px h-8 bg-zinc-800/50 mx-2" />

        {/* 4. SOLVE */}
        <div className="group cursor-pointer flex flex-col items-center" onClick={onStart}>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white hover:text-[#39FF14] hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.05)]">
            SOLVE
          </h1>
          <p className="mt-1 text-[9px] text-white font-mono opacity-0 group-hover:opacity-100 transition-opacity tracking-widest uppercase">
            /// FOR IMPACT
          </p>
        </div>

        <div className="hidden md:block w-px h-8 bg-zinc-800/50 mx-2" />

        {/* 5. EARN */}
        <div className="group cursor-pointer flex flex-col items-center" onClick={onOpenIdentity}>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 hover:scale-105 transition-transform duration-300">
            EARN
          </h1>
          <p className="mt-1 text-[9px] text-yellow-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity tracking-widest uppercase">
            /// YOUR LEGEND
          </p>
        </div>
      </div>

      {/* TAGLINE */}
      <div className="max-w-2xl mx-auto mb-8 px-4 text-center">
        <p className="text-lg md:text-xl text-zinc-300 font-medium leading-relaxed">
          The world's first <span className="text-blue-400 font-bold">Impact Engine</span>.
          <br className="hidden md:block" />
          <span className="text-zinc-500 text-sm mt-1 block">
            Solve real-world challenges, earn direct payouts, and build your legend.
          </span>
        </p>
      </div>

      {/* GREEN BUTTON */}
      <div>
        <button
          onClick={onStart}
          className="px-16 py-5 bg-gradient-to-r from-[#a3e635] to-[#4ade80] text-black font-black text-xl tracking-widest rounded-lg shadow-[0_0_50px_rgba(74,222,128,0.4)] hover:shadow-[0_0_80px_rgba(74,222,128,0.6)] hover:scale-105 transition-all flex items-center gap-3 mx-auto uppercase"
        >
          <span>🚀</span> SOLVE & EARN
        </button>
      </div>
    </main>
  );
}

// ----------------- COMPONENT: IMPACT BOARD -----------------
function ImpactBoard({ onMissionStart }: { onMissionStart: () => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {IMPACT_MISSIONS.map((mission) => (
        <div key={mission.id} className="group relative p-8 bg-zinc-900/40 border border-white/5 hover:border-white/20 rounded-2xl transition-all hover:bg-zinc-900/60 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-6">
            <span className={`text-[10px] font-black tracking-widest uppercase ${mission.color} bg-white/5 px-2 py-1 rounded`}>
              {mission.category}
            </span>
            <span className="text-[10px] font-mono text-zinc-600">{mission.id}</span>
          </div>
          <h3 className="text-2xl font-black text-white mb-3 group-hover:text-blue-200 transition-colors uppercase italic leading-none">
            {mission.title}
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed mb-8 font-medium">
            {mission.desc}
          </p>
          <div className="flex items-center justify-between border-t border-white/5 pt-6">
            <div>
              <span className="block text-[9px] text-zinc-500 font-black tracking-widest uppercase mb-1">Potential Reward</span>
              <span className="text-sm font-bold text-white">
                {mission.xp} XP <span className="text-zinc-700 mx-2">|</span> <span className="text-yellow-400 font-mono tracking-tighter">{mission.gp} GP</span>
              </span>
            </div>
            <button
              onClick={onMissionStart}
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
        <span className="text-[11px] font-black tracking-widest text-zinc-600 uppercase group-hover:text-white transition-all italic tracking-widest">Explore More Missions</span>
      </div>
    </div>
  );
}

// ----------------- ENTRY POINT: APP -----------------
function App() {
  const { userState, updateProfile, initUser, clearMemory } = useSageMemory();
  const { isInitialized, setUser, interventions, userProfile, heroPath } = useUser();

  const [showAssessment, setShowAssessment] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const [showLearn, setShowLearn] = useState(false);
  const [showIdentity, setShowIdentity] = useState(false);
  const [activeMission, setActiveMission] = useState<UIMission | null>(null);
  const [activeQuest, setActiveQuest] = useState<UIMission | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showFounderModal, setShowFounderModal] = useState(false);

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    setSimulationLog([]);
    const personaKey = getTargetPersonaKey();
    await SimulationEngine.runSimulation(personaKey, (msg) => {
      setSimulationLog(prev => [...prev, msg]);
    });
    // Log stays visible until user closes it - no auto-hide
  };

  useEffect(() => {
    if (isInitialized && !userState && userProfile && heroPath) {
      initUser(userProfile.name, heroPath.role, userProfile.passion || "Logic", userProfile.age || 10);
    }
  }, [isInitialized, userState, userProfile, heroPath, initUser]);

  const handleLaunchMission = () => {
    setActiveQuest(activeMission);
    setActiveMission(null);
  };

  const handleReturnToDash = (rewards?: { xp: number, balance: number }) => {
    setActiveQuest(null);
    if (rewards && userState) {
      const { profile: updatedProfile } = addGenesisPoints(userState, rewards.balance, "Mission Reward");
      updateProfile(updatedProfile);
    }
  };

  if (activeQuest) {
    return (
      <div className="min-h-screen bg-black text-white font-mono">
        <Suspense fallback={<div className="p-10 text-center">Loading Workspace...</div>}>
          <SolverWorkspace onBack={() => handleReturnToDash()} onSolve={(rewards) => handleReturnToDash(rewards)} />
        </Suspense>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-neon-green selection:text-black relative overflow-x-hidden">

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

      {showAssessment && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center font-black uppercase tracking-[0.5em] animate-pulse">Initializing Neural Assessment...</div>}>
          <AssessmentModule
            onClose={() => setShowAssessment(false)}
            onComplete={(data, selectedPath) => {
              initUser(data.name, selectedPath.role, selectedPath.focus, data.grade);
              setUser(
                { name: data.name, age: data.grade, passion: data.passion, style: data.style },
                { role: selectedPath.role, currentMission: "Initial Alignment", currentMissionId: null, status: "Idle", level: 1, xp: 0, history: [] }
              );
              setShowAssessment(false);
            }}
          />
        </Suspense>
      )}

      {/* OVERRAYS FOR VIEWS */}
      {showConnect && (
        <Suspense fallback={null}><ConnectView onBack={() => setShowConnect(false)} /></Suspense>
      )}
      {showLearn && (
        <Suspense fallback={null}><LearnView onBack={() => setShowLearn(false)} /></Suspense>
      )}
      {showIdentity && (
        <Suspense fallback={null}><IdentityView onBack={() => setShowIdentity(false)} /></Suspense>
      )}

      {/* SPECIAL OPS ALERTS */}
      {interventions.length > 0 && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-xl px-6">
          <motion.div initial={{ y: -20 }} animate={{ y: 0 }} className="bg-red-500/10 backdrop-blur-xl border border-red-500/50 p-6 rounded-[2rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 font-black text-4xl -rotate-12 translate-x-4">SPEC OPS</div>
            <h4 className="text-red-500 font-black text-[10px] uppercase tracking-[0.3em] mb-1">Critical Intervention</h4>
            <h3 className="text-xl font-bold text-white mb-2">{interventions[0].title}</h3>
            <p className="text-zinc-500 text-xs mb-4">{interventions[0].description}</p>
            <button onClick={() => setActiveMission(interventions[0])} className="px-6 py-2 bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-red-500 transition-all">Initialize Payload</button>
          </motion.div>
        </div>
      )}

      {activeMission && (
        <MissionModal mission={activeMission} onClose={() => setActiveMission(null)} onLaunch={handleLaunchMission} />
      )}

      {/* HEADER */}
      <nav className="fixed top-0 w-full z-[140] p-6 flex justify-between items-center bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            MBP // WORLD ENGINE
          </span>
          <div className="h-2 w-2 rounded-full bg-zinc-500 animate-pulse" />
        </div>
        <div className="flex gap-2 bg-zinc-900/80 p-1 rounded-full border border-white/10">
          <button className="px-6 py-2 rounded-full bg-white text-black font-bold text-xs tracking-widest hover:scale-105 transition-all">
            SOLVER
          </button>
          <button className="px-6 py-2 rounded-full text-gray-400 font-bold text-xs tracking-widest hover:text-white transition-all">
            CLIENT
          </button>
        </div>
        <button onClick={() => setShowMenu(true)} className="p-2 border border-white/10 rounded-full hover:bg-white/10 transition-colors">
          <div className="space-y-1">
            <div className="w-6 h-0.5 bg-white"></div>
            <div className="w-6 h-0.5 bg-white"></div>
            <div className="w-6 h-0.5 bg-white"></div>
          </div>
        </button>
      </nav>

      {/* COMMAND CENTER SLIDE-OVER */}
      <AnimatePresence>
        {showMenu && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-0 z-[150] flex justify-end">
            <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setShowMenu(false)} />
            <div className="w-full md:w-[400px] bg-zinc-950 border-l border-white/10 p-10 flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Command Center</h2>
                <button onClick={() => setShowMenu(false)} className="text-zinc-500 hover:text-white"><X size={24} /></button>
              </div>
              <nav className="flex-1 space-y-4">
                <MenuLink icon={<Activity size={18} />} label="Impact Feed" onClick={() => setShowMenu(false)} active />
                <MenuLink icon={<GraduationCap size={18} />} label="Knowledge Map" onClick={() => { setShowMenu(false); setShowLearn(true); }} />
                <MenuLink icon={<Users size={18} />} label="Squad Hub" onClick={() => { setShowMenu(false); setShowConnect(true); }} />
                <MenuLink icon={<Brain size={18} />} label="Neural Index" onClick={() => { setShowMenu(false); setShowIdentity(true); }} />

                <div className="pt-8 border-t border-white/5 mt-8">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5 mb-4">
                    <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-1">Total Payouts</div>
                    <div className="text-2xl font-mono font-black text-lime-400">{userState?.genesisPoints || 0} GP</div>
                  </div>
                  <button onClick={clearMemory} className="w-full flex items-center gap-4 p-4 text-zinc-700 hover:text-red-500 transition-all">
                    <LogOut size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Purge Session Data</span>
                  </button>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {!isInitialized ? (
          <>
            <HeroSection
              onStart={() => setShowAssessment(true)}
              onOpenConnect={() => alert("Initialize Neural Link first.")}
              onOpenLearn={() => alert("Initialize Neural Link first.")}
              onOpenIdentity={() => alert("Initialize Neural Link first.")}
            />
            <ImpactBoard onMissionStart={() => setShowAssessment(true)} />
          </>
        ) : (
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-cyan-500 animate-pulse font-mono uppercase tracking-[0.5em]">Syncing Neural State...</div>}>
            <div className="animate-in fade-in duration-1000">
              <HeroSection
                onStart={() => {
                  // Scroll to Impact Board section
                  const impactSection = document.getElementById('impact-board');
                  if (impactSection) {
                    impactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                  // Also open the mission modal for the first mission
                  setActiveMission({
                    id: 'CS.ALG.01',
                    title: 'Clean Energy Algorithm',
                    desc: 'Optimize the load-balancing logic for a decentralized solar grid in East Africa.',
                    price: '120 GP',
                    type: 'CODING',
                    tags: ['GREENTECH', 'ALGORITHM'],
                    rewards: { xp: 250, gp: 120 }
                  });
                }}
                onOpenConnect={() => setShowConnect(true)}
                onOpenLearn={() => setShowLearn(true)}
                onOpenIdentity={() => setShowIdentity(true)}
              />

              {/* DASHBOARD STATS (CORRECT ORDER: ID -> CONNECT -> LEARN -> SOLVE -> EARN) */}
              <section className="px-4 md:px-10 pb-20 z-20 relative">
                <div className="max-w-[95rem] mx-auto grid grid-cols-1 md:grid-cols-5 gap-6">
                  {/* BOX 1: IDENTITY */}
                  <div
                    className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col justify-between h-56 group hover:border-white/30 transition-all relative overflow-hidden cursor-pointer"
                    onClick={() => setShowIdentity(true)}
                  >
                    <div className="absolute -right-4 -top-4 text-[100px] font-black text-white/5 pointer-events-none select-none">ID</div>
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-zinc-900/80 rounded-2xl border border-white/5 text-cyan-400 shadow-inner">🛡️</div>
                      <div className="text-[10px] font-bold text-zinc-500 text-right uppercase tracking-wider leading-tight">
                        Neural<br />Engine
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-wide uppercase">Identity</h3>
                      <div className="text-3xl font-bold text-cyan-400 mt-2 font-mono italic">
                        {userProfile ? 63 : 0} <span className="text-sm font-mono text-zinc-500 not-italic font-sans">IDX</span>
                      </div>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 h-1.5 bg-zinc-800/50 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"></div>
                    </div>
                  </div>

                  {/* BOX 2: CONNECT */}
                  <div
                    className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col justify-between h-56 group hover:border-white/30 transition-all relative overflow-hidden cursor-pointer"
                    onClick={() => setShowConnect(true)}
                  >
                    <div className="absolute -right-4 -top-4 text-[100px] font-black text-white/5 pointer-events-none select-none">SQ</div>
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-zinc-900/80 rounded-2xl border border-white/5 text-blue-400 shadow-inner">👥</div>
                      <div className="text-[10px] font-bold text-zinc-500 text-right uppercase tracking-wider leading-tight">
                        Social<br />Link
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-wide uppercase">Connect</h3>
                      <div className="text-[11px] font-bold text-blue-300 mt-2 leading-tight uppercase tracking-wide h-8 overflow-hidden">
                        {heroPath?.status === "Active" ? `Unit: ${userProfile?.name?.split(' ')[0] || 'Alpha'} Squad` : "No Active Deployment"}
                      </div>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 h-1.5 bg-zinc-800/50 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.5)]"></div>
                    </div>
                  </div>

                  {/* BOX 3: LEARN */}
                  <div
                    className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col justify-between h-56 group hover:border-white/30 transition-all relative overflow-hidden cursor-pointer"
                    onClick={() => setShowLearn(true)}
                  >
                    <div className="absolute -right-4 -top-4 text-[100px] font-black text-white/5 pointer-events-none select-none">BR</div>
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-zinc-900/80 rounded-2xl border border-white/5 text-purple-400 shadow-inner">🧠</div>
                      <div className="text-[10px] font-bold text-zinc-500 text-right uppercase tracking-wider leading-tight">
                        Neural<br />Path
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-wide uppercase">Learn</h3>
                      <div className="text-3xl font-bold text-purple-400 mt-2 font-mono italic">
                        {userState?.dailyStreak || 0} <span className="text-sm font-mono text-zinc-500 not-italic font-sans">SYN</span>
                      </div>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 flex gap-1">
                      <div className="h-1.5 w-full bg-purple-600/30 rounded-full"></div>
                      <div className="h-1.5 w-1/3 bg-purple-600 rounded-full shadow-[0_0_10px_rgba(147,51,234,0.5)]"></div>
                      <div className="h-1.5 w-2 bg-purple-600/50 rounded-full"></div>
                    </div>
                  </div>

                  {/* BOX 4: SOLVE */}
                  <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col justify-between h-56 group hover:border-white/30 transition-all relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 text-[100px] font-black text-white/5 pointer-events-none select-none">AC</div>
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-zinc-900/80 rounded-2xl border border-white/5 text-green-400 shadow-inner">⚡</div>
                      <div className="text-[10px] font-bold text-zinc-500 text-right uppercase tracking-wider leading-tight">
                        Live<br />Status
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-wide uppercase">Solve</h3>
                      <div className="text-3xl font-bold text-white mt-2 font-mono italic">
                        0 <span className={`text-xs font-mono not-italic uppercase ml-2 ${heroPath?.currentMissionId ? "text-neon-green animate-pulse font-bold" : "text-zinc-600"}`}>
                          {heroPath?.currentMissionId ? "● Active" : "○ Idle"}
                        </span>
                      </div>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 h-1.5 bg-zinc-800/50 rounded-full overflow-hidden text-green-400">
                      <div className={`h-full bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)] transition-all duration-1000 ${heroPath?.currentMissionId ? "w-1/2" : "w-0"}`}></div>
                    </div>
                  </div>

                  {/* BOX 5: EARN */}
                  <div
                    className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col justify-between h-56 group hover:border-white/30 transition-all relative overflow-hidden cursor-pointer"
                    onClick={() => setShowIdentity(true)}
                  >
                    <div className="absolute -right-4 -top-4 text-[100px] font-black text-white/5 pointer-events-none select-none">GP</div>
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-zinc-900/80 rounded-2xl border border-white/5 text-yellow-400 shadow-inner">💳</div>
                      <div className="text-[10px] font-bold text-zinc-500 text-right uppercase tracking-wider leading-tight">
                        Verified<br />Payouts
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-wide uppercase">Earn</h3>
                      <div className="text-3xl font-bold text-yellow-400 mt-2 font-mono italic">
                        {userState?.genesisPoints || 0} <span className="text-sm font-mono text-zinc-500 not-italic font-sans">GP</span>
                      </div>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 h-1.5 bg-zinc-800/50 rounded-full overflow-hidden text-yellow-400">
                      <div className="h-full w-full bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)]"></div>
                    </div>
                  </div>
                </div>
              </section>

              {/* IMPACT BOARD */}
              <section id="impact-board" className="relative py-20 px-4 md:px-10 bg-gradient-to-b from-black/0 to-zinc-900/20 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                  <div className="flex items-center gap-6 mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic">Impact Board</h2>
                    <div className="h-px flex-1 bg-white/10"></div>
                    <span className="px-4 py-1 bg-zinc-900 text-xs font-mono text-zinc-500 rounded-full border border-zinc-800">
                      EPOCH: 42.1
                    </span>
                  </div>
                  <ImpactBoard onMissionStart={() => {
                    // Launch the first mission
                    setActiveMission({
                      id: 'CS.ALG.01',
                      title: 'Clean Energy Algorithm',
                      desc: 'Optimize the load-balancing logic for a decentralized solar grid.',
                      price: '120 GP',
                      type: 'CODING',
                      tags: ['GREENTECH', 'ALGORITHM'],
                      rewards: { xp: 250, gp: 120 }
                    });
                  }} />
                </div>
              </section>
              <SolverDashboard profile={userState!} onMissionStart={setActiveMission} />
            </div>
          </Suspense>
        )}
      </main>

      {/* FOOTER CONTROLS */}
      <footer className="fixed bottom-0 w-full p-4 border-t border-white/5 bg-black/80 backdrop-blur-xl flex justify-between items-center z-[140]">
        <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-600">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          SECURED BY SAGE IDENTITY PROTOCOL &copy; 2026
        </div>

        <div className="flex gap-4 items-center">
          <div className="hidden md:flex items-center gap-3 px-4 py-1.5 bg-zinc-900/80 rounded border border-white/5">
            <span className="text-yellow-500 text-xs">⚡</span>
            <span className="font-mono font-bold text-zinc-300 text-xs tracking-tighter">
              {userState?.genesisPoints || 0} GP
            </span>
          </div>

          <button
            onClick={() => setShowFounderModal(true)}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[10px] font-bold text-white uppercase tracking-wider rounded transition-all"
          >
            Founder Check
          </button>

          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className={`px-4 py-2 border border-blue-500/30 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded transition-all ${isSimulating ? "bg-blue-900/20 text-blue-400 cursor-wait" : "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
              }`}
          >
            {isSimulating ? "Running..." : "📈 Run Path Simulation"}
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;
