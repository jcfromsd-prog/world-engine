import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../hooks/useWallet';

interface CapitalDeploymentModalProps {
    onClose: () => void;
    onPurchase: (amount: number) => void;
}

const CapitalDeploymentModal: React.FC<CapitalDeploymentModalProps> = ({ onClose }) => {
    const { supabaseUser } = useAuth();
    const { balance, deposit } = useWallet(supabaseUser);
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleDeposit = async (selectedAmount: number) => {
        setIsProcessing(true);
        const success = await deposit(selectedAmount);
        if (success) {
            setStep(2); // Success state
            setTimeout(() => {
                onClose();
            }, 2000);
        } else {
            alert('Deposit failed');
        }
        setIsProcessing(false);
    };



    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white z-10">✕</button>

                {step === 1 ? (
                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-3xl">💳</span>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Deploy Capital</h2>
                                <p className="text-slate-400 text-sm">Fund your engine. Funds are held in escrow until work is verified.</p>
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <div className="text-slate-400 text-sm mb-1">Current Capital</div>
                            <div className="text-4xl font-mono text-white font-bold">
                                ${balance.toLocaleString()}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-8">
                            <button
                                onClick={() => handleDeposit(5000)}
                                disabled={isProcessing}
                                className="p-6 bg-slate-800 border border-slate-700 rounded-xl hover:border-cyan-500 transition-all text-left group"
                            >
                                <div className="text-cyan-400 font-bold mb-1 group-hover:text-cyan-300">SEED INJECTION</div>
                                <div className="text-2xl font-mono text-white mb-2">$5,000</div>
                                <div className="text-xs text-slate-500">Instant Access</div>
                            </button>

                            <button
                                onClick={() => handleDeposit(50000)}
                                disabled={isProcessing}
                                className="p-6 bg-slate-800 border border-slate-700 rounded-xl hover:border-purple-500 transition-all text-left group"
                            >
                                <div className="text-purple-400 font-bold mb-1 group-hover:text-purple-300">SERIES A</div>
                                <div className="text-2xl font-mono text-white mb-2">$50,000</div>
                                <div className="text-xs text-slate-500">Wire Transfer (Simulated)</div>
                            </button>
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
                ) : (
                    <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                        <div className="text-6xl mb-6 animate-bounce">💸</div>
                        <h2 className="text-3xl font-black text-white mb-2">FUNDS RECEIVED</h2>
                        <p className="text-slate-400">Your capital has been deployed to the secure ledger.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default CapitalDeploymentModal;
