// 1. THE ARCHETYPES (The "Classes" users get sorted into)
export const ARCHETYPES = {
    DATA_STRIKER: {
        id: 'striker',
        title: 'Data Striker',
        icon: '⚡',
        description: 'You see patterns where others see noise. Speed and precision are your weapons.',
        skills: ['Pattern Recognition', 'High Velocity', 'Python'],
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-400',
        borderColor: 'border-yellow-400',
        gradient: 'from-yellow-400 to-orange-500'
    },
    LOGIC_WEAVER: {
        id: 'weaver',
        title: 'Logic Weaver',
        icon: '🕸️',
        description: 'You build systems that last. Architecture and stability are your focus.',
        skills: ['System Design', 'Debugging', 'Optimization'],
        color: 'text-purple-400',
        bgColor: 'bg-purple-400',
        borderColor: 'border-purple-400',
        gradient: 'from-purple-400 to-indigo-500'
    },
    SYNTH_COMMANDER: {
        id: 'commander',
        title: 'Synth Commander',
        icon: '⚔️',
        description: 'You lead the swarm. Resource allocation and team optimization are your strengths.',
        skills: ['Project Management', 'Squad Tactics', 'Resource Alloc'],
        color: 'text-red-400',
        bgColor: 'bg-red-400',
        borderColor: 'border-red-400',
        gradient: 'from-red-400 to-pink-500'
    },
    CHAIN_GUARDIAN: {
        id: 'guardian',
        title: 'Chain Guardian',
        icon: '🛡️',
        description: 'You protect the realm. Security, validation, and trust are your domain.',
        skills: ['Security Audit', 'Blockchain', 'Smart Contracts'],
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-400',
        borderColor: 'border-cyan-400',
        gradient: 'from-cyan-400 to-blue-500'
    },
    // NON-TECHNICAL ARCHETYPES
    DESIGN_VISIONARY: {
        id: 'visionary',
        title: 'Design Visionary',
        icon: '🎨',
        description: 'You shape reality. UX, branding, and visual storytelling are your craft.',
        skills: ['UI/UX', 'Figma', 'Brand Strategy'],
        color: 'text-pink-400',
        bgColor: 'bg-pink-400',
        borderColor: 'border-pink-400',
        gradient: 'from-pink-400 to-rose-500'
    },
    WORD_SCRIBE: {
        id: 'scribe',
        title: 'Word Scribe',
        icon: '✍️',
        description: 'You weave narratives. Impact stories and clear communication are your spells.',
        skills: ['Copywriting', 'Content Strategy', 'SEO'],
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-400',
        borderColor: 'border-emerald-400',
        gradient: 'from-emerald-400 to-teal-500'
    },
    GROWTH_HACKER: {
        id: 'hacker',
        title: 'Growth Hacker',
        icon: '🚀',
        description: 'You accelerate impact. Marketing, reach, and user acquisition are your goals.',
        skills: ['Social Media', 'Analytics', 'Campaigns'],
        color: 'text-orange-400',
        bgColor: 'bg-orange-400',
        borderColor: 'border-orange-400',
        gradient: 'from-orange-400 to-amber-500'
    }
};

// 2. THE FIRST BOUNTIES (Mapped to Archetypes)
export const ONBOARDING_BOUNTIES: Record<string, {
    id: number;
    title: string;
    reward: string;
    difficulty: string;
    time: string;
    description: string;
    tags: string[];
    livesImpacted: number;
}> = {
    striker: {
        id: 101,
        title: "Anomaly Detection in Server Logs",
        reward: "$45.00",
        difficulty: "Easy",
        time: "30 mins",
        description: "We have a 50MB log file with 3 error patterns. Find them and save a Fortune 500 retailer from downtime.",
        tags: ["Data", "Python"],
        livesImpacted: 12
    },
    weaver: {
        id: 102,
        title: "Fix Broken Login State",
        reward: "$55.00",
        difficulty: "Medium",
        time: "45 mins",
        description: "The authentication token isn't persisting on refresh. Debug the React hook for a healthcare startup.",
        tags: ["React", "Debug"],
        livesImpacted: 150
    },
    commander: {
        id: 103,
        title: "Optimize Cloud Spend Report",
        reward: "$60.00",
        difficulty: "Easy",
        time: "40 mins",
        description: "Review this AWS bill and identify 3 unused instances. Help a nonprofit save $2,000/month.",
        tags: ["Ops", "Finance"],
        livesImpacted: 400
    },
    guardian: {
        id: 104,
        title: "Smart Contract Security Audit",
        reward: "$75.00",
        difficulty: "Medium",
        time: "60 mins",
        description: "Review this Solidity contract for reentrancy vulnerabilities. Protect $50K in community funds.",
        tags: ["Web3", "Security"],
        livesImpacted: 85
    },
    visionary: {
        id: 105,
        title: "Redesign Donation Flow",
        reward: "$65.00",
        difficulty: "Medium",
        time: "50 mins",
        description: "The current checkout drop-off rate is 60%. Propose a 3-step UI improvement in Figma.",
        tags: ["Design", "UX"],
        livesImpacted: 500
    },
    scribe: {
        id: 106,
        title: "Write Impact Story: Clean Water",
        reward: "$40.00",
        difficulty: "Easy",
        time: "45 mins",
        description: "Turn raw data from a Kenya well project into a compelling 300-word blog post for donors.",
        tags: ["Content", "Storytelling"],
        livesImpacted: 200
    },
    hacker: {
        id: 107,
        title: "Launch Twitter Campaign",
        reward: "$50.00",
        difficulty: "Easy",
        time: "40 mins",
        description: "Draft 5 tweets and 2 LinkedIn posts for the 'Ocean Cleanup' initiative launch next week.",
        tags: ["Marketing", "Social"],
        livesImpacted: 1000
    }
};

// 3. SUGGESTED TEAMMATES (For squad matching)
export const SUGGESTED_TEAMMATES = [
    {
        id: 1,
        name: "Alex Chen",
        avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Alex",
        archetype: "Logic Weaver",
        skills: ["React", "TypeScript"],
        status: "online",
        compatibility: 92
    },
    {
        id: 2,
        name: "Maya Rodriguez",
        avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Maya",
        archetype: "Data Striker",
        skills: ["Python", "ML"],
        status: "online",
        compatibility: 88
    },
    {
        id: 3,
        name: "Jordan Kim",
        avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Jordan",
        archetype: "Chain Guardian",
        skills: ["Solidity", "Security"],
        status: "away",
        compatibility: 85
    }
];

// Helper to determine archetype based on performance
export const determineArchetype = (speed: number, accuracy: boolean): keyof typeof ARCHETYPES => {
    // Speed is in milliseconds - faster = lower number
    if (speed < 3000 && accuracy) {
        return 'DATA_STRIKER'; // Fast and accurate = Striker
    } else if (speed < 6000 && accuracy) {
        return 'LOGIC_WEAVER'; // Methodical and accurate = Weaver
    } else if (speed >= 6000 && accuracy) {
        return 'SYNTH_COMMANDER'; // Thoughtful = Commander
    } else {
        return 'CHAIN_GUARDIAN'; // Careful/retried = Guardian
    }
};
// 4. EVERGREEN BOUNTIES (Always available to prevent "Ghost Town" effect)
export const EVERGREEN_BOUNTIES = [
    {
        id: 201,
        title: "Review Open Source PR #4292",
        reward: "$15.00",
        difficulty: "Easy",
        time: "15 mins",
        description: "Review a small documentation fix for a popular React library. Verify links and grammar.",
        tags: ["Open Source", "Docs"],
        livesImpacted: 50
    },
    {
        id: 202,
        title: "Design Generic Tech Logo",
        reward: "$75.00",
        difficulty: "Medium",
        time: "60 mins",
        description: "Create a minimalist SVG logo for an AI startup. Theme: 'Neural Networks + Growth'.",
        tags: ["Design", "SVG"],
        livesImpacted: 5
    },
    {
        id: 203,
        title: "Python Data Cleanup Script",
        reward: "$30.00",
        difficulty: "Easy",
        time: "25 mins",
        description: "Write a script to normalize phone numbers in a CSV file to E.164 format.",
        tags: ["Python", "Data"],
        livesImpacted: 20
    },
    {
        id: 204,
        title: "Accessibility Audit (Homepage)",
        reward: "$100.00",
        difficulty: "Hard",
        time: "90 mins",
        description: "Audit a landing page for WCAG 2.1 compliance. Write a report on navigation issues.",
        tags: ["A11y", "Audit"],
        livesImpacted: 1000
    },
    {
        id: 205,
        title: "Optimize SQL Query",
        reward: "$50.00",
        difficulty: "Medium",
        time: "40 mins",
        description: "Refactor a slow JOIN operation in PostgreSQL. Current execution: 3.5s. Target: <500ms.",
        tags: ["SQL", "DB"],
        livesImpacted: 200
    },
    {
        id: 206,
        title: "Translate Medical Aid Pamphlet",
        reward: "$45.00",
        difficulty: "Easy",
        time: "35 mins",
        description: "Translate a 1-page health guide from English to Spanish for a clinic in Peru.",
        tags: ["Content", "Translation"],
        livesImpacted: 150
    },
    {
        id: 207,
        title: "Create 'Donate Now' Button Variants",
        reward: "$30.00",
        difficulty: "Easy",
        time: "20 mins",
        description: "Design 3 variations of a CTA button (Hover/Active states) matching our brand guide.",
        tags: ["Design", "UI"],
        livesImpacted: 0
    },
    // FLAGSHIP SQUAD CONTRACT
    {
        id: 301,
        title: "Launch 'Ocean Cleanup' Landing Page",
        reward: "$750.00 Total",
        difficulty: "Hard",
        time: "3 Days",
        description: "Full stack launch for a major non-profit. Requires a coordinated squad.",
        tags: ["Squad", "Web3"],
        livesImpacted: 5000,
        squadRoles: [
            {
                id: 'role_1',
                title: 'Logic Weaver (Dev)',
                icon: '🕸️',
                rewardShare: '$350.00',
                status: 'filled',
                filledBy: { name: 'Alex', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' }
            },
            {
                id: 'role_2',
                title: 'Detail Visionary (Design)',
                icon: '🎨',
                rewardShare: '$250.00',
                status: 'open'
            },
            {
                id: 'role_3',
                title: 'Word Scribe (Copy)',
                icon: '✍️',
                rewardShare: '$150.00',
                status: 'open'
            }
        ]
    }
];
