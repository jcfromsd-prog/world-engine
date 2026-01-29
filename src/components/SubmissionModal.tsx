import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    questTitle: string;
    isOnboarding?: boolean; // Simplified flow for first bounty
}

const SubmissionModal: React.FC<SubmissionModalProps> = ({ isOpen, onClose, onSubmit, questTitle, isOnboarding = false }) => {
    const [videoUrl, setVideoUrl] = useState('');
    const [repoUrl, setRepoUrl] = useState('');
    const [instructions, setInstructions] = useState('');
    const [watchedVideo, setWatchedVideo] = useState(false);
    const [testedDocs, setTestedDocs] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [quickSubmitConfirmed, setQuickSubmitConfirmed] = useState(false);

    const isValid = isOnboarding
        ? quickSubmitConfirmed  // Onboarding only needs confirmation
        : (videoUrl.length > 10 && repoUrl.length > 10 && instructions.length > 20 && watchedVideo && testedDocs);

    const handleSubmit = async () => {
        if (!isValid) return;

        setIsSubmitting(true);
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        onSubmit();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <span>📤</span> Submit Solution
                            </h2>
                            <p className="text-sm text-slate-400 mt-1">Protocol: <span className="text-cyan-400">{questTitle}</span></p>
                        </div>
                        <button onClick={onClose} className="text-slate-500 hover:text-white transition">✕</button>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">

                        {/* QUICK SUBMIT MODE for Onboarding */}
                        {isOnboarding ? (
                            <div className="text-center space-y-6">
                                <div className="inline-block p-4 rounded-full bg-emerald-500/20 text-5xl mb-2">
                                    🎉
                                </div>
                                <h3 className="text-2xl font-bold text-white">
                                    Congratulations, Solver!
                                </h3>
                                <p className="text-slate-400 max-w-md mx-auto">
                                    You've successfully completed your first calibration bounty.
                                    Since this was a tutorial, we've already recorded your proof of work.
                                </p>

                                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-left space-y-4">
                                    <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">What You Earned:</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-900 p-3 rounded-lg">
                                            <span className="text-xs text-slate-500">Bounty Reward</span>
                                            <p className="text-emerald-400 font-bold text-lg">$5.00</p>
                                        </div>
                                        <div className="bg-slate-900 p-3 rounded-lg">
                                            <span className="text-xs text-slate-500">XP Gained</span>
                                            <p className="text-cyan-400 font-bold text-lg">+25 XP</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                        <span className="text-purple-400">🏆</span>
                                        <span>Achievement Unlocked: <span className="text-purple-400 font-medium">First Blood</span></span>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border border-cyan-500/20 rounded-xl p-4">
                                    <p className="text-sm text-slate-300">
                                        <span className="text-cyan-400 font-bold">What's Next?</span> Browse the Global Feed for more bounties,
                                        or join a Squad for bigger challenges with higher rewards!
                                    </p>
                                </div>

                                <label className="flex items-center justify-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={quickSubmitConfirmed}
                                        onChange={(e) => setQuickSubmitConfirmed(e.target.checked)}
                                        className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
                                    />
                                    <span className={`text-sm transition-colors ${quickSubmitConfirmed ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                                        I'm ready to claim my reward and continue!
                                    </span>
                                </label>
                            </div>
                        ) : (
                            /* FULL SUBMISSION FORM for regular bounties */
                            <>
                                {/* 1. The Loom Video */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider">
                                        1. Proof of Work (Loom/Video URL) <span className="text-red-500">*</span>
                                    </label>
                                    <p className="text-xs text-slate-500 mb-2">Show us it works. If you can't satisfy the requirements in a 2-minute video, it will be rejected.</p>
                                    <input
                                        type="url"
                                        value={videoUrl}
                                        onChange={(e) => setVideoUrl(e.target.value)}
                                        placeholder="https://www.loom.com/share/..."
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-colors placeholder:text-slate-600"
                                    />
                                </div>

                                {/* 2. The Code */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider">
                                        2. Repository Link (GitHub/GitLab) <span className="text-red-500">*</span>
                                    </label>
                                    <p className="text-xs text-slate-500 mb-2">Where is the code? Ensure it is public or accessible to the Engine Auditor.</p>
                                    <input
                                        type="url"
                                        value={repoUrl}
                                        onChange={(e) => setRepoUrl(e.target.value)}
                                        placeholder="https://github.com/username/project"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-colors placeholder:text-slate-600"
                                    />
                                </div>

                                {/* 3. The Grandma Test */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider">
                                            3. Deployment Instructions (The "Grandma Test") <span className="text-red-500">*</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setInstructions(`Step 1: Clone the repository using "git clone [repo-url]"

Step 2: Open Terminal and navigate to the project folder

Step 3: Run "npm install" to install dependencies

Step 4: Run "npm run dev" to start the application

Step 5: Open your browser to http://localhost:5173

Step 6: Verify the batched state updates are reducing render cycles by 40%`)}
                                            className="text-xs bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full hover:bg-cyan-500/30 transition flex items-center gap-1"
                                        >
                                            🤖 Sage Auto-Fill
                                        </button>
                                    </div>
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg mb-2">
                                        <p className="text-xs text-yellow-300">
                                            <strong>⚠️ Requirement:</strong> Write this so a non-technical founder can run it.
                                            <br />Bad: <em>"Run npm install then build binary."</em>
                                            <br />Good: <em>"Step 1: Download file. Step 2: Open Terminal. Step 3: Type 'start'."</em>
                                        </p>
                                    </div>
                                    <textarea
                                        value={instructions}
                                        onChange={(e) => setInstructions(e.target.value)}
                                        placeholder="Step 1: ..."
                                        rows={6}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-colors placeholder:text-slate-600 resize-none font-mono text-sm"
                                    />
                                </div>

                                {/* Checkboxes */}
                                <div className="space-y-3 pt-4 border-t border-white/5">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={watchedVideo}
                                            onChange={(e) => setWatchedVideo(e.target.checked)}
                                            className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
                                        />
                                        <span className={`text-sm transition-colors ${watchedVideo ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                                            I have watched my own video and confirmed it demonstrates the requirements.
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={testedDocs}
                                            onChange={(e) => setTestedDocs(e.target.checked)}
                                            className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
                                        />
                                        <span className={`text-sm transition-colors ${testedDocs ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                                            I have tested these instructions myself on a clean environment.
                                        </span>
                                    </label>
                                </div>
                            </>
                        )}

                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-slate-900 border-t border-white/10 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 rounded-lg font-bold text-slate-400 hover:text-white transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!isValid || isSubmitting}
                            className={`px-8 py-3 rounded-lg font-bold text-white shadow-lg transition-all flex items-center gap-2 ${isValid && !isSubmitting
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-cyan-500/25 hover:scale-105'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    VERIFYING...
                                </>
                            ) : (
                                <>
                                    SUBMIT FOR AUDIT
                                </>
                            )}
                        </button>
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default SubmissionModal;
