import React from "react";
import { FlashcardDeck } from "../learning/FlashcardDeck";
import { UserStats } from "./UserStats";
import { SquadRoster } from "../squad/SquadRoster";
import type { FlashcardItem } from "../../hooks/useLeitnerQueue";
import type { MatchResult } from "../../services/SquadMatcher";

interface DashboardProps {
    queue: FlashcardItem[];
    currentItem: FlashcardItem | null;
    recordAnswer: (itemId: string, success: boolean) => void;
    points: number;
    streak: number;
    addPoints: (pts: number) => void;
    incrementStreak: () => void;
    matchResult: MatchResult | null;
}

export const Dashboard: React.FC<DashboardProps> = ({
    queue,
    currentItem,
    recordAnswer,
    points,
    streak,
    addPoints,
    incrementStreak,
    matchResult,
}) => {
    return (
        <div className="space-y-8">
            {/* Daily Review Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UserStats
                    totalReviewed={queue.length}
                    totalPoints={points}
                    streakDays={streak}
                />
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                    <FlashcardDeck
                        queue={queue}
                        currentItem={currentItem}
                        onAnswer={recordAnswer}
                        onEarnPoints={addPoints}
                        onUpdateStreak={incrementStreak}
                    />
                </div>
            </section>

            {/* Squad Command Section */}
            <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    🎯 Squad Command
                </h2>
                {matchResult ? (
                    <div className="bg-zinc-900/20 border border-gray-800 p-4 rounded-xl">
                        <SquadRoster
                            squads={matchResult.squads}
                            unmatched={matchResult.unmatched}
                        />
                    </div>
                ) : (
                    <div className="p-6 text-gray-500 animate-pulse bg-zinc-900/10 rounded-xl border border-dashed border-gray-800">
                        Scanning for Squad Beacons...
                    </div>
                )}
            </section>
        </div>
    );
};
