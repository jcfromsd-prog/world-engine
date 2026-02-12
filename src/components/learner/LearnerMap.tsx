
import React, { useState, useMemo } from 'react';
import { WorldEngineDevConsole } from '../WorldEngine/DevConsole';
import { MissionLog } from './MissionLog';
import { MissionPlayer } from './MissionPlayer';
import type { Mission } from './MissionPlayer';
import { WorldEngine } from '../../engines/world-engine/WorldEngine';
import { SEED_GRAPH } from '../../engines/world-engine/KnowledgeGraph';
import type { KnowledgeNode } from '../../engines/world-engine/KnowledgeGraph';
import type { LearnerProfile } from '../../engines/world-engine/LearnerModel';

// --- MOCK PROFILE FOR LEARNER MAP ---
const LEARNER_PROFILE: LearnerProfile = {
    id: "learner-1128",
    name: "Builder One",
    currentGrade: 4,
    masteryMap: new Map(),
    domainLevels: { literacy: 3.0, numeracy: 3.0, science: 3.0, social: 3.0, sel: 3.0, career: 3.0 },
    cognitiveState: { focusLevel: 100, frustrationLevel: 0, energyLevel: 100, currentZPD: 0.5 },
    interests: ["Engineering", "Robotics"],
    learningStyle: 'kinesthetic',
    goals: ["Build a Robot"],
    completedMissions: [],
    genesisPoints: 0,
    calibrationScore: 0
};

export const LearnerMap: React.FC = () => {
    // 1. Initialize Engine
    const engine = useMemo(() => new WorldEngine(LEARNER_PROFILE, SEED_GRAPH), []);

    // 2. Play State
    const [activeMission, setActiveMission] = useState<Mission | null>(null);

    // 3. Play Handler
    const handleStartMission = (node: KnowledgeNode) => {
        // DYNAMIC TYPE SWITCHING (Demo Logic)
        let missionType: 'VIDEO' | 'INTERACTIVE' | 'QUIZ' = 'VIDEO';

        if (node.id === "math.g1.number_sense.counting_100") {
            missionType = 'INTERACTIVE';
        } else if (node.domain === 'literacy') {
            missionType = 'QUIZ';
        }

        const mission: Mission = {
            id: node.id,
            title: node.title,
            type: missionType,
            contentUrl: '', // TBD
            difficulty: node.difficulty
        };

        setActiveMission(mission);
    };

    // 4. Completion Handler
    const handleMissionComplete = (missionId: string) => {
        console.log(`[LearnerMap] Mission Completed: ${missionId}`);
        // Update Engine
        engine.submitTask(missionId, true, 45); // Simulate 45s duration
        setActiveMission(null);
    };

    return (
        <div className="relative min-h-screen bg-black text-white p-6 pt-24">
            {/* ----------------- NEON BACKGROUND FLAIR ----------------- */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-600/10 blur-[150px] rounded-full" />

            {/* ----------------- MISSION PLAYER OVERLAY ----------------- */}
            {activeMission && (
                <MissionPlayer
                    mission={activeMission}
                    onComplete={handleMissionComplete}
                    onExit={() => setActiveMission(null)}
                />
            )}

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 animate-in fade-in duration-700">
                {/* ----------------- MAIN CONTENT ----------------- */}
                <div className="flex-1 space-y-12">
                    <div className="text-center space-y-8">
                        <div className="inline-block px-4 py-2 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20 text-xs font-black uppercase tracking-widest animate-pulse">
                            Builder Mission Control
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                                BUILDER MAP
                            </span>
                        </h1>

                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                            Ready to build your skills, Builder? Your daily missions are prepped and ready for assembly.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 text-left">
                            {/* Placeholder Cards - Visual Only */}
                            {['Math', 'Science', 'Creativity'].map((subject) => (
                                <div key={subject} className="p-8 bg-zinc-900/50 border border-white/10 rounded-3xl hover:border-cyan-400/50 transition-all hover:-translate-y-2 group">
                                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🚀</div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{subject}</h3>
                                    <p className="text-sm text-zinc-500">Next unlock ready.</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 p-8 bg-black/50 border border-zinc-800 rounded-3xl text-left">
                            <h3 className="text-xl font-bold text-white mb-4">World Engine Status</h3>
                            {/* The "Real" Interactive List */}
                            <WorldEngineDevConsole
                                onExit={() => { }}
                                engine={engine}
                                onPlay={handleStartMission}
                            />
                        </div>
                    </div>
                </div>

                {/* ----------------- SIDEBAR (Mission Log) ----------------- */}
                <div className="w-full lg:w-96 flex-none space-y-8 lg:pt-24">
                    <MissionLog />
                </div>
            </div>
        </div>
    );
};
