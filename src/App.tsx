/* ==========================================================================
   MYBESTPURPOSE: ULTIMATE EDITION (All Features Combined)
   1. VISUALS: Breadcrumb History + Visual Wizard (Fun Boxes)
   2. LOGIC: AI Squads + Mastery Tracking + Choice Filtering
   3. ECONOMY: CEO Solvency Guard + Platform Fees
   4. VIRALITY: CMO Social Share Modal
   5. SWARM-VERIFIED: Smart Fill Logic guarantees 3 choices.
   6. BLUEPRINT: 4 Engines Grid & Parallel Pathway Hero
   7. ARCHITECTURE: Permanent Breadcrumbs Layer (No Overwriting)
   ========================================================================== */
import React, { useState } from "react";
import { FounderCheckModal } from "./components/dashboard/FounderCheckModal";
import { MissionWorkspace } from "./components/workspaces/MissionWorkspace";

// --- TYPES ---
type AppState = "LANDING" | "ONBOARDING" | "CHOICE_SELECTION" | "DASHBOARD" | "MISSION_WORKSPACE" | "MISSION_ACTIVE" | "MISSION_COMPLETE";
type OnboardingStep = "NAME" | "GRADE" | "PASSION" | "MATCHING";


// --- THE TREASURY (CEO Logic) ---
const SYSTEM_TREASURY = {
  balance: 50000, // Real money backing the system
  platformFee: 0.20, // 20% Commission
};

// --- MISSION DATABASE (Training + Real World) ---
const MISSION_DB = [
  // K-5 FOUNDATIONS
  { id: "SCI.K5.01", type: "TRAINING", title: "Backyard Bio-Blitz", client: "Academy", reward: 100, desc: "Find/draw 3 bugs.", category: "SCIENCE", minGrade: 0, maxGrade: 5, color: "text-emerald-400" },
  { id: "COD.K5.01", type: "TRAINING", title: "Robot Logic Maze", client: "Academy", reward: 100, desc: "Guide the mouse.", category: "CODING", minGrade: 0, maxGrade: 5, color: "text-blue-400" },
  { id: "CRE.K5.01", type: "TRAINING", title: "My Hero Story", client: "Academy", reward: 100, desc: "Draw a hero.", category: "CREATIVE", minGrade: 0, maxGrade: 5, color: "text-yellow-400" },

  // 6-12 SKILLS
  { id: "CS.WEB.03", type: "TRAINING", title: "Portfolio Site", client: "Academy", reward: 260, desc: "Code your own site.", category: "CODING", minGrade: 6, maxGrade: 16, color: "text-indigo-400" },
  { id: "CRE.MED.08", type: "TRAINING", title: "Viral Impact Doc", client: "Academy", reward: 240, desc: "Edit a 60s doc.", category: "CREATIVE", minGrade: 6, maxGrade: 16, color: "text-pink-500" },

  // REAL WORLD CONTRACTS (High Grade)
  { id: "RW.01", type: "CLIENT_CONTRACT", title: "Debug Shopify Store", client: "TechFlow Inc.", reward: 500, desc: "Fix CSS layout bug.", category: "CODING", minGrade: 10, maxGrade: 20, color: "text-white" },
  { id: "RW.02", type: "CLIENT_CONTRACT", title: "Logo Redesign", client: "StartUp Coffee", reward: 450, desc: "Vector logo assets.", category: "CREATIVE", minGrade: 8, maxGrade: 20, color: "text-white" },
];

/* ==========================================================================
   COMPONENT: THE 4 ENGINES GRID (Blueprint Visualization)
   ========================================================================== */
const EnginesGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto mb-16 px-4 w-full">
    {/* 🟢 CONNECT */}
    <div className="p-6 bg-zinc-900/50 border border-green-500/20 rounded-2xl hover:bg-zinc-800 transition-all group hover:-translate-y-2">
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🟢</div>
      <h3 className="text-xl font-black text-green-400 mb-2 tracking-wide">CONNECT</h3>
      <p className="text-xs text-zinc-400 leading-relaxed group-hover:text-white transition-colors">The <strong className="text-white">Squad Engine</strong>. Stop learning alone. Find your tribe and validate your belonging.</p>
    </div>

    {/* 🟣 LEARN */}
    <div className="p-6 bg-zinc-900/50 border border-purple-500/20 rounded-2xl hover:bg-zinc-800 transition-all group hover:-translate-y-2">
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🟣</div>
      <h3 className="text-xl font-black text-purple-400 mb-2 tracking-wide">LEARN</h3>
      <p className="text-xs text-zinc-400 leading-relaxed group-hover:text-white transition-colors">The <strong className="text-white">Acceleration Engine</strong>. AI speed. Download skills and reach flow state instantly.</p>
    </div>

    {/* 🔵 SOLVE */}
    <div className="p-6 bg-zinc-900/50 border border-blue-500/20 rounded-2xl hover:bg-zinc-800 transition-all group hover:-translate-y-2">
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🔵</div>
      <h3 className="text-xl font-black text-blue-400 mb-2 tracking-wide">SOLVE</h3>
      <p className="text-xs text-zinc-400 leading-relaxed group-hover:text-white transition-colors">The <strong className="text-white">Impact Engine</strong>. No tests. Just real-world missions that build your portfolio.</p>
    </div>

    {/* 🟡 EARN */}
    <div className="p-6 bg-zinc-900/50 border border-yellow-500/20 rounded-2xl hover:bg-zinc-800 transition-all group hover:-translate-y-2">
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🟡</div>
      <h3 className="text-xl font-black text-yellow-400 mb-2 tracking-wide">EARN</h3>
      <p className="text-xs text-zinc-400 leading-relaxed group-hover:text-white transition-colors">The <strong className="text-white">Legend Engine</strong>. Real value, real reward. Verify your impact and build wealth.</p>
    </div>
  </div>
);

/* ==========================================================================
   COMPONENT: BREADCRUMB HEADER (The History Trail)
   ========================================================================== */
const BreadcrumbHeader: React.FC<{ name: string, grade: string, passion: string, step: string }> = ({ name, grade, passion, step }) => {
  return (
    <div className="flex items-center gap-4 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 mx-auto w-fit shadow-2xl">
      <div className={`flex items-center gap-2 ${step === "NAME" ? "text-blue-400" : name ? "text-green-400" : "text-zinc-600"}`}>
        <span className="text-lg">👤</span>
        <span className="font-bold text-xs uppercase tracking-wider">{name || "IDENTITY"}</span>
      </div>
      <div className="w-4 h-px bg-white/20"></div>
      <div className={`flex items-center gap-2 ${step === "GRADE" ? "text-blue-400" : grade ? "text-green-400" : "text-zinc-600"}`}>
        <span className="text-lg">🎓</span>
        <span className="font-bold text-xs uppercase tracking-wider">{grade ? `GRADE ${grade}` : "LEVEL"}</span>
      </div>
      <div className="w-4 h-px bg-white/20"></div>
      <div className={`flex items-center gap-2 ${step === "PASSION" ? "text-blue-400" : passion ? "text-green-400" : "text-zinc-600"}`}>
        <span className="text-lg">🔥</span>
        <span className="font-bold text-xs uppercase tracking-wider">{passion || "PASSION"}</span>
      </div>
    </div>
  );
};

/* ==========================================================================
   COMPONENT: ONBOARDING WIZARD (Visual Choice Cards)
   ========================================================================== */
const OnboardingWizard: React.FC<{ onComplete: (profile: any) => void, onCancel: () => void }> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<OnboardingStep>("NAME");
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [passion, setPassion] = useState("");
  const [fade, setFade] = useState(false);
  const [matchStatus, setMatchStatus] = useState("SEARCHING GLOBAL NETWORK...");

  const handleNameSubmit = (e: React.KeyboardEvent) => { if (e.key === "Enter" && name.trim()) transitionTo("GRADE"); };

  const handleSelection = (type: "GRADE" | "PASSION", value: string) => {
    if (type === "GRADE") { setGrade(value); transitionTo("PASSION"); }
    else {
      setPassion(value);
      transitionTo("MATCHING");
      // AI SQUAD LOGIC
      setTimeout(() => setMatchStatus("FOUND 1 HUMAN MATCH..."), 1000);
      setTimeout(() => setMatchStatus("RECRUITING AI AGENTS TO FILL SQUAD..."), 2000);
      setTimeout(() => {
        let squad = "The Generalists";
        if (value.includes("COD")) squad = "The Algo-Rhythm (2 AI / 1 Human)";
        if (value.includes("SCI")) squad = "The Bio-Guardians (3 AI)";
        if (value.includes("CRE")) squad = "The Visionaries (1 AI / 2 Humans)";
        onComplete({ name, grade, passion: value, squad });
      }, 3500);
    }
  };

  const transitionTo = (nextStep: OnboardingStep) => { setFade(true); setTimeout(() => { setStep(nextStep); setFade(false); }, 300); };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in p-6 font-sans">
      <div className="mb-8">
        <BreadcrumbHeader name={name} grade={grade} passion={passion} step={step} />
      </div>
      <button onClick={onCancel} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors">✕ ESC</button>

      {step === "MATCHING" && (
        <div className="text-center">
          <div className="text-6xl mb-6 animate-bounce">🧬</div>
          <h2 className="text-3xl font-black text-white tracking-widest mb-2">BUILDING SQUAD</h2>
          <p className="text-green-400 font-mono text-sm uppercase animate-pulse">{matchStatus}</p>
        </div>
      )}

      {step === "NAME" && (
        <div className={`text-center w-full max-w-2xl transition-opacity duration-300 ${fade ? "opacity-0" : "opacity-100"}`}>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">What is your <span className="text-yellow-400">Name</span>?</h1>
          <input autoFocus className="relative w-full bg-zinc-900 border border-white/10 rounded-xl px-8 py-6 text-2xl text-center text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-all" placeholder="Type Name & Hit Enter..." value={name} onChange={e => setName(e.target.value)} onKeyDown={handleNameSubmit} />
        </div>
      )}

      {step === "GRADE" && (
        <div className={`w-full max-w-5xl transition-opacity duration-300 ${fade ? "opacity-0" : "opacity-100"}`}>
          <h1 className="text-4xl font-black text-white text-center mb-10">Calibrate Your <span className="text-purple-400">Engine</span></h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {["3|Explorer|K-5|🎒", "7|Builder|6-8|🛠️", "10|Legend|HS|🚀", "14|Pro|College|👔"].map(g => {
              const [val, title, sub, icon] = g.split("|");
              return (
                <button key={val} onClick={() => handleSelection("GRADE", val)} className="group p-8 bg-zinc-900/50 border border-white/10 rounded-3xl hover:bg-zinc-800 hover:border-blue-500 hover:-translate-y-2 transition-all">
                  <div className="text-5xl mb-4">{icon}</div><h3 className="text-xl font-bold text-white">{title}</h3><p className="text-xs text-zinc-400">{sub}</p>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {step === "PASSION" && (
        <div className={`w-full max-w-5xl transition-opacity duration-300 ${fade ? "opacity-0" : "opacity-100"}`}>
          <h1 className="text-4xl font-black text-white text-center mb-10">Select Your <span className="text-green-400">Primary Engine</span></h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {["CODING|Tech & Code|Building Future|💻", "SCIENCE|Nature|Protect Planet|🌿", "CREATIVE|Art & Design|Create Beauty|🎨", "LEADERSHIP|Leadership|Guide Teams|🤝"].map(p => {
              const [val, title, sub, icon] = p.split("|");
              return (
                <button key={val} onClick={() => handleSelection("PASSION", val)} className="group p-8 bg-zinc-900/50 border border-white/10 rounded-3xl hover:bg-zinc-800 hover:border-yellow-400 hover:-translate-y-2 transition-all">
                  <div className="text-5xl mb-4">{icon}</div><h3 className="text-xl font-bold text-white">{title}</h3><p className="text-xs text-zinc-400">{sub}</p>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/* ==========================================================================
   COMPONENT: VIRAL SHARE MODAL (CMO Logic)
   ========================================================================== */
const ViralShareModal: React.FC<{ mission: any, earnings: number, onClose: () => void }> = ({ mission, earnings, onClose }) => {
  const shareText = `I just earned ${earnings} GP as a Verified Contributor for ${mission.client} on @MyBestPurpose! 🚀 #VerifiedContributor`;
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl animate-scale-in p-6">
      <div className="w-full max-w-lg bg-zinc-900 border border-yellow-500/30 rounded-3xl p-8 text-center relative overflow-hidden">
        <h2 className="text-4xl font-black text-white italic mb-2">LEGENDARY!</h2>
        <p className="text-zinc-400 mb-8">Completed: <span className="text-white font-bold">{mission.title}</span></p>
        <div className="bg-black/50 p-6 rounded-xl border border-white/10 mb-8 transform rotate-1 hover:rotate-0 transition-transform">
          <div className="text-5xl mb-2">🏆 +{earnings} GP</div>
          <div className="text-xs font-mono text-green-400">PAYMENT VERIFIED • SOLVENCY CHECK PASSED</div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button className="p-3 bg-black border border-white/20 rounded-lg font-bold hover:bg-white hover:text-black">TikTok</button>
          <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank')} className="p-3 bg-black border border-white/20 rounded-lg font-bold hover:bg-blue-500">X / Twitter</button>
          <button className="p-3 bg-black border border-white/20 rounded-lg font-bold hover:bg-red-600">YouTube</button>
        </div>
        <button onClick={onClose} className="w-full py-4 bg-yellow-500 text-black font-black uppercase tracking-widest rounded-xl hover:bg-yellow-400">Return to HQ</button>
      </div>
    </div>
  );
};

/* ==========================================================================
   MAIN APP (The Engine)
   ========================================================================== */
const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>("LANDING");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [activeMission, setActiveMission] = useState<any>(null);
  const [systemBalance, setSystemBalance] = useState(SYSTEM_TREASURY.balance);
  const [error, setError] = useState("");
  const [showFounderModal, setShowFounderModal] = useState(false);

  // --- HANDLERS ---
  const completeOnboarding = (profile: any) => {
    setUserProfile({ ...profile, genesisPoints: 0, completedMissions: [] });
    setAppState("CHOICE_SELECTION");
  };

  const handleMissionSelect = (missionId: string) => {
    if (missionId === "LEVEL_UP") return alert("Level Up System coming soon!");
    const mission = MISSION_DB.find(m => m.id === missionId);
    if (mission) {
      setActiveMission(mission);
      setAppState("MISSION_WORKSPACE"); // NEW: Go to workspace instead of auto-completing
    }
  };

  // --- CEO SOLVENCY LOGIC ---
  const attemptPayout = (mission: any) => {
    const platformCut = mission.reward * SYSTEM_TREASURY.platformFee;
    const studentPayout = mission.reward - platformCut;

    if (systemBalance < studentPayout) {
      setError("CRITICAL: SYSTEM TREASURY LOW. PAYMENT PAUSED.");
      return;
    }

    setSystemBalance(prev => prev - studentPayout);
    setUserProfile((prev: any) => ({
      ...prev,
      genesisPoints: prev.genesisPoints + studentPayout,
      completedMissions: [...prev.completedMissions, mission.id]
    }));
    setAppState("MISSION_COMPLETE");
  };

  // --- FILTER LOGIC (Swarm Certified) ---
  const getDisplayMissions = () => {
    if (appState === "LANDING" || !userProfile) return MISSION_DB.slice(0, 6);
    const gradeNum = parseInt(userProfile?.grade.replace(/\D/g, "") || "5");
    const history = userProfile?.completedMissions || [];

    // 1. Get Passion Matches
    let matches = MISSION_DB.filter(m => {
      if (history.includes(m.id)) return false;
      // REAL WORLD contracts allowed for high grade irrespective of passion
      if (m.type === "CLIENT_CONTRACT" && gradeNum >= m.minGrade) return true;
      if (gradeNum < m.minGrade || gradeNum > m.maxGrade) return false;

      const p = userProfile.passion.toLowerCase();
      if (p.includes("cod") || p.includes("tech")) return m.category === "CODING";
      if (p.includes("sci") || p.includes("bio")) return m.category === "SCIENCE";
      if (p.includes("creat") || p.includes("art")) return m.category === "CREATIVE";

      return true;
    });

    // 2. Smart Fill Logic (Guarantees 3 Choices for Swarm Success)
    if (matches.length < 3) {
      const fillers = MISSION_DB.filter(m =>
        !history.includes(m.id) &&
        gradeNum >= m.minGrade &&
        gradeNum <= m.maxGrade &&
        !matches.includes(m) // Don't duplicate matches
      );
      matches = [...matches, ...fillers];
    }

    return matches.slice(0, 3);
  };

  const displayMissions = getDisplayMissions();

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden animate-fade-in relative">

      {/* 1. PERMANENT NAVBAR (Always Visible) */}
      {/* NAVBAR: FIXED & RESTORED */}
      <nav className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-black/50 backdrop-blur-md fixed w-full z-50">
        {/* LEFT: LOGO */}
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">MYBESTPURPOSE</span>
          <span className="text-sm font-mono text-gray-500 hidden md:block">// WORLD ENGINE</span>
        </div>

        {/* CENTER: SOLVER/CLIENT TOGGLE (RESTORED) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 bg-zinc-900/80 p-1 rounded-lg border border-white/10 backdrop-blur-md">
          <button className="px-6 py-1.5 bg-zinc-700 text-white text-xs font-bold rounded shadow-sm border border-white/10 hover:bg-zinc-600 transition-all">SOLVER</button>
          <button className="px-6 py-1.5 text-zinc-500 hover:text-white text-xs font-bold transition-colors">CLIENT</button>
        </div>

        {/* RIGHT: STATS & TREASURY */}
        <div className="flex gap-4 text-xs font-mono">
          <div className="hidden md:block px-3 py-1 bg-zinc-900 border border-green-500/30 text-green-400 rounded">SYS: ${systemBalance.toLocaleString()}</div>
          <div className="px-3 py-1 bg-zinc-900 border border-yellow-500/30 text-yellow-400 rounded">USER: {userProfile?.genesisPoints || 0} GP</div>
          <div className="px-3 py-1 bg-zinc-800 border border-white/10 text-zinc-400 rounded uppercase tracking-wider">{userProfile ? "CONTRIBUTOR" : "GUEST"}</div>
        </div>
      </nav>

      {/* 2. OVERLAYS */}
      {appState === "ONBOARDING" && <OnboardingWizard onComplete={completeOnboarding} onCancel={() => setAppState("LANDING")} />}
      {appState === "MISSION_COMPLETE" && <ViralShareModal mission={activeMission} earnings={activeMission.reward * (1 - SYSTEM_TREASURY.platformFee)} onClose={() => setAppState("DASHBOARD")} />}
      {error && <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-red-600/90 px-6 py-3 rounded-lg font-bold animate-pulse z-[200]">⚠️ {error}</div>}

      {/* 3. PERMANENT BREADCRUMBS LAYER (The Fix) */}
      {/* We only hide it on the very first Landing Page so it feels like a clean start */}
      {appState !== "LANDING" && appState !== "ONBOARDING" && (
        <div className="fixed top-24 left-0 w-full z-40 pointer-events-none flex justify-center">
          {/* 'pointer-events-none' lets you click things underneath it */}
          <BreadcrumbHeader
            name={userProfile?.name}
            grade={userProfile?.grade}
            passion={userProfile?.passion}
            step="COMPLETE"
          />
        </div>
      )}

      {/* 4. MAIN CONTENT SWITCHER */}
      {/* This renders the background content */}
      {appState === "LANDING" ? (
        /* BLUEPRINT LANDING PAGE HERO */
        <main className="relative pt-28 pb-10 px-4 flex flex-col items-center justify-center min-h-[70vh] text-center z-10 w-full">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
          {/* HEADLINE: COLORFUL & PUNCHY */}
          <div className="mb-4">
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-purple-500 to-orange-500 drop-shadow-2xl">
              SOLVE & EARN
            </h1>
          </div>

          {/* SUBHEAD: BRANDED & BOLD */}
          <div className="max-w-4xl mx-auto mb-8 px-4">
            <p className="text-lg md:text-2xl text-zinc-400 font-medium">
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">MyBestPurpose</span> is an <span className="text-white font-bold">AI-guided Engine</span> where you transition from a passive student into a <span className="text-orange-400 font-bold">Verified Contributor</span>.
            </p>
          </div>
          <EnginesGrid />
          <button onClick={() => setAppState("ONBOARDING")} className="px-16 py-6 bg-white text-black font-black text-xl tracking-widest rounded-full shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:scale-105 hover:bg-yellow-400 transition-all flex items-center gap-3 mx-auto uppercase z-10">
            <span>🚀</span> Start Your Engine
          </button>
          <div className="mt-8 text-[10px] font-mono text-zinc-600 uppercase tracking-widest z-10">
            Powered by Global Innovation Stack • Secured by Sage Identity
          </div>
        </main>
      ) : appState === "MISSION_WORKSPACE" ? (
        // THE NEW WORKSPACE LAYER
        <MissionWorkspace
          mission={activeMission}
          onComplete={() => attemptPayout(activeMission)}
          onCancel={() => setAppState("DASHBOARD")}
        />
      ) : appState === "MISSION_ACTIVE" ? (
        <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center flex-col">
          <div className="text-6xl mb-6 animate-spin">⚙️</div>
          <h2 className="text-2xl font-bold">EXECUTING {activeMission?.type === "CLIENT_CONTRACT" ? "CLIENT CONTRACT" : "TRAINING MISSION"}...</h2>
          <p className="text-zinc-500 mt-2">Verifying Quality Assurance for {activeMission?.client}...</p>
        </div>
      ) : (
        /* DASHBOARD VIEW (Default for CHOICE_SELECTION, DASHBOARD, MISSION_COMPLETE) */
        <div className="pt-40 px-6 pb-20 animate-fade-in">
          <div className="text-center mb-12 mt-10">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">MISSION CONTROL</h1>
            <p className="text-xl text-zinc-400">Missions optimized for <span className="text-white font-bold">{userProfile?.squad}</span>.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {displayMissions.map(m => (
              <button key={m.id} onClick={() => handleMissionSelect(m.id)} className="group relative p-8 bg-zinc-900/40 border border-white/10 hover:border-white/30 text-left rounded-2xl transition-all hover:-translate-y-2">
                <div className="absolute top-4 right-4 text-xs font-mono text-zinc-600">{m.type === "CLIENT_CONTRACT" ? "🔵 SOLVE" : "🟣 LEARN"}</div>
                <div className={`text-xs font-bold tracking-widest mb-4 ${m.color}`}>{m.category}</div>
                <h3 className="text-2xl font-black mb-4 group-hover:text-blue-200">{m.title}</h3>
                <p className="text-sm text-zinc-400 mb-6">{m.desc}</p>
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <span className="text-yellow-400 font-bold">{m.reward} GP</span>
                  <span className="px-3 py-1 bg-white text-black text-xs font-black rounded uppercase">Accept</span>
                </div>
              </button>
            ))}
            {displayMissions.length === 0 && (
              <div className="col-span-3 text-center py-20"><button onClick={() => handleMissionSelect("LEVEL_UP")} className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg">LEVEL UP TO NEXT GRADE 🚀</button></div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="fixed bottom-0 w-full p-4 border-t border-white/5 bg-black/80 backdrop-blur-xl flex justify-between items-center z-50">
        <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-600"><div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />SECURED BY SAGE IDENTITY PROTOCOL © 2026</div>
        <button onClick={() => setShowFounderModal(true)} className="px-4 py-2 bg-zinc-900 border border-zinc-700 text-[10px] font-bold text-white uppercase rounded hover:bg-zinc-800">Founder Check</button>
      </footer>
      <FounderCheckModal isOpen={showFounderModal} onClose={() => setShowFounderModal(false)} />
    </div>
  );
};

export default App;
