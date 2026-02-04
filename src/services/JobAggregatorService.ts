import type { Bounty } from '../types/bounty';

// 1. ECONOMIC PROTOCOL (The 15/55/20/5/5 Split)
const ECONOMICS = {
    PLATFORM_LEVY: 0.15, // 15% to Platform
    LEAD_SOLVER: 0.55,   // 55% to You
    SQUAD_FUND: 0.20,    // 20% to Support Squad
    AI_COMPUTE: 0.05,    // 5% to Sage
    GROWTH_FUND: 0.05    // 5% to Future Bounties
};

interface ExternalJob {
    id: string;
    title: string;
    company: string;
    source: 'Adzuna' | 'LinkedIn' | 'Upwork' | 'Indeed' | 'ProBlogger' | 'Dribbble';
    originalSalary?: number; // Hourly or Fixed
    description: string;
    url: string;
    category: 'Development' | 'Writing' | 'Design' | 'Marketing';
}

// 2. THE AGGREGATOR (Simulating API Calls to External Sources)
// In a real backend, this would call axios.get('https://api.adzuna.com/v1/api/jobs/...')
export const fetchExternalJobs = async (): Promise<ExternalJob[]> => {
    // SIMULATED LATENCY
    await new Promise(resolve => setTimeout(resolve, 800));

    return [
        {
            id: 'ext-101',
            title: 'Technical Blog Writer',
            company: 'CloudScale Inc.',
            source: 'ProBlogger',
            originalSalary: 250, // Fixed price for article
            description: 'Looking for an experienced writer to explain Kubernetes to beginners.',
            url: 'https://problogger.com/jobs/123',
            category: 'Writing'
        },
        {
            id: 'ext-102',
            title: 'React Dashboard UI Designer',
            company: 'FinTech Flow',
            source: 'Dribbble',
            originalSalary: 500, // Project budget
            description: 'Need a dark-mode dashboard design for our crypto trading platform.',
            url: 'https://dribbble.com/jobs/456',
            category: 'Design'
        },
        {
            id: 'ext-103',
            title: 'SEO Keyword Strategy',
            company: 'GrowthMasters',
            source: 'Upwork',
            originalSalary: 150,
            description: 'Research high-volume keywords for a vegan commerce brand.',
            url: 'https://upwork.com/jobs/789',
            category: 'Marketing'
        },
        {
            id: 'ext-104',
            title: 'Fix Python Data Pipeline',
            company: 'DataCorp',
            source: 'Indeed',
            originalSalary: 300,
            description: 'ETL script is failing on large CSV imports. Need optimization.',
            url: 'https://indeed.com/jobs/101',
            category: 'Development'
        }
    ];
};

// 3. THE TRANSFORMER (Applying the "World Engine" Logic)
export const transformToQuest = (job: ExternalJob): Bounty => {
    const totalValue = job.originalSalary || 100; // Default if unknown

    // Calculate The Split
    const splits = {
        platform: totalValue * ECONOMICS.PLATFORM_LEVY,
        solver: totalValue * ECONOMICS.LEAD_SOLVER,
        squad: totalValue * ECONOMICS.SQUAD_FUND,
        sage: totalValue * ECONOMICS.AI_COMPUTE,
        growth: totalValue * ECONOMICS.GROWTH_FUND
    };

    return {
        id: `quest-${job.id}`,
        title: job.title,
        reward: `$${totalValue.toFixed(0)}`, // Display Total Value
        rewardValue: totalValue,
        cause: job.category,
        time: "3 Days", // Standardized generic time for imported jobs
        difficulty: totalValue > 300 ? "Hard" : "Medium",
        tags: [job.source, "Imported", job.category],
        source: job.source,
        createdAt: new Date().toISOString(),
        externalUrl: job.url,
        description: job.description,
        isExternal: true,
        // The "Smart Contract" Data
        financials: {
            total: totalValue,
            splits: {
                platform: `$${splits.platform.toFixed(2)}`,
                leadSolver: `$${splits.solver.toFixed(2)}`,
                squad: `$${splits.squad.toFixed(2)}`,
                reserves: `$${(splits.sage + splits.growth).toFixed(2)}`
            }
        }
    };
};

// 4. THE API HOOK
export const getAggregatedBounties = async () => {
    try {
        const rawJobs = await fetchExternalJobs();
        return rawJobs.map(transformToQuest);
    } catch (error: unknown) {
        console.error("Failed to fetch external jobs:", error);
        return [];
    }
};
