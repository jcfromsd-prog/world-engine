/* ==========================================================================
   MYBESTPURPOSE: PROGRESSION EDITION (Genius Merged)
   Features:
   1. "Hero's Path" Breadcrumbs (History Trail)
   2. "Visual Wizard" + "AI Squad Recruitment" (Searching Animation)
   3. "Mastery Tracker" (Filters out completed missions)
   4. "Game Engine" (SolverWorkspace fully integrated)
   5. "Shared Database" (Linked to Diagnostic Engine)
   ========================================================================== */
import React, { useState, Suspense } from "react";
import { SimulationEngine, USER_PERSONAS } from "./services/SimulationEngine";
import { FounderCheckModal } from "./components/dashboard/FounderCheckModal";
import { MISSION_DB } from "./data/MissionDatabase";

// Lazy Load Game Engine
const SolverWorkspace = React.lazy(() => import('./components/SolverWorkspace'));

// --- TYPES ---
type AppState = "LANDING" | "ONBOARDING" | "CHOICE_SELECTION" | "DASHBOARD";
type OnboardingStep = "NAME" | "GRADE" | "PASSION" | "MATCHING";

/* ==========================================================================
   COMPONENT: BREADCRUMB HEADER (The History Trail)
   ========================================================================== */
const BreadcrumbHeader: React.FC<{ name: string, grade: string, passion: string, step: string }> = ({ name, grade, passion, step }) => {
  return (
    <div className="absolute top-0 left-0 w-full p-6 z-50 flex justify-center pointer-events-none">
      <div className="flex items-center gap-4 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-2xl">
        {/* NAME SEGMENT */}
        <div className={`flex items-center gap-2 transition-colors duration-500 ${step === "NAME" ? "text-blue-400" : name ? "text-green-400" : "text-zinc-600"}`}>
          <span className="text-lg">{name ? "✅" : "👤"}</span>
          <span className="font-bold text-[10px] uppercase tracking-widest">{name || "IDENTITY"}</span>
        </div>
        <div className="w-4 h-px bg-white/10"></div>
        {/* GRADE SEGMENT */}
        <div className={`flex items-center gap-2 transition-colors duration-500 ${step === "GRADE" ? "text-blue-400" : grade ? "text-green-400" : "text-zinc-600"}`}>
          <span className="text-lg">{grade ? "✅" : "🎓"}</span>
          <span className="font-bold text-[10px] uppercase tracking-widest">{grade ? `GRADE ${grade}` : "LEVEL"}</span>
        </div>
        <div className="w-4 h-px bg-white/10"></div>
        {/* PASSION SEGMENT */}
        <div className={`flex items-center gap-2 transition-colors duration-500 ${step === "PASSION" ? "text-blue-400" : passion ? "text-green-400" : "text-zinc-600"}`}>
          <span className="text-lg">{passion ? "✅" : "🔥"}</span>
          <span className="font-bold text-[10px] uppercase tracking-widest">{passion || "PASSION"}</span>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   COMPONENT: ONBOARDING WIZARD (With AI Squad Logic)
   ========================================================================== */
const OnboardingWizard: React.FC<{ onComplete: (profile: any) => void, onCancel: () => void }> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<OnboardingStep>("NAME");
  const [wizardData, setWizardData] = useState({ name: "", grade: "", passion: "" });
  const [fade, setFade] = useState(false);
  const [matchStatus, setMatchStatus] = useState("SEARCHING GLOBAL NETWORK...");

  const handleNameSubmit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && wizardData.name.trim()) transitionTo("GRADE");
  };

  const handleSelection = (type: "GRADE" | "PASSION", value: string) => {
    if (type === "GRADE") {
      setWizardData(prev => ({ ...prev, grade: value }));
      transitionTo("PASSION");
    } else {
      setWizardData(prev => ({ ...prev, passion: value }));
      transitionTo("MATCHING");

      // --- AI SQUAD MATCHING LOGIC (Simulated) ---
      setTimeout(() => setMatchStatus("SCANNING FOR HUMAN MATCHES..."), 1000);
      setTimeout(() => setMatchStatus("HUMAN SQUAD NOT FULL. RECRUITING AI..."), 2500);
      setTimeout(() => {
        let squad = "The Generalists";
        if (value.includes("COD")) squad = "The Algo-Rhythm (2 AI / 1 Human)";
        if (value.includes("SCI")) squad = "The Bio-Guardians (3 AI)";
        if (value.includes("CRE")) squad = "The Visionaries (1 AI / 2 Humans)";
        if (value.includes("LEAD")) squad = "The Vanguards (3 AI)";
        onComplete({ ...wizardData, passion: value, squad, completedMissions: [] });
      }, 4500);
    }
  };

  const transitionTo = (nextStep: OnboardingStep) => {
    setFade(true);
    setTimeout(() => { setStep(nextStep); setFade(false); }, 300);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in p-6 font-sans">
      <BreadcrumbHeader name={wizardData.name} grade={wizardData.grade} passion={wizardData.passion} step={step} />
      <button onClick={onCancel} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors cursor-pointer z-[110]">✕ ESC</button>

      {step === "MATCHING" && (
        <div className="text-center w-full max-w-lg">
          <div className="text-6xl mb-6 animate-bounce">🧬</div>
          <h2 className="text-3xl font-black text-white tracking-widest mb-4 uppercase">Building Squad</h2>
          <div className="h-1 w-full bg-zinc-800 rounded-full mx-auto overflow-hidden mb-6 relative">
            <div className="absolute top-0 left-0 h-full w-1/3 bg-blue-500 animate-[loading_2s_infinite]"></div>
          </div>
          <p className="text-green-400 font-mono text-xs uppercase animate-pulse tracking-widest border border-green-500/20 bg-green-500/10 py-2 rounded">{matchStatus}</p>
        </div>
      )}

      {step === "NAME" && (
        <div className={`text-center w-full max-w-2xl transition-opacity duration-300 ${fade ? "opacity-0" : "opacity-100"}`}>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">What is your Legend Name?</h1>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <input autoFocus className="relative w-full bg-zinc-900 border border-white/10 rounded-xl px-8 py-6 text-2xl text-center text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-all font-bold" placeholder="Type Name & Hit Enter..." value={wizardData.name} onChange={e => setWizardData({ ...wizardData, name: e.target.value })} onKeyDown={handleNameSubmit} />
          </div>
        </div>
      )}

      {step === "GRADE" && (
        <div className={`w-full max-w-5xl transition-opacity duration-300 ${fade ? "opacity-0" : "opacity-100"}`}>
          <h1 className="text-4xl font-black text-white text-center mb-10">Select Your Level</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <button onClick={() => handleSelection("GRADE", "3")} className="group p-8 bg-zinc-900/50 border border-white/10 rounded-3xl hover:bg-zinc-800 hover:border-green-500/50 hover:-translate-y-2 transition-all cursor-pointer"><div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🎒</div><h3 className="text-xl font-bold text-white uppercase tracking-tight">Explorer</h3><p className="text-xs text-zinc-400 font-mono">Grades K-5</p></button>
            <button onClick={() => handleSelection("GRADE", "7")} className="group p-8 bg-zinc-900/50 border border-white/10 rounded-3xl hover:bg-zinc-800 hover:border-blue-500/50 hover:-translate-y-2 transition-all cursor-pointer"><div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🛠️</div><h3 className="text-xl font-bold text-white uppercase tracking-tight">Builder</h3><p className="text-xs text-zinc-400 font-mono">Grades 6-8</p></button>
            <button onClick={() => handleSelection("GRADE", "10")} className="group p-8 bg-zinc-900/50 border border-white/10 rounded-3xl hover:bg-zinc-800 hover:border-purple-500/50 hover:-translate-y-2 transition-all cursor-pointer"><div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🚀</div><h3 className="text-xl font-bold text-white uppercase tracking-tight">Legend</h3><p className="text-xs text-zinc-400 font-mono">High School</p></button>
            <button onClick={() => handleSelection("GRADE", "14")} className="group p-8 bg-zinc-900/50 border border-white/10 rounded-3xl hover:bg-zinc-800 hover:border-yellow-500/50 hover:-translate-y-2 transition-all cursor-pointer"><div className="text-5xl mb-4 group-hover:scale-110 transition-transform">👔</div><h3 className="text-xl font-bold text-white uppercase tracking-tight">Pro</h3><p className="text-xs text-zinc-400 font-mono">College/Career</p></button>
          </div>
        </div>
      )}

      {step === "PASSION" && (
        <div className={`w-full max-w-5xl transition-opacity duration-300 ${fade ? "opacity-0" : "opacity-100"}`}>
          <h1 className="text-4xl font-black text-white text-center mb-10">What Drives You?</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <button onClick={() => handleSelection("PASSION", "CODING")} className="group p-8 bg-zinc-900/50 border border-white/10 rounded-3xl hover:bg-zinc-800 hover:border-blue-400 hover:-translate-y-2 transition-all cursor-pointer"><div className="text-5xl mb-4 group-hover:scale-110 transition-transform">💻</div><h3 className="text-xl font-bold text-white uppercase tracking-tight">Tech & Code</h3><p className="text-xs text-zinc-400">Building the future.</p></button>
            <button onClick={() => handleSelection("PASSION", "SCIENCE")} className="group p-8 bg-zinc-900/50 border border-white/10 rounded-3xl hover:bg-zinc-800 hover:border-emerald-400 hover:-translate-y-2 transition-all cursor-pointer"><div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🌿</div><h3 className="text-xl font-bold text-white uppercase tracking-tight">Nature</h3><p className="text-xs text-zinc-400">Protecting the planet.</p></button>
            <button onClick={() => handleSelection("PASSION", "CREATIVE")} className="group p-8 bg-zinc-900/50 border border-white/10 rounded-3xl hover:bg-zinc-800 hover:border-pink-400 hover:-translate-y-2 transition-all cursor-pointer"><div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🎨</div><h3 className="text-xl font-bold text-white uppercase tracking-tight">Art & Design</h3><p className="text-xs text-zinc-400">Creating beauty.</p></button>
            <button onClick={() => handleSelection("PASSION", "LEADERSHIP")} className="group p-8 bg-zinc-900/50 border border-white/10 rounded-3xl hover:bg-zinc-800 hover:border-yellow-400 hover:-translate-y-2 transition-all cursor-pointer"><div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🤝</div><h3 className="text-xl font-bold text-white uppercase tracking-tight">Leadership</h3><p className="text-xs text-zinc-400">Leading the way.</p></button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ==========================================================================
   COMPONENT: CHOICE SELECTION (Autonomy Protocol with History Filter)
   ========================================================================== */
const ChoiceSelection: React.FC<{ profile: any, onSelect: (missionId: string) => void }> = ({ profile, onSelect }) => {
  const gradeNum = parseInt(profile.grade.replace(/\D/g, "")) || 5;
  const history = profile.completedMissions || []; // Get history

  const recommendations = MISSION_DB.filter(m => {
    // 1. Filter Completed
    if (history.includes(m.id)) return false;

    // 2. Filter Passion
    const p = (profile.passion || "").toLowerCase();
    let matchesPassion = false;
    if (p.includes("cod") || p.includes("tech")) matchesPassion = m.category === "CODING";
    else if (p.includes("sci") || p.includes("bio")) matchesPassion = m.category === "SCIENCE";
    else if (p.includes("creat") || p.includes("art")) matchesPassion = m.category === "CREATIVE" || m.category === "HUMANITIES" || m.category === "DESIGN";
    else if (p.includes("lead")) matchesPassion = m.category === "LEADERSHIP" || m.category === "BUSINESS" || m.category === "HISTORY";
    else matchesPassion = true;

    // 3. Filter Grade
    return matchesPassion && gradeNum >= m.minGrade && gradeNum <= m.maxGrade;
  }).slice(0, 3);

  // Fallback if they exhausted passion missions
  const displayMissions = recommendations.length > 0 ? recommendations : MISSION_DB.filter(m => !history.includes(m.id) && gradeNum >= m.minGrade && gradeNum <= m.maxGrade).slice(0, 3);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in p-6">
      <BreadcrumbHeader name={profile.name} grade={profile.grade} passion={profile.passion} step="COMPLETE" />

      <div className="text-center mb-10 mt-16">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4 uppercase tracking-tighter italic">Autonomy Protocol</h1>
        <p className="text-xl text-zinc-400 max-w-2xl">
          SAGE found {displayMissions.length} new missions for <span className="text-white font-bold">{profile.name}</span>.<br />
          <span className="text-green-400 text-xs font-mono uppercase tracking-widest border border-green-500/20 bg-green-500/10 px-2 py-1 rounded mt-2 inline-block">History: {history.length} Completed</span>
        </p>
      </div>

      {displayMissions.length === 0 ? (
        <div className="text-center">
          <h2 className="text-3xl font-black text-white mb-4">👑 DOMAIN MASTERY ACHIEVED</h2>
          <p className="text-zinc-400 mb-8">You have completed all available missions for your level.</p>
          <button onClick={() => onSelect("LEVEL_UP")} className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest rounded hover:bg-blue-400 transition-colors">Advance to Next Grade</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
          {displayMissions.map((mission) => (
            <div key={mission.id} onClick={() => onSelect(mission.id)} className="group cursor-pointer bg-zinc-900/50 border border-white/10 p-8 rounded-2xl hover:border-white/50 hover:bg-zinc-800 transition-all hover:-translate-y-2">
              <div className={`text-[10px] font-black tracking-widest mb-4 uppercase ${mission.color}`}>{mission.category}</div>
              <h3 className="text-2xl font-black mb-4 group-hover:text-blue-300 transition-colors italic uppercase leading-tight">{mission.title}</h3>
              <p className="text-sm text-zinc-400 mb-6 leading-relaxed font-medium">{mission.desc}</p>
              <div className="flex justify-between items-center pt-6 border-t border-white/5">
                <span className="text-yellow-400 font-bold">{mission.gp} GP</span>
                <button className="px-6 py-2 bg-white text-black text-[10px] font-black uppercase rounded group-hover:bg-blue-400 transition-colors tracking-widest">Accept</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ==========================================================================
   MAIN APP
   ========================================================================== */
const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>("LANDING");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simIndex, setSimIndex] = useState(0);
  const [showFounderModal, setShowFounderModal] = useState(false);
  const [activeQuest, setActiveQuest] = useState<any>(null);

  const startOnboarding = () => setAppState("ONBOARDING");

  const completeOnboarding = (profile: any) => {
    setUserProfile({ ...profile, genesisPoints: 50, dailyStreak: 1, completedMissions: [] });
    setAppState("CHOICE_SELECTION");
  };

  const handleMissionSelect = (missionId: string) => {
    if (missionId === "LEVEL_UP") {
      // Placeholder for Level Up Logic
      alert("Level Up Logic Activated!");
      return;
    }

    const mission = MISSION_DB.find(m => m.id === missionId);
    if (mission) {
      // Optimistic History Update
      if (userProfile) {
        const newHistory = [...(userProfile.completedMissions || []), missionId];
        setUserProfile({ ...userProfile, completedMissions: newHistory });
      }
      setAppState("DASHBOARD");
      setActiveQuest(mission);
    }
  };

  const handleReturnToDash = (rewards?: { xp: number, balance: number }) => {
    // FIX: Using GP for currency, not XP (Inflation Fix)
    const missionGP = activeQuest?.gp || 0;

    setActiveQuest(null);
    if (rewards && userProfile) {
      setUserProfile({ ...userProfile, genesisPoints: userProfile.genesisPoints + missionGP });
    }
  };

  const runGodModeSim = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationLog([]);
    const personaKeys = Object.keys(USER_PERSONAS) as Array<keyof typeof USER_PERSONAS>;
    const currentKey = personaKeys[simIndex % personaKeys.length];
    const simUser = USER_PERSONAS[currentKey];
    setUserProfile({ name: simUser.name, grade: simUser.gradeLevel.toString(), passion: simUser.passion, squad: "Simulated Squad", genesisPoints: 999, dailyStreak: 42, completedMissions: [] });
    await SimulationEngine.runSimulation(currentKey, (msg) => setSimulationLog(p => [...p, msg]));
    setSimIndex(prev => prev + 1);
    // Manual Close Only
  };

  const displayProfile = userProfile || { name: "GUEST", grade: "N/A", genesisPoints: 0, squad: "UNASSIGNED" };
  const gradeNum = parseInt((displayProfile.grade || "5").replace(/\D/g, "")) || 5;
  const history = userProfile?.completedMissions || [];

  // Dashboard shows missions NOT in history
  const displayMissions = appState === "LANDING"
    ? MISSION_DB.slice(0, 6)
    : MISSION_DB.filter(m => !history.includes(m.id) && gradeNum >= m.minGrade && gradeNum <= m.maxGrade);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-neon-green selection:text-black overflow-x-hidden animate-fade-in relative">

      {/* OVERLAYS */}
      {appState === "ONBOARDING" && <OnboardingWizard onComplete={completeOnboarding} onCancel={() => setAppState("LANDING")} />}
      {appState === "CHOICE_SELECTION" && <ChoiceSelection profile={userProfile} onSelect={handleMissionSelect} />}

      {/* NAVBAR */}
      <nav className="flex justify-between items-center p-6 border-b border-white/10 bg-black/50 backdrop-blur-md fixed w-full z-50">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">MYBESTPURPOSE</span>
          <span className="text-sm font-mono text-gray-500 hidden md:block">// WORLD ENGINE</span>
        </div>

        {(userProfile?.dailyStreak || 0) > 0 && (
          <div className="hidden md:flex flex-col items-end mr-4 group cursor-help" title="Daily Login Streak">
            <span className="text-[9px] text-orange-500 uppercase tracking-widest font-black opacity-80 group-hover:opacity-100 font-mono">Streak</span>
            <div className="flex items-center gap-1.5 leading-none mt-0.5">
              <span className="text-orange-500 animate-pulse text-sm">🔥</span>
              <span className="text-white font-mono font-bold text-lg">{userProfile?.dailyStreak}</span>
            </div>
          </div>
        )}

        <div className="flex gap-2 bg-zinc-900/80 p-1 rounded-full border border-white/10">
          <button className="px-6 py-2 rounded-full bg-white text-black font-bold text-[10px] tracking-widest hover:scale-105 transition-all uppercase">Solver</button>
          <button className="px-6 py-2 rounded-full text-gray-400 font-bold text-[10px] tracking-widest hover:text-white transition-all uppercase">Client</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="relative pt-40 pb-20 px-4 flex flex-col items-center justify-center min-h-[60vh] text-center z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="mb-4">
          <span className={`px-4 py-1.5 rounded-full text-[10px] border font-black tracking-widest uppercase transition-all ${userProfile ? "bg-zinc-800 text-green-400 border-green-500/30" : "bg-zinc-900 text-zinc-500 border-zinc-800"}`}>
            {userProfile ? `Welcome, ${displayProfile.name.toUpperCase()} • Grade ${displayProfile.grade}` : "System Status: Guest Mode"}
          </span>
        </div>
        <div className="mb-8"><h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white drop-shadow-2xl italic uppercase">Solve <span className="text-zinc-700 font-thin mx-4">/</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Impact</span></h1></div>
        <div className="max-w-4xl mx-auto mb-12 px-4 text-center">
          <p className="text-lg md:text-2xl text-zinc-400 font-medium leading-relaxed tracking-wide">
            The world's first <span className="text-white font-bold">Impact Engine</span>. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-green-400 to-emerald-400 font-black mt-2 inline-block uppercase tracking-tight">
              Squad Up. Master Skills. Solve for Impact. Earn Your Legend.
            </span>
          </p>
        </div>
        <div>
          <button onClick={startOnboarding} className="px-16 py-5 bg-gradient-to-r from-[#a3e635] to-[#4ade80] text-black font-black text-xl tracking-widest rounded-lg shadow-[0_0_50px_rgba(74,222,128,0.4)] hover:scale-110 hover:-rotate-1 transition-all flex items-center gap-3 mx-auto uppercase">
            <span>🚀</span> {userProfile ? "Resume Mission" : "Solve & Earn"}
          </button>
        </div>
      </main>

      {/* DASHBOARD STATS */}
      <section className="px-4 md:px-10 pb-20 z-20 relative">
        <div className="max-w-[95rem] mx-auto grid grid-cols-1 md:grid-cols-5 gap-6">
          <StatBox label="Identity" sub="Neural Engine" value={userProfile ? "63" : "0"} unit="IDX" color="cyan" progress={userProfile ? 66 : 0} />
          <StatBox label="Connect" sub="Social Link" value={displayProfile.squad} unit="" color="blue" progress={userProfile ? 100 : 0} />
          <StatBox label="Learn" sub="Neural Path" value={history.length.toString()} unit="SYN" color="purple" progress={Math.min(history.length * 10, 100)} />
          <StatBox label="Solve" sub="Live Status" value="0" unit="Active" color="green" progress={0} animate />
          <StatBox label="Earn" sub="Verified Payouts" value={displayProfile.genesisPoints} unit="GP" color="yellow" progress={userProfile ? 100 : 0} />
        </div>
      </section>

      {/* IMPACT BOARD */}
      <section className="relative py-20 px-4 md:px-10 bg-gradient-to-b from-black/0 to-zinc-900/20 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic">Impact Board</h2>
            <div className="h-px flex-1 bg-white/10"></div>
            <span className="px-4 py-1 bg-zinc-900 text-[10px] font-black tracking-widest text-zinc-500 rounded-full border border-zinc-800 uppercase">
              {userProfile ? `Filter: Grade ${gradeNum} | History Active` : "Preview Mode"}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayMissions.length > 0 ? displayMissions.map((mission) => (
              <div key={mission.id} onClick={() => setActiveQuest(mission)} className="group relative p-8 bg-zinc-900/40 border border-white/5 hover:border-white/20 rounded-2xl transition-all hover:bg-zinc-900/60 hover:-translate-y-1 cursor-pointer">
                <div className="flex justify-between items-start mb-6"><span className={`text-[10px] font-black tracking-widest uppercase ${mission.color} bg-white/5 px-2 py-1 rounded`}>{mission.category}</span><span className="text-[10px] font-mono text-zinc-600">{mission.id}</span></div>
                <h3 className="text-2xl font-black text-white mb-3 group-hover:text-blue-200 transition-colors uppercase italic leading-none">{mission.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-8 font-medium">{mission.desc}</p>
                <div className="flex items-center justify-between border-t border-white/5 pt-6"><div><span className="block text-[9px] text-zinc-500 font-black tracking-widest uppercase mb-1">Potential Reward</span><span className="text-sm font-bold text-white uppercase">{mission.xp} XP <span className="text-zinc-700 mx-2">|</span> <span className="text-yellow-400">{mission.gp} GP</span></span></div><button className="px-6 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded hover:bg-zinc-200 transition-all">Start</button></div>
              </div>
            )) : (
              <div className="text-zinc-500 col-span-3 text-center py-20 font-bold uppercase tracking-widest">
                Level Complete! No pending missions.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* GAME WORKSPACE */}
      {activeQuest && (
        <div className="fixed inset-0 z-[200] bg-black animate-in fade-in zoom-in-95 duration-300">
          <Suspense fallback={<div className="flex h-screen items-center justify-center text-green-500 font-mono text-xl animate-pulse tracking-widest">INITIALIZING NEURAL LINK...</div>}>
            <SolverWorkspace mission={activeQuest} onBack={() => setActiveQuest(null)} onSolve={(rewards: any) => handleReturnToDash(rewards)} />
          </Suspense>
        </div>
      )}

      {/* FOOTER */}
      <footer className="fixed bottom-0 w-full p-4 border-t border-white/5 bg-black/80 backdrop-blur-xl flex justify-between items-center z-50">
        <div className="flex items-center gap-3 text-[9px] font-black tracking-[0.2em] text-zinc-600 uppercase"><div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> Secured by Sage Identity Protocol © 2026</div>
        <div className="flex gap-4">
          <button onClick={() => setShowFounderModal(true)} className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[10px] font-black text-white uppercase tracking-wider rounded transition-all">Founder Check</button>
          <button onClick={runGodModeSim} disabled={isSimulating} className="px-4 py-2 border border-blue-500/30 bg-blue-500/10 text-[10px] font-black text-blue-400 uppercase tracking-wider rounded hover:bg-blue-500/20 transition-all cursor-pointer">
            {isSimulating ? "Running..." : `📈 Run Sim: ${USER_PERSONAS[(Object.keys(USER_PERSONAS) as Array<keyof typeof USER_PERSONAS>)[simIndex % 3]].name}`}
          </button>
        </div>
      </footer>
      <FounderCheckModal isOpen={showFounderModal} onClose={() => setShowFounderModal(false)} />
      {isSimulating && (
        <div className="fixed bottom-24 left-6 w-[450px] max-h-96 bg-black/95 border border-blue-500/30 rounded-lg p-6 shadow-2xl z-50 flex flex-col font-mono">
          {/* Header with Close Button */}
          <div className="flex justify-between items-center mb-4 border-b border-blue-500/20 pb-2">
            <span className="text-xs text-blue-400 font-bold animate-pulse tracking-widest uppercase">● Simulation Live</span>
            <button
              onClick={() => setIsSimulating(false)}
              className="text-zinc-500 hover:text-white text-[10px] font-bold px-2 py-1 bg-zinc-900 rounded border border-zinc-700 hover:border-white transition-all uppercase tracking-wider cursor-pointer"
            >
              ✕ Close Log
            </button>
          </div>

          {/* Log Content */}
          <div className="overflow-y-auto flex-1 text-[11px] text-blue-400 space-y-2 pr-2 custom-scrollbar uppercase">
            {simulationLog.map((log, i) => (
              <div key={i} className="border-l-2 border-blue-500/50 pl-3 leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- STATBOX HELPER ---
const StatBox = ({ label, sub, value, unit, color, progress, animate }: any) => {
  const colors: any = { cyan: "text-cyan-400", blue: "text-blue-400", purple: "text-purple-400", green: "text-green-400", yellow: "text-yellow-400" };
  const bgGradients: any = { cyan: "from-cyan-500", blue: "from-blue-600", purple: "from-purple-600", green: "from-green-500", yellow: "from-yellow-400" };
  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col justify-between h-56 group hover:border-white/30 transition-all relative overflow-hidden cursor-default shadow-xl">
      <div className="absolute -right-4 -top-4 text-[110px] font-black text-white/[0.03] pointer-events-none select-none uppercase tracking-tighter italic">{label.substring(0, 2)}</div>
      <div className="flex justify-between items-start relative z-10"><div className="p-3 bg-zinc-900/80 rounded-2xl border border-white/5 shadow-inner"><span className="text-xl opacity-80">🛡️</span></div><div className="text-[9px] font-black text-zinc-500 text-right uppercase tracking-[0.2em]">{sub.split(' ')[0]}<br />{sub.split(' ')[1]}</div></div>
      <div className="mt-4 relative z-10"><h3 className="text-xl font-black text-white tracking-widest uppercase italic opacity-60 group-hover:opacity-100 transition-opacity">{label}</h3><div className={`text-2xl font-black mt-2 uppercase tracking-tighter ${colors[color]}`}>{value} <span className="text-[10px] font-bold text-zinc-600 ml-1">{unit}</span> {animate && <span className="text-[10px] font-black uppercase ml-2 animate-pulse">● Live</span>}</div></div>
      <div className="absolute bottom-6 left-6 right-6 h-1 bg-zinc-900/50 rounded-full overflow-hidden relative z-10"><div className={`h-full bg-gradient-to-r ${bgGradients[color]} to-transparent transition-all duration-1000 ease-out`} style={{ width: `${progress}%` }}></div></div>
    </div>
  );
};

export default App;
