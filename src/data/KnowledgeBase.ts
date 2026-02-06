export interface SkillNode {
    id: string;
    title: string;
    concept: string;
    example: string;
    bloomLevel: number; // 1: Recall, 2: Apply, 3: Analyze
    mastery: number; // 0 - 100
    category: 'Code' | 'Design' | 'Strategy';
}

export const KNOWLEDGE_BASE: SkillNode[] = [
    {
        id: 'node-1',
        title: 'Variables & State',
        concept: 'Containers for storing data values that can change during execution.',
        example: 'let score = 0; score += 10;',
        bloomLevel: 1,
        mastery: 0,
        category: 'Code'
    },
    {
        id: 'node-2',
        title: 'Rule of Thirds',
        concept: 'A composition guide that places your subject in the left or right third of an image.',
        example: 'Aligning a horizon line with the bottom horizontal grid line.',
        bloomLevel: 2,
        mastery: 0,
        category: 'Design'
    },
    {
        id: 'node-3',
        title: 'Functions',
        concept: 'Reusable blocks of code designed to perform a particular task.',
        example: 'function calculateImpact(points) { return points * 1.5; }',
        bloomLevel: 1,
        mastery: 0,
        category: 'Code'
    },
    {
        id: 'node-4',
        title: 'Typography Hierarchy',
        concept: 'Using size, color, and weight to guide the eye to the most important info first.',
        example: 'Making a heading 48px Bold and the body text 16px Regular.',
        bloomLevel: 2,
        mastery: 0,
        category: 'Design'
    },
    {
        id: 'node-5',
        title: 'Market Equilibrium',
        concept: 'The state where market supply and demand balance each other, resulting in stable prices.',
        example: 'When the number of bounty solvers matches the number of tasks available.',
        bloomLevel: 3,
        mastery: 0,
        category: 'Strategy'
    },
    {
        id: 'node-6',
        title: 'Conditionals',
        concept: 'Logic that performs different actions based on whether a condition is true or false.',
        example: 'if (balance > 100) { unlockProFeatures(); }',
        bloomLevel: 1,
        mastery: 0,
        category: 'Code'
    },
    {
        id: 'node-7',
        title: 'Color Psychology',
        concept: 'The study of how colors affect human behavior and decision making.',
        example: 'Using blue to evoke trust in a financial application.',
        bloomLevel: 2,
        mastery: 0,
        category: 'Design'
    },
    {
        id: 'node-8',
        title: 'Array Mapping',
        concept: 'Transforming a list of items into a new list using a specific rule.',
        example: 'missions.map(m => m.title)',
        bloomLevel: 2,
        mastery: 0,
        category: 'Code'
    },
    {
        id: 'node-9',
        title: 'User Personas',
        concept: 'Fictional characters created to represent different user types that might use your service.',
        example: "Creating 'Sovereign Sarah' to model a high-efficiency solo freelancer.",
        bloomLevel: 2,
        mastery: 0,
        category: 'Strategy'
    },
    {
        id: 'node-10',
        title: 'Visual Contrast',
        concept: 'The difference between elements that makes them stand out from one another.',
        example: 'Placing bright cyan text on a deep midnight black background.',
        bloomLevel: 1,
        mastery: 0,
        category: 'Design'
    }
];
