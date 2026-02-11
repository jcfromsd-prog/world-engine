
import { DeanProtocol } from './DeanProtocol';
import { ContractSolvencyEngine } from './ContractSolvencyEngine';
import { FinancialEngine } from './FinancialEngine';
import { VaultService } from './VaultService';
import type { LearnerProfile } from '../engines/world-engine/LearnerModel';

/**
 * MARKETPLACE GOVERNOR (Phase 4: The Autonomy Loop)
 * Orchestrates the full lifecycle of a mission from completion to reward.
 */

export interface VictoryLogEntry {
    missionId: string;
    title: string;
    description: string;
    timestamp: number;
    traceId: string;
}

export class MarketplaceGovernor {
    private static victoryLogs: VictoryLogEntry[] = [];

    /**
     * Processes the end-of-mission loop.
     */
    public static async processMissionCompletion(
        profile: LearnerProfile,
        missionId: string,
        contractId: string,
        rewardAmount: number,
        missionTitle: string,
        difficulty: 'Low' | 'Medium' | 'High' = 'Low'
    ): Promise<{ success: boolean; traceId?: string; error?: string }> {
        console.log(`[GOVERNOR] Processing completion for ${missionId}...`);

        // 1. Quality Check (Dean Protocol)
        if (!DeanProtocol.checkApprovalStatus(missionId)) {
            return { success: false, error: "QUALITY_GATE_FAILED: Mission not approved by Dean Protocol." };
        }

        // 2. Financial Check & Release (Solvency Engine)
        const payoutSuccess = ContractSolvencyEngine.releaseMilestone(contractId, missionId, rewardAmount);
        if (!payoutSuccess) {
            return { success: false, error: "SOLVENCY_GATE_FAILED: Payment could not be released." };
        }

        // --- SQUAD DISTRIBUTION LOGIC ---
        // Calculate the specific shares for Lead vs Members
        const studentPotential = FinancialEngine.calculateSplit(rewardAmount).studentPotential;
        const squadSplit = FinancialEngine.calculateSquadSplit(studentPotential, 3);

        console.log(`[GOVERNOR] Squad Split: Lead ${squadSplit.leadShare} | Members ${squadSplit.memberShare}`);

        // 3. UI/Profile Progression Update
        const traceId = FinancialEngine.generateTraceId();

        // --- VAULT REWARDS (Dual-Asset) ---
        const icReward = VaultService.calculateICReward(difficulty);
        VaultService.mintRewards(profile, squadSplit.leadShare, icReward);

        profile.completedMissions.push(missionId);

        // 4. Generate Victory Log
        const victoryEntry: VictoryLogEntry = {
            missionId,
            title: `Certified Completion: ${missionTitle}`,
            description: `Mission ${missionId} successfully submitted and verified via the Dean Protocol.`,
            timestamp: Date.now(),
            traceId
        };

        this.victoryLogs.push(victoryEntry);

        console.log(`[GOVERNOR] Success! Profile ${profile.id} updated. TraceID: ${traceId}`);

        return {
            success: true,
            traceId
        };
    }

    public static getVictoryLogs(): VictoryLogEntry[] {
        return this.victoryLogs;
    }
}
