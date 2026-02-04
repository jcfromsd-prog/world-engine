// SAGE "IRON DOME" PROTOCOLS
// These rules define how the AI intercepts and routes user queries.

// 1. INTENT CLASSIFICATION
// 1. INTENT CLASSIFICATION
export type Intent = 'GREETING' | 'TECH_SUPPORT' | 'ESCALATE_MONEY' | 'ESCALATE_BUG' | 'EARNINGS' | 'WORK' | 'GAUNTLET' | 'UNKNOWN';

export const classifyIntent = (message: string): Intent => {
    const lower = message.toLowerCase();

    // MONEY / URGENT (Escalate immediately)
    if (lower.includes('contract') || lower.includes('enterprise') || lower.includes('billing') || lower.includes('lawsuit')) {
        return 'ESCALATE_MONEY';
    }

    // EARNINGS (Self-Serve)
    if (lower.includes('money') || lower.includes('pay') || lower.includes('withdraw') || lower.includes('wallet') || lower.includes('earnings')) {
        return 'EARNINGS';
    }

    // WORK / BOUNTIES
    if (lower.includes('job') || lower.includes('work') || lower.includes('bounty') || lower.includes('task') || lower.includes('start')) {
        return 'WORK';
    }

    // GAUNTLET
    if (lower.includes('gauntlet') || lower.includes('level') || lower.includes('rank') || lower.includes('contest')) {
        return 'GAUNTLET';
    }

    // GREETING / HOW-TO (Solve instantly)
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('how ') || lower.includes('help') || lower.includes('profile')) {
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
            return "James, are we building toward your purpose today? I found a task that matches your desire to master your craft. Shall we look at it? I am here to guide your velocity.";
        case 'EARNINGS':
            return "The numbers are the scoreboard of your impact. Your Vault balance ($0.00) reflects the potential wait. Click 'Earnings' in the header to audit your treasury and prepare for distribution.";
        case 'WORK':
            return "The market is hungry for solutions. Venture into the 'Opportunities' tab. Choose a bounty that challenges your current level. Remember: Perfection is the enemy of velocity.";
        case 'GAUNTLET':
            return "Ah, the Forge of Guardians. You are Level 4. The Gauntlet demands Level 5 clearance. Complete 3 more high-impact bounties. We do not gamble with the Engine; we architect it.";
        case 'UNKNOWN':
            return "I am analyzing the data stream... Pattern not recognized. In the old days, we called this 'noise'. Speak with keywords like 'Money', 'Bounties', or 'Gauntlet' so I can narrow the signal.";
        default:
            return null; // Trigger escalation
    }
};
