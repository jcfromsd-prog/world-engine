
/**
 * FINANCIAL ENGINE (Marketplace Pillar)
 * Implements the Three-Wallet System and the Sovereign 2.0 Split.
 * 
 * Rules:
 * 1. Payouts to STUDENT_WALLET only come from CLIENT_ESCROW.
 * 2. PLATFORM_TREASURY is for revenue and reserves, never student payouts.
 * 3. Split must be configurable and account for 100% of funds.
 */

export interface FeeConfig {
    solverRatio: number;      // e.g. 0.45 (45%)
    squadRatio: number;       // e.g. 0.15 (15%)
    opsRatio: number;         // e.g. 0.10 (10%)
    legalRatio: number;       // e.g. 0.10 (10%)
    aiRatio: number;          // e.g. 0.10 (10%)
    growthFundRatio: number;  // e.g. 0.10 (10%)
}

export const SOVEREIGN_2_0_FEES: FeeConfig = {
    solverRatio: 0.45,
    squadRatio: 0.15,
    opsRatio: 0.10,
    legalRatio: 0.10,
    aiRatio: 0.10,
    growthFundRatio: 0.10
};

export interface WalletState {
    CLIENT_ESCROW: number;
    PLATFORM_TREASURY: number;
    STUDENT_WALLET: number;
}

export type PaymentStatus = 'PENDING' | 'CLEARED' | 'FAILED';

export class FinancialEngine {
    /**
     * Splits incoming client payment into Escrow and Treasury based on Config.
     * In this architecture, 100% of the payment enters Escrow first, 
     * then Platform fees (Ops, Legal, etc.) move to Treasury upon clearing.
     */
    public static calculateSplit(totalAmount: number, config: FeeConfig = SOVEREIGN_2_0_FEES) {
        const platformRatios = config.opsRatio + config.legalRatio + config.aiRatio + config.growthFundRatio;
        const studentRatios = config.solverRatio + config.squadRatio;

        // Integrity Check: Ratios must sum to 1.0 (100%)
        const totalRatio = platformRatios + studentRatios;
        if (Math.abs(totalRatio - 1.0) > 0.0001) {
            throw new Error(`FINANCIAL_ERROR: Ratios must sum to 1.0. Got: ${totalRatio}`);
        }

        const platformFee = totalAmount * platformRatios;
        const studentPotential = totalAmount * studentRatios;

        return {
            platformFee,
            studentPotential,
            totalAmount
        };
    }

    /**
     * Payout Guard: Validates if a student payout can be processed.
     */
    public static validatePayout(
        status: PaymentStatus,
        escrowBalance: number,
        requiredAmount: number
    ): boolean {
        // 1. CLEARED Status Check
        if (status !== 'CLEARED') return false;

        // 2. SOLVENCY GUARD: Never payout from Platform Treasury.
        // Payout MUST be covered by Escrow funds specifically.
        if (escrowBalance < requiredAmount) return false;

        return true;
    }

    /**
     * Executes the split and returns the TraceID for the transaction.
     */
    public static calculateSquadSplit(totalStudentPotential: number, squadSize: number = 3) {
        // Blueprint Rule: Lead Solver gets 55% of the student pool, rest split among others.
        // We use the SOVEREIGN_2_0_FEES as a reference but simplify for the specific squad pool.
        const leadShare = totalStudentPotential * 0.70; // High weight for leader
        const memberShare = (totalStudentPotential - leadShare) / (squadSize - 1);

        return {
            leadShare,
            memberShare,
            totalStudentPotential
        };
    }

    /**
     * Executes the split and returns the TraceID for the transaction.
     */
    public static generateTraceId(): string {
        return `tx_${crypto.randomUUID()}`;
    }
}
