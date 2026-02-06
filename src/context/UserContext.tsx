import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { KNOWLEDGE_BASE, type SkillNode } from '../data/KnowledgeBase';
import { Neo4jService } from '../services/Neo4jService';
import type { ReactNode } from 'react';

// ----------------- TYPES -----------------
export interface UserProfile {
    name: string;
    age: number; // Mapping grade to age approx or using grade
    passion: string;
    style: string;
}

export interface HeroPath {
    role: string;
    currentMission: string | null;
    currentMissionId: string | null;
    status: "Idle" | "Active" | "Completed";
    level: number;
    xp: number;
    history: string[];
}

export interface Wallet {
    balance: number;
}

export interface Squad {
    id: string;
    name: string;
    role: string;
}

export interface Psychometrics {
    autonomy: number;
    competence: number;
    relatedness: number;
}

interface UserContextType {
    userProfile: UserProfile | null;
    heroPath: HeroPath | null;
    wallet: Wallet;
    squad: Squad | null;
    knowledge: SkillNode[];
    synapseCount: number;
    psychometrics: Psychometrics;
    interventions: any[];
    setUser: (profile: UserProfile, path: HeroPath) => void;
    setHeroPath: React.Dispatch<React.SetStateAction<HeroPath | null>>;
    updateXP: (amount: number) => void;
    addBalance: (amount: number) => void;
    completeMission: (xpReward: number, balanceReward: number) => void;
    joinSquad: (squad: Squad) => void;
    updateMastery: (nodeId: string, correct: boolean) => void;
    updatePsychometrics: (vector: keyof Psychometrics, amount: number) => void;
    isInitialized: boolean;
}

// ----------------- CONTEXT -----------------
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [heroPath, setHeroPath] = useState<HeroPath | null>(null);
    const [wallet, setWallet] = useState<Wallet>({ balance: 0 });
    const [squad, setSquad] = useState<Squad | null>(null);
    const [knowledge, setKnowledge] = useState<SkillNode[]>(KNOWLEDGE_BASE);
    const [psychometrics, setPsychometrics] = useState<Psychometrics>({
        autonomy: 10,
        competence: 10,
        relatedness: 10
    });
    const [interventions, setInterventions] = useState<any[]>([]);

    const synapseCount = useMemo(() => {
        return knowledge.reduce((sum, node) => sum + node.mastery, 0);
    }, [knowledge]);

    const isInitialized = !!userProfile && !!heroPath;

    // Load data from Neo4j on mount
    useEffect(() => {
        const loadSovereignData = async () => {
            const savedId = localStorage.getItem('mbp_sovereign_id');
            if (savedId) {
                const data = await Neo4jService.fetchUserData(savedId);
                if (data) {
                    setUserProfile(data.profile);
                    setHeroPath(data.path);
                    setWallet(data.wallet);
                    setPsychometrics(data.psychometrics);
                    setSquad(data.squad);

                    const recommendations = await Neo4jService.fetchRecommendations(savedId);
                    setInterventions(recommendations);
                }
            }
        };
        loadSovereignData();
    }, []);

    const setUser = async (profile: UserProfile, path: HeroPath) => {
        const userId = `sovereign_${profile.name.toLowerCase().replace(/\s+/g, '_')}`;
        localStorage.setItem('mbp_sovereign_id', userId);

        setUserProfile(profile);
        setHeroPath(path);

        // Initial sync to Neo4j
        await Neo4jService.saveUserProfile(userId, profile, path, wallet, psychometrics);
    };

    const updateXP = (amount: number) => {
        if (!heroPath) return;
        const newXP = heroPath.xp + amount;
        const newLevel = Math.floor(newXP / 1000) + 1; // Simple level logic
        setHeroPath({ ...heroPath, xp: newXP, level: newLevel });
    };

    const addBalance = (amount: number) => {
        setWallet(prev => ({ balance: prev.balance + amount }));
    };

    const completeMission = async (xpReward: number, balanceReward: number) => {
        if (!heroPath || !userProfile) return;

        const newXP = heroPath.xp + xpReward;
        const newLevel = Math.floor(newXP / 1000) + 1;
        const completedId = heroPath.currentMissionId;
        const newHistory = completedId ? [...heroPath.history, completedId] : heroPath.history;

        const updatedPath: HeroPath = {
            ...heroPath,
            currentMission: null,
            currentMissionId: null,
            status: "Idle" as const,
            xp: newXP,
            level: newLevel,
            history: newHistory
        };

        const updatedWallet: Wallet = { balance: wallet.balance + balanceReward };

        setHeroPath(updatedPath);
        setWallet(updatedWallet);

        // Sync to Neo4j
        const userId = localStorage.getItem('mbp_sovereign_id');
        if (userId && completedId) {
            await Neo4jService.completeMission(userId, completedId, updatedPath, updatedWallet);
        }
    };

    const joinSquad = async (newSquad: Squad) => {
        setSquad(newSquad);
        const userId = localStorage.getItem('mbp_sovereign_id');
        if (userId) {
            await Neo4jService.joinSquad(userId, newSquad);
        }
    };

    const updateMastery = (nodeId: string, correct: boolean) => {
        setKnowledge(prev => prev.map(node => {
            if (node.id === nodeId) {
                const newMastery = correct
                    ? Math.min(100, node.mastery + 20)
                    : 0;
                return { ...node, mastery: newMastery };
            }
            return node;
        }));

        if (correct) {
            updatePsychometrics('competence', 5);
        }
    };

    const updatePsychometrics = async (vector: keyof Psychometrics, amount: number) => {
        const newPsychometrics = {
            ...psychometrics,
            [vector]: Math.min(100, psychometrics[vector] + amount)
        };
        setPsychometrics(newPsychometrics);

        const userId = localStorage.getItem('mbp_sovereign_id');
        if (userId) {
            await Neo4jService.updatePsychometrics(userId, newPsychometrics);
        }
    };

    return (
        <UserContext.Provider value={{
            userProfile,
            heroPath,
            wallet,
            squad,
            knowledge,
            synapseCount,
            psychometrics,
            interventions,
            setUser,
            setHeroPath,
            updateXP,
            addBalance,
            completeMission,
            joinSquad,
            updateMastery,
            updatePsychometrics,
            isInitialized
        }}>
            {children}
        </UserContext.Provider>
    );
};

// ----------------- HOOK -----------------
export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
