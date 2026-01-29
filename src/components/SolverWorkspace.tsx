import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SubmissionModal from './SubmissionModal';

const SolverWorkspace: React.FC = () => {
    const { id } = useParams();
    const [isComplete, setIsComplete] = useState(false);
    const [showSubmission, setShowSubmission] = useState(false);

    // Detect if this is the first/onboarding bounty (calibration)
    const isCalibrationComplete = localStorage.getItem('calibration_complete') === 'true';
    const isFirstBounty = localStorage.getItem('first_bounty_completed') !== 'true';
    const isOnboarding = isCalibrationComplete && isFirstBounty;

    // Mock Quest Data lookup based on ID
    const questTitle = id === "1" ? "Clean Climate Data Set" : "Unknown Quest";

    return (
        <div style={{ padding: '80px 20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: '1200px', marginBottom: '24px' }}>
                <Link to="/" style={{ color: '#888', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                    <span>←</span> BACK TO FEED
                </Link>
            </div>

            <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '8px', textTransform: 'uppercase', fontStyle: 'italic' }}>
                        Solver Workspace
                    </h1>
                    <p style={{ color: 'var(--accent-neon)', fontFamily: 'monospace' }}>
                        ACTIVE PROTOCOL: {questTitle}
                    </p>
                </div>
                <div className="glass" style={{ padding: '12px 24px', borderRadius: '50px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>STATUS: </span>
                    <span style={{ color: isComplete ? '#00ffca' : '#ffaa00', fontWeight: 800 }}>
                        {isComplete ? 'COMPLETED' : 'IN PROGRESS'}
                    </span>
                </div>
            </div>

            <div style={{ width: '100%', maxWidth: '1200px', flex: 1 }}>
                {!isComplete ? (
                    <div className="flex flex-col gap-6">
                        {/* THE SANDBOX INTERFACE (Inlined) */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[500px]">
                            {/* File Explorer Sidebar */}
                            <div className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-4 font-mono text-xs overflow-y-auto">
                                <div className="text-slate-600 mb-4 uppercase tracking-widest font-bold">Filesystem</div>
                                <div className="space-y-2">
                                    <div className="text-emerald-500 flex items-center gap-2">📁 src/</div>
                                    <div className="text-emerald-400 flex items-center gap-2 pl-4">📁 components/</div>
                                    <div className="text-cyan-400 flex items-center gap-2 pl-8 border-l border-cyan-500/30 font-bold bg-cyan-500/5 px-2 py-1 rounded">📄 LogicController.ts</div>
                                    <div className="text-slate-400 flex items-center gap-2 pl-4">📁 assets/</div>
                                    <div className="text-slate-400 flex items-center gap-2">📄 package.json</div>
                                    <div className="text-slate-400 flex items-center gap-2">📄 tsconfig.json</div>
                                </div>
                            </div>

                            {/* Code Editor Body */}
                            <div className="flex-1 flex flex-col min-w-0">
                                <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center gap-4 text-xs font-mono">
                                    <span className="text-cyan-400">LogicController.ts</span>
                                    <span className="text-slate-600">|</span>
                                    <span className="text-slate-500">Read-Only Check-out</span>
                                </div>
                                <div className="flex-1 bg-black p-6 font-mono text-sm overflow-auto text-slate-300 leading-relaxed">
                                    <div className="opacity-50 select-none">
                                        <span className="text-purple-400">import</span> &#123; Engine &#125; <span className="text-purple-400">from</span> <span className="text-emerald-400">"@world-engine/core"</span>;<br />
                                        <br />
                                        <span className="text-slate-500">// TODO: Optimize this transition logic</span><br />
                                        <span className="text-purple-400">export const</span> <span className="text-cyan-400">handleSync</span> = () =&gt; &#123;<br />
                                        &nbsp;&nbsp;<span className="text-purple-400">const</span> state = Engine.<span className="text-cyan-400">getState</span>();<br />
                                    </div>
                                    <div className="bg-emerald-500/10 border-l-2 border-emerald-500 px-4 py-2 my-2">
                                        &nbsp;&nbsp;<span className="text-emerald-400 font-bold">// FIX: Reduce render iterations by batching state updates</span><br />
                                        &nbsp;&nbsp;<span className="text-purple-400">return</span> state.<span className="text-cyan-400">map</span>(item =&gt; item.<span className="text-cyan-400">id</span>).<span className="text-cyan-400">filter</span>(Boolean);
                                    </div>
                                    <div className="opacity-50 select-none">
                                        &#125;;
                                    </div>
                                </div>
                                <div className="bg-slate-900 p-4 border-t border-slate-800 flex justify-end gap-3">
                                    <button className="px-4 py-2 bg-slate-800 text-slate-400 rounded-lg text-xs font-bold hover:text-white transition">RUN TESTS</button>
                                    <button
                                        onClick={() => setShowSubmission(true)}
                                        className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg text-xs font-bold hover:shadow-lg hover:shadow-cyan-500/20 transition"
                                    >
                                        VERIFY & SUBMIT
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Terminal / Sage Feedback */}
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs">
                            <div className="flex items-center gap-2 mb-2 text-slate-500">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                NEURAL INTERFACE STATUS: CONNECTED
                            </div>
                            <div className="text-cyan-400 font-bold mb-1">[SAGE]: ANALYSIS COMPLETE.</div>
                            <div className="text-slate-400 leading-relaxed">
                                Solution optimization detected. Batched updates will reduce main-thread blocking by 40%. Recommend immediate submission to the Guardian Ledger.
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="glass" style={{ padding: '80px', borderRadius: '32px', textAlign: 'center', border: '1px solid var(--accent-neon)' }}>
                        <div style={{ fontSize: '5rem', marginBottom: '24px' }}>✅</div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '16px', color: 'white' }}>Mission Accomplished</h2>
                        <p style={{ color: '#aaa', marginBottom: '40px' }}>
                            Your solution has been verified by the Engine Guardian. Payment has been released to your wallet.
                        </p>
                        <Link to="/" style={{
                            padding: '16px 48px',
                            background: 'white',
                            color: 'black',
                            fontWeight: 900,
                            borderRadius: '50px',
                            textDecoration: 'none',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                        }}>
                            Return to Feed
                        </Link>
                    </div>
                )}
            </div>

            {/* Submission Modal */}
            <SubmissionModal
                isOpen={showSubmission}
                onClose={() => setShowSubmission(false)}
                onSubmit={() => {
                    setShowSubmission(false);
                    setIsComplete(true);
                    // Mark first bounty as completed so future submissions use full form
                    if (isOnboarding) {
                        localStorage.setItem('first_bounty_completed', 'true');
                    }
                }}
                questTitle={questTitle}
                isOnboarding={isOnboarding}
            />
        </div>
    );
};

export default SolverWorkspace;
