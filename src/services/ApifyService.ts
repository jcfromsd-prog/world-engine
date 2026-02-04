
interface ScrapedGig {
    id: string;
    title: string;
    price: string;
    url: string;
    image?: string;
    platform: 'Fiverr' | 'Upwork' | 'Freelancer';
}

const APIFY_TOKEN = import.meta.env.VITE_APIFY_TOKEN;
// Example Actor: 'hudson/fiverr-actor' (This is a placeholder ID, user needs to select their preferred actor)
const FIVERR_ACTOR_ID = 'BPlKbiKgAi5l3lA0V';

export const fetchApifyGigs = async (query: string = 'website development'): Promise<ScrapedGig[]> => {
    if (!APIFY_TOKEN) {
        console.warn("Apify Token missing. Skipping scrape.");
        return [];
    }

    console.log("Initializing Neural Scraper for:", query);

    try {
        // 1. Start the Actor Run
        const runResponse = await fetch(`https://api.apify.com/v2/acts/${FIVERR_ACTOR_ID}/runs?token=${APIFY_TOKEN}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                search: query,
                maxItems: 10
            })
        });

        if (!runResponse.ok) {
            throw new Error(`Apify Run Failed: ${runResponse.statusText}`);
        }

        const runData = await runResponse.json();
        const datasetId = runData.data.defaultDatasetId;
        console.log("Apify Run Started. Dataset ID:", datasetId);

        // 2. Poll for Results (Simplified: We just wait 5s and check, in prod we'd poll status)
        // For the "Instant Feed" demo, this might be too slow. 
        // Strategy: We might want to use a "Saved Run" or "Last Run" dataset if available.
        // For now, let's just return an empty promise that resolves strictly to avoid hanging the UI,
        // as scraping takes time (10-30s).

        // REALITY CHECK: Client-side scraping is slow. 
        // Better Pattern: We hit the "Get Last Run" endpoint for instant data, 
        // and trigger a new run in the background. /runs/last/dataset/items

        const dataResponse = await fetch(`https://api.apify.com/v2/acts/${FIVERR_ACTOR_ID}/runs/last/dataset/items?token=${APIFY_TOKEN}`);

        if (!dataResponse.ok) return [];

        const items = await dataResponse.json();

        return items.map((item: {
            id?: string;
            title: string;
            price: string;
            url: string;
            thumbnail?: string;
        }) => ({
            id: item.id || Math.random().toString(),
            title: item.title,
            price: item.price, // Needs normalization
            url: item.url,
            image: item.thumbnail,
            platform: 'Fiverr'
        }));

    } catch (error: unknown) {
        console.error("Scraping Protocol Failed:", error);
        return [];
    }
};
