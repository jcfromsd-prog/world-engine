import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Activity, Inbox, History, CheckCircle2, ChevronRight, XCircle, Clock, Loader2 } from 'lucide-react';

interface UserProfile {
    user_id: string;
    current_tier: number | null;
    reputation_tokens: number;
    cognitive_tier: number;
    swarm_validator_level: number;
}

interface SubmissionNode {
    skill_domain: string | null;
    tier: number | null;
}

interface Submission {
    submission_id: string;
    user_id: string;
    node_id: string;
    stake_tokens: number;
    status: 'pending' | 'in_swarm' | 'validated' | 'failed' | 'escalated';
    consensus_score: number;
    submitted_at: string;
    nodes?: SubmissionNode;
}

interface LedgerEntry {
    ledger_id: string;
    delta: number;
    reason: string;
    related_id: string | null;
    logged_at: string;
}

export const SwarmDashboard: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [mySubmissions, setMySubmissions] = useState<Submission[]>([]);
    const [inbox, setInbox] = useState<Submission[]>([]);
    const [ledger, setLedger] = useState<LedgerEntry[]>([]);
    const [activeTab, setActiveTab] = useState<'submissions' | 'inbox' | 'ledger'>('submissions');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [voteModalOpen, setVoteModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [voteScore, setVoteScore] = useState<number>(0.5);
    const [isSubmittingVote, setIsSubmittingVote] = useState(false);

    useEffect(() => {
        loadSwarmData();

        const subSubmissions = supabase
            .channel('submissions_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, loadSwarmData)
            .subscribe();

        const subLedger = supabase
            .channel('ledger_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'reputation_ledger' }, loadSwarmData)
            .subscribe();

        return () => {
            supabase.removeChannel(subSubmissions);
            supabase.removeChannel(subLedger);
        };
    }, []);

    const loadSwarmData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data: authData, error: authErr } = await supabase.auth.getUser();
            if (authErr || !authData.user) {
                setError('Authentication failed. Please log in again.');
                return;
            }
            const uid = authData.user.id;

            // Profile — uses user_id and EXACT fields from Schema Ground Truth
            const { data: userProfile, error: profileErr } = await supabase
                .from('users')
                .select('user_id, current_tier, reputation_tokens, cognitive_tier, swarm_validator_level')
                .eq('user_id', uid)
                .single();

            // 42P01 = relation does not exist; 42703 = column does not exist; PGRST116 = no rows
            if (profileErr && profileErr.code !== 'PGRST116' && profileErr.code !== '42703' && profileErr.code !== '42P01') {
                throw profileErr;
            }

            if (userProfile) {
                setProfile(userProfile);
            }

            // My Submissions — select with node join for domain + tier
            const { data: subs } = await supabase
                .from('submissions')
                .select('*, nodes(skill_domain, tier)')
                .eq('user_id', uid)
                .order('submitted_at', { ascending: false });
            if (subs) setMySubmissions(subs as unknown as Submission[]);

            // Ledger — uses Schema Ground Truth columns
            const { data: ledgerEntries } = await supabase
                .from('reputation_ledger')
                .select('ledger_id, user_id, delta, reason, related_id, logged_at')
                .eq('user_id', uid)
                .order('logged_at', { ascending: false })
                .limit(10);
            if (ledgerEntries) setLedger(ledgerEntries as unknown as LedgerEntry[]);

            // ELIGIBILITY GATE: Inbox (validator only)
            // Directive Section 8: swarm_validator_level >= 1 to access Inbox Queue
            // Directive Section 14: filter by current_tier >= submission node tier
            // Validator cannot vote on own submissions (.neq('user_id', uid))
            // Inbox query: .eq('status', 'in_swarm')
            if (userProfile && userProfile.swarm_validator_level >= 1) {
                const { data: inboxSubs } = await supabase
                    .from('submissions')
                    .select('*, nodes(skill_domain, tier)')
                    .eq('status', 'in_swarm')
                    .neq('user_id', uid)
                    .order('submitted_at', { ascending: false });

                if (inboxSubs) {
                    // CLIENT-SIDE ELIGIBILITY GATE:
                    // A validator should only see submissions where the
                    // node's tier is LESS THAN OR EQUAL TO the validator's own current_tier.
                    // This prevents a Tier 1 user from validating Tier 5 work.
                    const validatorTier = userProfile.current_tier || 1;
                    const filtered = (inboxSubs as unknown as Submission[]).filter(sub => {
                        const nodeTier = sub.nodes?.tier;
                        // If node tier is unknown (null), allow it (conservative — don't block)
                        if (nodeTier == null) return true;
                        return nodeTier <= validatorTier;
                    });
                    setInbox(filtered);
                }
            }
        } catch (err: any) {
            console.error('Swarm Load Error:', err);
            setError(err?.message || 'Unexpected error loading Swarm data.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitVote = async () => {
        if (!selectedSubmission || !profile || isSubmittingVote) return;
        setIsSubmittingVote(true);
        try {
            // Insert vote via swarm_votes table — Schema Ground Truth:
            // submission_id, validator_id, score (int4), confidence_weight (numeric)
            const { error: voteError } = await supabase.from('swarm_votes').insert({
                submission_id: selectedSubmission.submission_id,
                validator_id: profile.user_id,
                score: voteScore,
                confidence_weight: profile.reputation_tokens > 0 ? profile.reputation_tokens : 1,
            });

            if (voteError) {
                if (voteError.code === '23505') {
                    alert('You have already voted on this submission.');
                } else {
                    alert(`Vote failed: ${voteError.message}`);
                }
            } else {
                // Award the validator reputation for casting the vote
                const { error: rpcError } = await supabase.rpc('award_reputation_delta', {
                    p_user_id: profile.user_id,
                    p_delta: 10,
                    p_reason: 'validation_earned',
                    p_submission_id: selectedSubmission.submission_id
                });

                if (rpcError) {
                    console.error("Failed to sync validator reputation reward:", rpcError);
                }

                setVoteModalOpen(false);
                setSelectedSubmission(null);
                setVoteScore(0.5);
                await loadSwarmData();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmittingVote(false);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'validated': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'failed': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'in_swarm': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'escalated': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-[200] bg-slate-950 flex items-center justify-center font-mono">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    <div className="text-emerald-500 animate-pulse text-xl tracking-widest">Connecting to Intelligence Swarm...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 z-[200] bg-slate-950 flex items-center justify-center font-mono p-8">
                <div className="text-center">
                    <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-400 text-sm">{error}</p>
                    <button onClick={loadSwarmData} className="mt-4 px-6 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm hover:bg-slate-700 transition-colors">
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[200] bg-slate-950 text-slate-200 font-sans overflow-y-auto w-full custom-scrollbar">
            <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 pb-24 relative">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-black text-white tracking-widest uppercase flex items-center gap-3">
                        <Shield className="w-8 h-8 text-emerald-400" />
                        Intelligence Swarm
                    </h1>
                    {onClose && (
                        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors font-mono text-sm">
                            [ TERMINATE LINK ]
                        </button>
                    )}
                </div>

                {profile && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">Operation Tier</span>
                            <div className="flex items-end gap-2">
                                <span className="text-5xl font-black text-white">{profile.current_tier || 1}</span>
                                <span className="text-slate-600 font-semibold pb-1">/ 5</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-4 overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: `${((profile.current_tier || 1) / 5) * 100}%` }} />
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">Reputation Tokens</span>
                            <div className="text-4xl font-black text-emerald-400">{profile.reputation_tokens.toFixed(1)}</div>
                            <span className="text-xs font-mono text-emerald-500/70 mt-2 flex items-center gap-1">
                                <Activity className="w-3 h-3" /> System Weight Active
                            </span>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Cognitive Tier</span>
                                <span className="text-xs font-mono font-bold text-slate-400">{profile.cognitive_tier.toFixed(2)}</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full mt-2 overflow-hidden flex">
                                <div className="h-full transition-all" style={{
                                    width: `${profile.cognitive_tier * 100}%`,
                                    backgroundColor: profile.cognitive_tier < 0.3 ? '#10b981' : profile.cognitive_tier > 0.7 ? '#ef4444' : '#f59e0b'
                                }} />
                            </div>
                            <span className="text-[10px] text-slate-600 mt-3 block">High apathy restricts validator influence.</span>
                        </div>

                        <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center shadow-[0_4px_20px_rgba(0,0,0,0.5)] overflow-hidden">
                            {profile.swarm_validator_level >= 1 && (
                                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-bl-full flex items-start justify-end p-2 border-b border-l border-blue-500/20">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]" />
                                </div>
                            )}
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">Validator Protocol</span>
                            <div className="text-3xl font-black text-white">Tier {profile.swarm_validator_level}</div>
                            {profile.swarm_validator_level >= 1 ? (
                                <span className="text-xs font-mono text-blue-400 mt-2 font-bold tracking-tight">Active Consensus Node</span>
                            ) : (
                                <span className="text-xs font-mono text-slate-500 mt-2 tracking-tight">Earn reputation to validate</span>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex gap-4 border-b border-slate-800 pb-px">
                    <button onClick={() => setActiveTab('submissions')} className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'submissions' ? 'text-white border-emerald-500' : 'text-slate-500 border-transparent hover:text-slate-300'}`}>My Submissions</button>
                    {profile && profile.swarm_validator_level >= 1 && (
                        <button onClick={() => setActiveTab('inbox')} className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 ${activeTab === 'inbox' ? 'text-white border-blue-500' : 'text-slate-500 border-transparent hover:text-slate-300'}`}>
                            <Inbox className="w-4 h-4" /> Inbox Queue {inbox.length > 0 && <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full">{inbox.length}</span>}
                        </button>
                    )}
                    <button onClick={() => setActiveTab('ledger')} className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'ledger' ? 'text-white border-emerald-500' : 'text-slate-500 border-transparent hover:text-slate-300'}`}>Ledger</button>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'submissions' && (
                        <motion.div key="submissions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                            {mySubmissions.length === 0 ? (
                                <div className="p-12 border border-dashed border-slate-800 rounded-2xl text-center">
                                    <Clock className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                                    <p className="text-slate-500 font-mono text-sm">No node submissions found in your vault.</p>
                                </div>
                            ) : (
                                mySubmissions.map(sub => (
                                    <div key={sub.submission_id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusStyle(sub.status)}`}>
                                                    {sub.status.replace('_', ' ')}
                                                </span>
                                                <span className="text-xs text-slate-500 font-mono">{new Date(sub.submitted_at).toLocaleDateString()}</span>
                                            </div>
                                            <h3 className="text-white font-bold">{sub.nodes?.skill_domain || 'Unknown Node Domain'}</h3>
                                            {sub.nodes?.tier != null && (
                                                <p className="text-slate-500 text-xs mt-1 font-mono">Node Tier: {sub.nodes.tier}</p>
                                            )}
                                        </div>
                                        <div className="w-full md:w-64">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">Consensus</span>
                                                <span className="text-xs font-mono font-bold text-white">{(sub.consensus_score * 100).toFixed(0)}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all ${sub.consensus_score >= 0.7 ? 'bg-emerald-500' : sub.consensus_score <= 0.3 ? 'bg-red-500' : 'bg-blue-500'}`}
                                                    style={{ width: `${sub.consensus_score * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'inbox' && (
                        <motion.div key="inbox" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                            {inbox.length === 0 ? (
                                <div className="p-12 border border-dashed border-slate-800 rounded-2xl text-center">
                                    <CheckCircle2 className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                                    <p className="text-slate-500 font-mono text-sm">Inbox clear. The swarm is at peace.</p>
                                </div>
                            ) : (
                                inbox.map(item => (
                                    <div key={item.submission_id} className="bg-slate-900 border border-blue-500/20 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_0_15px_rgba(59,130,246,0.05)] hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                                <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-widest">Awaiting Evaluation</span>
                                                <span className="text-xs text-slate-500 font-mono">{new Date(item.submitted_at).toLocaleTimeString()}</span>
                                            </div>
                                            <h3 className="text-white font-bold text-lg mb-1">{item.nodes?.skill_domain || 'Node Evaluation'}</h3>
                                            <div className="flex items-center gap-3">
                                                <p className="text-slate-400 text-xs">Submission: {item.submission_id.slice(0, 8)}...</p>
                                                {item.nodes?.tier != null && (
                                                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                                        Tier {item.nodes.tier}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => { setSelectedSubmission(item); setVoteModalOpen(true); }}
                                            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 transition-colors"
                                        >
                                            Evaluate <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'ledger' && (
                        <motion.div key="ledger" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-2">
                            {ledger.length === 0 ? (
                                <div className="p-12 border border-dashed border-slate-800 rounded-2xl text-center">
                                    <History className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                                    <p className="text-slate-500 font-mono text-sm">No ledger history.</p>
                                </div>
                            ) : (
                                ledger.map(entry => (
                                    <div key={entry.ledger_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-900 border border-slate-800/50 rounded-lg hover:bg-slate-800/50 transition-colors">
                                        <div className="flex items-start sm:items-center gap-4">
                                            <span className={`px-3 py-1 rounded text-xs font-bold font-mono ${entry.delta >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                                {entry.delta > 0 ? '+' : ''}{entry.delta} REP
                                            </span>
                                            <span className="text-sm text-slate-300 font-medium">{entry.reason}</span>
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-mono mt-2 sm:mt-0 tracking-widest uppercase">
                                            {new Date(entry.logged_at).toLocaleString()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {voteModalOpen && selectedSubmission && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                        <motion.div
                            initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }}
                            className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative"
                        >
                            <button disabled={isSubmittingVote} onClick={() => { setVoteModalOpen(false); setSelectedSubmission(null); setVoteScore(0.5); }} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors disabled:opacity-50">
                                <XCircle className="w-6 h-6" />
                            </button>

                            <div className="mb-8">
                                <span className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2 block">Validator Console</span>
                                <h2 className="text-2xl font-black text-white">Evaluate Submission</h2>
                                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                                    You are staking your reputation by validating this output. Ensure it meets the exact rubric standards for the specified node domain.
                                </p>
                            </div>

                            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-8">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Domain</span>
                                    <span className="text-sm text-white font-bold">{selectedSubmission.nodes?.skill_domain}</span>
                                </div>
                                {selectedSubmission.nodes?.tier != null && (
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Node Tier</span>
                                        <span className="text-sm text-white font-bold">{selectedSubmission.nodes.tier}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Current Consensus</span>
                                    <span className="text-sm text-yellow-400 font-mono">{(selectedSubmission.consensus_score * 100).toFixed(0)}%</span>
                                </div>
                            </div>

                            <div className="mb-8 relative">
                                <label className="flex justify-between items-center mb-4">
                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Your Verdict Score</span>
                                    <span className={`text-xl font-black font-mono ${voteScore >= 0.7 ? 'text-emerald-400' : voteScore <= 0.3 ? 'text-red-400' : 'text-blue-400'}`}>
                                        {(voteScore * 100).toFixed(0)}%
                                    </span>
                                </label>
                                <input
                                    type="range"
                                    min="0" max="1" step="0.05"
                                    value={voteScore}
                                    onChange={(e) => setVoteScore(parseFloat(e.target.value))}
                                    disabled={isSubmittingVote}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50"
                                />
                                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2 font-bold">
                                    <span>REJECT (0%)</span>
                                    <span>NEUTRAL (50%)</span>
                                    <span>APPROVE (100%)</span>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmitVote}
                                disabled={isSubmittingVote}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:shadow-none flex items-center justify-center gap-3"
                            >
                                {isSubmittingVote ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Transmitting...
                                    </>
                                ) : (
                                    'Submit Cryptographic Vote'
                                )}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
