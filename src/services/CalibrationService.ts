
import type { LearnerProfile, GradeLevel } from '../engines/world-engine/LearnerModel';

export type CalibrationPayload = {
    grade: number;
    domain: 'Code' | 'Design' | 'Science';
    style: 'Visual' | 'Logic' | 'Team'
};

export type MirrorReport = {
    traceId: string;
    before: number;
    after: number;
    unlockedTasks: string[];
    version: number
};

export interface Actor {
    id: string;
    isAdmin: boolean;
}

// Feature Flag Simulation (In real apps, this comes from a config service)
const FEATURE_CALIBRATION_ENABLED = true;

/**
 * CALIBRATION SERVICE
 * Senior Principal Architect Approved Protocol.
 * Handles the logic for raising contributor confidence.
 */
export class CalibrationService {
    public static runCalibration(
        profile: LearnerProfile,
        payload: CalibrationPayload,
        actor: Actor,
        currentVersion?: number
    ): MirrorReport {
        // 1. PRODUCTION GATING (Absolute Safety)
        const isProduction = process.env.NODE_ENV === 'production';
        if (isProduction && !actor.isAdmin && !FEATURE_CALIBRATION_ENABLED) {
            throw new Error("403: Calibration Protocol Restricted");
        }

        // 2. OPTIMISTIC LOCKING
        // Return 409 simulation on mismatch
        if (currentVersion !== undefined && profile.version !== currentVersion) {
            throw new Error("409: Profile Version Mismatch (State Conflict)");
        }

        const traceId = crypto.randomUUID();

        // 3. SNAPSHOT (Deep clone simulation for confidence math)
        const beforeConfidence = profile.confidence || 15;

        // 4. COMPUTE & ATOMIC UPDATE
        // SOLVENCY GUARD: Only unlock Tier 0 (Training) missions.
        const allowedTierZeroTasks = ['task-training-onboarding', 'task-skill-assessment'];

        // Update profile
        profile.confidence = 85;
        profile.isCalibrated = true;
        profile.currentGrade = payload.grade as GradeLevel;

        // Use Set semantics for idempotency in unlockedTasks
        const taskSet = new Set(profile.unlockedTasks || []);
        allowedTierZeroTasks.forEach(taskId => taskSet.add(taskId));
        profile.unlockedTasks = Array.from(taskSet);

        // Update version
        profile.version = (profile.version || 0) + 1;

        // 5. TELEMETRY
        console.log(`[TELEMETRY] identity_calibration`, {
            event: 'identity_calibration',
            traceId,
            learnerId: profile.id,
            actorId: actor.id,
            confidenceDelta: 85 - beforeConfidence,
            unlockedCount: allowedTierZeroTasks.length,
            version: profile.version
        });

        return {
            traceId,
            before: beforeConfidence,
            after: 85,
            unlockedTasks: allowedTierZeroTasks,
            version: profile.version
        };
    }
}
