import { motion } from 'framer-motion';
import { useState } from 'react';

interface CapitalDeploymentModalProps {
    onClose: () => void;
    onPurchase: (amount: number) => void;
}

const CapitalDeploymentModal: React.FC<CapitalDeploymentModalProps> = ({ onClose, onPurchase }) => {
    const [processing, setProcessing] = useState<number | null>(null); // null, or amount being processed

    const handlePurchase = (amount: number) => {
        setProcessing(amount);
        // Simulate Stripe delay
        setTimeout(() => {
            onPurchase(amount);
            setProcessing(null);
            onClose();
        }, 1500);
    };

    const packages = [
        { id: 1, name: "Starter Allocation", amount: 5000, label: "$5,000", color: "from-blue-500 to-cyan-400", desc: "Perfect for initial pilots and micro-tasks." },
        { id: 2, name: "Growth Engine", amount: 50000, label: "$50,000", color: "from-purple-500 to-pink-500", desc: "Scale your output. Unlocks priority matching." },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">✕</button>

                <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-3xl">💳</span>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Deploy Capital</h2>
                            <p className="text-slate-400 text-sm">Fund your engine. Funds are held in escrow until work is verified.</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                        {packages.map((pkg) => (
                            <button
                                key={pkg.id}
                                onClick={() => handlePurchase(pkg.amount)}
                                disabled={processing !== null}
                                className={`relative group p-6 rounded-xl border border-slate-700 hover:border-slate-500 transition-all text-left ${processing === pkg.amount ? 'opacity-50 cursor-wait' : 'hover:-translate-y-1'
                                    }`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-r ${pkg.color} opacity-0 group-hover:opacity-5 transition-opacity rounded-xl`} />

                                <h3 className="text-lg font-bold text-white mb-1">{pkg.name}</h3>
                                <div className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${pkg.color} mb-2`}>
                                    {pkg.label}
                                </div>
                                <p className="text-sm text-slate-400">{pkg.desc}</p>

                                {processing === pkg.amount && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl backdrop-blur-[1px]">
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="border-t border-slate-800 pt-6">
                        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                            <div>
                                <h4 className="text-white font-bold">Enterprise Invoicing</h4>
                                <p className="text-xs text-slate-400">Net-30 terms available for qualified partners.</p>
                            </div>
                            <button className="px-4 py-2 text-sm border border-slate-600 text-slate-300 rounded hover:bg-slate-700">
                                Request Terms
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center text-xs text-slate-500 gap-4">
                        <span>🔒 Secured by Stripe</span>
                        <span>🛡️ FDIC Insured Escrow</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CapitalDeploymentModal;
