import React, { useState, useCallback } from "react";
import type { FlashcardItem } from "../../hooks/useLeitnerQueue";

interface FlashcardDeckProps {
    queue: FlashcardItem[];
    currentItem: FlashcardItem | null;
    onAnswer: (itemId: string, success: boolean) => void;
    onEarnPoints: (points: number) => void;
    onUpdateStreak: () => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
    currentItem,
    onAnswer,
    onEarnPoints,
    onUpdateStreak,
}) => {
    const [showAnswer, setShowAnswer] = useState(false);

    const handleAnswer = useCallback(
        (success: boolean) => {
            if (!currentItem) return;
            onAnswer(currentItem.id, success);
            if (success) {
                onEarnPoints(5);
                onUpdateStreak();
            }
        },
        [currentItem, onAnswer, onEarnPoints, onUpdateStreak]
    );

    if (!currentItem) {
        return (
            <div className="text-center py-8 text-gray-400">
                <p className="text-lg">No cards due for review.</p>
                <p className="text-green-400 mt-2">You're crushing it! 🎉</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
                📚 Flashcard
                <span className="text-xs bg-zinc-800 px-2 py-1 rounded-full text-gray-400">
                    Box {currentItem.box}
                </span>
            </h3>

            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <p className="text-gray-300">
                    <span className="text-blue-400 font-semibold">Q:</span>{" "}
                    {currentItem.question}
                </p>
            </div>

            {showAnswer ? (
                <>
                    <div className="bg-green-900/20 rounded-lg p-4 border border-green-700/30">
                        <p className="text-green-300">
                            <span className="text-green-400 font-semibold">A:</span>{" "}
                            {currentItem.answer}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleAnswer(true)}
                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold transition-colors"
                        >
                            ✅ I Got It
                        </button>
                        <button
                            onClick={() => handleAnswer(false)}
                            className="flex-1 px-4 py-2 bg-red-600/80 hover:bg-red-500 text-white rounded-lg font-semibold transition-colors"
                        >
                            🔄 Need Review
                        </button>
                    </div>
                </>
            ) : (
                <button
                    onClick={() => setShowAnswer(true)}
                    className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-colors"
                >
                    Show Answer
                </button>
            )}
        </div>
    );
};
