
import type { LearnerProfile } from '../engines/world-engine/LearnerModel';

/**
 * THE SOVEREIGN VAULT (Phase 3: Dual-Asset Economy)
 * Manages the minting of Impact Credits (IC) and GP/IC conversion rules.
 * 
 * Concept:
 * - Genesis Points (GP): Liquid, spendable income (Marketplace Utility).
 * - Impact Credits (IC): Fixed, reputation-based power (Governance Utility).
 */

export interface VaultMetrics {
    gpTotal: number;
    icTotal: number;
    reputationTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
    governanceWeight: number;
}

export class VaultService {
    /**
     * Calculates the Impact Credit (IC) reward for a mission.
     * Higher difficulty + Higher Skill Theta alignment = More IC.
     */
    public static calculateICReward(difficulty: 'Low' | 'Medium' | 'High', skillTheta: number = 0): number {
        const baseIC = difficulty === 'Low' ? 10 : difficulty === 'Medium' ? 25 : 60;

        // Bonus for "Deep Skill" alignment (Skill Theta > 1.0)
        const multiplier = skillTheta > 1.0 ? 1.5 : 1.0;

        return Math.floor(baseIC * multiplier);
    }

    /**
     * Minting Logic: Adds both GP and IC to the profile.
     */
    public static mintRewards(profile: LearnerProfile, gpAmount: number, icAmount: number): void {
        profile.genesisPoints += gpAmount;
        profile.impactCredits = (profile.impactCredits || 0) + icAmount;

        console.log(`[VAULT] Minting Successful: +${gpAmount} GP | +${icAmount} IC to Profile ${profile.id}`);
    }

    /**
     * Returns the user's status within the Sovereign Vault.
     */
    public static getVaultMetrics(profile: LearnerProfile): VaultMetrics {
        const ic = profile.impactCredits || 0;

        let tier: VaultMetrics['reputationTier'] = 'BRONZE';
        if (ic > 1000) tier = 'PLATINUM';
        else if (ic > 500) tier = 'GOLD';
        else if (ic > 100) tier = 'SILVER';

        return {
            gpTotal: profile.genesisPoints,
            icTotal: ic,
            reputationTier: tier,
            governanceWeight: 1.0 + (ic / 1000) // Reputation increases voting/approval power
        };
    }
}
