import React, { useState, useEffect } from 'react';
import { Shield, Zap, Lock, Menu, X, Brain, CheckCircle, Activity, CreditCard, GraduationCap, LogOut } from 'lucide-react';
import SolveAndEarnButton from './components/SolveAndEarnButton';
import SolverWorkspace from './components/SolverWorkspace';
import AssessmentModule from './components/AssessmentModule';
import SystemDiagnostic from './components/SystemDiagnostic';
import ProgressionDashboard from './components/ProgressionDashboard';

// ----------------- SOULBOUND ENGINE IMPORTS -----------------
import type { SoulboundProfile } from './engine/types';
import {
  loadProfile,
  saveProfile,
  initializeProfile,
  updateStreak,
  addGenesisPoints
} from './engine';

// ----------------- TYPES -----------------
// UI Mission Type (Compatible with BountyCard)
type UIMission = {
  id: string;
  title: string;
  price: string;
  desc: string;
  tags?: string[];
  locked?: boolean;
  highlight?: boolean;
  type?: string;
  // Engine properties
  difficulty?: string;
  rewards?: any;
};

// ----------------- THE SAGE MEMORY ENGINE (HOOK) -----------------
function useSageMemory() {
  const [userState, setUserState] = useState<SoulboundProfile | null>(() => {
    // 1. Try to load existing profile
    const saved = loadProfile();
    if (saved) {
      // 2. Update streak on load
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

  const initUser = (name: string, archetype: string, sector: string) => {
    const newProfile = initializeProfile(
      `user_${Date.now()}`,
      name,
      archetype,
      sector
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
    <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-lg transition-all ${active ? 'bg-zinc-900 text-white border-l-2 border-green-500' : 'text-gray-400 hover:text-white hover:bg-zinc-900'}`}>
      {icon}
      <span className="font-bold tracking-widest uppercase text-xs">{label}</span>
    </button>
  );
}

function FooterIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="p-3 bg-zinc-900/50 rounded-full text-gray-500 hover:bg-green-500 hover:text-black transition-all cursor-pointer">
      {icon}
    </div>
  );
}

function BountyCard({ title, price, desc, tags = [], locked, highlight, onClick }: { title: string, price: string, desc: string, tags?: string[], locked?: boolean, highlight?: boolean, onClick?: () => void }) {
  return (
    <div onClick={onClick} className={`p-6 border rounded-xl transition-all cursor-pointer group relative overflow-hidden ${highlight ? 'bg-zinc-900/60 border-lime-500/50 hover:border-lime-400' : 'bg-zinc-900/20 border-gray-800 hover:border-gray-600'} ${locked && 'opacity-75 grayscale'}`}>
      {locked && (
        <div className="absolute inset-0 z-20 bg-black/50 flex items-center justify-center backdrop-blur-[1px]">
          <div className="text-center">
            <Lock className="text-gray-500 mb-2 mx-auto" size={32} />
            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Authentication Required</span>
          </div>
        </div>
      )}
      {highlight && <div className="absolute top-0 right-0 bg-lime-500 text-black text-[10px] font-bold px-3 py-1 uppercase tracking-widest">Purpose Match</div>}

      <div className="flex justify-between items-start mb-2">
        <div><h3 className={`text-lg font-bold mb-1 ${highlight ? 'text-white' : 'text-gray-300'}`}>{title}</h3></div>
        <div className={`text-xl font-mono font-bold ${highlight ? 'text-lime-400' : 'text-gray-400'}`}>{price}</div>
      </div>

      <p className="text-gray-500 text-sm mb-4 leading-relaxed">{desc}</p>

      <div className="flex gap-2 flex-wrap items-center">
        <button className={`bg-green-900/20 text-green-400 border border-green-900/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${!locked && 'hover:bg-green-500 hover:text-black transition-colors'}`}>
          {locked ? "LOCKED" : "[INITIATE PROTOCOL]"}
        </button>
        {tags && tags.map((tag, i) => (
          <span key={i} className="px-2 py-1 bg-black border border-gray-800 text-gray-600 text-[10px] uppercase tracking-wider">{tag}</span>
        ))}
      </div>
    </div>
  );
}

function SolverCard({ rank, name, role, earnings, badges, highlight }: { rank: string, name: string, role: string, earnings: string, badges: string[], highlight?: boolean }) {
  return (
    <div className={`flex items-center gap-4 p-4 border transition-colors cursor-pointer group ${highlight ? 'bg-blue-900/10 border-blue-500/30' : 'bg-zinc-900/20 border-gray-800 hover:bg-zinc-900/40'}`}>
      <div className="text-xl font-black text-gray-800 group-hover:text-green-500/50 transition-colors italic">{rank}</div>
      <div className="flex-1">
        <div className={`font-bold ${highlight ? 'text-white' : 'text-gray-300'}`}>{name}</div>
        <div className="text-[10px] text-gray-600 uppercase tracking-wide">{role}</div>
      </div>
      <div className="text-right">
        <div className="text-sm font-mono text-green-500">{earnings}</div>
        <div className="flex justify-end gap-1 mt-1">
          {badges.map((b, i) => <span key={i} className="text-[10px] text-gray-500">{b}</span>)}
        </div>
      </div>
    </div>
  );
}

// ----------------- COMPONENT: MISSION MODAL -----------------
function MissionModal({ mission, onClose, onLaunch }: { mission: UIMission, onClose: () => void, onLaunch: () => void }) {
  const [status, setStatus] = useState('initializing'); // initializing, connected, active

  useEffect(() => {
    // Simulate connection sequence
    const t1 = setTimeout(() => setStatus('connected'), 1000);
    const t2 = setTimeout(() => setStatus('active'), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex items-center justify-center animate-in fade-in duration-300">
      <div className="w-full max-w-2xl px-6 text-center">
        {status === 'initializing' && (
          <div className="space-y-6">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-2xl font-bold text-green-500 animate-pulse uppercase tracking-widest">Establishing Neural Handshake...</h2>
            <div className="font-mono text-gray-500 text-sm">Encrypting: {mission.title}</div>
          </div>
        )}

        {status === 'connected' && (
          <div className="space-y-6">
            <CheckCircle size={64} className="text-green-500 mx-auto animate-in zoom-in duration-300" />
            <h2 className="text-3xl font-black text-white uppercase">Uplink Secure</h2>
            <p className="text-gray-400">Sage is ready to guide you.</p>
          </div>
        )}

        {status === 'active' && (
          <div className="bg-zinc-900 border border-green-500/50 rounded-2xl p-8 relative overflow-hidden animate-in slide-in-from-bottom duration-500">
            <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
            <h2 className="text-3xl font-black text-white mb-2">{mission.title}</h2>
            <div className="text-green-400 font-bold mb-6 font-mono">{mission.price} REWARD POOL</div>
            <p className="text-gray-300 mb-8 max-w-md mx-auto">{mission.desc}</p>
            <div className="flex flex-col gap-4">
              <button
                onClick={onLaunch}
                className="bg-green-500 hover:bg-green-400 text-black font-black text-xl py-4 rounded-xl uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all transform hover:scale-[1.02]"
              >
                Launch Environment
              </button>
              <button onClick={onClose} className="text-gray-500 hover:text-white font-bold text-xs uppercase tracking-widest mt-4">
                Abort Mission
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------- COMPONENT: HERO SECTION -----------------
function HeroSection({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative py-24 md:py-32 px-6 border-b border-gray-900 bg-black overflow-hidden animate-in fade-in duration-700">
      <div className="relative z-10 max-w-7xl mx-auto text-center">

        {/* 1. THE NEON TEXT */}
        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 mb-16 font-black text-4xl md:text-6xl lg:text-7xl tracking-tighter leading-tight">
          <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">CONNECT</span>
          <span className="text-gray-800 font-light text-2xl md:text-5xl mx-2">/</span>
          <span className="text-indigo-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.4)]">LEARN</span>
          <span className="text-gray-800 font-light text-2xl md:text-5xl mx-2">/</span>
          <span className="text-fuchsia-500 drop-shadow-[0_0_15px_rgba(217,70,239,0.4)]">SOLVE</span>
          <span className="text-gray-800 font-light text-2xl md:text-5xl mx-2">/</span>
          <span className="text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]">EARN</span>
        </div>

        {/* 2. THE TAGLINE */}
        <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-8 text-xs md:text-sm text-gray-400 font-bold tracking-widest uppercase mb-16">
          <span className="hover:text-cyan-400 transition-colors">CONNECT with a Squad</span>
          <span className="hidden md:block text-gray-800">|</span>
          <span className="hover:text-indigo-400 transition-colors">LEARN with AI Speed</span>
          <span className="hidden md:block text-gray-800">|</span>
          <span className="hover:text-fuchsia-400 transition-colors">SOLVE for Impact</span>
          <span className="hidden md:block text-gray-800">|</span>
          <span className="hover:text-orange-400 transition-colors">EARN your Legend</span>
        </div>

        {/* 3. THE SUPERCHARGED BUTTON */}
        <SolveAndEarnButton onClick={onStart} />

        <div className="text-gray-700 text-[10px] tracking-[0.4em] uppercase font-mono">
          Built with the Global Innovation Stack
        </div>
      </div>
    </section>
  );
}

// ----------------- COMPONENT: SOLVER DASHBOARD (SOULBOUND EDITION) -----------------
function SolverDashboard({ profile, onMissionStart }: { profile: SoulboundProfile, onMissionStart: (m: any) => void }) {

  // ----------------- MISSION GENERATOR (ADAPTED) -----------------
  const getRecommendedMissions = () => {
    const { sector, archetype } = profile;
    let missions: UIMission[] = [];

    // ----------------- 1. DESIGN PATH (CREATOR) -----------------
    if (archetype === 'Creator') {
      missions = [
        {
          id: "des_1",
          title: "Logo Symmetry Studio",
          price: "25 GP",
          desc: "Analyze the geometric balance of corporate identities. Adjust vectors to achieve perfect golden ratio alignment.",
          tags: ["DESIGN", "GEOMETRY", "VISUAL"],
          locked: false,
          highlight: true,
          type: "visual"
        },
        {
          id: "des_2",
          title: "UI Color Harmonizer",
          price: "20 GP",
          desc: "Select the complementary palette for a high-stress medical dashboard. Optimize contrast for calm and clarity.",
          tags: ["UX", "COLOR", "VISUAL"],
          locked: false,
          highlight: false,
          type: "visual"
        }
      ];
    }
    // ----------------- 2. LEAD PATH (COMMANDER) -----------------
    else if (archetype === 'Commander') {
      missions = [
        {
          id: "lead_1",
          title: "Crisis Resource Allocator",
          price: "30 GP",
          desc: "A server farm has overheated. You have 3 cooling units and 5 critical clusters. Prioritize deployment to minimize data loss.",
          tags: ["STRATEGY", "LOGIC", "CRISIS"],
          locked: false,
          highlight: true,
          type: "logic"
        },
        {
          id: "lead_2",
          title: "Sprint Velocity Rescue",
          price: "25 GP",
          desc: "Your dev team is burned out. Analyze the burndown chart and choose the correct intervention to restore momentum.",
          tags: ["AGILE", "LEADERSHIP", "EMPATHY"],
          locked: false,
          highlight: false,
          type: "logic"
        }
      ];
    }
    // ----------------- 3. ENGINEER / ARCHITECT PATHS -----------------
    else {
      // Fallback to Sector-based logic for other archetypes
      if (sector === "Nature") {
        missions = [
          {
            id: "nat_1",
            title: "Leaf Pattern Match",
            price: "15 GP",
            desc: "Identify the fractal patterns in fern leaves to predict growth rates. Requires keen observation.",
            tags: ["NATURE", "PATTERN", "SCIENCE"],
            locked: false,
            highlight: true,
            type: "visual"
          },
          {
            id: "nat_2",
            title: "Eco-System Balancer",
            price: "20 GP",
            desc: "Adjust the predator/prey ratio in the simulation to stabilize the food web for 3 cycles.",
            tags: ["BIOLOGY", "LOGIC", "SYSTEMS"],
            locked: false,
            highlight: false,
            type: "logic"
          }
        ];
      } else if (sector === "Tech") {
        missions = [
          {
            id: "tech_1",
            title: "Quantum Circuit Logic",
            price: "30 GP",
            desc: "Debug the qubit superposition states. Ensure the logic gates resolve to a stable output.",
            tags: ["QUANTUM", "LOGIC", "CODE"],
            locked: false,
            highlight: true,
            type: "code"
          },
          {
            id: "tech_2",
            title: "Algorithm Optimizer",
            price: "25 GP",
            desc: "The sorting algorithm is O(n^2). Refactor the code block to achieve O(n log n) efficiency.",
            tags: ["CODE", "PERFORMANCE", "MATH"],
            locked: false,
            highlight: false,
            type: "code"
          }
        ];
      } else {
        // People Sector
        missions = [
          {
            id: "ppl_1",
            title: "Social Sentiment Analysis",
            price: "20 GP",
            desc: "Parse the social feed for rising negative sentiment. Flag keywords for the community manager.",
            tags: ["DATA", "SOCIAL", "ANALYSIS"],
            locked: false,
            highlight: true,
            type: "logic"
          },
          {
            id: "ppl_2",
            title: "Conflict Resolution",
            price: "25 GP",
            desc: "Two support tickets contradict each other. Find the root cause in the user data logs.",
            tags: ["SUPPORT", "EMPATHY", "LOGIC"],
            locked: false,
            highlight: false,
            type: "logic"
          }
        ];
      }
    }

    return missions;
  };

  const missions = getRecommendedMissions();

  return (
    <section className="relative py-12 px-6 border-b border-gray-900 bg-zinc-950 animate-in slide-in-from-bottom-10 duration-700">
      <div className="max-w-7xl mx-auto">

        {/* SOULBOUND PROGRESSION DASHBOARD */}
        <div className="mb-12">
          <ProgressionDashboard
            profile={profile}
            onOpenMission={() => onMissionStart(missions[0])}
            onJoinSquad={() => alert("Searching for local squad beacons...")}
          />
        </div>

        {/* MISSION GRID */}
        <div>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="text-green-500" />
            Available Missions
          </h3>
          <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {missions.map((m) => (
                <BountyCard
                  key={m.id}
                  {...m}
                  onClick={() => onMissionStart(m)}
                />
              ))}
              {/* LOCKED ELITE MISSION */}
              <BountyCard
                title="Solar Farm Deployed"
                price="$500.00"
                desc="Requires Level 5 and Squad of 3."
                tags={["ELITE", "SQUAD"]}
                locked={true}
              />
            </div>

            {/* SQUAD SIDEBAR */}
            <div>
              <div className="bg-zinc-900/20 border border-gray-800 p-6 rounded-xl">
                <h3 className="font-bold text-white mb-4">Your Squad</h3>
                <div className="space-y-4">
                  <SolverCard rank="1" name={profile.displayName} role={profile.archetype} earnings={`${profile.genesisPoints} GP`} badges={["🔵 Apprentice"]} highlight />
                  <SolverCard rank="-" name="Sage_AI" role="Mentor" earnings="∞" badges={["🟢 Online"]} />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}

// ----------------- ENTRY POINT: APP -----------------
function App() {
  // Use the Soulbound Engine Hook
  const { userState, updateProfile, initUser, clearMemory } = useSageMemory();

  // Local UI States
  const [showAssessment, setShowAssessment] = useState(false);
  const [activeMission, setActiveMission] = useState<UIMission | null>(null);
  const [activeQuest, setActiveQuest] = useState<UIMission | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  const handleLaunchMission = () => {
    setActiveQuest(activeMission);
    setActiveMission(null); // Close the modal
  };

  const handleReturnToDash = (rewards?: { xp: number, balance: number }) => {
    setActiveQuest(null);
    if (rewards && userState) {
      // Use Engine function to calculate updates
      const { profile: updatedProfile } = addGenesisPoints(userState, rewards.balance, "Mission Reward");
      updateProfile(updatedProfile);
      // Note: We should also call addSkillXP here in a specific skill, 
      // but simpler to just update GP for this demo.
    }
  };

  if (activeQuest) {
    return (
      <div className="min-h-screen bg-black text-white font-mono">
        <SolverWorkspace
          onBack={() => handleReturnToDash()}
          onSolve={(rewards) => handleReturnToDash(rewards)}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-green-900 selection:text-green-50 relative overflow-x-hidden">

      {/* ----------------- OVERLAYS ----------------- */}

      {/* DEV TOOL: Path Simulation Diagnostic */}
      <SystemDiagnostic />

      {/* 1. ADAPTIVE ASSESSMENT MODAL */}
      {showAssessment && (
        <AssessmentModule
          onClose={() => setShowAssessment(false)}
          onComplete={(data, selectedPath) => {
            initUser(data.name, selectedPath.role, selectedPath.focus);
            setShowAssessment(false);
          }}
        />
      )}

      {/* 2. ACTIVE MISSION MODAL */}
      {activeMission && (
        <MissionModal
          mission={activeMission}
          onClose={() => setActiveMission(null)}
          onLaunch={handleLaunchMission}
        />
      )}

      {/* 3. NAVIGATION DRAWER */}
      {showMenu && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl animate-in slide-in-from-right duration-300 flex justify-end">
          <div className="flex-1 hidden md:block" onClick={() => setShowMenu(false)}></div>
          <div className="w-full md:w-[400px] h-full bg-zinc-950 border-l border-gray-800 p-8 flex flex-col relative shadow-2xl">
            <button onClick={() => setShowMenu(false)} className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white transition-colors"><X size={24} /></button>
            <div className="mb-10 mt-4">
              <div className="text-xs text-green-500 font-bold tracking-[0.2em] uppercase mb-2 flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> SYSTEM ONLINE</div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">Command Center</h2>
            </div>
            {userState ? (
              <div className="bg-zinc-900/50 border border-gray-800 p-6 rounded-xl mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center border border-purple-500/50 text-purple-400 font-bold text-xl">{userState.displayName[0]}</div>
                  <div><div className="font-bold text-white text-lg">{userState.displayName}</div><div className="text-xs text-gray-500 uppercase tracking-widest">{userState.archetype}</div></div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-800"><span className="text-gray-500 text-xs uppercase tracking-widest">Vault Balance</span><span className="font-mono text-lime-400 font-bold text-xl">{userState.genesisPoints} GP</span></div>
              </div>
            ) : (
              <div className="p-6 bg-blue-900/10 border border-blue-800 rounded-xl mb-8 text-center"><p className="text-blue-400 text-sm mb-4">Neural Link Inactive</p><button onClick={() => { setShowMenu(false); setShowAssessment(true); }} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full uppercase tracking-wider text-xs">Initialize Link</button></div>
            )}
            <nav className="flex-1 space-y-2">
              <MenuLink icon={<Activity size={18} />} label="Genesis Feed" onClick={() => setShowMenu(false)} active />
              <MenuLink icon={<GraduationCap size={18} />} label="My Curriculum" onClick={() => alert("Sage Director: Curriculum Adapting...")} />
              <MenuLink icon={<CreditCard size={18} />} label="Wallet & Vault" onClick={() => alert(`Balance: ${userState?.genesisPoints} GP\n\n(Real withdrawals unlock at Level 5)`)} />
              <div className="pt-8 border-t border-gray-800">
                {userState && (<button onClick={clearMemory} className="flex items-center gap-3 text-red-500 hover:text-red-400 transition-colors w-full p-2 rounded hover:bg-red-900/10"><LogOut size={18} /><span className="font-bold tracking-widest uppercase text-xs">Disconnect (Reset Memory)</span></button>)}
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* ----------------- HEADER ----------------- */}
      <header className="border-b border-gray-900/50 p-4 md:p-6 flex items-center justify-between sticky top-0 z-50 bg-black/80 backdrop-blur-md">
        {/* LEFT: Branding */}
        <div className="flex flex-col items-start leading-none min-w-[120px] md:min-w-[150px] cursor-pointer" onClick={() => window.location.reload()}>
          <span className="text-cyan-400 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-1 ml-0.5">MYBESTPURPOSE</span>
          <div className="flex items-center gap-2"><span className="text-white text-lg md:text-2xl font-bold tracking-widest">WORLD ENGINE</span><div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" /></div>
        </div>

        {/* CENTER: SOLVER/CLIENT Toggle (Strategic) */}
        <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex">
          <div className="bg-zinc-900 p-1 rounded-full border border-gray-700 flex items-center shadow-lg">
            <button
              className="px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all bg-gradient-to-r from-cyan-500 to-cyan-400 text-black shadow-lg shadow-cyan-500/30"
            >
              SOLVER
            </button>
            <button
              className="px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all text-gray-500 hover:text-white"
            >
              CLIENT
            </button>
          </div>
        </div>

        {/* RIGHT: Menu */}
        <div className="flex justify-end min-w-[50px]"><button onClick={() => setShowMenu(true)} className="p-2 border border-gray-800 rounded bg-zinc-900/50 hover:bg-zinc-800 hover:text-white text-gray-400 transition-colors"><Menu size={24} /></button></div>
      </header>

      {/* ----------------- DYNAMIC CONTENT SWITCHER ----------------- */}
      {!userState ? (
        <HeroSection onStart={() => setShowAssessment(true)} />
      ) : (
        <SolverDashboard profile={userState} onMissionStart={setActiveMission} />
      )}

      <footer className="py-12 px-6 border-t border-gray-800 bg-zinc-950 text-center">
        <div className="flex justify-center gap-6 mb-8">
          <FooterIcon icon={<Shield size={20} />} />
          <FooterIcon icon={<Zap size={20} />} />
          <FooterIcon icon={<Brain size={20} />} />
        </div>
        <div className="text-gray-600 text-[10px] uppercase tracking-widest font-mono">
          Secured by Sage Identity Protocol &copy; 2025
        </div>
      </footer>
    </div>
  );
}

export default App;
