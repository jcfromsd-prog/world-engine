/**
 * The World Engine Payout Protocol
 * Defines how value is distributed for every verified asset.
 */

export interface PayoutSplit {
    leadSolver: string;
    supportSquad: string;
    founderPlatform: string;
    engineCompute: string;
    growthReferral: string;
}

// Default Governance Parameters (Edit here to change global logic)
export const GOVERNANCE_PARAMETERS = {
    LEAD_SOLVER_SHARE: 0.55,   // 55%
    SQUAD_SHARE: 0.20,         // 20%
    PLATFORM_FEE: 0.15,        // 15%
    COMPUTE_FEE: 0.05,         // 5%
    GROWTH_FEE: 0.05           // 5%
};

export const calculateWorldEngineSplit = (bountyAmount: number, params = GOVERNANCE_PARAMETERS): PayoutSplit => {
    return {
        leadSolver: (bountyAmount * params.LEAD_SOLVER_SHARE).toFixed(2),
        supportSquad: (bountyAmount * params.SQUAD_SHARE).toFixed(2),
        founderPlatform: (bountyAmount * params.PLATFORM_FEE).toFixed(2),
        engineCompute: (bountyAmount * params.COMPUTE_FEE).toFixed(2),
        growthReferral: (bountyAmount * params.GROWTH_FEE).toFixed(2),
    };
};
