import { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle, Play } from 'lucide-react';

const RemixInterface = () => {
    const [step, setStep] = useState(1);
    const [userContext, setUserContext] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // STEP 1: The Context (The Hook)
    if (step === 1) {
        return (
            <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Let's build your first Asset.</h2>
                <p className="text-gray-500 mb-8">Stop working. Start architecting. What is one repetitive task that annoys you?</p>

                <div className="space-y-4">
                    <textarea
                        className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-900"
                        rows={3}
                        placeholder="e.g., I spend 2 hours a day sorting messy leads for my plumbing business..."
                        value={userContext}
                        onChange={(e) => setUserContext(e.target.value)}
                    />
                    <button
                        onClick={() => setStep(2)}
                        disabled={!userContext}
                        className="w-full bg-black text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        Start Remixing <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        );
    }

    // STEP 2: The Remix (The "Sage" at work)
    if (step === 2) {
        return (
            <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-full text-green-700">
                        <Sparkles size={24} />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">I found a template for that.</h2>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Base Template</span>
                        <span className="px-2 py-1 bg-gray-200 text-xs rounded text-gray-600">Generic v1.0</span>
                    </div>
                    <p className="font-mono text-sm text-gray-600">
                        SYSTEM: You are a helpful assistant.<br />
                        TASK: Sort emails into categories.<br />
                        CONTEXT: General business.
                    </p>
                </div>

                <div className="text-center">
                    <p className="text-gray-600 mb-4">I am going to rewrite this logic specifically for: <br /><strong>"{userContext}"</strong></p>
                    <button
                        onClick={() => {
                            setIsProcessing(true);
                            setTimeout(() => {
                                setIsProcessing(false);
                                setStep(3);
                            }, 2500); // Simulate AI thinking time
                        }}
                        className="w-full bg-green-600 text-white py-4 rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                        {isProcessing ? 'Architecting...' : 'Remix Template'}
                        {isProcessing && <Sparkles className="animate-spin" size={20} />}
                    </button>
                </div>
            </div>
        );
    }

    // STEP 3: The Win (The Evidence)
    if (step === 3) {
        return (
            <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl border border-green-100 ring-4 ring-green-50">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">It's Ready.</h2>
                    <p className="text-gray-500">Your custom asset is now in your Vault.</p>
                </div>

                <div className="bg-gray-900 text-green-400 p-6 rounded-xl font-mono text-sm mb-8 text-left shadow-inner">
                    <p className="mb-2 text-gray-500">{'// Your Custom Logic'}</p>
                    <p>ROLE: Senior Lead Qualifier</p>
                    <p>MISSION: Analyze plumbing inquiries.</p>
                    <p>IF "Leak" OR "Flood" -{'>'} PRIORITY: URGENT</p>
                    <p>IF "Quote" -{'>'} PRIORITY: NORMAL</p>
                    <p className="animate-pulse mt-4">_ Waiting for input...</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button className="py-3 px-4 bg-white border border-gray-200 rounded-lg text-gray-600 font-medium hover:bg-gray-50">
                        Edit Logic
                    </button>
                    <button className="py-3 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 flex items-center justify-center gap-2">
                        <Play size={16} /> Run Test Case
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

export default RemixInterface;
