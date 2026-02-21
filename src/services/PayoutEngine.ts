/* =============================================================================
   PAYOUT ENGINE: The Elevation Protocol (v1.2)
   Enforcing Master Operating Prompt v5.0 - Prohibitions
   =============================================================================
   Enforce Law 2: Identity Over Points.
   Strict Prohibition: No gamification proxies, no confetti, no empty praise.
   ============================================================================= */

import { PurposeLedger } from './PurposeLedger';
import type { KnowledgeArtifact } from '../data/ArtifactRegistry';
import { ARTIFACT_REGISTRY } from '../data/ArtifactRegistry';
import type {
    LearnerProfile,
    VerifiedCompetency,
    SubjectDomain,
} from '../engines/world-engine/LearnerModel';
import type { MissionReward, CompletedNode } from '../engine/types';
import type { SpiralTier } from '../engines/world-engine/KnowledgeGraph';

/** Result of a payout attempt — now a ledgered verification */
export interface VerificationResult {
    success: boolean;
    updatedProfile: LearnerProfile | null;
    verifiedCompetencies: VerifiedCompetency[];
    tierUpgraded: boolean;
    newTier?: SpiralTier;
    sdiUpgrades: Array<{ domain: SubjectDomain; from: number; to: number }>;
    matchedArtifacts: KnowledgeArtifact[];
    error?: string;
}

/** Global event for the UI to show the 'Elevation Moment' */
export interface ElevationEvent {
    type: 'ELEVATION_MOMENT';
    missionId: string;
    verifiedCompetencies: VerifiedCompetency[];
    tierUpgraded: boolean;
    timestamp: string;
}

const ELEVATION_EVENT_NAME = 'mbp:elevation-moment';

function emitElevationMoment(payload: ElevationEvent): void {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(
            new CustomEvent(ELEVATION_EVENT_NAME, { detail: payload })
        );
    }
}

export function onElevationMoment(
    handler: (event: ElevationEvent) => void
): () => void {
    const listener = (e: Event) => {
        handler((e as CustomEvent<ElevationEvent>).detail);
    };
    window.addEventListener(ELEVATION_EVENT_NAME, listener);
    return () => window.removeEventListener(ELEVATION_EVENT_NAME, listener);
}

/**
 * STEP 1: RESOLVE ARTIFACTS
 */
function resolveArtifacts(reward: MissionReward): KnowledgeArtifact[] {
    if (!reward.competencies || reward.competencies.length === 0) {
        return [];
    }
    const artifacts: KnowledgeArtifact[] = [];
    for (const id of reward.competencies) {
        const artifact = ARTIFACT_REGISTRY.find(a => a.id === id);
        if (artifact) artifacts.push(artifact);
    }
    return artifacts;
}

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

/**
 * STEP 2: COMMIT IDENTITY WRITE
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

    for (const artifact of artifacts) {
        if (updated.verifiedCompetencies.some(c => c.competencyId === artifact.id)) continue;

        const domain = artifactCategoryToDomain(artifact.category);
        const competency: VerifiedCompetency = {
            competencyId: artifact.id,
            title: artifact.title,
            domain,
            tier: artifact.tier,
            sdi: artifact.sdi,
            verifiedAt: Date.now(),
            masteryScore: completedNode.accuracy / 100,
            evidence: `Mission ${missionId}: ${completedNode.accuracy}% accuracy`,
            standardRef: artifact.standardRef,
        };

        updated.verifiedCompetencies.push(competency);
        newCompetencies.push(competency);

        // SDI Logic
        const currentSDI = updated.domainLevels[domain] ?? 0;
        if (artifact.sdi > currentSDI) {
            sdiUpgrades.push({ domain, from: currentSDI, to: artifact.sdi });
            updated.domainLevels[domain] = artifact.sdi;
        }

        // Tier Logic
        if (artifact.tier !== updated.currentTier) {
            // Check if we should upgrade tier (SPROUTS -> BUILDERS etc)
            // Simplified for now: if artifact is higher tier, upgrade
            tierUpgraded = true;
            newTier = artifact.tier;
            updated.currentTier = artifact.tier;
        }
    }

    if (!updated.completedMissions.includes(missionId)) {
        updated.completedMissions.push(missionId);
    }

    return { updatedProfile: updated, newCompetencies, sdiUpgrades, tierUpgraded, newTier };
}

/**
 * MAIN: verifyAndLedgerMission
 * Replaces processMissionSuccess
 */
export async function verifyAndLedgerMission(
    missionId: string,
    profile: LearnerProfile,
    reward: MissionReward,
    completedNode: CompletedNode,
): Promise<VerificationResult> {
    const matchedArtifacts = resolveArtifacts(reward);

    try {
        const {
            updatedProfile,
            newCompetencies,
            sdiUpgrades,
            tierUpgraded,
            newTier
        } = commitIdentityWrite(profile, matchedArtifacts, completedNode, missionId);

        // STEP 3: APPEND TO IMMUTABLE LEDGER
        if (newCompetencies.length > 0) {
            await PurposeLedger.addEntry({
                user_id: profile.id,
                mission_id: missionId,
                verified_outputs: newCompetencies.map(c => c.competencyId),
                impact_metrics: {
                    portfolio_items_added: newCompetencies.length,
                    skills_demonstrated: newCompetencies.map(c => c.title),
                    real_value_created: 0, // In this model, we avoid gamified points
                    engine_progress: {
                        impact_to_legend: (updatedProfile.verifiedCompetencies.length / 100)
                    }
                }
            });
        }

        // Emit Elevation Moment for static UI display
        emitElevationMoment({
            type: 'ELEVATION_MOMENT',
            missionId,
            verifiedCompetencies: newCompetencies,
            tierUpgraded,
            timestamp: new Date().toISOString()
        });

        return {
            success: true,
            updatedProfile,
            verifiedCompetencies: newCompetencies,
            tierUpgraded,
            newTier,
            sdiUpgrades,
            matchedArtifacts
        };

    } catch (e) {
        const error = e instanceof Error ? e.message : String(e);
        console.error(`[ElevationProtocol] Failed:`, error);
        return {
            success: false,
            updatedProfile: null,
            verifiedCompetencies: [],
            tierUpgraded: false,
            sdiUpgrades: [],
            matchedArtifacts,
            error
        };
    }
}

/**
 * Triggers an elevation moment specifically for the Initial Intake Assessment.
 */
export function emitAssessmentElevation(masteryMap: any): void {
    emitElevationMoment({
        type: 'ELEVATION_MOMENT',
        missionId: 'INTAKE_VERIFICATION',
        verifiedCompetencies: masteryMap.gaps.map((gap: any) => ({
            competencyId: gap.standardId,
            title: `Detected Gap: ${gap.standardId}`,
            domain: gap.subject === 'math' ? 'numeracy' : gap.subject === 'ela' ? 'literacy' : 'science',
            tier: 'SPROUTS', // Default to initial tier
            sdi: 1,
            verifiedAt: Date.now(),
            masteryScore: 0, // Gap indicates lack of mastery
            evidence: `Diagnostic Result: Grade ${gap.gradeLevel} material requires focus.`,
            standardRef: gap.standardId,
        })),
        tierUpgraded: false,
        timestamp: new Date().toISOString()
    });
}
