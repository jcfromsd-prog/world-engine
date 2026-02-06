export interface SquadDefinition {
    id: string;
    name: string;
    mission: string;
    requiredRole: string;
    tags: string[];
    image?: string;
}

export const SQUAD_REGISTRY: SquadDefinition[] = [
    {
        id: 'squad-1',
        name: 'The Ocean Cleanup Crew',
        mission: 'Develop autonomous waste-sorting algorithms for Pacific collectors.',
        requiredRole: 'Coder',
        tags: ['Science', 'Code', 'Environment'],
        image: 'https://images.unsplash.com/photo-1484502249270-68775ffef4ae?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: 'squad-2',
        name: 'Eco-Vision Architects',
        mission: 'Design modular urban gardens for high-density social housing.',
        requiredRole: 'Visual Architect',
        tags: ['Art', 'Design', 'Sustainability'],
        image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: 'squad-3',
        name: 'Neural Narrative Lab',
        mission: 'Train AI models to preserve indigenous languages through storytelling.',
        requiredRole: 'Strategist',
        tags: ['AI/ML', 'Education', 'Culture'],
        image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: 'squad-4',
        name: 'Green Grid Guardians',
        mission: 'Optimize decentralized energy sharing protocols for solar villages.',
        requiredRole: 'Coder',
        tags: ['Energy', 'DeFi', 'Code'],
        image: 'https://images.unsplash.com/photo-1466611653911-954ffaa13b6f?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: 'squad-5',
        name: 'Biotone Composers',
        mission: 'Create immersive sound landscapes to reduce stress in recovery wards.',
        requiredRole: 'Visual Architect',
        tags: ['Art', 'Health', 'Sound'],
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: 'squad-6',
        name: 'Zero-Waste Logistics',
        mission: 'Refactor supply chain data to eliminate plastic packaging in local retail.',
        requiredRole: 'Strategist',
        tags: ['Business', 'Sustainability', 'Data'],
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=60'
    }
];
