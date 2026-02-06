import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Menu, X, Brain, CheckCircle, CreditCard, GraduationCap, LogOut, ArrowRight, Activity, Users } from 'lucide-react';
import SolveAndEarnButton from './components/SolveAndEarnButton';
import type { SoulboundProfile } from './engine/types';
import {
  loadProfile,
  saveProfile,
  initializeProfile,
  updateStreak,
  addGenesisPoints
} from './engine';
import { SimulationEngine, getTargetPersonaKey } from "./services/SimulationEngine";
import { FounderCheckModal } from "./components/dashboard/FounderCheckModal";
import { useUser } from './context/UserContext';

// Lazy Load Large Components
const SolverWorkspace = React.lazy(() => import('./components/SolverWorkspace'));
const AssessmentModule = React.lazy(() => import('./components/AssessmentModule'));
const SolverDashboard = React.lazy(() => import('./components/SolverDashboard'));
const ConnectView = React.lazy(() => import('./components/ConnectView'));
const LearnView = React.lazy(() => import('./components/LearnView'));
const IdentityView = React.lazy(() => import('./components/IdentityView'));

// ----------------- TYPES -----------------
type UIMission = {
  id: string;
  title: string;
  price: string;
  desc: string;
  tags?: string[];
  locked?: boolean;
  highlight?: boolean;
  type?: string;
  difficulty?: string;
  rewards?: any;
};

// ----------------- THE SAGE MEMORY ENGINE (HOOK) -----------------
function useSageMemory() {
  const [userState, setUserState] = useState<SoulboundProfile | null>(() => {
    const saved = loadProfile();
    if (saved) {
      const { profile } = updateStreak(saved, new Date().toISOString().split('T')[0]);
      saveProfile(profile);
      return profile;
    }
    return null;
  });

  useEffect(() => {
    if (userState) {
      saveProfile(userState);
    }
  }, [userState]);

  const updateProfile = (updates: Partial<SoulboundProfile>) => {
    setUserState(prev => prev ? ({ ...prev, ...updates }) : null);
  };

  const initUser = (name: string, archetype: string, sector: string, gradeLevel: number) => {
    const newProfile = initializeProfile(
      `user_${Date.now()}`,
      name,
      archetype,
      sector,
      gradeLevel
    );
    setUserState(newProfile);
  };

  const clearMemory = () => {
    localStorage.removeItem('mbp_soulbound_profile');
    window.location.reload();
  };

  return { userState, updateProfile, initUser, clearMemory };
}

// ----------------- SUB-COMPONENTS -----------------
function MenuLink({ icon, label, onClick, active }: { icon: React.ReactNode, label: string, onClick: () => void, active?: boolean }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-lg transition-all ${active ? 'bg-zinc-900 text-white border-l-2 border-cyan-500' : 'text-gray-400 hover:text-white hover:bg-zinc-900'}`}>
      {icon}
      <span className="font-bold tracking-widest uppercase text-xs">{label}</span>
    </button>
  );
}

function FooterIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="p-3 bg-zinc-900/50 rounded-full text-zinc-600 hover:bg-cyan-500 hover:text-black transition-all cursor-pointer">
      {icon}
    </div>
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
    <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-2xl flex items-center justify-center animate-in fade-in duration-500 p-6">
      <div className="w-full max-w-xl">
        {status === 'initializing' && (
          <div className="text-center space-y-8">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-[0.3em] mb-2">Neural Link</h2>
              <div className="font-mono text-cyan-500/50 text-[10px] uppercase tracking-widest animate-pulse">Establishing Handshake...</div>
            </div>
          </div>
        )}

        {status === 'connected' && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-lime-500 rounded-full mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(132,204,22,0.4)] animate-in zoom-in duration-300">
              <CheckCircle size={40} className="text-black" strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Uplink Stable</h2>
            <p className="text-zinc-500 font-medium">Sage resonance at 99.8%</p>
          </div>
        )}

        {status === 'active' && (
          <div className="bg-zinc-900/40 backdrop-blur-3xl border border-zinc-800 rounded-[2.5rem] p-10 relative overflow-hidden animate-in zoom-in-95 duration-500 shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-5 uppercase font-black text-6xl -rotate-12 translate-x-8 -translate-y-8">MISSION</div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded-full">Active Objective</span>
              </div>

              <h2 className="text-4xl font-black text-white mb-3 tracking-tight">{mission.title}</h2>
              <div className="text-2xl font-black text-lime-400 mb-8 font-mono">{mission.price} <span className="text-xs uppercase tracking-widest text-zinc-600">Reward</span></div>

              <p className="text-zinc-400 mb-10 text-lg leading-relaxed">{mission.desc}</p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={onLaunch}
                  className="h-16 bg-white text-black font-black text-lg rounded-2xl uppercase tracking-[0.2em] shadow-2xl hover:bg-cyan-400 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group"
                >
                  Launch <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={onClose} className="h-12 text-zinc-600 hover:text-white font-black text-[10px] uppercase tracking-[0.4em] transition-colors">
                  Abort Sequence
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------- COMPONENT: HERO SECTION -----------------
function HeroSection({ onStart, onOpenConnect, onOpenLearn, onOpenIdentity }: { onStart: () => void, onOpenConnect: () => void, onOpenLearn: () => void, onOpenIdentity: () => void }) {
  const { heroPath, wallet, squad, synapseCount, psychometrics } = useUser();
  const activeMission = heroPath?.currentMission;
  const hasActiveMission = !!heroPath?.currentMissionId;

  const identityScore = Math.floor((psychometrics.autonomy + psychometrics.competence + psychometrics.relatedness) / 3);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden bg-[#050505]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-12 font-black text-5xl md:text-8xl tracking-tighter leading-none uppercase">
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-700">Solve</span>
          <span className="text-zinc-900 font-thin text-3xl md:text-6xl mx-2">/</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-[0_0_30px_rgba(34,211,238,0.2)]">Impact</span>
        </div>

        <h1 className="text-zinc-500 text-lg md:text-2xl font-medium mb-16 tracking-tight max-w-2xl mx-auto leading-relaxed">
          The world's first <span className="text-white">Impact Engine</span>. Solve real-world challenges, earn direct payouts, and build your legend.
        </h1>

        <div className="flex flex-col items-center gap-12">
          <SolveAndEarnButton onClick={onStart} />

          {/* MAIN MENU CARDS / STATUS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full max-w-[1400px] mx-auto px-4">
            {/* IDENTITY CARD - THE NEW BRAIN */}
            <div
              onClick={onOpenIdentity}
              className="group relative p-8 rounded-[2rem] bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 hover:border-cyan-500/50 hover:bg-zinc-900/60 transition-all duration-500 cursor-pointer overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] uppercase font-black text-6xl -rotate-12 translate-x-8 -translate-y-8">SAGE</div>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <Shield size={20} />
                </div>
                <div className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Neural Engine</div>
              </div>
              <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tighter">IDENTITY</h3>
              <div className="text-cyan-400 font-mono text-xl font-bold tracking-tighter italic">
                {identityScore}<span className="text-[10px] ml-1 not-italic opacity-50 uppercase">IDX</span>
              </div>
              <div className="mt-4 flex gap-1">
                <div className="h-1 flex-1 rounded-full bg-pink-500" style={{ width: `${psychometrics.autonomy}%` }} />
                <div className="h-1 flex-1 rounded-full bg-blue-500" style={{ width: `${psychometrics.competence}%` }} />
                <div className="h-1 flex-1 rounded-full bg-green-500" style={{ width: `${psychometrics.relatedness}%` }} />
              </div>
            </div>

            {/* CONNECT CARD */}
            <div
              onClick={onOpenConnect}
              className={`group relative p-8 rounded-[2rem] border transition-all duration-500 cursor-pointer overflow-hidden ${squad
                ? "bg-indigo-500/5 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.2)]"
                : "bg-zinc-900/40 backdrop-blur-xl border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60"
                }`}
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] uppercase font-black text-6xl -rotate-12 translate-x-8 -translate-y-8">SQUAD</div>

              <div className="flex items-center gap-4 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${squad ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                  <Users size={20} />
                </div>
                <div className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Social Link</div>
              </div>
              <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tighter">CONNECT</h3>
              <div className="text-indigo-400 font-mono text-xs font-bold uppercase tracking-widest">
                {squad ? `Squad: ${squad.name}` : "Loading..."}
              </div>
              {!squad && (
                <div className="mt-4 flex items-center gap-2 group-hover:gap-3 transition-all">
                  <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Find Match</span>
                  <ArrowRight size={14} className="text-indigo-500" />
                </div>
              )}
            </div>

            {/* SOLVE CARD */}
            <div className={`group relative p-8 rounded-[2rem] border transition-all duration-500 overflow-hidden ${hasActiveMission
              ? "bg-cyan-500/5 border-cyan-500/50 animate-active-glow"
              : "bg-zinc-900/40 backdrop-blur-xl border-zinc-800 hover:border-zinc-700"
              }`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <Activity size={20} />
                </div>
                <div className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Live Status</div>
              </div>
              <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tighter">SOLVE</h3>
              <div className="text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest">
                {activeMission ? `Active: ${activeMission}` : "0 Active"}
              </div>
              {hasActiveMission && (
                <div className="mt-4 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 w-1/3 animate-progress-flow" />
                </div>
              )}
            </div>

            {/* EARN CARD */}
            <div className="group relative p-8 rounded-[2rem] bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 hover:border-zinc-700 transition-all duration-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-lime-500/10 flex items-center justify-center text-lime-400">
                  <CreditCard size={20} />
                </div>
                <div className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  {wallet.balance > 0 ? (
                    <span className="text-lime-500">● Active</span>
                  ) : (
                    <span className="text-zinc-700">○ Locked</span>
                  )}
                </div>
              </div>
              <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tighter">EARN</h3>
              <div className="text-lime-400 font-mono text-xl font-bold tracking-tighter italic">
                {wallet.balance}<span className="text-[10px] ml-1 not-italic opacity-50 uppercase">GP</span>
              </div>
              <div className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mt-1">
                Verified Global Payouts
              </div>
            </div>

            {/* LEARN CARD */}
            <div
              onClick={onOpenLearn}
              className="group relative p-8 rounded-[2rem] bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all duration-500 cursor-pointer overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] uppercase font-black text-6xl -rotate-12 translate-x-8 -translate-y-8">BRAIN</div>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <GraduationCap size={20} />
                </div>
                <div className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Neural Path</div>
              </div>
              <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tighter">LEARN</h3>
              <div className="text-purple-400 font-mono text-xl font-bold tracking-tighter italic">
                {synapseCount}<span className="text-[10px] ml-1 not-italic opacity-50 uppercase">SYN</span>
              </div>
              <div className="mt-4 flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${i <= (heroPath?.level || 1) ? 'bg-purple-500' : 'bg-zinc-800'}`} />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-12 mt-8">
            <div className="flex flex-col items-center gap-1">
              <span className="text-zinc-600 text-[10px] uppercase tracking-[0.4em] font-black">Legends Active</span>
              <span className="text-white font-black text-lg">12,402</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-zinc-600 text-[10px] uppercase tracking-[0.4em] font-black">Total Payouts</span>
              <span className="text-white font-black text-lg">$1.2M</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-zinc-600 text-[10px] uppercase tracking-[0.4em] font-black">Causes Solved</span>
              <span className="text-white font-black text-lg">412</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----------------- ENTRY POINT: APP -----------------
function App() {
  const { userState, updateProfile, initUser, clearMemory } = useSageMemory();
  const { isInitialized, setUser, interventions } = useUser();

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
    setTimeout(() => setIsSimulating(false), 3000);
  };

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
          <SolverWorkspace
            onBack={() => handleReturnToDash()}
            onSolve={(rewards) => handleReturnToDash(rewards)}
          />
        </Suspense>
      </div>
    )
  }

  if (showConnect) {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black text-indigo-400 animate-pulse font-black uppercase tracking-[0.5em]">Establishing Squad Link...</div>}>
        <ConnectView onBack={() => setShowConnect(false)} />
      </Suspense>
    );
  }

  if (showLearn) {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black text-purple-400 animate-pulse font-black uppercase tracking-[0.5em]">Syncing Knowledge Nodes...</div>}>
        <LearnView onBack={() => setShowLearn(false)} />
      </Suspense>
    );
  }

  if (showIdentity) {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black text-cyan-400 animate-pulse font-black uppercase tracking-[0.5em]">Initializing Neural Graph...</div>}>
        <IdentityView onBack={() => setShowIdentity(false)} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500 selection:text-black relative overflow-x-hidden">
      {isSimulating && (
        <div className="fixed bottom-6 left-6 right-6 bg-black/90 border border-cyan-500/50 p-6 rounded-2xl z-[120] font-mono shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom" id="simulation-log">
          <h3 className="text-cyan-400 font-black mb-4 uppercase tracking-[0.2em]">🚀 Path Simulation Active</h3>
          <div className="max-h-[200px] overflow-y-auto text-[10px] space-y-1">
            {simulationLog.map((log, i) => <div key={i} className="text-zinc-400">{log}</div>)}
          </div>
        </div>
      )}

      <FounderCheckModal isOpen={showFounderModal} onClose={() => setShowFounderModal(false)} />

      {showAssessment && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">Initializing Neural Assessment...</div>}>
          <AssessmentModule
            onClose={() => setShowAssessment(false)}
            onComplete={(data, selectedPath) => {
              // 1. Sync legacy engine state
              initUser(data.name, selectedPath.role, selectedPath.focus, data.grade);

              // 2. Sync GLOBAL UserContext (Short-term memory)
              setUser(
                { name: data.name, age: data.grade, passion: data.passion, style: data.style },
                { role: selectedPath.role, currentMission: "Initial Alignment", currentMissionId: null, status: "Idle", level: 1, xp: 0, history: [] }
              );

              setShowAssessment(false);
            }}
          />
        </Suspense>
      )}

      {/* SPECIAL OPS INTERVENTION ALERT */}
      {interventions.length > 0 && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[80] w-full max-w-xl px-6 pointer-events-none">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-red-500/10 backdrop-blur-3xl border border-red-500/50 p-6 rounded-[2rem] shadow-[0_0_50px_rgba(239,68,68,0.2)] pointer-events-auto relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-6 opacity-[0.05] font-black text-6xl -rotate-12 translate-x-4 -translate-y-4">SPEC OPS</div>
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-500 shrink-0 animate-pulse">
                <Shield size={24} />
              </div>
              <div>
                <div className="text-[10px] text-red-400 font-black uppercase tracking-[0.3em] mb-1 flex items-center gap-2">
                  <Zap size={12} className="animate-bounce" /> Meta-Agent Intervention
                </div>
                <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-2 italic">
                  Critical Special Ops: {interventions[0].title}
                </h4>
                <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                  {interventions[0].description}
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setActiveMission(interventions[0])}
                    className="px-6 py-2 bg-red-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-white hover:text-red-500 transition-all shadow-xl"
                  >
                    Initialize Payload
                  </button>
                  <div className="text-[10px] text-red-500/50 font-mono italic">Unblock Competence Vector +{interventions[0].reward} XP</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {activeMission && (
        <MissionModal
          mission={activeMission}
          onClose={() => setActiveMission(null)}
          onLaunch={handleLaunchMission}
        />
      )}

      {showMenu && (
        <div className="fixed inset-0 z-[130] bg-black/60 backdrop-blur-xl animate-in fade-in duration-300 flex justify-end">
          <div className="flex-1 hidden md:block" onClick={() => setShowMenu(false)}></div>
          <div className="w-full md:w-[450px] h-full bg-zinc-950/90 border-l border-zinc-900 p-10 flex flex-col relative shadow-2xl">
            <button onClick={() => setShowMenu(false)} className="absolute top-10 right-10 p-2 text-zinc-600 hover:text-white transition-colors"><X size={24} /></button>
            <div className="mb-12 mt-6">
              <div className="text-[10px] text-cyan-400 font-black tracking-[0.4em] uppercase mb-2 flex items-center gap-2">Command Center</div>
              <h2 className="text-4xl font-black text-white uppercase tracking-tight">Navigation</h2>
            </div>

            {userState ? (
              <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] mb-12 shadow-2xl">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center text-black font-black text-2xl shadow-xl shadow-cyan-500/20">{userState.displayName[0]}</div>
                  <div>
                    <div className="font-black text-white text-xl tracking-tight">{userState.displayName}</div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{userState.archetype}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                  <span className="text-zinc-600 text-[10px] uppercase tracking-widest font-black">Escrow Balance</span>
                  <span className="font-mono text-lime-400 font-black text-2xl">{userState.genesisPoints} GP</span>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-cyan-500/5 border border-cyan-500/10 rounded-[2rem] mb-12 text-center">
                <p className="text-cyan-400 font-bold text-sm mb-6">Neural Link Inactive</p>
                <button onClick={() => { setShowMenu(false); setShowAssessment(true); }} className="h-12 bg-white text-black font-black py-2 px-8 rounded-xl uppercase tracking-widest text-xs hover:bg-cyan-400 transition-all">Initialize Alignment</button>
              </div>
            )}

            <nav className="flex-1 space-y-4">
              <MenuLink icon={<Activity size={18} />} label="Genesis Feed" onClick={() => setShowMenu(false)} active />
              <MenuLink icon={<GraduationCap size={18} />} label="The Syllabus" onClick={() => alert("Acquiring targets...")} />
              <MenuLink icon={<CreditCard size={18} />} label="Vault & USD" onClick={() => alert(`GP: ${userState?.genesisPoints}\nReal Balance: USD Unlocked at Level 5`)} />

              <div className="pt-12">
                {userState && (
                  <button onClick={clearMemory} className="flex items-center gap-4 text-zinc-700 hover:text-red-500 transition-colors w-full px-4 py-2">
                    <LogOut size={18} />
                    <span className="font-black tracking-[0.2em] uppercase text-[10px]">Purge Session Data</span>
                  </button>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}

      <header className="border-b border-white/5 p-6 md:p-8 flex items-center justify-between sticky top-0 z-[100] bg-black/60 backdrop-blur-xl">
        <div className="flex flex-col items-start leading-none cursor-pointer group" onClick={() => window.location.reload()}>
          <span className="text-cyan-400 text-[10px] font-black tracking-[0.4em] uppercase mb-1">Impact Engine</span>
          <div className="flex items-center gap-3">
            <span className="text-white text-xl md:text-3xl font-black tracking-tighter uppercase transition-colors group-hover:text-cyan-400">MBP // World Engine</span>
            <div className="w-2 h-2 bg-lime-500 rounded-full animate-pulse shadow-[0_0_10px_#84cc16]" />
          </div>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
          <div className="bg-zinc-900/50 p-1 rounded-2xl border border-white/5 flex items-center shadow-2xl backdrop-blur-md">
            {['SOLVER', 'FOUNDER'].map((mode, i) => (
              <button
                key={mode}
                className={`px-8 py-2 rounded-xl text-[10px] font-black tracking-[0.3em] transition-all ${i === 0 ? 'bg-white text-black shadow-xl shadow-white/5' : 'text-zinc-600 hover:text-white'
                  }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => setShowMenu(true)} className="w-14 h-14 border border-white/10 rounded-2xl bg-zinc-900/40 hover:bg-white hover:text-black text-white transition-all flex items-center justify-center shadow-xl">
          <Menu size={24} />
        </button>
      </header>

      <main className="relative z-10">
        {!isInitialized ? (
          <HeroSection
            onStart={() => setShowAssessment(true)}
            onOpenConnect={() => alert("Initialize Neural Link first.")}
            onOpenLearn={() => alert("Initialize Neural Link first.")}
            onOpenIdentity={() => alert("Initialize Neural Link first.")}
          />
        ) : (
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-cyan-400 font-mono animate-pulse uppercase tracking-[0.5em]">Syncing Progress...</div>}>
            <div className="animate-in fade-in duration-700">
              <HeroSection
                onStart={() => { }}
                onOpenConnect={() => setShowConnect(true)}
                onOpenLearn={() => setShowLearn(true)}
                onOpenIdentity={() => setShowIdentity(true)}
              />
              <SolverDashboard profile={userState!} onMissionStart={setActiveMission} />
            </div>
          </Suspense>
        )}
      </main>

      <footer className="py-24 px-8 border-t border-white/5 bg-[#030303] text-center relative z-10">
        <div className="mb-12 flex flex-wrap justify-center gap-6">
          <button
            onClick={() => setShowFounderModal(true)}
            className="h-12 border border-zinc-800 bg-zinc-900/30 px-8 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:border-cyan-500 hover:text-cyan-400 transition-all"
          >
            Founder Diagnostic
          </button>

          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className={`h-12 px-8 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border ${isSimulating
              ? 'bg-zinc-900 border-zinc-800 text-zinc-700 cursor-not-allowed'
              : 'border-white text-white hover:bg-white hover:text-black'
              }`}
          >
            {isSimulating ? "Simulation Underway" : "Run Path Simulation"}
          </button>
        </div>

        <div className="flex justify-center gap-8 mb-12">
          {[Shield, Zap, Brain].map((Icon, i) => (
            <FooterIcon key={i} icon={<Icon size={20} />} />
          ))}
        </div>
        <div className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.5em] mb-4">
          Secured by Sage Identity Protocol &copy; 2026
        </div>
        <div className="text-zinc-800 text-[9px] font-mono uppercase tracking-widest">
          Uptime: 99.999% // Latency: 4ms // Nodes: 4,102
        </div>
      </footer>
    </div>
  );
}

export default App;
