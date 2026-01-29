import { useState, useEffect } from 'react';
import { supabase, getWallet, depositFunds, type Wallet } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export function useWallet(user: User | null) {
    const [balance, setBalance] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Initial Fetch & Subscription
    useEffect(() => {
        if (!user) {
            setBalance(0);
            return;
        }

        let isMounted = true;

        async function fetchWallet() {
            setLoading(true);
            try {
                const data = await getWallet(user!.id);
                if (isMounted) {
                    setBalance(data?.balance || 0);
                }
            } catch (err) {
                console.error('Error fetching wallet:', err);
                // If not found, it's 0. We tolerate this.
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchWallet();

        // Subscribe to changes
        const channel = supabase
            .channel(`wallet-${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'wallets',
                    filter: `user_id=eq.${user.id}`
                },
                (payload) => {
                    const newWallet = payload.new as Wallet;
                    setBalance(newWallet.balance);
                }
            )
            .subscribe();

        return () => {
            isMounted = false;
            supabase.removeChannel(channel);
        };
    }, [user]);

    // Deposit function
    const deposit = async (amount: number) => {
        if (!user) return;
        setLoading(true);
        try {
            await depositFunds(user.id, amount);
            // Balance update handled by subscription usually, but we can force it
            setBalance(prev => prev + amount);
            return true;
        } catch (err: any) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        balance,
        loading,
        error,
        deposit
    };
}
