// SAGE "IRON DOME" PROTOCOLS
// These rules define how the AI intercepts and routes user queries.

// 1. INTENT CLASSIFICATION
export type Intent = 'GREETING' | 'TECH_SUPPORT' | 'ESCALATE_MONEY' | 'ESCALATE_BUG' | 'UNKNOWN';

export const classifyIntent = (message: string): Intent => {
    const lower = message.toLowerCase();

    // MONEY / URGENT (Escalate immediately)
    if (lower.includes('money') || lower.includes('payment') || lower.includes('contract') || lower.includes('enterprise') || lower.includes('billing') || lower.includes('$')) {
        return 'ESCALATE_MONEY';
    }

    // GREETING / HOW-TO (Solve instantly)
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('how do i') || lower.includes('help') || lower.includes('profile')) {
        return 'GREETING';
    }

    // TECH ERROR (Attempt fit, then fail)
    if (lower.includes('error') || lower.includes('bug') || lower.includes('broken') || lower.includes('fail') || lower.includes('upload')) {
        return 'ESCALATE_BUG';
    }

    return 'UNKNOWN';
};

// 2. KNOWLEDGE BASE ANSWERS (The 80% Layer)
export const getAutoResponse = (intent: Intent): string | null => {
    switch (intent) {
        case 'GREETING':
            return "Greetings, Architect. I am fully operational. I can help you find bounties, optimize your assets, or troubleshoot the Engine.";
        case 'UNKNOWN':
            return "I am analyzing your query... My databases are searching... (Try asking about 'Payments' or 'Bugs').";
        default:
            return null; // Trigger escalation
    }
};
