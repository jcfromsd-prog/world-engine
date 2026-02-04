import { useState, useEffect } from 'react';
import { getAggregatedBounties } from '../services/JobAggregatorService';
import type { Bounty } from '../types/bounty';

export const useRealBounties = () => {
    const [bounties, setBounties] = useState<Bounty[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBounties = async () => {
            try {
                setIsLoading(true);
                const data = await getAggregatedBounties();
                setBounties(data);
            } catch {
                setError('Failed to load external opportunities.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBounties();
    }, []);

    return { bounties, isLoading, error };
};
