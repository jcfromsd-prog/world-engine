import { useState, useEffect } from 'react';
import { supabase, getGauntletCount, hasUserJoinedGauntlet, joinGauntlet } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

/**
 * Hook to manage Gauntlet event state
 * Tracks participant count and join status
 */
export function useGauntlet(eventName: string = 'Zero-Day Defense') {
    const [participantCount, setParticipantCount] = useState<number>(0);
    const [hasJoined, setHasJoined] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    // Check auth state and count on mount
    useEffect(() => {
        // Get current user
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
            if (user) {
                checkJoinStatus(user.id);
            }
        });

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                checkJoinStatus(session.user.id);
            } else {
                setHasJoined(false);
            }
        });

        // Get initial count
        fetchCount();

        // Subscribe to real-time updates
        const channel = supabase
            .channel('gauntlet-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'gauntlet_entries',
                    filter: `event_name=eq.${eventName}`
                },
                () => {
                    fetchCount();
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
            supabase.removeChannel(channel);
        };
    }, [eventName]);

    async function fetchCount() {
        try {
            const count = await getGauntletCount(eventName);
            setParticipantCount(count);
        } catch (err) {
            console.error('Error fetching gauntlet count:', err);
        }
    }

    async function checkJoinStatus(userId: string) {
        try {
            const joined = await hasUserJoinedGauntlet(userId, eventName);
            setHasJoined(joined);
        } catch (err) {
            console.error('Error checking join status:', err);
        }
    }

    async function byteIn() {
        if (!user) {
            setError('Please log in to join the Gauntlet');
            return false;
        }

        if (hasJoined) {
            setError('You have already joined this event');
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            await joinGauntlet(user.id, eventName);
            setHasJoined(true);
            setParticipantCount(prev => prev + 1); // Optimistic update
            await fetchCount();
            return true;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to join the Gauntlet';
            setError(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    }

    return {
        participantCount,
        hasJoined,
        isLoading,
        error,
        user,
        byteIn,
        maxParticipants: 100
    };
}
