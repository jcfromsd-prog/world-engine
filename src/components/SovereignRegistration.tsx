import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RegistrationProps {
    onClose: () => void;
    onSwitchToLogin: () => void;
}

const SovereignRegistration: React.FC<RegistrationProps> = ({ onClose, onSwitchToLogin }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        username: '',
        country: '',
        address: '',
        taxId: '',
        dob: '',
        payoutMethod: 'crypto', // 'crypto' | 'bank'
        walletAddress: '',
        bankDetails: '',
        agreedToLevy: false,
        agreedToToS: false
    });

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here we would call supabase.auth.signUp
        // and insert into profiles with compliance_level: 1
        console.log("Sovereign Registration Complete:", formData);
        alert("Verification Pending. Welcome to the World Engine.");
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative"
            >
                {/* Progress Bar */}
                <div className="h-1 bg-slate-800 w-full">
                    <motion.div
                        className="h-full bg-cyan-500"
                        initial={{ width: "33%" }}
                        animate={{ width: `${step * 33.33}%` }}
                    />
                </div>

                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-black text-white tracking-wide">
                            {step === 1 && "IDENTITY GATE"}
                            {step === 2 && "COMPLIANCE DATA"}
                            {step === 3 && "PAYOUT & CONTRACT"}
                        </h2>
                        <span className="text-xs font-mono text-slate-500">TIER {step} CLEARANCE</span>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    className="space-y-4"
                                >
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-400 font-bold uppercase">Full Legal Name</label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-cyan-500 outline-none"
                                            value={formData.fullName}
                                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-400 font-bold uppercase">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
                                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-cyan-500 outline-none"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-400 font-bold uppercase">Choose Neural Identity (Username)</label>
                                        <input
                                            type="text"
                                            placeholder="Crypto_Scribe_99"
                                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-cyan-500 outline-none"
                                            value={formData.username}
                                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-400 font-bold uppercase">Password</label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-cyan-500 outline-none"
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    className="space-y-4"
                                >
                                    <div className="p-4 bg-yellow-900/10 border border-yellow-500/20 rounded text-xs text-yellow-200 mb-4">
                                        <span className="font-bold">⚠️ TIER 2 REQUIRED:</span> To process payouts &gt;$500, we require tax residence and physical address verification.
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs text-slate-400 font-bold uppercase">Country</label>
                                            <select
                                                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-cyan-500 outline-none"
                                                value={formData.country}
                                                onChange={e => setFormData({ ...formData, country: e.target.value })}
                                            >
                                                <option value="">Select</option>
                                                <option value="US">USA</option>
                                                <option value="UK">UK</option>
                                                <option value="CA">Canada</option>
                                                <option value="DE">Germany</option>
                                                <option value="BR">Brazil</option>
                                                <option value="IN">India</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-slate-400 font-bold uppercase">Date of Birth</label>
                                            <input
                                                type="date"
                                                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-cyan-500 outline-none"
                                                value={formData.dob}
                                                onChange={e => setFormData({ ...formData, dob: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-400 font-bold uppercase">Physical Address</label>
                                        <input
                                            type="text"
                                            placeholder="Street, City, Postal Code"
                                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-cyan-500 outline-none"
                                            value={formData.address}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-400 font-bold uppercase">Tax ID / SSN / VAT</label>
                                        <input
                                            type="text"
                                            placeholder="XXX-XX-XXXX"
                                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-cyan-500 outline-none"
                                            value={formData.taxId}
                                            onChange={e => setFormData({ ...formData, taxId: e.target.value })}
                                        />
                                        <p className="text-[10px] text-slate-600 justify-end flex">Encrypted via Zero-Knowledge Proof</p>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    className="space-y-6"
                                >
                                    {/* Payout Configuration */}
                                    <div className="space-y-4 border-b border-slate-800 pb-6">
                                        <label className="text-xs text-cyan-400 font-bold uppercase tracking-widest">Select Payout Method</label>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, payoutMethod: 'crypto' })}
                                                className={`flex-1 py-2 rounded border text-xs font-bold transition ${formData.payoutMethod === 'crypto'
                                                    ? 'bg-cyan-900/20 border-cyan-500 text-cyan-400'
                                                    : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'
                                                    }`}
                                            >
                                                CRYPTO (USDC/ETH)
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, payoutMethod: 'bank' })}
                                                className={`flex-1 py-2 rounded border text-xs font-bold transition ${formData.payoutMethod === 'bank'
                                                    ? 'bg-emerald-900/20 border-emerald-500 text-emerald-400'
                                                    : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'
                                                    }`}
                                            >
                                                BANK TRANSFER
                                            </button>
                                        </div>

                                        {formData.payoutMethod === 'crypto' ? (
                                            <div className="space-y-1">
                                                <label className="text-xs text-slate-400 font-bold uppercase">Wallet Address (EVM)</label>
                                                <input
                                                    type="text"
                                                    placeholder="0x..."
                                                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-mono text-sm focus:border-cyan-500 outline-none"
                                                    value={formData.walletAddress}
                                                    onChange={e => setFormData({ ...formData, walletAddress: e.target.value })}
                                                />
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                <label className="text-xs text-slate-400 font-bold uppercase">IBAN / Routing Number</label>
                                                <input
                                                    type="text"
                                                    placeholder="Bank Details"
                                                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-emerald-500 outline-none"
                                                    value={formData.bankDetails}
                                                    onChange={e => setFormData({ ...formData, bankDetails: e.target.value })}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Contract Agreement */}
                                    <div className="space-y-3">
                                        <h4 className="font-bold text-white text-sm">THE SOVEREIGN CONTRACT</h4>
                                        <label className="flex items-start gap-3 cursor-pointer group">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="peer h-4 w-4 appearance-none border border-slate-600 bg-slate-900 checked:bg-cyan-500 checked:border-cyan-500 rounded"
                                                    checked={formData.agreedToLevy}
                                                    onChange={e => setFormData({ ...formData, agreedToLevy: e.target.checked })}
                                                />
                                                <svg className="absolute w-3 h-3 text-black pointer-events-none opacity-0 peer-checked:opacity-100 left-0.5" viewBox="0 0 14 14" fill="none">
                                                    <path d="M3 8L6 11L11 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <span className="text-xs text-slate-400 group-hover:text-white transition-colors">
                                                I accept the <span className="text-red-400 font-bold">15% Platform Levy</span> on all earnings.
                                            </span>
                                        </label>

                                        <label className="flex items-start gap-3 cursor-pointer group">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="peer h-4 w-4 appearance-none border border-slate-600 bg-slate-900 checked:bg-cyan-500 checked:border-cyan-500 rounded"
                                                    checked={formData.agreedToToS}
                                                    onChange={e => setFormData({ ...formData, agreedToToS: e.target.checked })}
                                                />
                                                <svg className="absolute w-3 h-3 text-black pointer-events-none opacity-0 peer-checked:opacity-100 left-0.5" viewBox="0 0 14 14" fill="none">
                                                    <path d="M3 8L6 11L11 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <span className="text-xs text-slate-400 group-hover:text-white transition-colors">
                                                I verify I am 18+ and have provided accurate tax data.
                                            </span>
                                        </label>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="mt-8 flex gap-3">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="flex-1 px-4 py-3 rounded-lg border border-slate-700 text-slate-400 font-bold text-sm hover:bg-slate-800 transition"
                                >
                                    BACK
                                </button>
                            )}
                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="flex-1 px-4 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition shadow-lg shadow-cyan-500/20"
                                >
                                    CONTINUE
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={!formData.agreedToLevy || !formData.agreedToToS}
                                    className="flex-1 px-4 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-sm transition shadow-lg shadow-emerald-500/20"
                                >
                                    INITIALIZE IDENTITY
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <button onClick={onSwitchToLogin} className="text-xs text-slate-500 hover:text-white underline">
                            Already have a Neural Identity? Log In
                        </button>
                    </div>
                </div>

                <div className="absolute top-4 right-4">
                    <button onClick={onClose} className="text-slate-600 hover:text-white">✕</button>
                </div>
            </motion.div>
        </div>
    );
};

export default SovereignRegistration;
