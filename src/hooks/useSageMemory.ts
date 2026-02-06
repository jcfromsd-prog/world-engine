import { useState, useEffect } from 'react';
import type { SoulboundProfile } from '../engine/types';
import { loadProfile, saveProfile, initializeProfile, updateStreak } from '../engine/ProgressionEngine';

/**
 * THE SAGE MEMORY ENGINE (HOOK)
 * Manages the legacy profile state and streak logic.
 */
export function useSageMemory() {
    const [userState, setUserState] = useState<SoulboundProfile | null>(() => {
        const saved = loadProfile();
        if (saved) {
            const { profile } = updateStreak(saved, new Date().toISOString().split('T')[0]);
            saveProfile(profile);
            return profile;
        }
        return null;
    });

    useEffect(() => {
        if (userState) {
            saveProfile(userState);
        }
    }, [userState]);

    const updateProfile = (updates: Partial<SoulboundProfile>) => {
        setUserState(prev => prev ? ({ ...prev, ...updates }) : null);
    };

    const initUser = (name: string, archetype: string, sector: string, gradeLevel: number) => {
        const newProfile = initializeProfile(
            `user_${Date.now()}`,
            name,
            archetype,
            sector,
            gradeLevel
        );
        setUserState(newProfile);
    };

    const clearMemory = () => {
        localStorage.removeItem('mbp_soulbound_profile');
        window.location.reload();
    };

    return { userState, updateProfile, initUser, clearMemory };
}
