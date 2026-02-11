
import { CalibrationService } from '../services/CalibrationService';
import type { CalibrationPayload, MirrorReport, Actor } from '../services/CalibrationService';
import type { LearnerProfile } from '../engines/world-engine/LearnerModel';

/**
 * SIMULATED API: POST /api/calibrate
 * This serves as the bridge between the UI and the Service Layer.
 * In a production environment, this would be a server-side route.
 */
export async function postCalibrate(
    profile: LearnerProfile,
    payload: CalibrationPayload,
    actor: Actor,
    version: number
): Promise<MirrorReport> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
        const report = CalibrationService.runCalibration(profile, payload, actor, version);
        return report;
    } catch (error: any) {
        console.error(`[API ERROR] ${error.message}`);
        throw error; // Let the UI handle the 403 or 409
    }
}
