import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AgencyAgreement from './AgencyAgreement';

// Define the Job interface
interface AdzunaJob {
    id: string | number;
    title: string;
    salary_min?: number;
    company: {
        display_name: string;
    };
    location: {
        display_name: string;
    };
    redirect_url: string;
}

interface AdzunaResponse {
    results: AdzunaJob[];
}

const JobFeed: React.FC = () => {
    const [jobs, setJobs] = useState<AdzunaJob[]>([]);
    const [loading, setLoading] = useState(true);

    // State for Agency Agreement
    const [showAgreement, setShowAgreement] = useState(false);
    const [pendingJobUrl, setPendingJobUrl] = useState<string | null>(null);
    const [contractSigned, setContractSigned] = useState(() => {
        return localStorage.getItem('world_engine_contract_signed') === 'true';
    });

    const APP_ID = import.meta.env.VITE_ADZUNA_APP_ID;
    const APP_KEY = import.meta.env.VITE_ADZUNA_APP_KEY;

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // 1. Fetch Adzuna Jobs (The "Noise")
                const response = await fetch(
                    `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=50&what=freelance%20contract%20remote%20agency%20fiverr%20upwork&content-type=application/json`
                );

                if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

                const data: AdzunaResponse = await response.json();

                // SOVEREIGN FILTER: Remove "Career" roles, keep "Task" roles
                const corporateKeywords = ['Senior', 'Sr.', 'Lead', 'Manager', 'Director', 'Head', 'VP', 'Chief', 'Staff', 'Principal', 'Executive'];

                const filteredJobs = (data.results || []).filter(job => {
                    const title = job.title;
                    if (corporateKeywords.some(keyword => title.includes(keyword))) return false;
                    return true;
                }).slice(0, 5); // Take top 5 valid bounties

                // 2. Fetch Local Bounties (The "Signal")
                const localBounties = JSON.parse(localStorage.getItem('local_bounties') || '[]');

                // Merge: Local Bounties FIRST
                setJobs([...localBounties, ...filteredJobs]);

                setLoading(false);
            } catch (error) {
                console.error("Engine Sync Error:", error);

                // Even if API fails, show Local Bounties
                const localBounties = JSON.parse(localStorage.getItem('local_bounties') || '[]');
                if (localBounties.length > 0) {
                    setJobs(localBounties);
                }

                setLoading(false);
            }
        };

        fetchJobs();
    }, [APP_ID, APP_KEY]);

    const handleAcceptQuest = (url: string) => {
        if (contractSigned) {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            setPendingJobUrl(url);
            setShowAgreement(true);
        }
    };

    const handleContractSign = () => {
        localStorage.setItem('world_engine_contract_signed', 'true');
        setContractSigned(true);
        setShowAgreement(false);
        // "Digital Handshake" Effect or Auto-redirect
        if (pendingJobUrl) {
            window.open(pendingJobUrl, '_blank', 'noopener,noreferrer');
            setPendingJobUrl(null);
        }
    };

    if (loading) return (
        <div className="w-full h-64 flex items-center justify-center border border-green-500/30 bg-black/50 rounded-xl backdrop-blur-sm">
            <div className="text-green-500 font-mono tracking-widest animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-t-green-500 border-green-900 rounded-full animate-spin" />
                SYNCHRONIZING GLOBAL FEED...
            </div>
        </div>
    );

    return (
        <div className="w-full bg-slate-900/50 border border-green-500/30 rounded-xl backdrop-blur-md overflow-hidden relative">
            <AgencyAgreement
                isOpen={showAgreement}
                onClose={() => setShowAgreement(false)}
                onAccept={handleContractSign}
            />
            {/* Header */}
            <div className="p-6 border-b border-green-500/20 flex justify-between items-center bg-black/20">
                <h2 className="text-xl font-bold text-white tracking-wide uppercase flex items-center gap-2">
                    <span className="text-2xl">⚔️</span> Live Revenue Stream
                </h2>
                <div className="flex items-center gap-2 text-xs font-mono text-green-400">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    LIVE
                </div>
            </div>

            {/* Job List */}
            <div className="p-6 space-y-4">
                {jobs.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 italic">No signal found. Check API credentials.</div>
                ) : (
                    jobs.map((job, idx) => {
                        const salary = job.salary_min || 85000;
                        const platformFee = (salary * 0.15).toLocaleString(undefined, { maximumFractionDigits: 0 });
                        const leadSolverShare = (salary * 0.55).toLocaleString(undefined, { maximumFractionDigits: 0 });
                        const squadShare = (salary * 0.20).toLocaleString(undefined, { maximumFractionDigits: 0 });

                        return (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative p-6 bg-black/40 border border-slate-800 rounded-xl hover:border-green-500/50 transition-all duration-300"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-green-400 transition-colors">{job.title}</h3>
                                        <p className="text-slate-400 text-sm flex items-center gap-2">
                                            <span>🏢 {job.company.display_name}</span>
                                            <span>•</span>
                                            <span>📍 {job.location.display_name}</span>
                                            {job.id.toString().startsWith('local_') && (
                                                <span className="ml-2 px-2 py-0.5 bg-yellow-400 text-black text-[10px] uppercase font-bold rounded">
                                                    VERIFIED CLIENT
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleAcceptQuest(job.redirect_url)}
                                        className="px-6 py-2 bg-green-600/10 text-green-400 border border-green-600/50 rounded-lg hover:bg-green-500 hover:text-black font-bold uppercase text-xs tracking-wider transition-all"
                                    >
                                        Accept Quest
                                    </button>
                                </div>

                                {/* Financial Breakdown Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                                    <div className="space-y-1">
                                        <span className="text-[10px] text-green-500 uppercase tracking-widest font-bold">Lead Solver</span>
                                        <div className="text-white font-mono font-bold">${leadSolverShare}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">Platform Levy</span>
                                        <div className="text-white font-mono font-bold opacity-70">${platformFee}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] text-yellow-500 uppercase tracking-widest font-bold">Squad Reserve</span>
                                        <div className="text-white font-mono font-bold opacity-70">${squadShare}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] text-purple-400 uppercase tracking-widest font-bold">Audit</span>
                                        <div className="text-white font-mono font-bold opacity-70">10%</div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default JobFeed;
