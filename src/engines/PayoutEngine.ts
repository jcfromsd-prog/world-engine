// =============================================================================
// PAYOUT ENGINE: The Stamp of Legitimacy (Phase III, Step 3)
// =============================================================================
//
// WHAT THIS IS:
// When the MissionRunner hits COMPLETED, we do NOT show "You Win". We physically
// write to the LearnerProfile to permanently upgrade the user's identity.
//
// PHILOSOPHY:
// We convert temporary effort (the mission) into permanent value (the Artifact).
// Struggle → Effort → Proof → Identity Growth.
//
// THE 3-STEP SEQUENCE:
// 1. FETCH ARTIFACT  — Look up the KnowledgeArtifact in the ArtifactRegistry
// 2. IDENTITY WRITE  — Append competency + upgrade SDI in LearnerProfile
// 3. DOPAMINE TRIGGER — Fire confetti + emit COMPETENCE_VERIFIED event
//
// ATOMICITY CONSTRAINT:
// If the identity write fails, confetti does NOT fire.
// We do not celebrate an unverified result.
//
// ARCHITECTURE:
// ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
// │ MissionRunner │───>│ PayoutEngine │───>│ LearnerModel │
// │  (COMPLETED) │    │  (3 steps)   │    │  (Profile)   │
// └──────────────┘    └──────────────┘    └──────────────┘
//         │                   │                    │
//         │                   ▼                    ▼
//         │           ┌──────────────┐    ┌──────────────┐
//         │           │   Confetti   │    │ NeuralAvatar │
//         │           │  (dopamine)  │    │ (growth anim)│
//         │           └──────────────┘    └──────────────┘
//         │                                       ▲
//         └───── COMPETENCE_VERIFIED event ───────┘
// =============================================================================

import confetti from 'canvas-confetti';

import type { KnowledgeArtifact } from '../data/ArtifactRegistry';
import { ARTIFACT_REGISTRY } from '../data/ArtifactRegistry';

import type {
    LearnerProfile,
    VerifiedCompetency,
    SubjectDomain,
} from '../engines/world-engine/LearnerModel';

import type { MissionReward, CompletedNode } from '../engine/types';
import type { SpiralTier } from '../engines/world-engine/KnowledgeGraph';

// =============================================================================
// TYPES
// =============================================================================

/** Result of a payout attempt — either success or a structured failure */
export interface PayoutResult {
    success: boolean;

    /** The updated profile (only valid if success === true) */
    updatedProfile: LearnerProfile | null;

    /** What competencies were permanently added */
    verifiedCompetencies: VerifiedCompetency[];

    /** Whether the learner's tier was upgraded as a result */
    tierUpgraded: boolean;
    newTier?: SpiralTier;

    /** SDI movements (e.g., "numeracy: 1→2") */
    sdiUpgrades: Array<{ domain: SubjectDomain; from: number; to: number }>;

    /** Artifacts matched from the registry */
    matchedArtifacts: KnowledgeArtifact[];

    /** Error if the payout failed */
    error?: string;
}

/** Configuration for the confetti "Victory Burst" */
export interface VictoryConfig {
    /** Number of particles (default: 150) */
    particleCount?: number;
    /** Angular spread in degrees (default: 100) */
    spread?: number;
    /** Colors (default: Gold + Cyan) */
    colors?: string[];
    /** Origin Y position (default: 0.5) */
    originY?: number;
    /** Duration in bursts (default: 3) */
    burstCount?: number;
}

/** The global event dispatched when competence is verified */
export interface CompetenceVerifiedEvent {
    type: 'COMPETENCE_VERIFIED';
    missionId: string;
    competencyIds: string[];
    artifacts: KnowledgeArtifact[];
    tierUpgraded: boolean;
    newTier?: SpiralTier;
    sdiUpgrades: Array<{ domain: SubjectDomain; from: number; to: number }>;
    timestamp: number;
}

// =============================================================================
// GLOBAL EVENT BUS
// =============================================================================
// The NeuralAvatar listens for this. CustomEvent on `window` ensures
// decoupled communication without prop drilling.

const COMPETENCE_VERIFIED_EVENT = 'mbp:competence-verified';

/**
 * Emit a global COMPETENCE_VERIFIED event.
 * The NeuralAvatar or any listener can subscribe via:
 *   window.addEventListener('mbp:competence-verified', handler)
 */
function emitCompetenceVerified(payload: CompetenceVerifiedEvent): void {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(
            new CustomEvent(COMPETENCE_VERIFIED_EVENT, { detail: payload })
        );
    }
}

/**
 * Subscribe to COMPETENCE_VERIFIED events.
 * Returns an unsubscribe function.
 */
export function onCompetenceVerified(
    handler: (event: CompetenceVerifiedEvent) => void
): () => void {
    const listener = (e: Event) => {
        handler((e as CustomEvent<CompetenceVerifiedEvent>).detail);
    };
    window.addEventListener(COMPETENCE_VERIFIED_EVENT, listener);
    return () => window.removeEventListener(COMPETENCE_VERIFIED_EVENT, listener);
}

// =============================================================================
// ARTIFACT LOOKUP
// =============================================================================

/**
 * Look up artifacts in the ArtifactRegistry by competency IDs from the MissionReward.
 * Each `reward.competencies` entry is an artifact ID.
 */
function fetchArtifacts(competencyIds: string[]): KnowledgeArtifact[] {
    const artifacts: KnowledgeArtifact[] = [];
    for (const id of competencyIds) {
        const artifact = ARTIFACT_REGISTRY.find(a => a.id === id);
        if (artifact) {
            artifacts.push(artifact);
        }
    }
    return artifacts;
}

// =============================================================================
// SDI TIER MAP
// =============================================================================

const TIER_ORDER: SpiralTier[] = [
    'SPROUTS',
    'BUILDERS',
    'TRAILBLAZERS',
    'EXPLORERS',
    'VOYAGERS',
];

function tierOrdinal(tier: SpiralTier): number {
    return TIER_ORDER.indexOf(tier);
}

// =============================================================================
// DOMAIN MAPPING
// =============================================================================

/**
 * Map ArtifactCategory → SubjectDomain.
 * The artifact registry uses categories; the LearnerProfile uses domains.
 */
function artifactCategoryToDomain(category: string): SubjectDomain {
    const map: Record<string, SubjectDomain> = {
        LITERACY: 'literacy',
        NUMERACY: 'numeracy',
        SCIENTIFIC: 'science',
        CIVIC: 'social',
        PROFESSIONAL: 'career',
    };
    return map[category] ?? 'literacy';
}

// =============================================================================
// STEP 1: FETCH ARTIFACT
// =============================================================================

/**
 * Resolves which artifacts this mission proves.
 * Returns [] if no matching artifacts found (mission had no competency reward).
 */
function resolveArtifacts(reward: MissionReward): KnowledgeArtifact[] {
    if (!reward.competencies || reward.competencies.length === 0) {
        return [];
    }
    return fetchArtifacts(reward.competencies);
}

// =============================================================================
// STEP 2: IDENTITY WRITE (The Commit)
// =============================================================================

/**
 * Writes the mission outcome to the LearnerProfile.
 *
 * Substeps:
 *   2a. Append verified competencies (no duplicates)
 *   2b. Upgrade mastery records for associated knowledge nodes
 *   2c. Upgrade SDI / Tier if the new artifact crosses a threshold
 *   2d. Add missionId to completedMissions
 *   2e. Bump calibrationScore (system gains confidence in placement)
 *
 * RETURNS: A mutated copy of the profile + metadata about what changed.
 * THROWS: If any critical invariant is violated.
 */
function commitIdentityWrite(
    profile: LearnerProfile,
    artifacts: KnowledgeArtifact[],
    completedNode: CompletedNode,
    missionId: string,
): {
    updatedProfile: LearnerProfile;
    newCompetencies: VerifiedCompetency[];
    sdiUpgrades: Array<{ domain: SubjectDomain; from: number; to: number }>;
    tierUpgraded: boolean;
    newTier?: SpiralTier;
} {
    // Clone to prevent partial mutations on error
    const updated: LearnerProfile = {
        ...profile,
        masteryMap: new Map(profile.masteryMap),
        traits: new Map(profile.traits),
        verifiedCompetencies: [...profile.verifiedCompetencies],
        completedMissions: [...profile.completedMissions],
    };

    const newCompetencies: VerifiedCompetency[] = [];
    const sdiUpgrades: Array<{ domain: SubjectDomain; from: number; to: number }> = [];
    let tierUpgraded = false;
    let newTier: SpiralTier | undefined;

    // ─── 2a. Append Verified Competencies ───
    for (const artifact of artifacts) {
        // Skip if already verified
        const alreadyVerified = updated.verifiedCompetencies.some(
            c => c.competencyId === artifact.id,
        );
        if (alreadyVerified) continue;

        const domain = artifactCategoryToDomain(artifact.category);

        const competency: VerifiedCompetency = {
            competencyId: artifact.id,
            title: artifact.title,
            domain,
            tier: artifact.tier,
            sdi: artifact.sdi,
            verifiedAt: Date.now(),
            masteryScore: completedNode.accuracy / 100, // CompletedNode.accuracy is 0-100
            evidence: `Mission ${missionId}: ${completedNode.accuracy}% accuracy, `
                + `${completedNode.timeSpent}s, ${completedNode.attempts} attempt(s)`,
            standardRef: artifact.standardRef,
        };

        updated.verifiedCompetencies.push(competency);
        newCompetencies.push(competency);
    }

    // ─── 2b. Upgrade Mastery Records ───
    for (const artifact of artifacts) {
        for (const requiredNodeId of artifact.verification.requiredNodes) {
            const existing = updated.masteryMap.get(requiredNodeId);
            const masteryScore = completedNode.accuracy / 100;

            if (existing) {
                // Update existing record — only upgrade, never downgrade
                if (masteryScore > existing.masteryScore) {
                    updated.masteryMap.set(requiredNodeId, {
                        ...existing,
                        masteryScore,
                        attempts: existing.attempts + completedNode.attempts,
                        lastReviewed: Date.now(),
                        strength: Math.min(1, existing.strength + 0.1),
                    });
                }
            } else {
                // New mastery record
                updated.masteryMap.set(requiredNodeId, {
                    nodeId: requiredNodeId,
                    masteryScore,
                    attempts: completedNode.attempts,
                    lastReviewed: Date.now(),
                    strength: masteryScore,
                });
            }
        }
    }

    // ─── 2c. Upgrade SDI / Tier ───
    for (const artifact of artifacts) {
        const domain = artifactCategoryToDomain(artifact.category);
        const currentDomainLevel = updated.domainLevels[domain] ?? 0;
        const artifactSDI = artifact.sdi as number;

        // If this artifact's SDI is higher than the user's current domain level,
        // upgrade the domain level to this SDI
        if (artifactSDI > currentDomainLevel) {
            sdiUpgrades.push({
                domain,
                from: currentDomainLevel,
                to: artifactSDI,
            });
            updated.domainLevels[domain] = artifactSDI;
        }

        // Check if the tier should be upgraded
        const artifactTierOrdinal = tierOrdinal(artifact.tier);
        const currentTierOrdinal = tierOrdinal(updated.currentTier);

        if (artifactTierOrdinal > currentTierOrdinal) {
            tierUpgraded = true;
            newTier = artifact.tier;
            updated.currentTier = artifact.tier;
        }
    }

    // ─── 2d. Record Mission Completion ───
    if (!updated.completedMissions.includes(missionId)) {
        updated.completedMissions.push(missionId);
    }

    // ─── 2e. Bump Calibration Score ───
    // Each successful mission increases system confidence, capped at 100
    const calibrationBump = Math.min(5, Math.ceil(completedNode.accuracy / 25));
    updated.calibrationScore = Math.min(100, updated.calibrationScore + calibrationBump);

    return { updatedProfile: updated, newCompetencies, sdiUpgrades, tierUpgraded, newTier };
}

// =============================================================================
// STEP 3: DOPAMINE TRIGGER
// =============================================================================

/** Default confetti config: Gold/Cyan/Emerald colors, wide spread */
const DEFAULT_VICTORY_CONFIG: Required<VictoryConfig> = {
    particleCount: 150,
    spread: 100,
    colors: [
        '#fbbf24', // Gold
        '#22d3ee', // Cyan
        '#10b981', // Emerald
        '#a78bfa', // Violet
        '#f1f5f9', // White shimmer
    ],
    originY: 0.5,
    burstCount: 3,
};

/**
 * Fire the Victory Confetti sequence.
 * Multiple bursts create a sustained celebration effect.
 */
function fireVictoryConfetti(config: VictoryConfig = {}): void {
    const resolved = { ...DEFAULT_VICTORY_CONFIG, ...config };

    for (let i = 0; i < resolved.burstCount; i++) {
        setTimeout(() => {
            // Main burst
            confetti({
                particleCount: resolved.particleCount,
                spread: resolved.spread,
                origin: { y: resolved.originY },
                colors: resolved.colors,
                startVelocity: 30 + i * 5,
                gravity: 0.8,
                ticks: 200,
                scalar: 1.1,
            });

            // Side bursts for extra impact
            if (i === 0) {
                confetti({
                    particleCount: Math.floor(resolved.particleCount * 0.4),
                    angle: 60,
                    spread: 55,
                    origin: { x: 0, y: 0.6 },
                    colors: resolved.colors,
                    startVelocity: 40,
                    gravity: 0.9,
                    ticks: 180,
                });
                confetti({
                    particleCount: Math.floor(resolved.particleCount * 0.4),
                    angle: 120,
                    spread: 55,
                    origin: { x: 1, y: 0.6 },
                    colors: resolved.colors,
                    startVelocity: 40,
                    gravity: 0.9,
                    ticks: 180,
                });
            }
        }, i * 400); // 400ms between bursts
    }
}

/**
 * Fire a TIER UPGRADE confetti sequence — even more dramatic.
 * Full-screen, longer duration, more particles.
 */
function fireTierUpgradeConfetti(): void {
    const tierColors = ['#fbbf24', '#f59e0b', '#d97706', '#f1f5f9', '#22d3ee'];
    const totalDuration = 2000; // 2 seconds

    for (let t = 0; t < totalDuration; t += 200) {
        setTimeout(() => {
            confetti({
                particleCount: 40,
                spread: 160,
                origin: {
                    x: Math.random(),
                    y: Math.random() * 0.5 + 0.2,
                },
                colors: tierColors,
                startVelocity: 25 + Math.random() * 20,
                gravity: 0.6,
                ticks: 300,
                scalar: 1.2,
            });
        }, t);
    }
}

// =============================================================================
// MAIN EXPORT: processMissionSuccess
// =============================================================================

/**
 * The Payout Engine's primary function.
 *
 * Called when MissionRunner emits MISSION_COMPLETED.
 *
 * 3-Step Atomic Sequence:
 *   1. FETCH ARTIFACT  — Resolve competency IDs → artifacts
 *   2. IDENTITY WRITE  — Commit to LearnerProfile
 *   3. DOPAMINE TRIGGER — Confetti + global event (only if write succeeds)
 *
 * @param missionId  - The unique mission identifier
 * @param profile    - The current LearnerProfile (will be mutated into a new copy)
 * @param reward     - The MissionReward from the runner (contains competency IDs)
 * @param completedNode - The CompletedNode data from the runner (accuracy, time, attempts)
 * @param victoryConfig - Optional confetti customization
 *
 * @returns PayoutResult with the updated profile and metadata
 */
export function processMissionSuccess(
    missionId: string,
    profile: LearnerProfile,
    reward: MissionReward,
    completedNode: CompletedNode,
    victoryConfig?: VictoryConfig,
): PayoutResult {
    // ─── STEP 1: FETCH ARTIFACT ───
    const matchedArtifacts = resolveArtifacts(reward);

    // If no artifacts resolve, we still mark the mission as completed
    // but no competencies are verified (it was a "practice" mission)
    if (matchedArtifacts.length === 0) {
        // Still record mission completion
        const practiceProfile: LearnerProfile = {
            ...profile,
            completedMissions: [...profile.completedMissions],
        };
        if (!practiceProfile.completedMissions.includes(missionId)) {
            practiceProfile.completedMissions.push(missionId);
        }

        return {
            success: true,
            updatedProfile: practiceProfile,
            verifiedCompetencies: [],
            tierUpgraded: false,
            sdiUpgrades: [],
            matchedArtifacts: [],
        };
    }

    // ─── STEP 2: IDENTITY WRITE (The Commit) ───
    try {
        const writeResult = commitIdentityWrite(
            profile,
            matchedArtifacts,
            completedNode,
            missionId,
        );

        // ─── STEP 3: DOPAMINE TRIGGER ───
        // CRITICAL: Only fires if the write succeeded (we are inside try, after commit)

        // 3a. Fire Confetti
        if (writeResult.tierUpgraded) {
            // Tier upgrade = maximum celebration
            fireTierUpgradeConfetti();
        } else if (writeResult.newCompetencies.length > 0) {
            // New competency = standard victory
            fireVictoryConfetti(victoryConfig);
        }

        // 3b. Emit Global Event
        const eventPayload: CompetenceVerifiedEvent = {
            type: 'COMPETENCE_VERIFIED',
            missionId,
            competencyIds: writeResult.newCompetencies.map(c => c.competencyId),
            artifacts: matchedArtifacts,
            tierUpgraded: writeResult.tierUpgraded,
            newTier: writeResult.newTier,
            sdiUpgrades: writeResult.sdiUpgrades,
            timestamp: Date.now(),
        };
        emitCompetenceVerified(eventPayload);

        return {
            success: true,
            updatedProfile: writeResult.updatedProfile,
            verifiedCompetencies: writeResult.newCompetencies,
            tierUpgraded: writeResult.tierUpgraded,
            newTier: writeResult.newTier,
            sdiUpgrades: writeResult.sdiUpgrades,
            matchedArtifacts,
        };

    } catch (e) {
        // ──────────────────────────────────────────────────────────────
        // ATOMIC GUARANTEE: If the write fails, NO confetti fires.
        // We do not celebrate an unverified result.
        // ──────────────────────────────────────────────────────────────
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.error(`[PayoutEngine] Identity write failed for mission ${missionId}:`, errorMessage);

        return {
            success: false,
            updatedProfile: null,
            verifiedCompetencies: [],
            tierUpgraded: false,
            sdiUpgrades: [],
            matchedArtifacts,
            error: errorMessage,
        };
    }
}

// =============================================================================
// INTEGRATION HELPER: Wire to MissionRunner
// =============================================================================

/**
 * Creates a MissionRunner event listener that automatically triggers the
 * PayoutEngine when a mission completes.
 *
 * Usage:
 * ```ts
 * const runner = createMissionFromBlueprint(blueprint, options);
 * const unsub = runner.on(createPayoutListener(profile, setProfile));
 * ```
 *
 * @param getCurrentProfile - Returns the current LearnerProfile
 * @param setProfile - Callback to update the profile after payout
 * @param onPayoutComplete - Optional callback after successful payout
 */
export function createPayoutListener(
    getCurrentProfile: () => LearnerProfile,
    setProfile: (profile: LearnerProfile) => void,
    onPayoutComplete?: (result: PayoutResult) => void,
): (event: { type: string; completedNode?: CompletedNode; reward?: MissionReward;[key: string]: unknown }) => void {
    return (event) => {
        if (event.type !== 'MISSION_COMPLETED') return;

        const completedNode = event.completedNode as CompletedNode | undefined;
        const reward = event.reward as MissionReward | undefined;

        if (!completedNode || !reward) {
            console.error('[PayoutEngine] MISSION_COMPLETED event missing completedNode or reward');
            return;
        }

        const profile = getCurrentProfile();
        const missionId = (event as Record<string, unknown>).missionId as string
            ?? completedNode.id
            ?? `mission_${Date.now()}`;

        const result = processMissionSuccess(
            missionId,
            profile,
            reward,
            completedNode,
        );

        if (result.success && result.updatedProfile) {
            setProfile(result.updatedProfile);

            // Log what happened
            console.log(
                `[PayoutEngine] ✓ Payout complete for "${missionId}"\n`
                + `  → ${result.verifiedCompetencies.length} new competencies\n`
                + `  → ${result.sdiUpgrades.length} SDI upgrades\n`
                + `  → Tier upgraded: ${result.tierUpgraded ? result.newTier : 'No'}`
            );
        }

        onPayoutComplete?.(result);
    };
}

// =============================================================================
// RE-EXPORTS for convenience
// =============================================================================

export { COMPETENCE_VERIFIED_EVENT };
export type { KnowledgeArtifact } from '../data/ArtifactRegistry';
