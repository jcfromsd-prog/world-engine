// --- GENESIS FEED: MISSION GENERATOR SERVICE ---
// Simulates a live job marketplace with dynamic mission drops

export interface LiveMission {
    id: string;
    type: 'TRAINING' | 'CLIENT_CONTRACT' | 'BOUNTY';
    title: string;
    client: string;
    reward: number;
    desc: string;
    category: 'CODING' | 'CREATIVE' | 'SCIENCE' | 'LEADERSHIP';
    minGrade: number;
    maxGrade: number;
    status: 'LIVE' | 'TRENDING' | 'EXPIRING' | 'CLAIMED';
    expiresAt: number; // timestamp
    claimedBy?: string;
}

// Template pools for generating realistic missions
const MISSION_TEMPLATES = {
    CODING: [
        { title: 'Fix Navbar CSS', desc: 'Dropdown menu misaligned on mobile.', baseReward: 180 },
        { title: 'Add Dark Mode Toggle', desc: 'Implement theme switcher component.', baseReward: 220 },
        { title: 'Debug Login Flow', desc: 'Users getting stuck on redirect.', baseReward: 350 },
        { title: 'Optimize Page Speed', desc: 'Reduce load time by 40%.', baseReward: 420 },
        { title: 'Build API Endpoint', desc: 'Create REST endpoint for user data.', baseReward: 380 },
        { title: 'Fix Memory Leak', desc: 'Dashboard crashing after 10 minutes.', baseReward: 500 },
    ],
    CREATIVE: [
        { title: 'Design App Icon', desc: 'Modern flat design, 512x512.', baseReward: 200 },
        { title: 'Create Hero Banner', desc: 'Gradient background with text overlay.', baseReward: 280 },
        { title: 'Rebrand Logo', desc: 'Refresh existing brand for Gen-Z.', baseReward: 450 },
        { title: 'Edit Promo Video', desc: '30s social media clip with captions.', baseReward: 320 },
        { title: 'Design Email Template', desc: 'Clean newsletter layout.', baseReward: 240 },
    ],
    SCIENCE: [
        { title: 'Analyze Water Samples', desc: 'Document pH levels from 5 sources.', baseReward: 150 },
        { title: 'Track Plant Growth', desc: 'Weekly measurements for 4 weeks.', baseReward: 180 },
        { title: 'Weather Pattern Log', desc: 'Record and analyze local data.', baseReward: 160 },
        { title: 'Biodiversity Survey', desc: 'Count species in local park.', baseReward: 200 },
    ],
    LEADERSHIP: [
        { title: 'Run Team Standup', desc: 'Facilitate 15-min morning sync.', baseReward: 120 },
        { title: 'Create Project Plan', desc: 'Outline 2-week sprint goals.', baseReward: 260 },
        { title: 'Mentor New Member', desc: 'Onboard and guide for 1 week.', baseReward: 300 },
        { title: 'Resolve Team Conflict', desc: 'Mediate disagreement on approach.', baseReward: 350 },
    ],
};

const CLIENT_NAMES = [
    'TechFlow Inc.', 'StartUp Coffee', 'NeonLabs', 'PixelForge',
    'DataStream Co.', 'CloudNine', 'MindSpark', 'EcoVentures',
    'ByteSize', 'InnovateCo', 'FutureBuild', 'Quantum Leap'
];

let missionCounter = 1000;

export class MissionGenerator {
    /**
     * Generate a single random mission
     */
    static generateMission(category?: keyof typeof MISSION_TEMPLATES): LiveMission {
        const categories = category ? [category] : Object.keys(MISSION_TEMPLATES) as (keyof typeof MISSION_TEMPLATES)[];
        const selectedCategory = categories[Math.floor(Math.random() * categories.length)];
        const templates = MISSION_TEMPLATES[selectedCategory];
        const template = templates[Math.floor(Math.random() * templates.length)];
        const client = CLIENT_NAMES[Math.floor(Math.random() * CLIENT_NAMES.length)];

        // Randomize reward within +/- 20%
        const rewardVariance = template.baseReward * (0.8 + Math.random() * 0.4);
        const reward = Math.round(rewardVariance / 10) * 10; // Round to nearest 10

        // Random expiration (30s to 5min from now)
        const expiresAt = Date.now() + (30 + Math.random() * 270) * 1000;

        // Random status weighting
        const statusRoll = Math.random();
        let status: LiveMission['status'] = 'LIVE';
        if (statusRoll > 0.85) status = 'TRENDING';
        else if (statusRoll > 0.7) status = 'EXPIRING';

        missionCounter++;

        return {
            id: `GEN.${selectedCategory.substring(0, 3)}.${missionCounter}`,
            type: Math.random() > 0.3 ? 'CLIENT_CONTRACT' : 'BOUNTY',
            title: template.title,
            client,
            reward,
            desc: template.desc,
            category: selectedCategory,
            minGrade: Math.floor(Math.random() * 5),
            maxGrade: 10 + Math.floor(Math.random() * 10),
            status,
            expiresAt,
        };
    }

    /**
     * Generate initial batch of missions
     */
    static generateInitialFeed(count: number = 6): LiveMission[] {
        const missions: LiveMission[] = [];
        const categories: (keyof typeof MISSION_TEMPLATES)[] = ['CODING', 'CREATIVE', 'SCIENCE', 'LEADERSHIP'];

        // Ensure at least one from each category
        for (let i = 0; i < Math.min(count, categories.length); i++) {
            missions.push(this.generateMission(categories[i]));
        }

        // Fill the rest randomly
        for (let i = missions.length; i < count; i++) {
            missions.push(this.generateMission());
        }

        // Sort by reward (high to low)
        return missions.sort((a, b) => b.reward - a.reward);
    }

    /**
     * Simulate another user claiming a mission
     */
    static claimMission(mission: LiveMission): LiveMission {
        return {
            ...mission,
            status: 'CLAIMED',
            claimedBy: `User${Math.floor(Math.random() * 9000 + 1000)}`,
        };
    }
}
