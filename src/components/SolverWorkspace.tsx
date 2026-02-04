import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

// ----------------- UNIVERSAL TYPES -----------------
interface Mission {
    title: string;
    price: string;
    desc: string;
    tags?: string[];
    type?: string;
}

interface SolverWorkspaceProps {
    mission?: Mission | null;
    onSolve?: (rewards: { xp: number, balance: number }) => void;
    onBack?: () => void;
}

// ----------------- COMPONENT: UNIVERSAL SOLVER WORKSPACE -----------------
export default function SolverWorkspace({ mission, onBack, onSolve }: SolverWorkspaceProps) {
    // 1. DETERMINE WORKSPACE TYPE
    // Fallback if mission is missing (debug mode)
    const activeQuest = mission || { title: "Unknown Mission", tags: ["CODE", "DEBUG"], type: "CODE" };

    // Safety check for tags
    const tags = activeQuest.tags || [];

    const isVisualMission = tags.includes("VISUAL") || tags.includes("NATURE") || tags.includes("PATTERN");
    const isNatureMission = tags.includes("NATURE");

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col animate-in fade-in duration-500">

            {/* TOOLBAR (Universal) */}
            <div className="h-14 border-b border-gray-800 flex items-center justify-between px-4 bg-[#0a0a0a]">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors hover:bg-zinc-900 px-3 py-1.5 rounded"
                    >
                        <ArrowLeft size={14} /> Abort Mission
                    </button>
                    <div className="h-4 w-[1px] bg-gray-800"></div>
                    <div>
                        <h2 className="text-sm font-black text-white uppercase tracking-wider">{activeQuest.title}</h2>
                        <div className="text-[10px] text-gray-500 font-mono">PROTOCOL: {tags.join(" // ")}</div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div> Status: Active
                    </div>
                </div>
            </div>

            {/* CONTENT SWITCHER */}
            <div className="flex-1 overflow-hidden relative">
                {isVisualMission ? (
                    <VisualMatcherGame
                        theme={isNatureMission ? "NATURE" : "TECH"}
                        onComplete={() => onSolve && onSolve({ xp: 100, balance: 15.00 })}
                    />
                ) : (
                    <CodeEditorGame onComplete={() => onSolve && onSolve({ xp: 150, balance: 25.00 })} />
                )}
            </div>

            {/* FOOTER (Universal) */}
            <div className="h-8 bg-black border-t border-gray-800 flex items-center px-4 justify-between relative z-50">
                <div className="flex items-center gap-2 text-[10px] text-green-500 font-mono tracking-widest uppercase">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Neural Interface Status: Connected
                </div>
                <div className="text-[10px] text-gray-600 font-mono">
                    <span className="text-purple-500 font-bold">[SAGE]:</span> Monitoring performance...
                </div>
            </div>
        </div>
    );
}

// ----------------- SUB-GAME: VISUAL MATCHER (NATURE / JUNIOR) -----------------
function VisualMatcherGame({ theme, onComplete }: { theme: string, onComplete: () => void }) {
    const [matches, setMatches] = useState<Record<string, boolean>>({});
    const [selectedItem, setSelectedItem] = useState<{ id: number, type: string, icon: string } | null>(null);

    // Setup Data based on Theme
    const isNature = theme === "NATURE";

    const slots = isNature
        ? [{ id: 'oak', label: 'Oak Tree', icon: '🌳' }, { id: 'maple', label: 'Maple Tree', icon: '🍁' }, { id: 'pine', label: 'Pine Tree', icon: '🌲' }]
        : [{ id: 'aa', label: 'AA Slot', icon: '🔋' }, { id: '9v', label: '9V Slot', icon: '⚡' }, { id: 'aaa', label: 'AAA Slot', icon: '🔋' }];

    const items = isNature
        ? [{ id: 1, type: 'oak', icon: '🍃' }, { id: 2, type: 'pine', icon: '🌿' }, { id: 3, type: 'maple', icon: '🍂' }]
        : [{ id: 1, type: '9v', icon: '⚡' }, { id: 2, type: 'aa', icon: '🔋' }, { id: 3, type: 'aaa', icon: '🤏' }];

    const handleSlotClick = (slotId: string) => {
        if (selectedItem && selectedItem.type === slotId) {
            setMatches(prev => {
                const newState = { ...prev, [selectedItem.id]: true };
                return newState;
            });
            setSelectedItem(null);
        }
    };

    const allMatched = Object.keys(matches).length === items.length;

    return (
        <div className="h-full bg-zinc-900/50 flex flex-col items-center justify-center p-8 gap-12">
            {/* 1. THE SLOTS (Drop Zones) */}
            <div className="flex gap-8">
                {slots.map(slot => (
                    <button
                        key={slot.id}
                        onClick={() => handleSlotClick(slot.id)}
                        className="w-32 h-40 border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
                    >
                        <div className="text-4xl grayscale opacity-50">{slot.icon}</div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{slot.label}</div>
                    </button>
                ))}
            </div>

            {/* 2. THE ITEMS (Draggables) */}
            <div className="p-8 bg-black/50 rounded-2xl border border-gray-800 w-full max-w-2xl flex justify-center gap-6 min-h-[120px]">
                {allMatched ? (
                    <div className="flex flex-col items-center animate-in zoom-in">
                        <div className="text-green-500 font-bold text-2xl mb-2">SEQUENCE COMPLETE</div>
                        <button onClick={onComplete} className="bg-green-500 text-black font-bold px-6 py-2 rounded-full uppercase tracking-widest hover:scale-105 transition-transform">Claim Reward</button>
                    </div>
                ) : (
                    items.map(item => (
                        !matches[item.id] && (
                            <button
                                key={item.id}
                                onClick={() => setSelectedItem(item)}
                                className={`w-20 h-20 bg-zinc-800 rounded-lg flex items-center justify-center text-4xl border-2 transition-all hover:-translate-y-2 ${selectedItem?.id === item.id ? 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)] scale-110' : 'border-gray-700'}`}
                            >
                                {item.icon}
                            </button>
                        )
                    ))
                )}
            </div>
            <div className="text-gray-500 text-xs font-mono">INSTRUCTION: Select an ITEM below, then click the correct SLOT above.</div>
        </div>
    );
}

// ----------------- SUB-GAME: CODE EDITOR (ORIGINAL) -----------------
function CodeEditorGame({ onComplete }: { onComplete: () => void }) {
    return (
        <div className="flex h-full">
            {/* SIDEBAR: FILES */}
            <div className="w-64 border-r border-gray-800 bg-[#050505] hidden md:flex flex-col">
                <div className="p-4 text-xs font-bold text-gray-600 uppercase tracking-widest">Filesystem</div>
                <div className="px-2 space-y-1">
                    <FileItem name="src/" isFolder />
                    <FileItem name="components/" isFolder indent />
                    <FileItem name="LogicController.ts" active indent />
                    <FileItem name="assets/" isFolder />
                    <FileItem name="package.json" />
                </div>
            </div>

            {/* MAIN EDITOR AREA */}
            <div className="flex-1 flex flex-col bg-[#0c0c0c] relative">
                <div className="flex items-center justify-between bg-[#0a0a0a] border-b border-gray-800 px-4">
                    <div className="flex">
                        <div className="px-4 py-2 text-xs font-mono text-cyan-400 bg-[#0c0c0c] border-t-2 border-cyan-400">LogicController.ts</div>
                    </div>
                    <div className="text-[10px] text-gray-600 uppercase tracking-widest">Read-Only Check-out</div>
                </div>

                {/* CODE MOCKUP */}
                <div className="flex-1 p-6 font-mono text-sm leading-relaxed overflow-y-auto text-gray-400 selection:bg-cyan-900 selection:text-white">
                    <div className="flex gap-4">
                        <div className="text-gray-700 select-none text-right">1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9<br />10<br />11</div>
                        <div>
                            <span className="text-purple-400">import</span> {"{ Engine }"} <span className="text-purple-400">from</span> <span className="text-green-400">"@world-engine/core"</span>;
                            <br /><br />
                            <span className="text-gray-600">// Optimized transition logic</span>
                            <br />
                            <span className="text-purple-400">export const</span> <span className="text-yellow-200">handleSync</span> = () ={">"} {"{"}
                            <br />
                            &nbsp;&nbsp;<span className="text-purple-400">const</span> state = Engine.<span className="text-blue-400">getState</span>();
                            <br /><br />
                            <div className="bg-green-900/20 border-l-2 border-green-500 pl-4 py-2 my-2">
                                <span className="text-green-400 font-bold">// FIX: Reduce render iterations by batching state updates</span>
                                <br />
                                <span className="text-purple-400">return</span> state.<span className="text-blue-400">map</span>(item ={">"} item.id).<span className="text-blue-400">filter</span>(Boolean);
                            </div>
                            <br />
                            {"};"}
                        </div>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="p-4 border-t border-gray-800 bg-[#0a0a0a] flex justify-end gap-3">
                    <button className="px-6 py-3 rounded bg-zinc-800 text-gray-300 text-xs font-bold uppercase tracking-widest hover:bg-zinc-700">Run Tests</button>
                    <button onClick={onComplete} className="px-6 py-3 rounded bg-blue-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]">Verify & Submit</button>
                </div>
            </div>
        </div>
    );
}

// HELPERS
function FileItem({ name, isFolder, active, indent }: { name: string, isFolder?: boolean, active?: boolean, indent?: boolean }) {
    return (
        <div className={`flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer ${active ? 'bg-blue-900/20 text-blue-400' : 'text-gray-500 hover:text-gray-300 hover:bg-zinc-900'} ${indent ? 'ml-4' : ''}`}>
            {isFolder ? <span className="text-yellow-600">📁</span> : <span className="text-gray-600">📄</span>}
            <span className="text-xs font-mono">{name}</span>
        </div>
    );
}
