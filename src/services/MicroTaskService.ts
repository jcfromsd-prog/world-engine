
export interface MicroTask {
    id: string;
    platform: 'MTurk' | 'Clickworker' | 'JumpTask' | 'Appen' | 'UserTesting' | 'Prolific';
    title: string;
    description: string;
    pay: number;
    currency: 'USD' | 'JMPT' | 'EUR';
    timeEstimate: string; // e.g. "5 min"
    url: string;
    actionLabel: string; // e.g. "START TASK", "TEST APP"
}

// REALITY PROTOCOL: No Mock Data.
// This service now strictly requires a Real-Time Source (Apify or RSS).
// Currently returns empty to prevent "Fake" tasks from appearing.

export const fetchMicroTasks = async (): Promise<MicroTask[]> => {
    // TODO: Connect to Apify 'Micro-Task Scraper' when token is available.
    // Until then, return SILENCE to avoid polluting the feed with mocks.
    return [];
};

