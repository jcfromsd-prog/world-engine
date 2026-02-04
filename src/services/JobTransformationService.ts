import config from '../data/worldEngineConfig.json';

// TYPES
export interface TransformedQuest {
    id: string;
    title: string;
    originalTitle: string;
    description: string;
    originalDescription: string;
    reward: string;
    financials: {
        founderLevy: number;
        leadSolver: number;
        supportSquad: number;
        aiCompute: number;
        growthFund: number;
    };
    milestones: string[];
    verification: string; // "The Grandma Test"
    tags: string[];
    guildId: string;
}

// THE SAGE'S PROMPT (Simulated AI Logic)
// In a real backend, this would call GPT-4 with a System Prompt.
export const transformJobToQuest = (rawJob: { originalPay?: number; title: string; description: string }): TransformedQuest => {
    const rawPay = rawJob.originalPay || 100;

    // 1. ECONOMIC CALCULUS (15/55/20/5/5)
    // Using config.economicModel to ensure sovereignty
    const splits = {
        founderLevy: rawPay * config.economicModel.founderLevy,
        leadSolver: rawPay * config.economicModel.leadSolver,
        supportSquad: rawPay * config.economicModel.supportSquad,
        aiCompute: rawPay * config.economicModel.aiCompute,
        growthFund: rawPay * config.economicModel.growthFund
    };

    // 2. GUILD MAPPING (Logic to route jobs to the right guild)
    let guildId = "Scribe"; // Default
    const lowerTitle = rawJob.title.toLowerCase();

    if (lowerTitle.includes('design') || lowerTitle.includes('ux') || lowerTitle.includes('ui')) guildId = "Visionary";
    if (lowerTitle.includes('marketing') || lowerTitle.includes('growth') || lowerTitle.includes('seo')) guildId = "Strategist";
    if (lowerTitle.includes('research') || lowerTitle.includes('admin') || lowerTitle.includes('data')) guildId = "Analyst";
    if (lowerTitle.includes('grant') || lowerTitle.includes('impact') || lowerTitle.includes('esg')) guildId = "Guardian";

    // 3. THE REWRITE (Transforming "Boring" to "Epic")
    // This mocks the LLM's output
    const epicTitle = `Execute: ${rawJob.title}`;

    return {
        id: `quest-${Math.random().toString(36).substr(2, 9)}`,
        title: epicTitle,
        originalTitle: rawJob.title,
        description: `OBJECTIVE: ${rawJob.description || "Complete the designated task with precision."}`,
        originalDescription: rawJob.description,
        reward: `$${rawPay.toFixed(0)}`,
        financials: splits,
        milestones: [
            "Phase 1: Initial Draft & Squad Review",
            "Phase 2: Final Polish",
            "Phase 3: Grandma Test Verification"
        ],
        verification: config.verificationStandard, // "Grandma Test v1.0"
        tags: ["Imported", "Verified Opportunity"],
        guildId: guildId
    };
};
