
import { FinancialEngine } from './FinancialEngine';
import { DeanProtocol } from './DeanProtocol';

/**
 * CONTRACT SOLVENCY ENGINE (Phase 3: Financial Triggers)
 * Bridges Client Funding to Student Payouts.
 */

export interface ContractFunding {
    contractId: string;
    amount: number;
    escrowBalance: number;
    status: 'FUNDED' | 'UNFUNDED' | 'EXHAUSTED';
}

export class ContractSolvencyEngine {
    private static contractLedger: Map<string, ContractFunding> = new Map();

    /**
     * Funds a specific contract into the logical CLIENT_ESCROW.
     */
    public static fundContract(contractId: string, amount: number): void {
        const funding = this.contractLedger.get(contractId) || {
            contractId,
            amount: 0,
            escrowBalance: 0,
            status: 'UNFUNDED'
        };

        funding.amount += amount;
        funding.escrowBalance += amount;
        funding.status = 'FUNDED';

        this.contractLedger.set(contractId, funding);
        console.log(`[SOLVENCY] Contract ${contractId} funded with ${amount}. Escrow: ${funding.escrowBalance}`);
    }

    /**
     * Releases a milestone payment to the student wallet.
     * Enforces Dean Protocol check and Financial Solvency.
     */
    public static releaseMilestone(contractId: string, missionId: string, payoutAmount: number): boolean {
        const funding = this.contractLedger.get(contractId);

        // 1. Funding existence check
        if (!funding) {
            console.error(`[SOLVENCY ERROR] Contract ${contractId} does not exist.`);
            return false;
        }

        // 2. QUALITY GATE: Enforce Dean Protocol Rule of 3
        const isApproved = DeanProtocol.checkApprovalStatus(missionId);
        if (!isApproved) {
            console.error(`[SOLVENCY ERROR] Mission ${missionId} has not cleared Dean Protocol approval.`);
            return false;
        }

        // 3. FINANCIAL GUARD: Enforce SOLVENCY
        // We simulate a 'CLEARED' status for this release logic
        const isSolvent = FinancialEngine.validatePayout('CLEARED', funding.escrowBalance, payoutAmount);
        if (!isSolvent) {
            console.error(`[SOLVENCY ERROR] Insufficient Escrow in ${contractId} to cover ${payoutAmount}.`);
            return false;
        }

        // 4. ATOMIC WITHDRAWAL
        funding.escrowBalance -= payoutAmount;
        if (funding.escrowBalance <= 0) {
            funding.status = 'EXHAUSTED';
        }

        this.contractLedger.set(contractId, funding);
        console.log(`[SOLVENCY] Payout of ${payoutAmount} released for Mission ${missionId}. Remaining Escrow: ${funding.escrowBalance}`);

        return true;
    }

    public static getContractFunding(contractId: string): ContractFunding | undefined {
        return this.contractLedger.get(contractId);
    }
}
