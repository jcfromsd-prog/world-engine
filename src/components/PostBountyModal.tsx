import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createBounty } from '../lib/supabase';

interface PostBountyModalProps {
    onClose: () => void;
    currentBalance: number;
    onPost: (cost: number) => void;
    onOpenCapital: () => void;
}

const PostBountyModal: React.FC<PostBountyModalProps> = ({
    onClose,
    currentBalance,
    onPost,
    onOpenCapital
}) => {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [legalAccepted, setLegalAccepted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Development');
    const reward = '$500.00'; // Fixed value, no need for usualState if not controlled

    // Bounty Cost
    const BOUNTY_COST = 500;

    const handleDeploy = async () => {
        if (!user) {
            alert('Please login to post a bounty.');
            return;
        }
        if (currentBalance < BOUNTY_COST) {
            return;
        }

        setIsSubmitting(true);
        try {
            await createBounty({
                client_id: user.id,
                title: title || "Untitled Bounty", // Fallback
                reward: reward,
                difficulty: 'Medium',
                category: category,
                time_estimate: '4 hours',
                status: 'open'
            });

            onPost(BOUNTY_COST);
            setStep(2); // Success state
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            console.error('Bounty creation failed:', err);
            alert('Failed to create bounty. Check console.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const hasFunds = currentBalance >= BOUNTY_COST;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl relative"
            >
                {step === 1 && (
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-2xl font-bold text-white">Deploy Engine Bounty</h2>
                            <button onClick={onClose} className="text-slate-500 hover:text-white">✕</button>
                        </div>

                        <div className="mb-6 space-y-4">
                            <div>
                                <label className="block text-xs uppercase text-slate-500 font-bold mb-1">Objective</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Optimize React rendering perfs..."
                                    className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase text-slate-500 font-bold mb-1">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none appearance-none"
                                    >
                                        <option value="Development">Development</option>
                                        <option value="Design">Design & Creative</option>
                                        <option value="Content">Writing & Content</option>
                                        <option value="Marketing">Marketing & Growth</option>
                                        <option value="Research">Research & Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs uppercase text-slate-500 font-bold mb-1">Difficulty</label>
                                    <div className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-white">
                                        Medium
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase text-slate-500 font-bold mb-1">Bounty Reward</label>
                                <div className="flex items-center gap-4 p-4 bg-slate-800 rounded border border-slate-700">
                                    <div className="text-2xl font-mono text-white">$500.00</div>
                                    <div className="text-xs text-slate-400">Fixed Price</div>
                                </div>
                            </div>
                        </div>

                        {!hasFunds ? (
                            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded mb-6 flex items-center justify-between">
                                <div className="text-red-400 text-sm">
                                    <strong>Insufficient Credits</strong><br />
                                    Balance: {currentBalance.toLocaleString()} / Req: 500
                                </div>
                                <button
                                    onClick={onOpenCapital}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-bold"
                                >
                                    ADD FUNDS
                                </button>
                            </div>
                        ) : (
                            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded mb-6 flex items-center justify-between">
                                <div className="text-emerald-400 text-sm">
                                    <strong>Funds Available</strong><br />
                                    Balance: {currentBalance.toLocaleString()}
                                </div>
                            </div>
                        )}

                        {/* Legal Checkbox */}
                        <div className="mb-6 flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="legal-check"
                                checked={legalAccepted}
                                onChange={(e) => setLegalAccepted(e.target.checked)}
                                className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
                            />
                            <label htmlFor="legal-check" className="text-xs text-slate-400 leading-snug cursor-pointer">
                                I agree to the <span className="text-white hover:underline">IP Transfer Policy</span> and confirm that I have the rights to disclose this problem.
                            </label>
                        </div>

                        <button
                            onClick={handleDeploy}
                            disabled={!hasFunds || !legalAccepted || isSubmitting}
                            className={`w-full py-4 rounded-lg font-bold text-lg tracking-widest transition-all ${hasFunds && legalAccepted
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                }`}
                        >
                            {isSubmitting ? "DEPLOYING..." : hasFunds ? "DEPLOY BOUNTY (-500)" : "RECHARGE REQUIRED"}
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                        <div className="text-6xl mb-6 animate-bounce">🚀</div>
                        <h2 className="text-3xl font-black text-white mb-2">DEPLOYED</h2>
                        <p className="text-slate-400">Your bounty is now live on the global feed.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default PostBountyModal;
