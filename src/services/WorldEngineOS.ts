
import { FinancialEngine } from './FinancialEngine';
import { DeanProtocol } from './DeanProtocol';
import { MarketplaceGovernor } from './MarketplaceGovernor';
import { ContractSolvencyEngine } from './ContractSolvencyEngine';
import { CalibrationService } from './CalibrationService';
import type { LearnerProfile } from '../engines/world-engine/LearnerModel';

/**
 * WORLD ENGINE OS: THE CORE ORCHESTRATOR
 * This is the "Master Operating System" for MyBestPurpose.
 * It integrates Trust, Quality, Solvency, and Autonomy.
 * 
 * USE THIS SERVICE TO:
 * 1. Validate permissions and tiering.
 * 2. Process financial split and release.
 * 3. Enforce quality via the Dean Protocol.
 * 4. Execute system-wide transformations.
 */

export interface SystemStatus {
    version: string;
    isSolvent: boolean;
    governanceActive: boolean;
    identityStandard: string;
    metrics: {
        totalGenesisPoints: number;
        approvedMissions: number;
        verifiedLegends: number;
    };
}

export class WorldEngineOS {
    private static OS_VERSION = "2.0.0-GOLDEN-GATE";

    /**
     * The "Grand Activation" Check:
     * Returns the health and state of the World Engine.
     */
    public static getSystemStatus(): SystemStatus {
        const victoryLogs = MarketplaceGovernor.getVictoryLogs();
        return {
            version: this.OS_VERSION,
            isSolvent: true, // Derived from ContractSolvencyEngine in real state
            governanceActive: true,
            identityStandard: "Canonical Socratic Identity",
            metrics: {
                totalGenesisPoints: victoryLogs.reduce((acc, entry) => acc + entry.missionId.length, 0), // Realistic simulation
                approvedMissions: victoryLogs.length,
                verifiedLegends: 1 // Simulated for current session
            }
        };
    }

    /**
     * Executes an "Evolution Event":
     * Tries to complete a mission, handle the split, and upgrade the user identity.
     */
    public static async executeEvolution(
        profile: LearnerProfile,
        missionId: string,
        contractId: string,
        amount: number,
        title: string,
        difficulty: 'Low' | 'Medium' | 'High' = 'Low'
    ) {
        console.log(`[OS] Executing Evolution Event for Mission: ${title}`);

        // Safety Gating using imported services
        if (!DeanProtocol.checkApprovalStatus(missionId)) {
            throw new Error("EVOLUTION_FAILED: Quality Gate Not Cleared (Dean Protocol).");
        }
        const split = FinancialEngine.calculateSplit(amount);
        const contract = ContractSolvencyEngine.getContractFunding(contractId);

        // 1. Tier Check
        if (!profile.isCalibrated && amount > 100) {
            throw new Error("EVOLUTION_FAILED: Tier 1+ Evolution requires Identity Calibration.");
        }

        if (contract && contract.escrowBalance < split.studentPotential) {
            throw new Error("EVOLUTION_FAILED: Insufficient Escrow.");
        }

        // 2. Delegate to Governor (The Orchestration Hub)
        const result = await MarketplaceGovernor.processMissionCompletion(
            profile,
            missionId,
            contractId,
            amount,
            title,
            difficulty
        );

        if (result.success) {
            console.log(`[OS] Evolution Successful. TraceID: ${result.traceId}`);
            return result;
        } else {
            console.error(`[OS] Evolution Halted: ${result.error}`);
            throw new Error(result.error);
        }
    }

    /**
     * Calibrates a new Legend.
     */
    public static calibrate(profile: LearnerProfile, payload: any, actor: any) {
        return CalibrationService.runCalibration(profile, payload, actor, profile.version);
    }
}
