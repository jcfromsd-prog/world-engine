import { TelemetryService } from "../../telemetry/events";

export interface AEPContext {
    userId: string;
    gradeBand: string;
    activityId: string;
    correctRate: number;
    hintsUsed: number;
    confidenceScore: number;
    parentalConsent: boolean;
}

export interface AEPAction {
    type: "CONTINUE" | "REMEDIATE" | "HUMAN_REVIEW" | "BLOCK";
    rationale: string;
    payload?: any;
}

export const ProgressionEngine = {
    evaluateResult(context: AEPContext): AEPAction {
        // Iron Rule: Dean Protocol for Low Confidence
        if (context.confidenceScore < 0.75) {
            const decision: AEPAction = {
                type: "HUMAN_REVIEW",
                rationale: "Confidence score below 0.75 threshold (Dean Protocol trigger)."
            };
            TelemetryService.logAepDecision(decision, context);
            return decision;
        }

        // Standard Remediation Rule (basic_remediate_v1.json)
        if (context.correctRate < 0.6 && context.hintsUsed > 3) {
            const decision: AEPAction = {
                type: "REMEDIATE",
                rationale: "High hint dependency with low accuracy indicates concept gap.",
                payload: {
                    interventionType: "CONCEPT_REVIEW",
                    difficultyAdjustment: -1
                }
            };
            TelemetryService.logAepDecision(decision, context);
            return decision;
        }

        // Default: Continue
        const decision: AEPAction = {
            type: "CONTINUE",
            rationale: "Performance within acceptable bounds."
        };
        TelemetryService.logAepDecision(decision, context);
        return decision;
    },

    // Solvency Guard Helper (Stub since we don't have full financial context here)
    verifySolvency(clientPaymentStatus: string): boolean {
        if (clientPaymentStatus !== "CLEARED") {
            TelemetryService.logGovernanceGate("SOLVENCY_GUARD", "FAILED", "Payment not cleared.");
            return false;
        }
        TelemetryService.logGovernanceGate("SOLVENCY_GUARD", "PASSED");
        return true;
    }
};
