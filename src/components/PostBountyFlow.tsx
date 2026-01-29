import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { createBountyEscrow, formatCurrency, calculatePlatformFee } from '../lib/stripe';

interface PostBountyFlowProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (bountyId: string) => void;
}

type Step = 'details' | 'review' | 'payment' | 'success';

const PostBountyFlow: React.FC<PostBountyFlowProps> = ({ isOpen, onClose, onSuccess }) => {
    const [step, setStep] = useState<Step>('details');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [bountyId, setBountyId] = useState<string | null>(null);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [requirements, setRequirements] = useState('');
    const [category, setCategory] = useState('General');
    const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
    const [rewardAmount, setRewardAmount] = useState(50); // in dollars
    const [timeEstimate, setTimeEstimate] = useState('1-2 hours');

    const rewardCents = rewardAmount * 100;
    const { platformFee, solverReceives } = calculatePlatformFee(rewardCents);

    const handleSubmitDetails = async () => {
        if (!title || !description || rewardAmount < 5) {
            setError('Please fill in all required fields. Minimum bounty is $5.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setError('Please sign in to post a bounty');
                return;
            }

            // Create bounty in database (draft status)
            const { data: bounty, error: dbError } = await supabase
                .from('company_bounties')
                .insert({
                    company_id: user.id,
                    title,
                    description,
                    requirements,
                    category,
                    difficulty,
                    reward_amount: rewardCents,
                    time_estimate: timeEstimate,
                    status: 'draft'
                })
                .select()
                .single();

            if (dbError) throw dbError;

            setBountyId(bounty.id);
            setStep('review');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create bounty');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFundBounty = async () => {
        if (!bountyId) return;

        setIsLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setError('Please sign in');
                return;
            }

            // Create escrow payment intent
            const result = await createBountyEscrow({
                bountyId,
                amount: rewardCents,
                title,
                companyId: user.id
            });

            if (!result.success) {
                throw new Error(result.error || 'Failed to create escrow');
            }

            // In production, you'd use Stripe Elements here
            // For now, simulate successful payment
            setStep('payment');

            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Update bounty to live
            await supabase
                .from('company_bounties')
                .update({
                    status: 'live',
                    escrow_status: 'funded'
                })
                .eq('id', bountyId);

            setStep('success');

            if (onSuccess) {
                onSuccess(bountyId);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Payment failed');
            setStep('review');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setStep('details');
        setTitle('');
        setDescription('');
        setRequirements('');
        setError(null);
        setBountyId(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-emerald-900/30 to-cyan-900/30">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <span>💼</span> Post a Bounty
                            </h2>
                            <p className="text-sm text-slate-400 mt-1">
                                {step === 'details' && 'Step 1: Define the work'}
                                {step === 'review' && 'Step 2: Review & Fund'}
                                {step === 'payment' && 'Step 3: Processing Payment'}
                                {step === 'success' && 'Bounty Live!'}
                            </p>
                        </div>
                        <button onClick={handleClose} className="text-slate-500 hover:text-white transition">✕</button>
                    </div>

                    {/* Content */}
                    <div className="p-6 max-h-[70vh] overflow-y-auto">
                        {error && (
                            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Step 1: Details */}
                        {step === 'details' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-1">Title *</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Build an API integration for..."
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-1">Description *</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Describe the problem and expected outcome..."
                                        rows={4}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-1">Requirements</label>
                                    <textarea
                                        value={requirements}
                                        onChange={(e) => setRequirements(e.target.value)}
                                        placeholder="- Must include tests&#10;- TypeScript required&#10;- Documentation needed"
                                        rows={3}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none resize-none font-mono text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-300 mb-1">Category</label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
                                        >
                                            <option>General</option>
                                            <option>Frontend</option>
                                            <option>Backend</option>
                                            <option>Data</option>
                                            <option>AI/ML</option>
                                            <option>DevOps</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-300 mb-1">Difficulty</label>
                                        <select
                                            value={difficulty}
                                            onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
                                        >
                                            <option>Easy</option>
                                            <option>Medium</option>
                                            <option>Hard</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-300 mb-1">Time Estimate</label>
                                        <select
                                            value={timeEstimate}
                                            onChange={(e) => setTimeEstimate(e.target.value)}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
                                        >
                                            <option>30 mins</option>
                                            <option>1-2 hours</option>
                                            <option>Half day</option>
                                            <option>1 day</option>
                                            <option>2-3 days</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-1">Bounty Reward (USD) *</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl text-white">$</span>
                                        <input
                                            type="number"
                                            value={rewardAmount}
                                            onChange={(e) => setRewardAmount(Math.max(5, parseInt(e.target.value) || 0))}
                                            min={5}
                                            className="w-32 bg-slate-800 border border-slate-700 rounded-lg p-3 text-2xl font-mono text-emerald-400 focus:border-cyan-500 outline-none"
                                        />
                                        <span className="text-slate-500 text-sm">Min: $5</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Review */}
                        {step === 'review' && (
                            <div className="space-y-6">
                                <div className="bg-slate-800/50 rounded-xl p-4 space-y-3">
                                    <h3 className="text-lg font-bold text-white">{title}</h3>
                                    <p className="text-slate-400 text-sm">{description}</p>
                                    <div className="flex gap-2">
                                        <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded">{category}</span>
                                        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">{difficulty}</span>
                                        <span className="text-xs bg-slate-700 text-slate-400 px-2 py-1 rounded">{timeEstimate}</span>
                                    </div>
                                </div>

                                <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4">
                                    <h4 className="text-sm font-bold text-emerald-400 mb-3">Payment Summary</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Bounty Amount</span>
                                            <span className="text-white">{formatCurrency(rewardCents)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Platform Fee (10%)</span>
                                            <span className="text-slate-400">{formatCurrency(platformFee)}</span>
                                        </div>
                                        <div className="border-t border-slate-700 pt-2 flex justify-between font-bold">
                                            <span className="text-slate-300">Solver Receives</span>
                                            <span className="text-emerald-400">{formatCurrency(solverReceives)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                                    <p className="text-xs text-yellow-300">
                                        <strong>⚠️ Escrow:</strong> Funds will be held securely until the work is completed and approved.
                                        You can dispute or cancel within 48 hours of submission.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Payment Processing */}
                        {step === 'payment' && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-6" />
                                <h3 className="text-xl font-bold text-white mb-2">Processing Payment</h3>
                                <p className="text-slate-400">Securing funds in escrow...</p>
                            </div>
                        )}

                        {/* Step 4: Success */}
                        {step === 'success' && (
                            <div className="text-center py-8">
                                <div className="text-6xl mb-4">🎉</div>
                                <h3 className="text-2xl font-bold text-white mb-2">Bounty is Live!</h3>
                                <p className="text-slate-400 mb-6">
                                    Your bounty is now visible to solvers worldwide.
                                    You'll be notified when someone claims it.
                                </p>
                                <div className="bg-slate-800 rounded-lg p-4 inline-block">
                                    <p className="text-sm text-slate-500">Bounty ID</p>
                                    <p className="text-cyan-400 font-mono">{bountyId?.slice(0, 8)}...</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-slate-800/50 border-t border-white/10 flex justify-end gap-3">
                        {step === 'details' && (
                            <>
                                <button onClick={handleClose} className="px-6 py-3 rounded-lg font-bold text-slate-400 hover:text-white transition">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitDetails}
                                    disabled={isLoading}
                                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg transition disabled:opacity-50"
                                >
                                    {isLoading ? 'Creating...' : 'Continue to Review'}
                                </button>
                            </>
                        )}

                        {step === 'review' && (
                            <>
                                <button onClick={() => setStep('details')} className="px-6 py-3 rounded-lg font-bold text-slate-400 hover:text-white transition">
                                    Back
                                </button>
                                <button
                                    onClick={handleFundBounty}
                                    disabled={isLoading}
                                    className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-lg hover:shadow-lg transition disabled:opacity-50"
                                >
                                    {isLoading ? 'Processing...' : `Fund Bounty (${formatCurrency(rewardCents)})`}
                                </button>
                            </>
                        )}

                        {step === 'success' && (
                            <button
                                onClick={handleClose}
                                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg transition"
                            >
                                Done
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PostBountyFlow;
