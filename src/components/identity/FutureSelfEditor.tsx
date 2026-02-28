import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Loader2, Sparkles } from 'lucide-react';

export const FutureSelfEditor: React.FC = () => {
    const [futureSelf, setFutureSelf] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        loadFutureSelf();
    }, []);

    const loadFutureSelf = async () => {
        try {
            const { data: authData } = await supabase.auth.getUser();
            if (!authData?.user) {
                setIsLoading(false);
                return;
            }
            const uid = authData.user.id;
            if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uid)) {
                setIsLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('users')
                .select('future_self')
                .eq('user_id', uid)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error("Error loading Future Self:", error);
            } else if (data && data.future_self) {
                setFutureSelf(data.future_self);
            }
        } catch (err) {
            console.error("Exception loading Future Self:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveStatus('idle');

        try {
            const { data: authData } = await supabase.auth.getUser();
            if (!authData?.user) {
                setSaveStatus('error');
                return;
            }
            const uid = authData.user.id;
            if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uid)) {
                setSaveStatus('error');
                return;
            }

            const { error } = await supabase
                .from('users')
                .update({ future_self: futureSelf })
                .eq('user_id', uid);

            if (error) {
                console.error("Error committing Future Self:", error);
                setSaveStatus('error');
            } else {
                setSaveStatus('success');
                setTimeout(() => setSaveStatus('idle'), 3000);
            }
        } catch (err) {
            console.error("Exception committing Future Self:", err);
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.6)] relative overflow-hidden group">
            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-slate-400">
                        Future Self Identity
                    </h2>
                </div>

                <div>
                    <p className="text-slate-300 text-sm leading-relaxed mb-4">
                        Define the person you are becoming. This anchor will persist across your evaluations, guiding your productive struggle and aligning your efforts with your ultimate purpose.
                    </p>
                </div>

                <div className="relative">
                    <textarea
                        value={futureSelf}
                        onChange={(e) => setFutureSelf(e.target.value)}
                        placeholder="e.g., I am a resilient AI architect who builds secure systems to protect data integrity..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-base leading-relaxed placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none h-32 custom-scrollbar"
                    />
                </div>

                <div className="flex justify-end items-center gap-4 mt-4">
                    {saveStatus === 'success' && (
                        <span className="text-emerald-400 text-xs font-mono font-bold uppercase tracking-widest animate-pulse">
                            Identity Committed
                        </span>
                    )}
                    {saveStatus === 'error' && (
                        <span className="text-red-400 text-xs font-mono font-bold uppercase tracking-widest">
                            Commit Failed
                        </span>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isSaving || futureSelf.trim() === ''}
                        className="px-6 py-2 bg-slate-800 hover:bg-cyan-900 border border-slate-700 hover:border-cyan-500 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4 text-cyan-400" />
                        )}
                        Commit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FutureSelfEditor;
