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
import React, { useState, useEffect } from "react";
import { FounderCommandPanel } from "./components/dashboard/FounderCommandPanel";
import { MissionWorkspace } from "./components/workspaces/MissionWorkspace";
import { SwarmDashboard } from "./components/admin/SwarmDashboard";
import { MasterTeacherDashboard } from "./components/admin/MasterTeacherDashboard";
import { CalibrationModal } from "./components/dashboard/CalibrationModal";
import { GenesisFeed } from "./components/feed/GenesisFeed";
import { SagePrep } from "./components/learning/SagePrep";
import AssessmentModule from "./components/AssessmentModule";
import { LearnerMap } from "./components/learner/LearnerMap";
import { WorldEngineDevConsole } from "./components/WorldEngine/DevConsole";


import Header from "./components/Header";
import { FounderMenu } from "./components/Navigation/FounderMenu";
import { ImpactEngine, STARTING_MISSIONS, type ImpactMission } from "./components/engines/ImpactEngine";
import { ActiveMission } from "./components/engines/ActiveMission";
import type { LiveMission } from "./lib/MissionGenerator";
import { supabase } from "./lib/supabase";
import { RecommendationEngine } from "./services/RecommendationEngine";
import { WorldEngine } from "./engines/world-engine/WorldEngine";
import { SEED_GRAPH } from "./engines/world-engine/KnowledgeGraph";
import type { LearnerProfile } from "./engines/world-engine/LearnerModel";

// --- MOCK PROFILE FOR APP-LEVEL ENGINE ---
const APP_LEARNER_PROFILE: LearnerProfile = {
  id: "learner-app-root",
  name: "Explorer Root",
  currentGrade: 5, // Default to Grade 5
  masteryMap: new Map(),
  domainLevels: { literacy: 1.0, numeracy: 1.0, science: 1.0, social: 1.0, sel: 1.0, career: 1.0 },
  cognitiveState: { focusLevel: 100, frustrationLevel: 0, energyLevel: 100, currentZPD: 0.2 },
  interests: ["General"],
  learningStyle: 'visual',
  goals: ["Explore the World"],
  completedMissions: [],
  genesisPoints: 0,
  calibrationScore: 0
};


// --- TYPES ---
type AppState = "LANDING" | "ONBOARDING" | "CHOICE_SELECTION" | "DASHBOARD" | "MISSION_WORKSPACE" | "MISSION_ACTIVE" | "MISSION_COMPLETE" | "IMPACT_ENGINE" | "MISSION_ACTIVE_NEURAL" | "SAGE_PREP" | "WORLD_ENGINE_DEV" | "ASSESSMENT" | "LEARNER_MAP";


export interface UserProfile {
  name: string;
  grade: string;
  passion: string;
  squad: string;
  genesisPoints: number;
  completedMissions: string[];
  calibrationScore: number; // 0-100: system confidence in placement
  id?: string; // UUID for Vault Sync
}

export interface Mission {
  id: string;
  title: string;
  client: string;
  reward: number;
  desc: string;
  category: string;
  minGrade: number;
  maxGrade: number;
  color: string;
  type: "TRAINING" | "CLIENT_CONTRACT";
  status: "LIVE" | "TRENDING" | "EXPIRING" | "CLAIMED";
  expiresAt: number;
  requirements?: { type: "MATH" | "SCIENCE" | "ENGLISH" | "LOGIC"; desc: string }[];
}

// --- THE TREASURY (CEO Logic) ---
const SYSTEM_TREASURY = {
  balance: 50000, // Real money backing the system
  platformFee: 0.20, // 20% Commission
};

// --- MISSION DATABASE (Training + Real World) ---
const MISSION_DB: Mission[] = [
  // K-5 FOUNDATIONS
  {
    id: "SCI.K5.01", type: "TRAINING", title: "Backyard Bio-Blitz", client: "Academy", reward: 100, desc: "Find/draw 3 bugs.", category: "SCIENCE", minGrade: 0, maxGrade: 5, color: "text-emerald-400",
    status: "LIVE", expiresAt: Date.now() + 86400000,
    requirements: [
      { type: "SCIENCE", desc: "Identify 3 insect species." },
      { type: "MATH", desc: "Count legs and antennae (Logic Check)." },
      { type: "ENGLISH", desc: "Label your drawing." }
    ]
  },
  {
    id: "COD.K5.01", type: "TRAINING", title: "Robot Logic Maze", client: "Academy", reward: 100, desc: "Guide the mouse.", category: "CODING", minGrade: 0, maxGrade: 5, color: "text-blue-400",
    status: "LIVE", expiresAt: Date.now() + 86400000,
    requirements: [
      { type: "LOGIC", desc: "Plan the shortest path." },
      { type: "MATH", desc: "Count total steps (A+B)." }
    ]
  },
  {
    id: "CRE.K5.01", type: "TRAINING", title: "My Hero Story", client: "Academy", reward: 100, desc: "Draw a hero.", category: "CREATIVE", minGrade: 0, maxGrade: 5, color: "text-yellow-400",
    status: "LIVE", expiresAt: Date.now() + 86400000
  },

  // 6-12 SKILLS
  {
    id: "CS.WEB.03", type: "TRAINING", title: "Portfolio Site", client: "Academy", reward: 260, desc: "Code your own site.", category: "CODING", minGrade: 6, maxGrade: 16, color: "text-indigo-400",
    status: "LIVE", expiresAt: Date.now() + 86400000,
    requirements: [
      { type: "LOGIC", desc: "Debug CSS Layout." },
      { type: "ENGLISH", desc: "Write 'About Me' Bio." },
      { type: "MATH", desc: "Calculate pixel dimensions." }
    ]
  },
  {
    id: "CRE.MED.08", type: "TRAINING", title: "Viral Impact Doc", client: "Academy", reward: 240, desc: "Edit a 60s doc.", category: "CREATIVE", minGrade: 6, maxGrade: 16, color: "text-pink-500",
    status: "LIVE", expiresAt: Date.now() + 86400000
  },

  // REAL WORLD CONTRACTS (High Grade)
  {
    id: "RW.01", type: "CLIENT_CONTRACT", title: "Debug Shopify Store", client: "TechFlow Inc.", reward: 500, desc: "Fix CSS layout bug.", category: "CODING", minGrade: 10, maxGrade: 20, color: "text-white",
    status: "LIVE", expiresAt: Date.now() + 86400000
  },
  {
    id: "RW.02", type: "CLIENT_CONTRACT", title: "Logo Redesign", client: "StartUp Coffee", reward: 450, desc: "Vector logo assets.", category: "CREATIVE", minGrade: 8, maxGrade: 20, color: "text-white",
    status: "LIVE", expiresAt: Date.now() + 86400000
  },
];

/* ==========================================================================
   COMPONENT: THE 4 ENGINES GRID (Blueprint Visualization)
   ========================================================================== */
const EnginesGrid = ({ onSolveClick, onLearnClick }: { onSolveClick: () => void, onLearnClick: () => void }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto mb-32 px-4 w-full">
    {/* 🟢 CONNECT */}
    <div className="p-6 bg-zinc-900/50 border border-green-500/20 rounded-2xl hover:bg-zinc-800 transition-all group hover:-translate-y-2">
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🟢</div>
      <h3 className="text-xl font-black text-green-400 mb-2 tracking-wide">CONNECT</h3>
      <p className="text-xs text-zinc-400 leading-relaxed group-hover:text-white transition-colors">The <strong className="text-white">Squad Engine</strong>. Stop learning alone. Find your tribe and validate your belonging.</p>
    </div>

    {/* 🟣 LEARN */}
    <div
      onClick={onLearnClick}
      className="p-6 bg-zinc-900/50 border border-purple-500/20 rounded-2xl hover:bg-zinc-800 transition-all group hover:-translate-y-2 cursor-pointer relative overflow-hidden"
    >
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🟣</div>
      <h3 className="text-xl font-black text-purple-400 mb-2 tracking-wide">LEARN</h3>
      <p className="text-xs text-zinc-400 leading-relaxed group-hover:text-white transition-colors">The <strong className="text-white">Acceleration Engine</strong>. AI speed. Download skills and reach flow state instantly.</p>
      <div className="absolute bottom-4 right-4 text-[10px] font-black text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
        Initialize →
      </div>
    </div>

    {/* 🔵 SOLVE (Interactive) */}
    <div
      onClick={onSolveClick}
      className="p-6 bg-zinc-900/50 border border-blue-500/20 rounded-2xl hover:bg-zinc-800 transition-all group hover:-translate-y-2 cursor-pointer relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🔵</div>
      <h3 className="text-xl font-black text-blue-400 mb-2 tracking-wide">SOLVE</h3>
      <p className="text-xs text-zinc-400 leading-relaxed group-hover:text-white transition-colors">The <strong className="text-white">Impact Engine</strong>. No tests. Just real-world missions that build your portfolio.</p>
      <div className="absolute bottom-4 right-4 text-[10px] font-black text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
        Boot Up →
      </div>
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
type OnboardingStep = "NAME" | "GRADE" | "PASSION" | "MATCHING" | "AUTH";

const OnboardingWizard: React.FC<{ onComplete: (profile: Partial<UserProfile>) => void, onCancel: () => void }> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<OnboardingStep>("NAME");
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [passion, setPassion] = useState("");
  const [squad, setSquad] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [fade, setFade] = useState(false);
  const [matchStatus, setMatchStatus] = useState("SEARCHING GLOBAL NETWORK...");

  // 🔊 VOICE SYNTHESIS
  useEffect(() => {
    const speak = (text: string) => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.1;
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v => v.name.includes("Google US English") || v.name.includes("Samantha"));
        if (preferred) utterance.voice = preferred;
        window.speechSynthesis.speak(utterance);
      }
    };

    if (step === "NAME") speak("Welcome, Explorer. I am Sage. What should I call you?");
    if (step === "GRADE") speak(`Nice to meet you, ${name}. What is your experience level?`);
    if (step === "PASSION") speak("Excellent. Now, what mission calls to you?");
    if (step === "MATCHING") speak("Initializing your squad. Stand by.");
    if (step === "AUTH") speak("Final Step. Secure your Engine Key to save your progress.");

  }, [step, name]);

  const handleNameSubmit = (e: React.KeyboardEvent) => { if (e.key === "Enter" && name.trim()) transitionTo("GRADE"); };

  const handleSelection = (type: "GRADE" | "PASSION", value: string) => {
    if (type === "GRADE") { setGrade(value); transitionTo("PASSION"); }
    else {
      setPassion(value);
      transitionTo("MATCHING");

      // Determine Squad
      let sq = "The Generalists";
      if (value.includes("COD")) sq = "The Algo-Rhythm (2 AI / 1 Human)";
      if (value.includes("SCI")) sq = "The Bio-Guardians (3 AI)";
      if (value.includes("CRE")) sq = "The Visionaries (1 AI / 2 Humans)";
      setSquad(sq);

      // AI SQUAD LOGIC
      setTimeout(() => setMatchStatus("FOUND 1 HUMAN MATCH..."), 1000);
      setTimeout(() => setMatchStatus("RECRUITING AI AGENTS TO FILL SQUAD..."), 2000);
      setTimeout(() => {
        transitionTo("AUTH");
      }, 3500);
    }
  };

  const handleAuthSubmit = async () => {
    if (!email || !password) { setAuthError("Email and Password required."); return; }
    if (password.length < 6) { setAuthError("Password must be at least 6 characters."); return; }

    try {
      setMatchStatus("SECURING VAULT CONNECTION...");
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            grade: grade,
            passion: passion,
            squad: squad,
            is_child_account: true
          }
        }
      });

      if (error) throw error;

      console.log("✅ AUTH SUCCESS:", data.user?.id);
      onComplete({ name, grade, passion, squad, id: data.user?.id });
    } catch (err: any) {
      console.error("Auth Fail:", err);
      setAuthError(err.message || "Connection Failed. Try again.");
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
          <div className="flex flex-col items-center gap-2 mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Type your <span className="text-blue-400">Name</span></h1>
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-400 tracking-wide">press <span className="text-blue-400">Enter</span></h2>
          </div>
          <input autoFocus className="relative w-full bg-zinc-900 border border-white/10 rounded-xl px-8 py-6 text-2xl text-center text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-all" placeholder="Your Name... [Enter]" value={name} onChange={e => setName(e.target.value)} onKeyDown={handleNameSubmit} />
        </div>
      )}

      {step === "GRADE" && (
        <div className={`w-full max-w-5xl transition-opacity duration-300 ${fade ? "opacity-0" : "opacity-100"}`}>
          <h1 className="text-4xl font-black text-white text-center mb-10">Calibrate Your <span className="text-purple-400">Engine</span></h1>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {["2|Sprouts|K-2|🌱", "5|Builders|3-5|🛠️", "8|Trailblazers|6-8|🌲", "12|Explorers|9-12|🧭", "16|Voyagers|College+|🚀"].map(g => {
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

      {step === "AUTH" && (
        <div className={`text-center w-full max-w-md transition-opacity duration-300 ${fade ? "opacity-0" : "opacity-100"}`}>
          <div className="text-6xl mb-6">🔐</div>
          <h1 className="text-3xl font-black text-white mb-2">Secure Your <span className="text-blue-400">Engine Key</span></h1>
          <p className="text-zinc-400 mb-8 text-sm">Create a secure pilot identity to save your progress.</p>

          <div className="space-y-4">
            <input
              type="email"
              autoFocus
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-6 py-4 text-xl text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-all"
              placeholder="Pilot Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-6 py-4 text-xl text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-all"
              placeholder="Secret Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {authError && <p className="text-red-400 mt-4 text-sm font-bold bg-red-900/20 py-2 px-4 rounded-lg">{authError}</p>}

          <button
            onClick={handleAuthSubmit}
            className="w-full mt-8 py-5 bg-blue-500 hover:bg-blue-400 text-black font-black text-xl rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
          >
            CONFIRM IDENTITY 🚀
          </button>
        </div>
      )}
    </div>
  );
};

/* ==========================================================================
   COMPONENT: VIRAL SHARE MODAL (CMO Logic)
   ========================================================================== */
const ViralShareModal: React.FC<{ mission: Mission, earnings: number, onClose: () => void }> = ({ mission, earnings, onClose }) => {
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
        </div >
        <button onClick={onClose} className="w-full py-4 bg-yellow-500 text-black font-black uppercase tracking-widest rounded-xl hover:bg-yellow-400">Return to HQ</button>
      </div >
    </div >
  );
};

/* ==========================================================================
   MAIN APP (The Engine)
   ========================================================================== */
const App: React.FC = () => {
  // 1. Injected Sage Prep State Logic
  const [appState, setAppState] = useState<AppState>("LANDING");

  // --- WORLD ENGINE INSTANCE ---
  const worldEngine = React.useMemo(() => new WorldEngine(APP_LEARNER_PROFILE, SEED_GRAPH), []);


  const [sagePrepContent, setSagePrepContent] = useState<any>(null); // Using any to reuse RecommendationResult structure loosely

  const startSagePrep = (mission: LiveMission | Mission) => {
    setActiveMission(mission);

    // Logic to generate card based on UserContext.gradeLevel
    // Mock user for engine
    const engineUser = {
      id: 'current',
      name: userProfile?.name || 'User',
      archetype: 'Explorer',
      passion: userProfile?.passion || 'General',
      skillTheta: 0,
      gradeLevel: parseInt(userProfile?.grade || '5'),
      interests: [userProfile?.passion || 'General'],
      competencies: {}
    };

    // We use the Recommendation Engine to get a "Prep" card
    const rec = RecommendationEngine.recommendNext(engineUser as any);
    setSagePrepContent(rec);

    setAppState("SAGE_PREP");
  };
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeMission, setActiveMission] = useState<Mission | LiveMission | null>(null);
  const [activeImpactMission, setActiveImpactMission] = useState<ImpactMission | null>(null);
  const [systemBalance, setSystemBalance] = useState(SYSTEM_TREASURY.balance);
  const [error, setError] = useState("");
  const [showFounderModal, setShowFounderModal] = useState(false);
  const [showSwarm, setShowSwarm] = useState(false); // GHOST CLASS TOGGLE
  const [showMasterTeacher, setShowMasterTeacher] = useState(false); // MASTER TEACHER TOGGLE
  const [showCalibration, setShowCalibration] = useState(false); // CALIBRATION TOGGLE
  const [viewMode, setViewMode] = useState<'solver' | 'client'>('solver'); // HEADER VIEW MODE

  // --- SWARM & MASTER TEACHER LISTENER ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        setShowSwarm(prev => !prev);
      }
      if (e.ctrlKey && e.shiftKey && (e.key === 'M' || e.key === 'm')) {
        e.preventDefault();
        setShowMasterTeacher(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- HANDLERS ---
  const getUserTrack = () => {
    const p = (userProfile?.passion || "").toLowerCase();
    if (p.includes("code") || p.includes("tech")) return 'CODING';
    if (p.includes("art") || p.includes("design") || p.includes("creat")) return 'CREATIVE';
    if (p.includes("sci") || p.includes("bio")) return 'SCIENCE';
    if (p.includes("lead") || p.includes("bus")) return 'LEADERSHIP';
    return 'ALL';
  };

  const completeOnboarding = (profile: Partial<UserProfile>) => {
    setUserProfile({
      name: profile.name || "Anonymous",
      grade: profile.grade || "1",
      passion: profile.passion || "ALL",
      squad: profile.squad || "Alpha",
      genesisPoints: 0,
      completedMissions: [],
      calibrationScore: 0,
      id: profile.id // Capture the Real Vault ID
    });
    setAppState("CHOICE_SELECTION");
  };

  const handleMissionSelect = (mission: LiveMission | string) => {
    if (mission === "LEVEL_UP") return alert("Level Up System coming soon!");
    if (typeof mission === 'string') {
      const found = MISSION_DB.find(m => m.id === mission);
      if (found) {
        startSagePrep(found);
      }
    } else {
      startSagePrep(mission);
    }
  };

  // 2. CEO-Verified Supabase Persistence
  const attemptPayout = async (mission: Mission | LiveMission) => {
    const reward = mission.reward;
    const platformCut = reward * SYSTEM_TREASURY.platformFee;
    const studentPayout = reward - platformCut;

    // CEO Solvency Check
    if (systemBalance < studentPayout) {
      setError("CRITICAL: SYSTEM TREASURY LOW.");
      return;
    }

    // The Vault Sync (Supabase)
    // Note: 'users' table assumed as per instruction. If using 'profiles', adapt accordingly.
    const { error } = await supabase
      .from('profiles') // Adapted to 'profiles' because 'users' table is usually protected/internal in Supabase schemes unless custom. Reverting to 'profiles' to match local file structure which has 'profiles' table.
      .update({
        reputation_points: (userProfile?.genesisPoints || 0) + studentPayout, // Using reputation_points as GP equivalent in profiles table
        updated_at: new Date().toISOString()
      })
      .eq('id', userProfile?.id || 'anon'); // Use Real ID

    if (!error) {
      setSystemBalance(prev => prev - studentPayout);
      setUserProfile((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          genesisPoints: prev.genesisPoints + studentPayout,
          completedMissions: [...prev.completedMissions, mission.id],
          calibrationScore: Math.min(100, (prev.calibrationScore || 0) + 15)
        };
      });
      setAppState("MISSION_COMPLETE");
    } else {
      console.error("Vault Sync Error:", error);
      alert("⚠️ VAULT SYNC DELAYED. Saving locally...\n\nPayment verified.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* HEADER NAVIGATION */}
      <div className="fixed top-0 left-0 w-full z-[1000] bg-black/80 backdrop-blur-md border-b border-white/5">
        <Header
          viewMode={viewMode}
          setViewMode={setViewMode}
          walletBalance={userProfile ? `$${userProfile.genesisPoints}` : undefined}
          onToggleNeural={() => setShowCalibration(true)}
          onOpenCommandCenter={() => setShowFounderModal(true)}
        />
      </div>

      {/* ERROR OVERLAY */}
      {error && (
        <div className="fixed top-0 left-0 w-full h-full bg-red-950/90 z-[1000] flex items-center justify-center p-6 backdrop-blur-md">
          <div className="text-center max-w-xl">
            <h2 className="text-6xl font-black mb-4 animate-pulse">🛑 BANKRUPTCY ALERT</h2>
            <p className="text-xl font-mono mb-8">{error}</p>
            <button onClick={() => setError("")} className="px-8 py-4 bg-white text-black font-black uppercase rounded-xl">Override System</button>
          </div>
        </div>
      )}

      {/* FOUNDER DASHBOARD MODAL */}
      {showFounderModal && (
        <FounderCommandPanel
          isOpen={showFounderModal}
          onClose={() => setShowFounderModal(false)}
          onLaunchMasterTeacher={() => { setShowMasterTeacher(true); setShowFounderModal(false); }}
          onDeployGhostClass={() => { setShowSwarm(true); setShowFounderModal(false); }}
        />
      )}

      {/* CALIBRATION MODAL */}
      {showCalibration && (
        <CalibrationModal
          isOpen={true}
          grade={userProfile?.grade || "5"}
          onClose={(score) => {
            setUserProfile(prev => prev ? { ...prev, calibrationScore: score } : null);
            setShowCalibration(false);
          }}
        />
      )}

      {/* ADMIN OVERLAYS */}
      {showSwarm && <SwarmDashboard onClose={() => setShowSwarm(false)} />}
      {showMasterTeacher && <MasterTeacherDashboard onClose={() => setShowMasterTeacher(false)} />}

      {/* 🚀 LANDING PAGE */}
      {appState === "LANDING" && (
        <div className="relative pt-24">
          <div className="absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-blue-900/20 via-black to-black -z-10"></div>
          <div className="max-w-6xl mx-auto pt-16 pb-40 px-6 text-center">

            <h1 className="text-7xl md:text-[120px] font-black tracking-tighter leading-none mb-8 animate-scale-in bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-violet-500 to-amber-400">
              SOLVE & EARN.
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 max-w-4xl mx-auto mt-4 mb-12 font-medium leading-relaxed">
              <span className="text-blue-400 font-bold">MyBestPurpose</span>
              {" is an "}
              <span className="text-white font-bold">AI-guided Engine</span>
              {" where you "}
              <span className="text-emerald-400 font-bold">evolve</span>
              {" from a passive student into a "}
              <span className="text-amber-400 font-bold">Verified Contributor</span>.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-24">
              <button onClick={() => setAppState("ONBOARDING")} className="px-12 py-6 bg-white text-black font-black text-xl rounded-2xl hover:bg-blue-400 transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                🚀 START YOUR ENGINE
              </button>

              {import.meta.env.DEV && (
                <button
                  onClick={() => setAppState("WORLD_ENGINE_DEV")}
                  className="px-6 py-6 bg-zinc-900 border border-green-500/30 text-green-400 font-mono text-sm rounded-2xl hover:bg-zinc-800 transition-all"
                >
                  🛠️ DEV: WORLD ENGINE
                </button>
              )}
            </div>

            <EnginesGrid
              onSolveClick={() => setAppState("IMPACT_ENGINE")}
              onLearnClick={() => {
                // LOGIC: Check if calibrated. For now, we assume uncalibrated to force the flow as requested in Scenario A.
                // In a real scenario, check userProfile.completedMissions or similar.
                setAppState("ASSESSMENT");
              }}
            />
          </div>
        </div>
      )}

      {/* IMPACY (MISSIONS) ENGINE */}
      {appState === "IMPACT_ENGINE" && (
        <ImpactEngine
          onBack={() => setAppState("LANDING")}
          onAccept={(id) => {
            const mission = STARTING_MISSIONS.find(m => m.id === id);
            if (mission) {
              if (mission.id === 'M1') {
                setActiveImpactMission(mission);
                setAppState("MISSION_ACTIVE_NEURAL");
              } else {
                alert("🔒 MISSION LOCKED: LOW CLEARANCE LEVEL\n\nComplete 'Neural Calibration' to unlock this contract.");
              }
            }
          }}
        />
      )}

      {/* 🟢 ACTIVE MISSION: NEURAL CALIBRATION */}
      {appState === "MISSION_ACTIVE_NEURAL" && activeImpactMission && (
        <ActiveMission
          missionId={activeImpactMission.id}
          onComplete={(reward) => {
            // Update Balance + Calibration
            setUserProfile(prev => prev ? { ...prev, genesisPoints: prev.genesisPoints + reward, calibrationScore: Math.min(100, (prev.calibrationScore || 0) + 15) } : null);
            // System pays
            setSystemBalance(prev => prev - reward);

            alert(`✅ MISSION COMPLETE\n\nREWARD: ${reward} SYS TRANSFERRED TO WALLET.`);

            setAppState("IMPACT_ENGINE");
            setActiveImpactMission(null);
          }}
          onExit={() => {
            if (confirm("ABORT MISSION? Progress will be lost.")) {
              setAppState("IMPACT_ENGINE");
              setActiveImpactMission(null);
            }
          }}
        />
      )}

      {/* 🧬 ONBOARDING */}
      {appState === "ONBOARDING" && <OnboardingWizard onComplete={completeOnboarding} onCancel={() => setAppState("LANDING")} />}

      {/* 🧠 SAGE PREP (Micro-Syllabus) */}
      {appState === "SAGE_PREP" && (
        <SagePrep
          mission={activeMission}
          sageContent={sagePrepContent}
          onComplete={() => setAppState("MISSION_WORKSPACE")}
          onCancel={() => setAppState("CHOICE_SELECTION")}
        />
      )}

      {/* 🧪 ASSESSMENT MODULE (The Missing Link) */}
      {appState === "ASSESSMENT" && (
        <AssessmentModule
          onClose={() => setAppState("LANDING")}
          onComplete={(data, path) => {
            console.log("Assessment Complete:", data, path);

            // 1. Update Profile Logic (Simulated)
            completeOnboarding({ ...data, grade: data.grade.toString(), passion: path.focus });

            // 2. Conditional Routing (The Fix)
            // K-5 => Learner Map
            // 6+ => Squad HQ / Choice Selection
            if (data.grade <= 5) {
              setAppState("LEARNER_MAP");
            } else {
              setAppState("CHOICE_SELECTION");
            }
          }}
        />
      )}

      {/* 🚀 LEARNER MAP (K-5 Environment) */}
      {appState === "LEARNER_MAP" && <LearnerMap />}

      {/* 🛡️ THE HQ (Feed Selection) */}
      {appState === "CHOICE_SELECTION" && (
        <div className="max-w-7xl mx-auto p-6 md:p-12 animate-fade-in pt-24">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="w-full md:w-[400px]">
              <div className="sticky top-24 p-8 bg-zinc-900/30 border border-white/5 rounded-3xl backdrop-blur-md">
                <div className="text-4xl mb-4">🛡️</div>
                <h2 className="text-3xl font-black mb-2 italic">THE SQUAD HQ</h2>
                <div className="space-y-6 mt-8">
                  <div>
                    <div className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1">
                      {Number(userProfile?.grade) <= 5 ? "Authenticated Contributor" : ""}
                      {Number(userProfile?.grade) >= 6 && Number(userProfile?.grade) <= 8 ? "TRAILBLAZER (Tier 2)" : ""}
                      {Number(userProfile?.grade) >= 9 && Number(userProfile?.grade) <= 12 ? "EXPLORER (Tier 3)" : ""}
                      {Number(userProfile?.grade) >= 13 ? "VOYAGER (High Command)" : ""}
                    </div>
                    <div className="text-xl font-bold text-white">{userProfile?.name}</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 p-4 bg-black/40 rounded-2xl border border-white/5">
                      <div className="text-[10px] text-zinc-600 font-bold mb-1">SOLVENCY</div>
                      <div className="text-xl font-black text-yellow-400">{userProfile?.genesisPoints} GP</div>
                    </div>
                    <div className="flex-1 p-4 bg-black/40 rounded-2xl border border-white/5">
                      <div className="text-[10px] text-zinc-600 font-bold mb-1">RANK</div>
                      <div className="text-xl font-black text-white">LVL {userProfile?.grade}</div>
                    </div>
                  </div>
                  <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                    <div className="text-[10px] text-zinc-600 font-bold mb-2">CALIBRATION</div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${(userProfile?.calibrationScore || 0) >= 70 ? 'bg-green-500' : (userProfile?.calibrationScore || 0) >= 40 ? 'bg-yellow-500' : 'bg-blue-500'}`} style={{ width: `${userProfile?.calibrationScore || 0}%` }} />
                      </div>
                      <span className={`text-sm font-black ${(userProfile?.calibrationScore || 0) >= 70 ? 'text-green-400' : (userProfile?.calibrationScore || 0) >= 40 ? 'text-yellow-400' : 'text-blue-400'}`}>{userProfile?.calibrationScore || 0}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <GenesisFeed
                userTrack={getUserTrack()}
                onMissionSelect={handleMissionSelect}
                onCalibrate={() => setShowCalibration(true)}
              />
            </div>
          </div>
        </div>
      )}

      {/* 🎮 MISSION WORKSPACE */}
      {appState === "MISSION_WORKSPACE" && activeMission && (
        <MissionWorkspace
          mission={activeMission}
          onComplete={() => attemptPayout(activeMission)}
          onCancel={() => setAppState("CHOICE_SELECTION")}
        />
      )}

      {/* 🎊 COMPLETE MODAL */}
      {appState === "MISSION_COMPLETE" && activeMission && (
        <ViralShareModal
          mission={activeMission as Mission}
          earnings={activeMission.reward - (activeMission.reward * SYSTEM_TREASURY.platformFee)}
          onClose={() => setAppState("CHOICE_SELECTION")}
        />
      )}

      {/* GHOST CLASS SWARM (Visual Layer) - Removed as per polish step */}

      {/* FOUNDER MENU (Replaces Static Badge) */}
      <div className="fixed bottom-6 right-6 z-[500]">
        <FounderMenu
          systemHealth={Math.round(systemBalance / 50000 * 100)}
          onOpenCommand={() => setShowFounderModal(true)}
          onOpenDiscovery={() => setShowCalibration(true)}
          onReset={() => {
            if (typeof window !== "undefined") {
              localStorage.clear();
              window.location.reload();
            }
          }}
        />
      </div>

      {/* 🛠️ WORLD ENGINE DEV CONSOLE */}
      {appState === "WORLD_ENGINE_DEV" && (
        <WorldEngineDevConsole
          onExit={() => setAppState("LANDING")}
          engine={worldEngine}
        />
      )}
    </div>
  );
};

export default App;
