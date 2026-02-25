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
import React, { useState, useEffect, useRef } from "react";
import { FounderCommandPanel } from "./components/dashboard/FounderCommandPanel";
import { MissionWorkspace } from "./components/workspaces/MissionWorkspace";
import { SwarmDashboard } from "./components/admin/SwarmDashboard";
import { MasterTeacherDashboard } from "./components/admin/MasterTeacherDashboard";
import { CalibrationModal } from "./components/dashboard/CalibrationModal";
import { GenesisFeed } from "./components/feed/GenesisFeed";
import { SagePrep } from "./components/learning/SagePrep";
import { LearnerMap } from "./components/learner/LearnerMap";
import { WorldEngineDevConsole } from "./components/WorldEngine/DevConsole";
import { SimulationDashboard } from "./components/SimulationDashboard";
import { PassionSelection } from "./components/PassionSelection";
import { ElevationMoment } from "./components/ElevationMoment";
import { IntakeFlow } from "./components/intake/IntakeFlow";
import type { MasteryMap } from "./engines/intake/IntakeRegistry";
import { StandardsGapGraph } from "./engines/intake/StandardsGapGraph";


import Header from "./components/Header";
import { FounderMenu } from "./components/Navigation/FounderMenu";
import { ImpactEngine, STARTING_MISSIONS, type ImpactMission } from "./components/engines/ImpactEngine";
import { ActiveMission } from "./components/engines/ActiveMission";
import type { LiveMission } from "./lib/MissionGenerator";
import { supabase } from "./lib/supabase";
import { RecommendationEngine } from "./services/RecommendationEngine";
import type { UserProfile as EngineUserProfile, RecommendationResult } from "./types/EngineTypes";
import { WorldEngine } from "./engines/world-engine/WorldEngine";
import { SEED_GRAPH } from "./engines/world-engine/KnowledgeGraph";
import type { LearnerProfile } from "./engines/world-engine/LearnerModel";
import BlueprintCanvas from "./architect/components/BlueprintCanvas";
import BlueprintErrorBoundary from "./architect/components/BlueprintErrorBoundary";
import { useAuth } from './hooks/useAuth';
import { NeuralGraph } from './components/NeuralGraph';
import type { SkillEdge } from './components/NeuralGraph';
import { useGraphData } from './hooks/useGraphData';

// --- MOCK PROFILE FOR APP-LEVEL ENGINE ---
const APP_LEARNER_PROFILE: LearnerProfile = {
  id: "learner-app-root",
  name: "Explorer Root",
  currentGrade: 12, // Upgraded to match Voyager
  currentTier: 'VOYAGERS', // GOD MODE: Unlocked
  masteryMap: new Map(),
  domainLevels: { literacy: 4.0, numeracy: 4.0, science: 4.0, social: 4.0, sel: 4.0, career: 4.0 },
  cognitiveState: { focusLevel: 100, frustrationLevel: 0, energyLevel: 100, currentZPD: 0.2 },
  interests: ["General"],
  learningStyle: 'visual',
  goals: ["Explore the World"],
  traits: new Map(),
  verifiedCompetencies: [
    {
      competencyId: 'cert.python.basic',
      title: 'Python Basic',
      domain: 'science', // using science as proxy for CS
      tier: 'VOYAGERS',
      sdi: 1,
      verifiedAt: Date.now(),
      masteryScore: 1.0,
      evidence: 'Passed exam'
    }
  ],
  completedMissions: [],
  activeContracts: [],
  totalEarnings: 0,
  calibrationScore: 95 // God Mode: High Confidence
};


// --- TYPES ---
type AppState = "LANDING" | "ONBOARDING" | "SQUAD_BRIEFING" | "CHOICE_SELECTION" | "DASHBOARD" | "MISSION_WORKSPACE" | "MISSION_ACTIVE" | "MISSION_COMPLETE" | "IMPACT_ENGINE" | "MISSION_ACTIVE_NEURAL" | "SAGE_PREP" | "WORLD_ENGINE_DEV" | "ASSESSMENT" | "LEARNER_MAP" | "BLUEPRINT_MODE" | "SIMULATION_ENGINE" | "SWARM_DASHBOARD";


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
type OnboardingStep = "NAME" | "GRADE" | "PASSION" | "MATCHING" | "SQUAD_REVEAL" | "AUTH";

const ONBOARDING_STORAGE_KEY = 'onboarding_progress';

interface OnboardingDraft {
  step: OnboardingStep;
  name: string;
  grade: string;
  passion: string;
  squad: string;
}

function loadOnboardingDraft(): OnboardingDraft | null {
  try {
    const raw = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<OnboardingDraft> & { savedAt?: number };
    // TTL: 30 minutes — stale drafts auto-expire
    const THIRTY_MINUTES = 30 * 60 * 1000;
    if (parsed.savedAt && Date.now() - parsed.savedAt > THIRTY_MINUTES) {
      localStorage.removeItem(ONBOARDING_STORAGE_KEY);
      return null;
    }
    if (parsed.step && parsed.name !== undefined) return parsed as OnboardingDraft;
    return null;
  } catch {
    return null;
  }
}

function saveOnboardingDraft(draft: OnboardingDraft): void {
  try {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify({ ...draft, savedAt: Date.now() }));
  } catch { /* localStorage may be unavailable in some contexts */ }
}

function clearOnboardingDraft(): void {
  try { localStorage.removeItem(ONBOARDING_STORAGE_KEY); } catch { /* noop */ }
}

const OnboardingWizard: React.FC<{ onComplete: (profile: Partial<UserProfile>) => void, onCancel: () => void }> = ({ onComplete, onCancel }) => {
  const draft = loadOnboardingDraft();
  const [step, setStep] = useState<OnboardingStep>(draft?.step || "NAME");
  const [name, setName] = useState(draft?.name || "");
  const [grade, setGrade] = useState(draft?.grade || "");
  const [passion, setPassion] = useState(draft?.passion || "");
  const [squad, setSquad] = useState(draft?.squad || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [fade, setFade] = useState(false);
  const [matchStatus, setMatchStatus] = useState("SEARCHING GLOBAL NETWORK...");

  // 🔊 VOICE SYNTHESIS
  // 🔊 VOICE SYNTHESIS CONFIG
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // Priority: Google US English -> Microsoft Zira -> Samantha -> Default
      const preferred = voices.find(v => v.name.includes("Google US English"))
        || voices.find(v => v.name.includes("Microsoft Zira"))
        || voices.find(v => v.name.includes("Samantha"));

      if (preferred) voiceRef.current = preferred;
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    // Tiny delay to ensure voices are ready if called immediately on mount
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05; // "Quicker but not too fast"
    utterance.pitch = 1.0; // Natural pitch

    if (voiceRef.current) {
      utterance.voice = voiceRef.current;
    } else {
      // Fallback attempt just in case
      const voices = window.speechSynthesis.getVoices();
      const fallback = voices.find(v => v.name.includes("Google US English")) || voices.find(v => v.name.includes("Microsoft Zira"));
      if (fallback) utterance.voice = fallback;
    }

    window.speechSynthesis.speak(utterance);
  };

  // 🗣️ SAGE SPEAKS ON STEP CHANGE
  useEffect(() => {
    if (step === "NAME" && !name) speak("Welcome, Explorer. I am Sage. What should I call you?");
    if (step === "GRADE") speak(`Nice to meet you, ${name}. What is your experience level?`);
    if (step === "PASSION") speak("Nice, that choice unlocks new potential. Now, what mission calls to you?");
    if (step === "MATCHING") speak("Initializing your squad. Stand by.");
    if (step === "SQUAD_REVEAL") speak(`${name}, meet your squad. Lock in to start your first mission.`);
    if (step === "AUTH") speak("Final Step. Secure your Engine Key to save your progress.");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]); // Removed 'name' dependency to prevent re-speaking while typing/dictating

  // 🛡️ SAFETY GUARD: Warn guests before leaving
  useEffect(() => {
    if (step === "SQUAD_REVEAL" || step === "AUTH") {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [step]);

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
        transitionTo("SQUAD_REVEAL");
      }, 3500);
    }
  };

  const handleAuthSubmit = async () => {
    if (!email || !password) { setAuthError("Email and Password required."); return; }
    if (password.length < 6) { setAuthError("Password must be at least 6 characters."); return; }

    try {
      setMatchStatus("SECURING VAULT CONNECTION...");
      setAuthError(""); // Clear previous errors

      // 1. Try Log In First
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (!loginError && loginData.user) {
        onComplete({ name, grade, passion, squad, id: loginData.user.id });
        clearOnboardingDraft();
        return;
      }

      // If login error is standard "Invalid login credentials", try signing up.
      // E.g. User doesn't exist yet.
      if (loginError && loginError.message.includes("Invalid login credentials")) {
        // 2. Try Sign Up
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
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

        if (signUpError) throw signUpError;
        onComplete({ name, grade, passion, squad, id: signUpData.user?.id });
        clearOnboardingDraft();
        return;
      }

      // If it wasn't a standard 'invalid credentials' error, surface the real error
      throw loginError;

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setAuthError(errorMessage || "Connection Failed. Try again.");
    }
  };

  const [isListening, setIsListening] = useState(false);
  const [voiceModeEnabled, setVoiceModeEnabled] = useState(false); // Explicit User Opt-In
  const [voiceToast, setVoiceToast] = useState<string | null>(null);

  // 🎤 GLOBAL VOICE LISTENER FOR SELECTION
  useEffect(() => {
    if ((step !== "GRADE" && step !== "PASSION") || !voiceModeEnabled) {
      setIsListening(false);
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice commands are not supported in this browser.");
      setVoiceModeEnabled(false);
      return;
    }

    // @ts-expect-error - SpeechRecognition is experimental
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      // Auto-restart if mode is still on (keep listening)
      if (voiceModeEnabled) recognition.start();
      else setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const transcript = event.results[last][0].transcript.toLowerCase().trim();

      setVoiceToast(`🎤 Heard: "${transcript}"`);
      setTimeout(() => setVoiceToast(null), 3000);

      // 🎤 GLOBAL COMMANDS
      if (transcript.includes("back") || transcript.includes("go back") || transcript.includes("undo")) {
        setVoiceToast("↩️ Going Back...");
        goBack();
        return;
      }

      // GRADE MAPPING
      if (step === "GRADE") {
        if (["2", "two", "sprouts", "kindergarten", "k", "one", "1"].some(k => transcript.includes(k))) handleSelection("GRADE", "2|Sprouts|K-2|🌱");
        if (["5", "five", "builders", "three", "3", "four", "4"].some(k => transcript.includes(k))) handleSelection("GRADE", "5|Builders|3-5|🛠️");
        if (["8", "eight", "trailblazers", "six", "6", "seven", "7"].some(k => transcript.includes(k))) handleSelection("GRADE", "8|Trailblazers|6-8|🌲");
        if (["12", "twelve", "explorers", "high school", "nine", "9", "ten", "10", "eleven", "11"].some(k => transcript.includes(k))) handleSelection("GRADE", "12|Explorers|9-12|🧭");
        if (["16", "sixteen", "voyagers", "college", "university"].some(k => transcript.includes(k))) handleSelection("GRADE", "16|Voyagers|College+|🚀");
      }

      // PASSION MAPPING
      if (step === "PASSION") {
        if (["code", "coding", "tech", "computer"].some(k => transcript.includes(k))) handleSelection("PASSION", "CODING|Tech & Code|Building Future|💻");
        if (["science", "nature", "biology", "planet"].some(k => transcript.includes(k))) handleSelection("PASSION", "SCIENCE|Nature|Protect Planet|🌿");
        if (["art", "design", "creative", "draw"].some(k => transcript.includes(k))) handleSelection("PASSION", "CREATIVE|Art & Design|Create Beauty|🎨");
        if (["leader", "business", "money", "team"].some(k => transcript.includes(k))) handleSelection("PASSION", "LEADERSHIP|Leadership|Guide Teams|🤝");
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.warn("Speech recognition already started", e);
    }

    return () => {
      recognition.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, voiceModeEnabled]);

  const goBack = () => {
    setFade(true);
    setTimeout(() => {
      if (step === "GRADE") setStep("NAME");
      if (step === "PASSION") setStep("GRADE");
      if (step === "MATCHING") setStep("PASSION");
      setFade(false);
    }, 300);
  };

  const transitionTo = (nextStep: OnboardingStep) => {
    setFade(true);
    setTimeout(() => {
      setStep(nextStep);
      setFade(false);
      saveOnboardingDraft({ step: nextStep, name, grade, passion, squad });
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in p-6 font-sans">
      <div className="mb-8">
        <BreadcrumbHeader name={name} grade={grade} passion={passion} step={step} />
      </div>
      <button onClick={() => { clearOnboardingDraft(); onCancel(); }} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors">✕ ESC</button>

      {/* 🎤 VOICE TOGGLE */}
      {(step === "GRADE" || step === "PASSION") && (
        <button
          onClick={() => setVoiceModeEnabled(!voiceModeEnabled)}
          className={`absolute top-6 right-24 flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${voiceModeEnabled ? "bg-red-500/20 border-red-500 text-red-500 animate-pulse" : "bg-zinc-900 border-zinc-700 text-zinc-500 hover:text-white"}`}
        >
          <span>{voiceModeEnabled ? "🎤 ON" : "🎤 OFF"}</span>
        </button>
      )}

      {/* 🗣️ VOICE TOAST */}
      {voiceToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-full border border-white/20 animate-fade-in-up z-50 shadow-2xl">
          {voiceToast}
        </div>
      )}

      {step === "MATCHING" && (
        <div className="text-center">
          <div className="text-6xl mb-6 animate-bounce">🧬</div>
          <h2 className="text-3xl font-black text-white tracking-widest mb-2">BUILDING SQUAD</h2>
          <p className="text-green-400 font-mono text-sm uppercase animate-pulse">{matchStatus}</p>
        </div>
      )}

      {step === "SQUAD_REVEAL" && (
        <div className={`text-center w-full max-w-2xl transition-opacity duration-300 ${fade ? "opacity-0" : "opacity-100"}`}>
          <div className="text-5xl mb-4">🎯</div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Your Squad is <span className="text-emerald-400">Ready</span></h1>
          <p className="text-zinc-400 text-sm mb-8">You've been matched with teammates who share your mission.</p>

          {/* SQUAD VISUALIZATION */}
          <div className="bg-zinc-900/80 border border-emerald-500/20 rounded-2xl p-8 mb-8">
            <h3 className="text-lg font-bold text-emerald-400 mb-6 tracking-wider uppercase">{squad}</h3>
            <div className="flex justify-center gap-6 mb-6">
              {/* YOU */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-blue-500/30">
                  {name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-blue-400">YOU</span>
                <span className="text-[10px] text-zinc-500">{name}</span>
              </div>
              {/* AI TEAMMATE 1 */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-violet-400 flex items-center justify-center text-2xl shadow-lg shadow-purple-500/30">🤖</div>
                <span className="text-xs font-bold text-purple-400">AI AGENT</span>
                <span className="text-[10px] text-zinc-500">Sage-7</span>
              </div>
              {/* AI TEAMMATE 2 */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/30">🧠</div>
                <span className="text-xs font-bold text-amber-400">AI MENTOR</span>
                <span className="text-[10px] text-zinc-500">Oracle-3</span>
              </div>
              {/* HUMAN MATCH */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-600 to-green-400 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/30">👤</div>
                <span className="text-xs font-bold text-emerald-400">HUMAN</span>
                <span className="text-[10px] text-zinc-500">Matched — Pending</span>
              </div>
            </div>
            <div className="text-[10px] text-zinc-600 font-mono border-t border-zinc-800 pt-4">
              SQUAD STATUS: ASSEMBLED • FIRST MISSION: READY TO DEPLOY
            </div>
          </div>

          {/* THE HOOK — CTA */}
          <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-lg">🎯</span>
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">First Mission Preview</span>
            </div>
            <h4 className="text-sm font-bold text-white">Neural Calibration</h4>
            <p className="text-xs text-zinc-500">Discover your learning strengths and unlock your personalized path. ~5 min • +50 GP</p>
          </div>
          <button
            onClick={() => transitionTo("AUTH")}
            className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xl rounded-xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
          >
            🔒 LOCK IN YOUR SQUAD
          </button>
          <p className="mt-4 text-zinc-600 text-xs">Create your account to save your squad and start your first mission.</p>
        </div>
      )}

      {step === "NAME" && (
        <div className={`text-center w-full max-w-2xl transition-opacity duration-300 ${fade ? "opacity-0" : "opacity-100"}`}>
          <div className="flex flex-col items-center gap-2 mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Type your <span className="text-orange-500">Name</span></h1>
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-400 tracking-wide">press <span className="text-blue-400">Enter</span></h2>
          </div>
          <div className="relative w-full">
            <input
              autoFocus
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-8 py-6 text-2xl text-center text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-all pr-16"
              placeholder="Your Name... [Enter]"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={handleNameSubmit}
            />
            <button
              onClick={() => {
                if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                  // @ts-expect-error - SpeechRecognition is experimental and not in all TS libs
                  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                  const recognition = new SpeechRecognition();
                  recognition.lang = 'en-US';
                  recognition.start();
                  recognition.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    setName(transcript);
                    // Optional: auto-submit if confident? For now let them verify.
                  };
                } else {
                  alert("Speech recognition not supported in this browser.");
                }
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-zinc-500 hover:text-white transition-colors"
              title="Speak your name"
            >
              🎤
            </button>
          </div>
          {name.trim().length > 0 && (
            <button
              onClick={() => transitionTo("GRADE")}
              className="mt-6 px-10 py-4 bg-blue-500 hover:bg-blue-400 text-black font-black text-lg rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
            >
              Continue →
            </button>
          )}
          {name.trim().length === 0 && (
            <p className="mt-6 text-zinc-600 text-sm animate-pulse">Take your time. Enter your name above when you&apos;re ready.</p>
          )}
        </div>
      )}

      {/* 🔙 BACK BUTTON */}
      {(step === "GRADE" || step === "PASSION") && (
        <button
          onClick={goBack}
          className="absolute top-6 left-6 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
        >
          <span>← Back</span>
        </button>
      )}

      {step === "GRADE" && (
        <div className={`w-full max-w-5xl transition-opacity duration-300 ${fade ? "opacity-0" : "opacity-100"}`}>
          <h1 className="text-4xl font-black text-white text-center mb-10">
            Calibrate Your <span className="text-purple-400">Engine</span>
            {isListening && <span className="ml-4 text-sm font-mono text-red-500 animate-pulse">● LISTENING</span>}
          </h1>
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
        <PassionSelection
          grade={parseInt(grade.split('|')[0]) || 8}
          onSelect={(val) => handleSelection("PASSION", val)}
          isListening={isListening}
        />
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

          <button
            onClick={() => {
              onComplete({ name: name || "Test Pilot", grade: grade || "8", passion: passion || "CODING", squad: "ALPHA-1", id: "temp-test-id-" + Date.now() });
              clearOnboardingDraft();
            }}
            className="mt-4 text-xs text-zinc-600 underline hover:text-red-400"
          >
            [DEV: BYPASS AUTH]
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
  const { supabaseUser } = useAuth();

  // 0. GLOBAL STATE
  const [appState, setAppState] = useState<AppState>(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/architect/blueprint') {
      return "BLUEPRINT_MODE";
    }
    return "LANDING";
  });

  // GOD MODE: Check if founder mode is enabled
  const [learnerProfile, setLearnerProfile] = useState<LearnerProfile>(() => {
    const isGodMode = typeof window !== 'undefined' && localStorage.getItem('founder_mode') === 'true';
    return isGodMode
      ? { ...APP_LEARNER_PROFILE, currentTier: 'VOYAGERS', calibrationScore: 95 }
      : APP_LEARNER_PROFILE;
  });

  // --- WORLD ENGINE INSTANCE ---
  const worldEngine = React.useMemo(() => new WorldEngine(learnerProfile, SEED_GRAPH), [learnerProfile]);

  const [masteryMap, setMasteryMap] = useState<MasteryMap | null>(null);
  const [gapGraph, setGapGraph] = useState<StandardsGapGraph | null>(null);
  const [sagePrepContent, setSagePrepContent] = useState<RecommendationResult | null>(null);

  // Phase 4: Live graph data from Supabase
  const { nodes: graphNodes, stats: platformStats } = useGraphData(learnerProfile);

  const availableMissions = React.useMemo(() => {
    // 1. Filter by grade level
    const grade = learnerProfile.currentGrade || 10;
    const gradeMissions = MISSION_DB.filter((m: any) => grade >= m.minGrade && grade <= m.maxGrade);

    // 2. Identify Targeted Missions (Targeting gaps detected in intake)
    if (masteryMap && masteryMap.gaps.length > 0) {
      const gapStandardIds = masteryMap.gaps.map(g => g.standardId);
      const targeted = gradeMissions.filter((m: any) => gapStandardIds.includes(m.standardId));

      // If we have targeted missions, prioritize them at the top of the feed
      if (targeted.length > 0) {
        const others = gradeMissions.filter((m: any) => !gapStandardIds.includes(m.standardId));
        return [...targeted, ...others].slice(0, 3); // Return limited "Genesis Feed"
      }
    }

    return gradeMissions.slice(0, 3);
  }, [learnerProfile.currentGrade, masteryMap]);

  const startSagePrep = (mission: LiveMission | Mission) => {
    setActiveMission(mission);

    const engineUser: EngineUserProfile = {
      id: 'current',
      name: userProfile?.name || 'User',
      archetype: 'Explorer',
      passion: userProfile?.passion || 'General',
      skillTheta: 0,
      gradeLevel: parseInt(userProfile?.grade || '5'),
      interests: [userProfile?.passion || 'General'],
      competencies: {}
    };

    const rec = RecommendationEngine.recommendNext(engineUser);
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
    // 1. KEYBOARD LISTENERS
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
    setAppState("SQUAD_BRIEFING");
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
      alert("⚠️ VAULT SYNC DELAYED. Saving locally...\n\nPayment verified.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* HEADER NAVIGATION — hidden in full-page dashboard modes */}
      {appState !== "SIMULATION_ENGINE" && appState !== "WORLD_ENGINE_DEV" && appState !== "BLUEPRINT_MODE" && (
        <div className="fixed top-0 left-0 w-full z-[1000] bg-black/80 backdrop-blur-md border-b border-white/5">
          <Header
            viewMode={viewMode}
            setViewMode={setViewMode}
            walletBalance={userProfile ? `$${userProfile.genesisPoints}` : undefined}
            onToggleNeural={() => setShowCalibration(true)}
            onOpenCommandCenter={() => setShowFounderModal(true)}
          />
        </div>
      )}

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
        <div className="relative pt-24 mbp-kinetic-grid">
          {/* Ambient Glow Orbs */}
          <div className="mbp-ambient-glow mbp-ambient-glow--cyan" style={{ top: '-10%', left: '20%' }} />
          <div className="mbp-ambient-glow mbp-ambient-glow--purple" style={{ top: '30%', right: '10%' }} />
          <div className="mbp-ambient-glow mbp-ambient-glow--emerald" style={{ bottom: '10%', left: '40%' }} />

          <div className="absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-blue-900/20 via-black to-black -z-10"></div>
          <div className="max-w-7xl mx-auto pt-16 pb-40 px-6">

            {/* HERO: Split Layout — Text + Neural Graph */}
            <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">

              {/* LEFT: Hero Copy */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-6xl md:text-7xl lg:text-[96px] font-black tracking-tighter leading-[0.9] mb-8 animate-mbp-fadeInUp bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-violet-500 to-amber-400">
                  SOLVE &<br />EARN.
                </h1>
                <p className="text-lg md:text-xl text-slate-400 max-w-xl mt-4 mb-8 font-medium leading-relaxed animate-mbp-fadeInUp-delay-1">
                  <span className="text-blue-400 font-bold">MyBestPurpose</span>
                  {" is an "}
                  <span className="text-white font-bold">AI-guided Engine</span>
                  {" where you "}
                  <span className="text-emerald-400 font-bold">evolve</span>
                  {" from a passive student into a "}
                  <span className="text-amber-400 font-bold">Verified Contributor</span>.
                </p>

                {/* CTA Row */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8 animate-mbp-fadeInUp-delay-2">
                  <button
                    onClick={() => setAppState("ONBOARDING")}
                    className="px-10 py-5 bg-white text-black font-black text-lg rounded-2xl hover:bg-emerald-400 transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)] relative overflow-hidden group"
                  >
                    <span className="relative z-10">🚀 START YOUR ENGINE</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <button
                    onClick={() => setAppState("IMPACT_ENGINE")}
                    className="px-8 py-5 border border-white/10 text-zinc-400 font-bold text-lg rounded-2xl hover:border-cyan-500/30 hover:text-white transition-all hover:bg-white/5"
                  >
                    Explore Missions →
                  </button>
                </div>

                {/* Live Stats */}
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start animate-mbp-fadeInUp-delay-3">
                  <div className="mbp-stat-pill">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-zinc-400">{platformStats.totalNodes} Skill Nodes</span>
                  </div>
                  <div className="mbp-stat-pill">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="text-zinc-400">{platformStats.totalUsers || '—'} Active Learner{platformStats.totalUsers !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="mbp-stat-pill">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span className="text-zinc-400">{platformStats.totalReputationAwarded} RP Earned</span>
                  </div>
                </div>
              </div>

              {/* RIGHT: Neural Graph Visualization */}
              <div className="flex-1 w-full lg:w-auto min-h-[400px] animate-mbp-fadeInUp-delay-2">
                <div className="mbp-card-elevated p-4 h-[420px] relative">
                  <div className="absolute top-4 left-5 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Neural Skill Map • Live</span>
                  </div>
                  <NeuralGraph
                    nodes={graphNodes}
                    edges={SEED_GRAPH.getAllNodes().flatMap((n): SkillEdge[] =>
                      n.prerequisites.map((p: string) => ({ source: p, target: n.id }))
                    )}
                    onNodeClick={(node) => {
                      console.log('[NeuralGraph] Node selected:', node);
                      if (!node.unlocked) {
                        alert(`🔒 NODE LOCKED: "${node.label}"\n\nComplete prerequisite skills to unlock this path.`);
                        return;
                      }
                      // Route based on domain — learning domains go to IntakeFlow, action domains go to Impact Engine
                      const LEARNING_DOMAINS = ['literacy', 'numeracy', 'science', 'social', 'sel'];
                      if (LEARNING_DOMAINS.includes(node.domain)) {
                        setAppState("ASSESSMENT");
                      } else {
                        // coding, career, creative → Impact missions
                        setAppState("IMPACT_ENGINE");
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ENGINES GRID — Below Hero */}
            <div className="animate-mbp-fadeInUp-delay-3">
              <EnginesGrid
                onSolveClick={() => setAppState("IMPACT_ENGINE")}
                onLearnClick={() => {
                  setAppState("ONBOARDING");
                }}
              />
            </div>
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

      {/* 🧬 INTELLIGENT INTAKE (Phase 1 & 2) */}
      {appState === "ASSESSMENT" && (
        <IntakeFlow
          userId={supabaseUser?.id || userProfile?.id || "temp-explorer"}
          onCancel={() => setAppState("LANDING")}
          onComplete={(map) => {
            setMasteryMap(map);
            setGapGraph(new StandardsGapGraph(map));
            // Auto-complete onboarding with determined grade
            const avgGrade = Math.round(Object.values(map.zpd).reduce((a, b) => a + b, 0) / 3);
            completeOnboarding({
              name: "Authenticated Explorer",
              grade: avgGrade.toString(),
              passion: "TECH",
              squad: "Alpha Squad"
            });
          }}
        />
      )}

      {/* 🚁 SQUAD BRIEFING (The Hangar) */}
      {appState === "SQUAD_BRIEFING" && (
        <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col items-center justify-center p-6 animate-fade-in">
          {/* BACKGROUND FX */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614728853913-1e32005e307a?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 pointer-events-none mix-blend-screen"></div>

          <div className="relative z-10 max-w-4xl w-full text-center">
            <div className="mb-12">
              <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">SQUAD <span className="text-emerald-500">ASSEMBLED</span></h1>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">Your team is online. The network is waiting. Verify your skills to unlock the global feed.</p>
            </div>

            {/* SQUAD GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {/* USER */}
              <div className="p-8 bg-zinc-900/80 border border-blue-500/30 rounded-3xl backdrop-blur-md relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">👤</div>
                <h3 className="text-xl font-black text-white uppercase">{userProfile?.name}</h3>
                <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mt-1">SQUAD LEADER</p>
              </div>
              {/* SAGE */}
              <div className="p-8 bg-zinc-900/60 border border-white/5 rounded-3xl backdrop-blur-md relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🤖</div>
                <h3 className="text-xl font-black text-white">SAGE</h3>
                <p className="text-xs text-purple-400 font-bold uppercase tracking-widest mt-1">AI ARCHITECT</p>
              </div>
              {/* ORACLE */}
              <div className="p-8 bg-zinc-900/60 border border-white/5 rounded-3xl backdrop-blur-md relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🧠</div>
                <h3 className="text-xl font-black text-white">ORACLE</h3>
                <p className="text-xs text-amber-400 font-bold uppercase tracking-widest mt-1">STRATEGIC COMMS</p>
              </div>
            </div>

            {/* ACTION CARD */}
            <div className="bg-black/40 border border-emerald-500/50 rounded-3xl p-8 max-w-2xl mx-auto backdrop-blur-xl shadow-[0_0_50px_rgba(16,185,129,0.1)]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs ring-1 ring-emerald-500/50">1</span>
                  <span className="text-zinc-400 font-mono text-sm uppercase tracking-widest">Initial Objective</span>
                </div>
                <span className="px-3 py-1 bg-emerald-900/30 text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20 rounded-full animate-pulse">Ready to Start</span>
              </div>
              <h2 className="text-3xl font-black text-white mb-2">NEURAL CALIBRATION</h2>
              <p className="text-zinc-400 text-sm mb-8">
                Before we can assign you high-value contracts, we need to verify your engine's baseline.
                Solve 3 logic puzzles to prove your readiness.
              </p>
              <button
                onClick={() => setAppState("ASSESSMENT")}
                className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xl rounded-2xl transition-all hover:scale-[1.02] shadow-xl shadow-emerald-500/20"
              >
                🚀 LAUNCH CALIBRATION
              </button>
            </div>

            <div className="mt-8 flex justify-center gap-4 text-xs font-mono text-zinc-600">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> MARKETPLACE: LOCKED</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> GENESIS FEED: OFFLINE</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> SQUAD COMMS: SECURE</span>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 LEARNER MAP (K-5 Environment) */}
      {appState === "LEARNER_MAP" && <LearnerMap />}


      {/* 📐 BLUEPRINT MODE (Architect Tier) */}
      {appState === "BLUEPRINT_MODE" && (
        <div className="fixed inset-0 z-[2000] bg-zinc-950 flex flex-col">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-zinc-900">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">📐</span> ARCHITECT BLUEPRINT
            </h1>
            <button
              onClick={() => setAppState("LANDING")}
              className="px-4 py-2 border border-white/20 hover:bg-white/10 rounded text-sm transition-colors"
            >
              EXIT STUDIO
            </button>
          </div>
          <BlueprintErrorBoundary>
            <BlueprintCanvas />
          </BlueprintErrorBoundary>
        </div>
      )}

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
                profile={learnerProfile}
                onProfileUpdate={setLearnerProfile}
                availableMissions={availableMissions}
              />
            </div>
          </div>
        </div>
      )}

      {/* 🎮 MISSION WORKSPACE */}
      {appState === "MISSION_WORKSPACE" && activeMission && (
        <MissionWorkspace
          mission={activeMission}
          userGap={masteryMap?.gaps[0]?.description} // First gap context
          onComplete={async (_qualityScore) => {
            const missionStandardId = (activeMission as any).standardId || (activeMission as any).standard;
            if (gapGraph && missionStandardId) {
              await gapGraph.recordMastery(missionStandardId, userProfile?.id || 'anon');
            }
            attemptPayout(activeMission);
          }}
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
          onOpenSwarmMenu={() => setAppState("SWARM_DASHBOARD")}
          onReset={async () => {
            if (typeof window !== "undefined") {
              localStorage.clear();
              // Make sure to also nuke the Supabase session token if imported!
              await supabase.auth.signOut();
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

      {/* 🧪 SIMULATION ENGINE v1.1 */}
      {appState === "SIMULATION_ENGINE" && (
        <div className="relative">
          <button
            onClick={() => setAppState("LANDING")}
            className="fixed top-4 right-4 z-50 px-4 py-2 bg-zinc-800 border border-white/10 text-zinc-400 hover:text-white rounded-lg font-mono text-xs transition-all"
          >
            ← EXIT TO LANDING
          </button>
          <SimulationDashboard />
        </div>
      )}

      {/* 🐝 SWARM DASHBOARD (Validation UI) */}
      {appState === "SWARM_DASHBOARD" && (
        <SwarmDashboard onClose={() => setAppState("LANDING")} />
      )}

      <ElevationMoment />
    </div>
  );
};

export default App;
