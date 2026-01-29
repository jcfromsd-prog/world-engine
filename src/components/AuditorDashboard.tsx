import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Mock Submission Interface
interface Submission {
    id: number;
    questTitle: string;
    solverName: string;
    submittedAt: string;
    videoUrl: string;
    repoUrl: string;
    instructions: string;
    status: 'pending' | 'approved' | 'rejected';
}

// Mock Data
const MOCK_SUBMISSIONS: Submission[] = [
    {
        id: 101,
        questTitle: "Clean Climate Data Set",
        solverName: "Data_Striker_99",
        submittedAt: "10 mins ago",
        videoUrl: "https://www.loom.com/share/demo123",
        repoUrl: "https://github.com/datastriker/climate-clean",
        instructions: "Step 1: PIP install pandas. Step 2: Run clean.py. Output is in /data folder.",
        status: 'pending'
    },
    {
        id: 102,
        questTitle: "Design Generic Tech Logo",
        solverName: "Pixel_Weaver_x",
        submittedAt: "45 mins ago",
        videoUrl: "https://www.loom.com/share/logo-walkthrough",
        repoUrl: "https://github.com/pixelweaver/logo-assets",
        instructions: "Open the SVG in Figma or Illustrator.",
        status: 'pending'
    }
];

const AuditorDashboard: React.FC = () => {
    const [submissions, setSubmissions] = useState<Submission[]>(MOCK_SUBMISSIONS);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [emailCopied, setEmailCopied] = useState(false);

    const selectedSubmission = submissions.find(s => s.id === selectedId);

    const handleApprove = (id: number) => {
        setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: 'approved' } : s));
        setSelectedId(null);
    };

    const handleReject = (id: number) => {
        setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: 'rejected' } : s));
        setSelectedId(null);
    };

    const generateClientEmail = (s: Submission) => {
        const email = `Hi Client,

I've personally reviewed the submission for "${s.questTitle}" by ${s.solverName}.

✅ Tech Audit Passed
✅ Security Check Passed

Here is the video demonstration:
${s.videoUrl}

Deployment Instructions:
${s.instructions}

Funds have been released to the solver.
        
Best,
The World Engine Team`;

        navigator.clipboard.writeText(email);
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 font-mono">
            <header className="max-w-7xl mx-auto mb-12 border-b border-slate-800 pb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2">AUDITOR DASHBOARD</h1>
                    <p className="text-slate-400">Quality Control Protocol • Active Queue: <span className="text-cyan-400">{submissions.filter(s => s.status === 'pending').length}</span></p>
                </div>
                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-slate-900 rounded border border-slate-800 text-xs">
                        <span className="block text-slate-500 mb-1">TOTAL PAYOUT PENDING</span>
                        <span className="text-xl font-bold text-white">$650.00</span>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 1. THE QUEUE */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-4">Pending Review</h2>
                    {submissions.filter(s => s.status === 'pending').length === 0 && (
                        <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-600">
                            No pending submissions.
                        </div>
                    )}
                    {submissions.filter(s => s.status === 'pending').map(s => (
                        <div
                            key={s.id}
                            onClick={() => setSelectedId(s.id)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedId === s.id
                                ? 'bg-cyan-500/10 border-cyan-500 ring-1 ring-cyan-500'
                                : 'bg-slate-900 border-slate-800 hover:border-slate-600'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] rounded font-bold uppercase tracking-wider">
                                    #{s.id}
                                </span>
                                <span className="text-xs text-slate-500">{s.submittedAt}</span>
                            </div>
                            <h3 className="font-bold text-white mb-1 truncate">{s.questTitle}</h3>
                            <p className="text-sm text-slate-400">by <span className="text-cyan-400">{s.solverName}</span></p>
                        </div>
                    ))}
                </div>

                {/* 2. THE WORKBENCH */}
                <div className="lg:col-span-2">
                    <h2 className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-4">Audit Interface</h2>

                    {selectedSubmission ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={selectedSubmission.id}
                            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{selectedSubmission.questTitle}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-sm text-slate-400">Live Audit Session</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <a
                                        href={selectedSubmission.repoUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 text-sm font-bold flex items-center gap-2"
                                    >
                                        <span>📂</span> View Code
                                    </a>
                                    <a
                                        href={selectedSubmission.videoUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-4 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded hover:bg-purple-500/20 text-sm font-bold flex items-center gap-2"
                                    >
                                        <span>📺</span> Watch Demo
                                    </a>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Video Proof</label>
                                    <div className="aspect-video bg-black rounded-lg border border-slate-800 flex items-center justify-center relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                                            <p className="text-white text-sm font-medium truncate">{selectedSubmission.videoUrl}</p>
                                        </div>
                                        <span className="text-4xl opacity-50 group-hover:opacity-100 transition-opacity">▶️</span>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Deployment Instructions (Grandma Test)</label>
                                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-sm text-slate-300 leading-relaxed font-sans h-40 overflow-y-auto">
                                            {selectedSubmission.instructions}
                                        </div>
                                    </div>

                                    {/* White Glove Generator */}
                                    <div className="p-4 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/20 rounded-xl">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">White Glove Service</span>
                                            {emailCopied && <span className="text-xs text-green-400 font-bold animate-pulse">COPIED TO CLIPBOARD!</span>}
                                        </div>
                                        <button
                                            onClick={() => generateClientEmail(selectedSubmission)}
                                            className="w-full py-2 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 rounded hover:bg-cyan-500/20 text-sm font-bold transition-all"
                                        >
                                            Generate Client Email 📋
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-6 bg-slate-950 border-t border-slate-800 flex justify-end gap-3">
                                <button
                                    onClick={() => handleReject(selectedSubmission.id)}
                                    className="px-6 py-3 rounded-lg font-bold text-red-500 hover:bg-red-500/10 transition border border-transparent hover:border-red-500/30"
                                >
                                    Reject (Needs Fix)
                                </button>
                                <button
                                    onClick={() => handleApprove(selectedSubmission.id)}
                                    className="px-8 py-3 rounded-lg font-bold text-white bg-green-600 hover:bg-green-500 transition shadow-lg shadow-green-500/20"
                                >
                                    APPROVE & PAY
                                </button>
                            </div>

                        </motion.div>
                    ) : (
                        <div className="h-96 flex flex-col items-center justify-center text-slate-600 border border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
                            <span className="text-4xl mb-4">⚡</span>
                            <p>Select a submission to begin audit.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuditorDashboard;
