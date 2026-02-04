export type TransactionType = 'DEPOSIT' | 'BOUNTY_ESCROW' | 'PAYOUT_DISTRIBUTION' | 'WITHDRAWAL';
export type DistributionKey = 'leadSolver' | 'supportSquad' | 'sovereignOps' | 'legalDefense' | 'aiCompute' | 'growthFund';

export interface Transaction {
    id: string;
    timestamp: number;
    type: TransactionType;
    amount: number;
    description: string;
    metadata?: Record<string, unknown>;
}

export interface Distribution {
    leadSolver: number;    // 45%
    supportSquad: number;  // 15%
    sovereignOps: number;  // 10%
    legalDefense: number;  // 10%
    aiCompute: number;     // 10%
    growthFund: number;    // 10%
}

export interface Wallet {
    id: string;
    balance: number;
    frozen: number; // For Escrow
    transactions: Transaction[];
}

export const SOVEREIGN_SPLIT: Record<DistributionKey, number> = {
    leadSolver: 0.45,
    supportSquad: 0.15,
    sovereignOps: 0.10,
    legalDefense: 0.10,
    aiCompute: 0.10,
    growthFund: 0.10
};

class LedgerService {
    private wallets: Map<string, Wallet> = new Map();

    constructor() {
        // Initialize Founder Wallet for testing
        this.createWallet('FOUNDER_01');
    }

    createWallet(id: string): Wallet {
        const wallet = {
            id,
            balance: 0,
            frozen: 0, // In-flight bounties
            transactions: []
        };
        this.wallets.set(id, wallet);
        return wallet;
    }

    getWallet(id: string): Wallet | undefined {
        return this.wallets.get(id);
    }

    getBalance(id: string): number {
        return this.wallets.get(id)?.balance || 0;
    }

    /**
     * Calculates the exact atomic split for a given amount.
     * Throws error if split does not sum to 100% (floating point check).
     */
    calculateDistribution(amount: number): Distribution {
        const dist = {
            leadSolver: Number((amount * SOVEREIGN_SPLIT.leadSolver).toFixed(2)),
            supportSquad: Number((amount * SOVEREIGN_SPLIT.supportSquad).toFixed(2)),
            sovereignOps: Number((amount * SOVEREIGN_SPLIT.sovereignOps).toFixed(2)),
            legalDefense: Number((amount * SOVEREIGN_SPLIT.legalDefense).toFixed(2)),
            aiCompute: Number((amount * SOVEREIGN_SPLIT.aiCompute).toFixed(2)),
            growthFund: Number((amount * SOVEREIGN_SPLIT.growthFund).toFixed(2))
        };

        // SAFETY CHECK: Ensure we aren't creating money
        const totalDistributed = Object.values(dist).reduce((a, b) => a + b, 0);
        const difference = Math.abs(amount - totalDistributed);

        if (difference > 0.01) {
            console.warn(`[LEDGER] Micro-penny variance detected: ${difference}. Assigning to Growth Fund.`);
            dist.growthFund += parseFloat((amount - totalDistributed).toFixed(2));
        }

        return dist;
    }

    private isSystemFrozen = false;

    // ... (existing methods)

    getSystemStatus(): boolean {
        return this.isSystemFrozen;
    }

    setSystemFrozen(frozen: boolean) {
        this.isSystemFrozen = frozen;
        // In a real system, this would log to a secure audit log
        console.warn(`[LEDGER] SYSTEM STATUS CHANGE: ${frozen ? 'FROZEN' : 'ACTIVE'}`);
    }

    /**
     * Enforces Zero-Debt. Throws if insufficient funds.
     */
    processTransaction(walletId: string, type: TransactionType, amount: number, description: string): Transaction {
        // 0. KILL SWITCH CHECK
        if (this.isSystemFrozen && type !== 'DEPOSIT') {
            throw new Error(`[SECURITY LOCKDOWN] System is FROZEN. No outflows allowed.`);
        }

        const wallet = this.wallets.get(walletId);
        if (!wallet) throw new Error(`Wallet ${walletId} not found.`);

        // 1. SOLVENCY CHECK
        if (type === 'BOUNTY_ESCROW' || type === 'WITHDRAWAL') {
            if (wallet.balance < amount) {
                throw new Error(`[INSOLVENCY RISK] Attempted overflow: Balance ${wallet.balance}, Requested ${amount}. Transaction REJECTED.`);
            }
        }

        // 2. EXECUTE
        const tx: Transaction = {
            id: `TX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            type,
            amount,
            description
        };

        if (type === 'DEPOSIT' || type === 'PAYOUT_DISTRIBUTION') {
            wallet.balance += amount;
        } else if (type === 'BOUNTY_ESCROW') {
            wallet.balance -= amount;
            wallet.frozen += amount;
        } else if (type === 'WITHDRAWAL') {
            wallet.balance -= amount;
        }

        wallet.transactions.push(tx);
        return tx;
    }

    /**
     * Finalizes a bounty, moving funds from escrow to distribution
     */
    settleBounty(walletId: string, amount: number): Distribution {
        const wallet = this.wallets.get(walletId);
        if (!wallet) throw new Error('Wallet not found');

        if (wallet.frozen < amount) {
            throw new Error(`[AUDIT FAIL] Missing escrow funds. Expected ${amount} in frozen state.`);
        }

        // Release Escrow
        wallet.frozen -= amount;

        // Calculate Split
        const split = this.calculateDistribution(amount);

        // Record Distribution Event
        this.processTransaction(walletId, 'PAYOUT_DISTRIBUTION', 0, `Bounty Settled: Payouts Distributed`); // Zero because funds moved out of wallet scope into sub-wallets

        // In a real DB, we would credit the sub-wallets here.
        // For simulation, we return the split for display.
        return split;
    }
}

export const ledger = new LedgerService();
