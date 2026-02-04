import React from 'react';

// UI Metadata (Presentation Layer) separating "Law" (Config) from "Style" (Code)
const GUILD_METADATA: Record<string, { title: string; category: string; icon: string; description: string }> = {
    "Scribe": { title: "The Scribes", category: "Writing", icon: "✍️", description: "Grant writing, technical documentation, SEO blogs." },
    "Visionary": { title: "The Visionaries", category: "Design", icon: "🎨", description: "UI/UX audits, brand identity, social media graphics." },
    "Strategist": { title: "The Strategists", category: "Marketing", icon: "🚀", description: "Ad campaign setups, growth loops, newsletter automation." },
    "Analyst": { title: "The Analysts", category: "Research", icon: "🔍", description: "Market research, lead generation, CRM cleanup." },
    "Guardian": { title: "The Guardians", category: "Impact", icon: "❤️", description: "ESG reporting, community moderation, donor outreach." }
};

interface GuildBadgeProps {
    id: string; // Now receives the simple string e.g. "Scribe"
    showDescription?: boolean;
}

const GuildBadge: React.FC<GuildBadgeProps> = ({ id, showDescription = false }) => {
    const meta = GUILD_METADATA[id];

    if (!meta) return null;

    return (
        <div className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-lg hover:border-cyan-500/30 transition-all cursor-default group">
            <div className="text-2xl bg-slate-800 rounded-md p-2 shadow-inner group-hover:scale-110 transition-transform">
                {meta.icon}
            </div>
            <div>
                <h4 className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">
                    {meta.title}
                </h4>
                <div className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">
                    {meta.category}
                </div>
                {showDescription && (
                    <p className="text-xs text-slate-400 mt-1">
                        {meta.description}
                    </p>
                )}
            </div>
        </div>
    );
};

export default GuildBadge;
