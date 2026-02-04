
export interface AdzunaBounty {
    id: string;
    title: string;
    description: string;
    originalPay: number;
    url: string;
    company: string;
    postedAt: string;
}

interface AdzunaJob {
    id: string;
    title: string;
    description: string;
    salary_min?: number;
    salary_max?: number;
    redirect_url: string;
    company: {
        display_name: string;
    };
    created: string;
    category: {
        label: string;
    };
}

interface AdzunaResponse {
    results: AdzunaJob[];
    count: number;
}

// NOTE: In a production environment, these should be in an Edge Function to hide the keys.
// For this "Founder Mode" demo, we will run it client-side.
// You can get a free API Key at: https://developer.adzuna.com/
const ADZUNA_APP_ID = import.meta.env.VITE_ADZUNA_APP_ID || 'DEMO_MODE';
const ADZUNA_APP_KEY = import.meta.env.VITE_ADZUNA_APP_KEY || 'DEMO_MODE';

export const fetchAdzunaJobs = async (): Promise<AdzunaBounty[]> => {
    // If no keys are present, we might want to return mock data or throw/log.
    // But let's build the fetcher.

    if (ADZUNA_APP_ID === 'DEMO_MODE') {
        console.warn("Adzuna API Keys missing. Cannot fetch real work.");
        return [];
    }

    // Categories: 'it-jobs', 'creative-design-jobs', 'pr-advertising-marketing-jobs' are likely mappings.
    // We will search for keywords to filter better.

    // STRATEGY PIVOT: "The Growth Engine"
    // User identified: SEO, Ads, Newsletters, Marketing as high-ROI/Low-Barrier tasks.
    const country = 'us';

    // Targeted "Growth" Keywords
    const what = 'marketing seo copywriting social media content analytics remote';

    // Keywords to EXCLUDE to avoid "Corporate" noise
    const EXCLUDED_TERMS = ['director', 'vp', 'executive', 'manager', 'head of', 'senior', 'lead'];

    try {
        const response = await fetch(
            `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=50&what=${encodeURIComponent(what)}&content-type=application/json`
        );

        if (!response.ok) {
            throw new Error(`Adzuna API Error: ${response.statusText}`);
        }

        const data: AdzunaResponse = await response.json();

        // STRICT FILTERING: Remove Senior/Management roles to find "Execution" tasks
        const filteredResults = data.results.filter(job => {
            const titleLower = job.title.toLowerCase();
            return !EXCLUDED_TERMS.some(term => titleLower.includes(term));
        });

        // IF FILTERING REMOVES EVERYTHING, we return empty list.
        // The UI will handle "No Spaks Found" state.
        if (filteredResults.length === 0) {
            console.warn("Filter removed all results. Try loosening keywords.");
            return [];
        }

        // Transform and normalize pay to look like "Bounties" (Tasks) rather than Annual Salaries
        return filteredResults.map(job => {
            let estimatedBounty = 500; // Default fallback for a marketing task

            // Marketing tasks often show hourly or project rates. 
            // If huge salary, assume it's a "Retainer" or large project.
            if (job.salary_min && job.salary_min > 20000) {
                // Convert ~$60k marketing job -> ~$1000 "Campaign Setup" bounty
                estimatedBounty = Math.floor(job.salary_min / 52);
            } else if (job.salary_min) {
                estimatedBounty = job.salary_min;
            }

            return {
                id: String(job.id),
                title: job.title, // formatting could happen here
                description: job.description,
                originalPay: estimatedBounty,
                url: job.redirect_url,
                company: job.company.display_name,
                postedAt: job.created
            };
        });

    } catch (error: unknown) {
        console.error("Failed to fetch jobs from Adzuna:", error);
        return [];
    }
};
