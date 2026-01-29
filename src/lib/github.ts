/**
 * World Engine - GitHub Bounties Integration
 * Fetches real open-source issues with bounty labels
 */

// Types for GitHub API responses
export interface GitHubIssue {
    id: number;
    number: number;
    title: string;
    body: string | null;
    html_url: string;
    state: string;
    labels: GitHubLabel[];
    created_at: string;
    updated_at: string;
    user: {
        login: string;
        avatar_url: string;
    };
    repository_url: string;
}

export interface GitHubLabel {
    name: string;
    color: string;
}

export interface GitHubRepo {
    full_name: string;
    stargazers_count: number;
    language: string;
    description: string;
}

export interface ParsedBounty {
    id: string;
    source: 'github';
    title: string;
    description: string;
    reward: string;
    rewardAmount: number;
    url: string;
    repo: string;
    repoStars: number;
    language: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    labels: string[];
    author: string;
    authorAvatar: string;
    createdAt: string;
    issueNumber: number;
}

// Bounty label patterns to search for
const BOUNTY_LABELS = [
    'bounty',
    'help wanted',
    'good first issue',
    'hacktoberfest',
    'bug bounty',
    'reward',
    'paid'
];

// Parse bounty amount from issue body
function parseBountyAmount(body: string | null): { amount: number; display: string } {
    if (!body) return { amount: 0, display: 'Open Bounty' };

    // Match patterns like "$50", "$100 bounty", "100 USD", etc.
    const patterns = [
        /\$(\d+(?:,\d{3})*(?:\.\d{2})?)/i,           // $50, $1,000
        /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:USD|dollars?)/i,  // 50 USD
        /bounty[:\s]*\$?(\d+(?:,\d{3})*)/i,         // bounty: 50
        /reward[:\s]*\$?(\d+(?:,\d{3})*)/i          // reward: 50
    ];

    for (const pattern of patterns) {
        const match = body.match(pattern);
        if (match) {
            const amount = parseFloat(match[1].replace(/,/g, ''));
            return { amount, display: `$${amount.toLocaleString()}` };
        }
    }

    return { amount: 0, display: 'Open Bounty' };
}

// Estimate difficulty based on labels
function estimateDifficulty(labels: GitHubLabel[]): 'Easy' | 'Medium' | 'Hard' {
    const labelNames = labels.map(l => l.name.toLowerCase());

    if (labelNames.some(l => l.includes('good first') || l.includes('beginner') || l.includes('easy'))) {
        return 'Easy';
    }
    if (labelNames.some(l => l.includes('hard') || l.includes('complex') || l.includes('expert'))) {
        return 'Hard';
    }
    return 'Medium';
}

// Fetch issues with bounty-related labels from GitHub
export async function fetchGitHubBounties(options: {
    repos?: string[];  // Optional specific repos to search
    labels?: string[];
    limit?: number;
} = {}): Promise<ParsedBounty[]> {
    const labels = options.labels || BOUNTY_LABELS;
    const limit = options.limit || 20;

    // Build search query
    const labelQuery = labels.map(l => `label:"${l}"`).join(' OR ');
    const query = `is:issue is:open (${labelQuery}) sort:updated-desc`;

    const searchUrl = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=${limit}`;

    try {
        const response = await fetch(searchUrl, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                // Add token if available for higher rate limits
                ...(import.meta.env.VITE_GITHUB_TOKEN && {
                    'Authorization': `token ${import.meta.env.VITE_GITHUB_TOKEN}`
                })
            }
        });

        if (!response.ok) {
            console.error('GitHub API error:', response.status);
            return [];
        }

        const data = await response.json();
        const bounties: ParsedBounty[] = [];

        for (const issue of data.items || []) {
            // Extract repo name from repository_url
            const repoMatch = issue.repository_url.match(/repos\/(.+)/);
            const repoName = repoMatch ? repoMatch[1] : 'unknown/repo';

            // Parse bounty amount from body
            const { amount, display } = parseBountyAmount(issue.body);

            // Fetch repo details for stars and language
            let repoStars = 0;
            let language = 'Unknown';

            try {
                const repoResponse = await fetch(issue.repository_url, {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        ...(import.meta.env.VITE_GITHUB_TOKEN && {
                            'Authorization': `token ${import.meta.env.VITE_GITHUB_TOKEN}`
                        })
                    }
                });
                if (repoResponse.ok) {
                    const repoData = await repoResponse.json();
                    repoStars = repoData.stargazers_count || 0;
                    language = repoData.language || 'Unknown';
                }
            } catch (e) {
                // Silently fail for repo details
            }

            bounties.push({
                id: `github-${issue.id}`,
                source: 'github',
                title: issue.title,
                description: issue.body?.slice(0, 200) || 'No description',
                reward: display,
                rewardAmount: amount,
                url: issue.html_url,
                repo: repoName,
                repoStars,
                language,
                difficulty: estimateDifficulty(issue.labels),
                labels: issue.labels.map((l: GitHubLabel) => l.name),
                author: issue.user.login,
                authorAvatar: issue.user.avatar_url,
                createdAt: issue.created_at,
                issueNumber: issue.number
            });
        }

        return bounties;
    } catch (error) {
        console.error('Failed to fetch GitHub bounties:', error);
        return [];
    }
}

// Fetch bounties from specific popular repos known for bounties
export async function fetchPopularBountyRepos(): Promise<ParsedBounty[]> {
    const popularRepos = [
        'ethereum/solidity',
        'bitcoin/bitcoin',
        'microsoft/vscode',
        'facebook/react',
        'vercel/next.js',
        'supabase/supabase'
    ];

    const allBounties: ParsedBounty[] = [];

    for (const repo of popularRepos) {
        const url = `https://api.github.com/repos/${repo}/issues?state=open&labels=help%20wanted&per_page=5`;

        try {
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    ...(import.meta.env.VITE_GITHUB_TOKEN && {
                        'Authorization': `token ${import.meta.env.VITE_GITHUB_TOKEN}`
                    })
                }
            });

            if (response.ok) {
                const issues = await response.json();
                for (const issue of issues) {
                    const { amount, display } = parseBountyAmount(issue.body);

                    allBounties.push({
                        id: `github-${issue.id}`,
                        source: 'github',
                        title: issue.title,
                        description: issue.body?.slice(0, 200) || 'No description',
                        reward: display,
                        rewardAmount: amount,
                        url: issue.html_url,
                        repo,
                        repoStars: 0, // Skip for speed
                        language: 'Unknown',
                        difficulty: estimateDifficulty(issue.labels || []),
                        labels: (issue.labels || []).map((l: GitHubLabel) => l.name),
                        author: issue.user?.login || 'unknown',
                        authorAvatar: issue.user?.avatar_url || '',
                        createdAt: issue.created_at,
                        issueNumber: issue.number
                    });
                }
            }
        } catch (e) {
            console.error(`Failed to fetch from ${repo}:`, e);
        }
    }

    return allBounties;
}
