import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AgencyAgreementProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
}

const AgencyAgreement: React.FC<AgencyAgreementProps> = ({ isOpen, onClose, onAccept }) => {
    const [canAccept, setCanAccept] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (contentRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
            // Allow acceptance if scrolled to within 50px of bottom
            if (scrollHeight - scrollTop - clientHeight < 50) {
                setCanAccept(true);
            }
        }
    };

    // Reset scroll when opened
    useEffect(() => {
        if (isOpen && contentRef.current) {
            contentRef.current.scrollTop = 0;
            const timer = setTimeout(() => {
                setCanAccept(false);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-2xl bg-slate-900 border border-t-green-500/50 border-x-green-500/20 border-b-green-500/20 rounded-xl shadow-[0_0_50px_rgba(34,197,94,0.1)] overflow-hidden flex flex-col max-h-[80vh]"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-800 bg-black/40 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-white tracking-widest uppercase">
                                    <span className="text-green-500 mr-2">⚖️</span> Agency Covenant
                                </h2>
                                <p className="text-xs text-slate-400 font-mono mt-1">Review & Sign to Access the Neural Workforce</p>
                            </div>
                            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">✕</button>
                        </div>

                        {/* Scrollable Content */}
                        <div
                            ref={contentRef}
                            onScroll={handleScroll}
                            className="flex-1 overflow-y-auto p-8 space-y-6 text-slate-300 font-light leading-relaxed text-sm scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-black"
                        >
                            <div className="border border-green-500/20 p-4 rounded bg-green-900/5 mb-6">
                                <p className="font-mono text-xs text-green-400 text-center uppercase tracking-widest">
                                    Official Document • World Engine Protocol
                                </p>
                            </div>

                            <h3 className="text-lg font-bold text-white">WORLD ENGINE: Master Agency & Solver Agreement</h3>
                            <p className="opacity-70"><strong>Effective Date:</strong> January 29, 2026</p>
                            <p><strong>Between:</strong> MyBestPurpose.com (the "Agency") and The User (the "Solver").</p>

                            <section>
                                <h4 className="font-bold text-white mb-2">1. Nature of Relationship</h4>
                                <p>The Solver acknowledges that they are an Independent Contractor and not an employee, partner, or joint venturer of the Agency. The Solver is responsible for their own taxes, insurance, and equipment. The Agency provides the "World Engine" infrastructure to connect Solvers with external Job Markets (Adzuna, Upwork, Fiverr, etc.).</p>
                            </section>

                            <section>
                                <h4 className="font-bold text-white mb-2">2. The Sovereign Economic Split (Sovereign 2.0)</h4>
                                <p>By accepting a "Quest" on this platform, the Solver agrees to the following distribution of Gross Revenue received from the Client:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
                                    <li><strong className="text-emerald-400">45% Lead Solver Share:</strong> Distributed to the primary architect/executor.</li>
                                    <li><strong className="text-white">15% Support Squad:</strong> Peer-reviewers and audit specialists.</li>
                                    <li><strong className="text-white">10% Sovereign Ops:</strong> Founder income and operational overhead.</li>
                                    <li><strong className="text-red-400">10% Legal Defense:</strong> "War Chest" for regulatory protection.</li>
                                    <li><strong className="text-purple-400">10% AI Compute:</strong> R&D and Custom Model development.</li>
                                    <li><strong className="text-cyan-400">10% Growth Fund:</strong> Acquisition and expansion to 142 countries.</li>
                                </ul>
                            </section>

                            <section>
                                <h4 className="font-bold text-white mb-2">3. The "Grandma Test" & Quality Assurance</h4>
                                <p>The Agency's "Engine Sage" (AI Auditor) acts as the final arbiter of quality. Payments are only released once a solution has passed the Grandma Test: The output must be clear, actionable, and understandable by a non-technical end-user. The Agency reserves the right to withhold the 15% Levy and require revisions if the quality standards are not met.</p>
                            </section>

                            <section>
                                <h4 className="font-bold text-white mb-2">4. Intellectual Property (IP)</h4>
                                <p>Upon full payment, the IP of the "Solve" is transferred to the External Client. The Solver grants the Agency (MyBestPurpose.com) a perpetual, non-exclusive license to use the completed work as a "Verified Portfolio Case Study" within the World Engine ecosystem.</p>
                            </section>

                            <section>
                                <h4 className="font-bold text-white mb-2">5. Confidentiality & Non-Circumvention</h4>
                                <p>The Solver agrees not to contact the External Client directly or attempt to move the work off-platform to avoid the 15% Platform Levy. Any attempt to circumvent the World Engine will result in immediate account termination and forfeiture of pending balances.</p>
                            </section>

                            <section>
                                <h4 className="font-bold text-white mb-2">6. Termination & "Kill Switch"</h4>
                                <p>The Agency Owner retains the sovereign right to suspend or terminate access to the World Engine for any user who violates the "Grandma Test" quality standards or attempts to manipulate the economic engine.</p>
                            </section>

                            <div className="h-8" /> {/* Spacer for scroll detection */}
                        </div>

                        {/* Footer / Actions */}
                        <div className="p-6 border-t border-slate-800 bg-black/40 flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-xs text-slate-500 italic">
                                {canAccept ? "Document Read. Ready for Signature." : "Please scroll to the bottom to verify comprehension."}
                            </p>

                            <div className="flex gap-4 w-full md:w-auto">
                                <button
                                    onClick={onClose}
                                    className="flex-1 md:flex-none px-6 py-3 rounded-lg text-slate-400 hover:text-white transition-colors text-sm font-semibold"
                                >
                                    Decline
                                </button>
                                <button
                                    onClick={onAccept}
                                    disabled={!canAccept}
                                    className={`flex-1 md:flex-none px-8 py-3 rounded-lg font-bold tracking-wide transition-all ${canAccept
                                        ? "bg-green-500 text-black hover:bg-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                                        : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                                        }`}
                                >
                                    {canAccept ? "SEAL COVENANT" : "SCROLL TO SIGN"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AgencyAgreement;
