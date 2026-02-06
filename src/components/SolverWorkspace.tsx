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

// ----------------- SUB-GAME: CODE EDITOR (INTERACTIVE) -----------------
function CodeEditorGame({ onComplete }: { onComplete: () => void }) {
    const [code, setCode] = useState(`// Task: Optimize solar grid distribution
// Input: Array of GridNodes
// Output: Active Node IDs

export const handleSync = (nodes) => {
  // TODO: Filter for active nodes and map to IDs
  
  return []; 
};`);
    const [status, setStatus] = useState<'IDLE' | 'RUNNING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [consoleOutput, setConsoleOutput] = useState<string[]>([]);

    const activeQuest = {
        title: "Clean Energy Algorithm",
        brief: "Optimize the load-balancing logic for a decentralized solar grid."
    };

    const handleRun = async () => {
        setStatus('RUNNING');
        setConsoleOutput(['> Compiling...', '> Running Unit Tests...']);

        // Artificial delay for realism
        await new Promise(r => setTimeout(r, 1500));

        // Simple validation logic (keyword check for prototype)
        const hasMap = code.includes('.map');
        const hasFilter = code.includes('.filter');

        if (hasMap && hasFilter) {
            setConsoleOutput(p => [...p, '√ Test 1: Active Nodes Filtered (PASS)', '√ Test 2: IDs Mapped (PASS)', '√ Performance: 12ms', 'ALL TESTS PASSED']);
            setStatus('SUCCESS');
        } else {
            setConsoleOutput(p => [...p, 'x Test 1: Active Nodes Filtered (FAIL)', 'x Test 2: IDs Mapped (FAIL)', 'Hint: Use .filter() and .map() to transform the data.']);
            setStatus('ERROR');
        }
    };

    return (
        <div className="flex h-full animate-in fade-in">
            {/* SIDEBAR: FILES */}
            <div className="w-64 border-r border-gray-800 bg-[#050505] hidden md:flex flex-col">
                <div className="p-4 text-xs font-bold text-gray-600 uppercase tracking-widest">Project Explorer</div>
                <div className="px-2 space-y-1">
                    <FileItem name="src/" isFolder />
                    <FileItem name="grid_logic/" isFolder indent />
                    <FileItem name="Optimizer.ts" active indent />
                    <FileItem name="GridNode.d.ts" indent />
                    <FileItem name="tests/" isFolder />
                </div>

                <div className="mt-auto p-4 border-t border-gray-900">
                    <div className="text-[10px] text-gray-500 font-mono mb-2">MISSION BRIEF</div>
                    <p className="text-xs text-gray-400 leading-relaxed">{activeQuest.brief}</p>
                </div>
            </div>

            {/* MAIN EDITOR AREA */}
            <div className="flex-1 flex flex-col bg-[#0c0c0c] relative">
                {/* TAB BAR */}
                <div className="flex items-center justify-between bg-[#0a0a0a] border-b border-gray-800 px-4">
                    <div className="flex">
                        <div className="px-4 py-2 text-xs font-mono text-cyan-400 bg-[#0c0c0c] border-t-2 border-cyan-400 flex items-center gap-2">
                            <span className="text-blue-400">TS</span> Optimizer.ts
                        </div>
                    </div>
                </div>

                {/* EDITOR + CONSOLE SPLIT */}
                <div className="flex-1 flex flex-col">
                    {/* EDITABLE TEXTAREA */}
                    <div className="flex-1 relative">
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full h-full bg-[#0c0c0c] text-gray-300 font-mono text-sm p-6 resize-none outline-none selection:bg-cyan-900/50"
                            spellCheck={false}
                        />
                        {/* Line Numbers (Fake visual) */}
                        <div className="absolute top-6 left-2 text-right text-gray-800 font-mono text-sm select-none pointer-events-none w-6 leading-relaxed">
                            {code.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
                        </div>
                    </div>

                    {/* TERMINAL UI */}
                    <div className="h-48 border-t border-gray-800 bg-[#050505] p-4 font-mono text-xs overflow-y-auto">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-500 uppercase tracking-wider font-bold">Terminal</span>
                            {status === 'SUCCESS' && <span className="text-green-500 font-bold">BUILD SUCCESSFUL</span>}
                            {status === 'ERROR' && <span className="text-red-500 font-bold">BUILD FAILED</span>}
                        </div>
                        <div className="space-y-1">
                            {consoleOutput.map((line, i) => (
                                <div key={i} className={`${line.includes('PASS') ? 'text-green-400' : line.includes('FAIL') ? 'text-red-400' : line.includes('Hint') ? 'text-yellow-400' : 'text-gray-400'}`}>
                                    {line}
                                </div>
                            ))}
                            {status === 'RUNNING' && <div className="text-cyan-400 animate-pulse">_</div>}
                        </div>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="p-4 border-t border-gray-800 bg-[#0a0a0a] flex justify-end gap-3 z-10">
                    <button
                        onClick={() => setCode(`// Task: Optimize solar grid distribution
// Input: Array of GridNodes
// Output: Active Node IDs

export const handleSync = (nodes) => {
  return nodes
    .filter(n => n.isActive)
    .map(n => n.id);
};`)}
                        className="px-4 py-3 text-gray-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                    >
                        Reset / Hint
                    </button>

                    {status === 'SUCCESS' ? (
                        <button
                            onClick={onComplete}
                            className="px-8 py-3 rounded bg-green-500 text-black text-xs font-black uppercase tracking-widest hover:bg-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)] animate-pulse"
                        >
                            Submit & Claim Rewards
                        </button>
                    ) : (
                        <button
                            onClick={handleRun}
                            disabled={status === 'RUNNING'}
                            className={`px-6 py-3 rounded bg-blue-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all ${status === 'RUNNING' ? 'opacity-50 cursor-wait' : ''}`}
                        >
                            {status === 'RUNNING' ? 'Compiling...' : 'Run Analysis'}
                        </button>
                    )}
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
