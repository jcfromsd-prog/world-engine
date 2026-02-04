export interface SquadRole {
    id: string;
    title: string;
    icon: string;
    rewardShare: string;
    status: 'open' | 'filled';
    filledBy?: {
        name: string;
        avatar: string;
    };
}

export interface BountyFinancials {
    total: number;
    splits: {
        platform: string;
        leadSolver: string;
        squad: string;
        reserves: string;
    };
}

export interface Bounty {
    id: string | number;
    title: string;
    reward: string;
    rewardValue?: number;
    cause: string;
    time: string;
    difficulty: string;
    createdAt?: string;
    tags?: string[];
    source?: string;
    financials?: BountyFinancials | Record<string, unknown>;
    squadRoles?: SquadRole[];
    externalUrl?: string;
    description?: string;
    isExternal?: boolean;
    livesImpacted?: number;
}
