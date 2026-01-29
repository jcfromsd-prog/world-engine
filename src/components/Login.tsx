import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
    onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
    const { login, signup } = useAuth();
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            if (mode === 'login') {
                const result = await login(email, password);
                if (result.success) {
                    onClose();
                } else {
                    setError(result.error || 'Invalid credentials.');
                }
            } else {
                const result = await signup(email, password, name);
                if (result.success) {
                    setSuccess('Account created! Check your email to verify, then log in.');
                    setMode('login');
                } else {
                    setError(result.error || 'Signup failed.');
                }
            }
        } catch (err) {
            setError('System error. Please retry.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
            >
                {/* Visual Header */}
                <div className={`h-2 ${mode === 'login' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-emerald-500 to-cyan-500'}`} />

                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                                {mode === 'login' ? 'Access Engine' : 'Join the Network'}
                            </h2>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                                {mode === 'login' ? 'Solver Authentication' : 'Create Solver Profile'}
                            </p>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-xl">
                        <button
                            type="button"
                            onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${mode === 'login'
                                    ? 'bg-white text-slate-800 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Log In
                        </button>
                        <button
                            type="button"
                            onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${mode === 'signup'
                                    ? 'bg-white text-slate-800 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {mode === 'signup' && (
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Solver Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-slate-800 font-medium"
                                    placeholder="Your display name"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-800 font-medium"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Password</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-800 font-medium"
                                placeholder="••••••••"
                            />
                            {mode === 'signup' && (
                                <p className="text-[10px] text-slate-400 mt-1">Minimum 6 characters</p>
                            )}
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs font-bold text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-600 text-xs font-bold text-center"
                            >
                                {success}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group ${mode === 'login'
                                    ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-200'
                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-200'
                                }`}
                        >
                            {isLoading
                                ? (mode === 'login' ? 'Authenticating...' : 'Creating Account...')
                                : (mode === 'login' ? 'Log In' : 'Create Account')
                            }
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </form>
                </div>

                <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center">
                    <span className="text-[9px] text-slate-400 font-bold tracking-widest">
                        🔐 SECURED BY SUPABASE
                    </span>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;

