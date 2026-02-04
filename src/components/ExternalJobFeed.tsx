import React, { useState, useEffect } from 'react';
import { transformJobToQuest, type TransformedQuest } from '../services/JobTransformationService';
import { fetchAdzunaJobs } from '../services/AdzunaService';
import BountyCard from './BountyCard';

// MOCK ADZUNA RESPONSE (Fallback)
const MOCK_ADZUNA_JOBS = [
    { id: "mock_1", title: "Freelance Content Writer", originalPay: 150, description: "Write blog posts for a tech startup.", url: "#", company: "Mock Corp", postedAt: new Date().toISOString() },
    { id: "mock_2", title: "Graphic Designer needed for Logo", originalPay: 300, description: "Need a modern logo for a coffee shop.", url: "#", company: "Design Shop", postedAt: new Date().toISOString() },
    { id: "mock_3", title: "Grant Researcher", originalPay: 500, description: "Find grants for environmental non-profit.", url: "#", company: "Eco Grants", postedAt: new Date().toISOString() }
];

interface ExternalJobFeedProps {
    selectedRole?: string | null;
}

const ExternalJobFeed: React.FC<ExternalJobFeedProps> = ({ selectedRole }) => {
    const [quests, setQuests] = useState<TransformedQuest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadJobs = async () => {
            setIsLoading(true);
            try {
                // Fetch real jobs
                const realJobs = await fetchAdzunaJobs();

                let jobsToTransform = realJobs;

                // Fallback if API keys aren't set or quota exceeded
                if (realJobs.length === 0) {
                    // console.log("Using fallback mock data for External Feed.");
                    jobsToTransform = MOCK_ADZUNA_JOBS;
                }

                const loadedQuests = jobsToTransform.map(job => transformJobToQuest(job));
                setQuests(loadedQuests);
            } catch (err) {
                console.error("Feed Error:", err);
                // Fallback
                setQuests(MOCK_ADZUNA_JOBS.map(job => transformJobToQuest(job)));
            } finally {
                setIsLoading(false);
            }
        };

        loadJobs();
    }, []);

    // Filter Logic based on Hero Selection
    const filteredQuests = selectedRole
        ? quests.filter(q => {
            // Simple mapping: Role name vs Guild/Tags
            if (selectedRole === 'Code / Dev') return q.guildId === 'Visionary' || q.guildId === 'Scribe' || q.guildId === 'Architect';
            if (selectedRole === 'Design / Creative') return q.guildId === 'Visionary';
            if (selectedRole === 'Marketing / Sales') return q.guildId === 'Strategist';
            if (selectedRole === 'Writing / Content') return q.guildId === 'Scribe';
            return true;
        })
        : quests;

    if (!isLoading && filteredQuests.length === 0) return null;

    return (
        <div className="mt-8 space-y-4 px-4 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest">
                        {isLoading ? 'Scanning Global Networks...' : (selectedRole ? `Opportunities for ${selectedRole}` : 'Live External Feed')}
                    </h3>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-12 text-slate-500 animate-pulse">
                    Intercepting Signals...
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {filteredQuests.map(quest => (
                        <div key={quest.id} className="relative group">
                            {/* TRANSFORMATION OVERLAY (Visual Flair) */}
                            <div className="absolute -top-3 left-4 bg-purple-900/90 text-purple-200 text-[10px] font-bold px-2 py-1 rounded border border-purple-500/50 z-20 shadow-lg">
                                ✨ AI SAGE: REWRITTEN
                            </div>

                            <BountyCard
                                id={quest.id}
                                title={quest.title}
                                reward={quest.reward}
                                cause={quest.guildId} // Mapping Guild to "Cause" for display
                                time="2 Days"
                                difficulty="Medium"
                                source="Adzuna API"
                                financials={quest.financials}
                                onSolve={() => window.open(quest.originalDescription || '#', '_blank')} // Link to original job
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExternalJobFeed;
