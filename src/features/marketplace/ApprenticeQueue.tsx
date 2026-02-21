import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Briefcase, ChevronRight, CheckCircle } from 'lucide-react';
import type { LearnerProfile } from '../../engines/world-engine/LearnerModel';
import { ContractWorkspace } from './ContractWorkspace';
import { verifyAndLedgerMission } from '../../services/PayoutEngine';

// Priority: define tiers and SDI mapping
const TIER_LEVELS: Record<string, number> = {
    'SPROUTS': 1,
    'BUILDERS': 2,
    'TRAILBLAZERS': 3,
    'EXPLORERS': 4,
    'VOYAGERS': 5
};

const SDI_REQUIREMENTS: Record<number, number> = {
    3: 2, // Trailblazer needs SDI 2
    4: 3, // Explorer needs SDI 3
    5: 4  // Voyager needs SDI 4
};

export interface BountyTask {
    id: string;
    tier: number; // 1-5
    title: string;
    description: string;
    rewardType: 'VERIFICATION' | 'ARTIFACT' | 'CASH';
    rewardValue: string;
    client: string;
    tags: string[];
    requiredArtifacts?: string[];
}

const BOUNTY_LIST: BountyTask[] = [
    {
        id: 'b-001',
        tier: 3,
        title: 'Beta Test: Physics Engine Collision Bug',
        description: 'Verify collision detection reliability in the new module. Report edge cases.',
        rewardType: 'VERIFICATION',
        rewardValue: 'Logic Artifact #882',
        client: 'Simulacra Systems',
        tags: ['QA', 'Physics', 'Bug Hunt'],
        requiredArtifacts: []
    },
    {
        id: 'b-002',
        tier: 4,
        title: 'Data Cleanup: NGSS Tagging',
        description: 'Review and tag 50 curriculum items with appropriate NGSS standards.',
        rewardType: 'ARTIFACT',
        rewardValue: 'Portfolio Token [NGSS]',
        client: 'Global Education Initiative',
        tags: ['Data Science', 'Education', 'NLP'],
        requiredArtifacts: []
    },
    {
        id: 'b-003',
        tier: 5,
        title: 'Frontend Optimization: React Render Cycle',
        description: 'Optimize the main dashboard to reduce re-renders by 40%.',
        rewardType: 'CASH',
        rewardValue: '$50.00',
        client: 'TechFlow Inc.',
        tags: ['React', 'Performance', 'Engineering'],
        requiredArtifacts: ['cert.python.basic']
    }
];

interface ApprenticeQueueProps {
    profile: LearnerProfile;
    onProfileUpdate?: (profile: LearnerProfile) => void;
}

export const ApprenticeQueue: React.FC<ApprenticeQueueProps> = ({ profile, onProfileUpdate }) => {
    // Determine user's numeric tier level
    const userTierLevel = TIER_LEVELS[profile.currentTier] || 1;
    const [acceptedContracts, setAcceptedContracts] = React.useState<string[]>(profile.activeContracts || []);
    const [completedContracts, setCompletedContracts] = React.useState<string[]>(profile.completedMissions || []);
    const [activeWorkspaceTask, setActiveWorkspaceTask] = React.useState<BountyTask | null>(null);

    const handleAcceptTask = (task: BountyTask) => {
        // 0. Idempotency Guard: Prevent duplicate accepts
        if (acceptedContracts.includes(task.id)) return;

        // 1. Atomic Check: Calibration Score
        if (profile.calibrationScore < 90) {
            alert(`🚫 CONTRACT REJECTED\n\nTRUST SCORE TOO LOW.\nRequired: 90%\nCurrent: ${profile.calibrationScore}%\n\nComplete more verified missions to increase trust.`);
            return;
        }

        // 2. Atomic Check: Verified Artifacts
        if (task.requiredArtifacts && task.requiredArtifacts.length > 0) {
            const missing = task.requiredArtifacts.filter(req =>
                !profile.verifiedCompetencies.some(c => c.competencyId === req)
            );

            if (missing.length > 0) {
                alert(`🚫 CONTRACT REJECTED\n\nMISSING VERIFIED ARTIFACTS:\n${missing.join(', ')}\n\nVisit the Academy to earn these credentials.`);
                return;
            }
        }

        // 3. Handshake Protocol
        if (confirm(`🤝 INITIATE SMART CONTRACT?\n\nClient: ${task.client}\nReward: ${task.rewardValue}\n\nFunds will be held in escrow until verification.`)) {
            setAcceptedContracts(prev => [...prev, task.id]);
            alert(`✅ CONTRACT ACTIVE\n\nYou have 24 hours to submit your deliverables.`);
        }
    };

    const handleOpenWorkspace = (task: BountyTask) => {
        setActiveWorkspaceTask(task);
    };

    const handleContractComplete = async () => {
        if (!activeWorkspaceTask) return;

        const taskId = activeWorkspaceTask.id;

        // 1. Process Payout (Identity + Artifacts) — NOW VERIFIED & LEDGERED
        const result = await verifyAndLedgerMission(
            `contract_${taskId}`,
            profile,
            { competencies: ['artifact_service_record'] },
            {
                id: taskId,
                title: activeWorkspaceTask.title,
                category: 'leadership',
                accuracy: 100,
                timeSpent: 3600, // 1 hour sim
                attempts: 1,
                completedAt: Date.now(),
                competencyProven: true
            }
        );

        // 2. Update Profile & Earnings
        if (result.success && result.updatedProfile) {
            const finalProfile = { ...result.updatedProfile };

            if (activeWorkspaceTask.rewardType === 'CASH') {
                const cashMatch = activeWorkspaceTask.rewardValue.match(/\$([\d.]+)/);
                const rewardCash = cashMatch ? parseFloat(cashMatch[1]) : 0;

                if (rewardCash > 0 && !isNaN(rewardCash)) {
                    finalProfile.totalEarnings = (finalProfile.totalEarnings || 0) + rewardCash;
                }
            }

            // Sync to parent
            if (onProfileUpdate) {
                onProfileUpdate(finalProfile);
            }
        }

        // 3. UI Updates
        setAcceptedContracts(prev => prev.filter(id => id !== taskId));
        setCompletedContracts(prev => [...prev, taskId]);
        setActiveWorkspaceTask(null);

        // Final Record Entry Log (Removing gamified 'payout' language where possible)
        console.log(`[ApprenticeQueue] Contract ${taskId} inscribed in Purpose Ledger.`);
    };

    return (
        <div className="w-full h-full bg-slate-900 text-slate-100 p-6 overflow-y-auto relative">
            {/* WORKSPACE OVERLAY */}
            {activeWorkspaceTask && (
                <ContractWorkspace
                    task={activeWorkspaceTask}
                    onComplete={handleContractComplete}
                    onCancel={() => setActiveWorkspaceTask(null)}
                />
            )}

            <header className="mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Briefcase className="w-6 h-6 text-emerald-400" />
                    Apprentice Queue <span className="text-slate-500 text-sm font-normal">(Verified Marketplace)</span>
                </h2>
                <p className="text-slate-400 mt-2">
                    Accept real-world contracts. Prove your competence. Get paid.
                </p>
            </header>

            {/* WARM DEMANDER: Empty state for users below all bounty tiers */}
            {BOUNTY_LIST.filter(t => !completedContracts.includes(t.id)).every(t => userTierLevel < t.tier) && (
                <div className="mb-6 p-6 bg-blue-950/30 border border-blue-500/20 rounded-xl text-center">
                    <div className="text-3xl mb-3">🌱</div>
                    <h3 className="text-lg font-bold text-blue-300 mb-2">
                        Building Your Foundation
                    </h3>
                    <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                        These contracts require verified skills you're still developing.
                        That's not a wall — it's a path. Complete missions in the Academy
                        to earn competencies and unlock real opportunities here.
                    </p>
                    <div className="mt-4 text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                        Current Tier: {profile.currentTier} • Next unlock at Tier {Math.min(...BOUNTY_LIST.map(t => t.tier))}
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {BOUNTY_LIST.map((task) => {
                    // Hide completed tasks from main list
                    if (completedContracts.includes(task.id)) return null;

                    const isLocked = userTierLevel < task.tier;
                    const isActive = acceptedContracts.includes(task.id);
                    const sdiReq = SDI_REQUIREMENTS[task.tier] || 0;

                    return (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`relative border rounded-lg p-5 transition-all ${isLocked
                                ? 'bg-slate-950/50 border-slate-800 opacity-75 grayscale'
                                : isActive
                                    ? 'bg-emerald-900/10 border-emerald-500/50'
                                    : 'bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800'
                                }`}
                        >
                            {/* LOCKED OVERLAY */}
                            {isLocked && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-[2px] rounded-lg">
                                    <div className="flex flex-col items-center gap-2 text-red-400 font-mono">
                                        <Lock className="w-8 h-8" />
                                        <span className="font-bold tracking-wider">LOCKED</span>
                                        <span className="text-xs text-red-300/80">REQUIRES SDI {sdiReq}</span>
                                    </div>
                                </div>
                            )}

                            {/* ACTIVE OVERLAY (Subtle) */}
                            {isActive && (
                                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase rounded border border-emerald-500/30">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    Active Contract
                                </div>
                            )}

                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className={`text-xs font-mono px-2 py-0.5 rounded border ${task.tier === 5 ? 'border-amber-500/30 text-amber-400 bg-amber-500/5' :
                                            task.tier === 4 ? 'border-purple-500/30 text-purple-400 bg-purple-500/5' :
                                                'border-blue-500/30 text-blue-400 bg-blue-500/5'
                                            }`}>
                                            TIER {task.tier}
                                        </span>
                                        <h3 className="font-semibold text-lg">{task.title}</h3>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-3 max-w-2xl">{task.description}</p>

                                    <div className="flex gap-2 mb-2">
                                        {task.tags.map(tag => (
                                            <span key={tag} className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* ARTIFACT REQUIREMENTS */}
                                    {task.requiredArtifacts && task.requiredArtifacts.length > 0 && (
                                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                            <Lock className="w-3 h-3" />
                                            <span>REQUIRES: {task.requiredArtifacts.join(', ')}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="text-right">
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-xs text-slate-500 uppercase tracking-wider">Reward</span>
                                        <div className="flex items-center gap-2">
                                            <span className={`font-mono font-bold ${task.rewardType === 'CASH' ? 'text-emerald-400 text-xl' : 'text-slate-200'
                                                }`}>
                                                {task.rewardValue}
                                            </span>
                                            {isActive && task.rewardType === 'CASH' && (
                                                <span className="text-[10px] font-bold text-amber-400 bg-amber-900/30 border border-amber-500/30 px-1.5 py-0.5 rounded flex items-center gap-1">
                                                    <Lock className="w-2 h-2" /> ESCROW
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => isActive ? handleOpenWorkspace(task) : handleAcceptTask(task)}
                                        disabled={isLocked}
                                        className={`mt-4 px-4 py-2 rounded text-sm font-bold flex items-center gap-2 transition-colors ${isLocked
                                            ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                            : isActive
                                                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
                                                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'
                                            }`}
                                    >
                                        {isLocked ? 'LOCKED' : isActive ? 'SUBMIT PROOF' : 'ACCEPT CONTRACT'}
                                        {!isLocked && <ChevronRight className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* HISTORY SECTION */}
            {completedContracts.length > 0 && (
                <div className="mt-12 border-t border-slate-800 pt-8 animate-fade-in">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Completed Contracts (History)
                    </h3>
                    <div className="space-y-4 opacity-75">
                        {BOUNTY_LIST.filter(t => completedContracts.includes(t.id)).map(task => (
                            <div key={task.id} className="border border-slate-800 bg-black/40 p-4 rounded-lg flex justify-between items-center group hover:bg-slate-900 transition-colors">
                                <div>
                                    <h4 className="font-bold text-slate-300 line-through decoration-emerald-500/50 group-hover:text-emerald-400 transition-colors">{task.title}</h4>
                                    <div className="text-xs text-emerald-500 font-mono mt-1 flex items-center gap-2">
                                        <span>PAID: {task.rewardValue}</span>
                                        <span className="text-slate-600">•</span>
                                        <span className="text-slate-500">{task.client}</span>
                                    </div>
                                </div>
                                <div className="text-emerald-500 bg-emerald-900/10 p-2 rounded-full border border-emerald-900/30">
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
