import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import AgencyAgreement from './AgencyAgreement';
import { fetchAdzunaJobs } from '../services/AdzunaService';
import { fetchApifyGigs } from '../services/ApifyService';
import { fetchMicroTasks, type MicroTask } from '../services/MicroTaskService';
import BountyCard from './BountyCard';

interface Task {
    id: string | number;
    title: string;
    description: string;
    salary_min: number;
    redirect_url: string;
    isPremium?: boolean;
    category?: 'security' | 'growth' | 'dev' | 'micro';
    platform?: string;
    actionLabel?: string;
}

const SkillSparkEngine = ({ isLocked = false }: { isLocked?: boolean }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'solo' | 'squad'>('solo');

    // Agency Agreement State
    const [showAgreement, setShowAgreement] = useState(false);
    const [pendingUrl, setPendingUrl] = useState<string | null>(null);
    const [contractSigned, setContractSigned] = useState(() => {
        return localStorage.getItem('world_engine_contract_signed') === 'true';
    });

    useEffect(() => {
        const fetchSparks = async () => {
            // 1. Fetch Local "Strategist" Bounties (The "Bridge")
            const localBounties: Task[] = JSON.parse(localStorage.getItem('local_bounties') || '[]').map((b: Task) => ({
                id: b.id,
                title: b.title,
                description: b.description,
                salary_min: b.salary_min,
                redirect_url: b.redirect_url,
                isPremium: true
            }));

            // 2. Fetch Adzuna (The "Volume") - Automated
            const adzunaResults = await fetchAdzunaJobs();

            const adaptedAdzuna = adzunaResults.map((job: { id: string; title: string; description: string; originalPay: number; url: string }) => ({
                id: job.id,
                title: job.title,
                description: job.description,
                salary_min: job.originalPay,
                redirect_url: job.url,
                isPremium: false
            }));

            // 3. Fetch Apify (The "Scraper") - High Value Real Gigs
            const apifyResults = await fetchApifyGigs('wordpress_seo');
            const adaptedApify = apifyResults.map((gig: { id: string; title: string; platform: string; price: string; url: string }) => ({
                id: gig.id,
                title: gig.title,
                description: `Sourced from ${gig.platform}. click to view details.`,
                salary_min: parseInt(gig.price) || 50,
                redirect_url: gig.url,
                isPremium: true
            }));

            // 4. INJECT: Real-World Partner Bounties (Verified Live)
            const partnerBounties: Task[] = [
                {
                    id: 'h1_tesla',
                    title: 'Tesla Bug Bounty Program',
                    description: 'Report vulnerabilities in vehicle software, hardware, or web assets. (Evergreen)',
                    salary_min: 15000,
                    redirect_url: 'https://bugcrowd.com/tesla',
                    isPremium: true,
                    category: 'security'
                },
                {
                    id: 'h1_nintendo',
                    title: 'Nintendo HackerOne Program',
                    description: 'Vulnerability disclosure for Nintendo Switch and 3DS systems.',
                    salary_min: 5000,
                    redirect_url: 'https://hackerone.com/nintendo',
                    isPremium: true,
                    category: 'security'
                },
                {
                    id: 'partner_epic',
                    title: 'Epic Games Security Program',
                    description: 'Active bounty program for Fortnite and Epic Online Services.',
                    salary_min: 2500,
                    redirect_url: 'https://hackerone.com/epic_games',
                    isPremium: true,
                    category: 'security'
                }
            ];

            // 5. Fetch Micro-Task Stream (The "Rain")
            const microTasks = await fetchMicroTasks();
            const adaptedMicro: Task[] = microTasks.map((task: MicroTask) => ({
                id: task.id,
                title: task.title,
                description: task.description,
                salary_min: task.pay,
                redirect_url: task.url,
                isPremium: false,
                category: 'micro',
                platform: task.platform,
                actionLabel: task.actionLabel
            }));

            setTasks([...partnerBounties, ...localBounties, ...adaptedApify, ...adaptedAdzuna, ...adaptedMicro]);
            setLoading(false);
        };
        fetchSparks();
    }, []);

    const handleAcceptChallenge = (url: string) => {
        if (contractSigned) {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            setPendingUrl(url);
            setShowAgreement(true);
        }
    };

    const handleContractSign = () => {
        localStorage.setItem('world_engine_contract_signed', 'true');
        setContractSigned(true);
        setShowAgreement(false);
        if (pendingUrl) {
            window.open(pendingUrl, '_blank', 'noopener,noreferrer');
            setPendingUrl(null);
        }
    };

    return (
        <div className="bg-black/40 text-gray-400 font-mono p-1 rounded-sm">
            <AgencyAgreement
                isOpen={showAgreement}
                onClose={() => setShowAgreement(false)}
                onAccept={handleContractSign}
            />

            <div className="flex flex-wrap justify-between items-center border-b border-gray-900 pb-4 mb-6 pt-2">
                <h2 className="text-xs font-black text-gray-500 tracking-[0.2em] uppercase flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Potential Calibration Feed
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('solo')}
                        className={`text-[10px] font-black px-4 py-1.5 transition-all uppercase tracking-widest ${viewMode === 'solo' ? 'bg-green-500 text-black' : 'bg-gray-900 text-gray-600 hover:text-gray-400'}`}
                    >
                        SOLO [+100% XP]
                    </button>
                    <button
                        onClick={() => setViewMode('squad')}
                        className={`text-[10px] font-black px-4 py-1.5 transition-all uppercase tracking-widest ${viewMode === 'squad' ? 'bg-cyan-500 text-black' : 'bg-gray-900 text-gray-600 hover:text-gray-400'}`}
                    >
                        SQUAD [15% BONUS]
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="py-20 text-center animate-pulse flex flex-col items-center gap-4">
                    <Zap className="text-green-500 animate-bounce" size={32} />
                    <span className="text-xs uppercase tracking-[0.3em] text-gray-600">Scanning Global Frequencies...</span>
                </div>
            ) : tasks.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-gray-800 rounded-sm bg-gray-950/50">
                    <h3 className="text-gray-600 font-black mb-2 uppercase tracking-widest">No Global Signals Detected</h3>
                    <p className="text-gray-700 text-[10px] mb-6 max-w-xs mx-auto uppercase leading-relaxed">
                        The frequencies are silent. Deploy a strategic bounty to initialize the market.
                    </p>
                    <button
                        onClick={() => document.querySelector<HTMLButtonElement>('.main-post-btn')?.click()}
                        className="bg-green-500/10 text-green-500 border border-green-500/50 px-6 py-2 text-xs font-black hover:bg-green-500 hover:text-black transition-all uppercase tracking-widest"
                    >
                        Deploy Strategic Bounty (+250 XP)
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {tasks.map((task) => {
                        const randomOffset = 50 + (task.id.toString().length % 400);
                        const rawPay = task.salary_min || randomOffset;
                        const userPay = (rawPay * 0.45).toFixed(2);

                        return (
                            <BountyCard
                                key={task.id}
                                id={task.id}
                                title={task.title}
                                reward={`$${userPay}`}
                                cause={task.category?.toUpperCase() || "DEVELOPMENT"}
                                time="Active"
                                difficulty={task.isPremium ? "Hard" : "Medium"}
                                onSolve={() => handleAcceptChallenge(task.redirect_url)}
                                locked={isLocked}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SkillSparkEngine;
