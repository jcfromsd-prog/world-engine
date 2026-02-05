import { useState, useEffect, useCallback } from "react";

export interface FlashcardItem {
    id: string;
    question: string;
    answer: string;
    box: number;
    nextReview: number;
}

export interface LeitnerQueueHook {
    queue: FlashcardItem[];
    currentItem: FlashcardItem | null;
    recordAnswer: (itemId: string, success: boolean) => void;
}

const INITIAL_FLASHCARDS: FlashcardItem[] = [
    { id: "fc1", question: "What is the capital of France?", answer: "Paris", box: 1, nextReview: 0 },
    { id: "fc2", question: "Define Newton's 1st law.", answer: "Inertia", box: 1, nextReview: 0 },
    { id: "fc3", question: "What is 12 × 12?", answer: "144", box: 1, nextReview: 0 },
    { id: "fc4", question: "H₂O is the formula for?", answer: "Water", box: 1, nextReview: 0 },
];

// Leitner box intervals in milliseconds
const BOX_INTERVALS = [
    0,          // Box 0 (unused, we start at 1)
    60_000,     // Box 1: 1 minute
    300_000,    // Box 2: 5 minutes  
    1_800_000,  // Box 3: 30 minutes
    86_400_000, // Box 4: 1 day
    259_200_000 // Box 5: 3 days
] as const;

const MAX_BOX = 5;

export function useLeitnerQueue(): LeitnerQueueHook {
    const [queue, setQueue] = useState<FlashcardItem[]>(INITIAL_FLASHCARDS);
    const [currentItem, setCurrentItem] = useState<FlashcardItem | null>(null);

    // Update current item when queue changes
    useEffect(() => {
        const now = Date.now();
        const dueCards = queue.filter((item) => item.nextReview <= now);
        // Sort by nextReview to show oldest due first
        dueCards.sort((a, b) => a.nextReview - b.nextReview);
        setCurrentItem(dueCards.length > 0 ? dueCards[0] : null);
    }, [queue]); // setCurrentItem is stable, no need in deps

    // Memoized answer handler for stable reference
    const recordAnswer = useCallback((itemId: string, success: boolean) => {
        setQueue((prev) =>
            prev.map((item) => {
                if (item.id !== itemId) return item;

                // Calculate new box based on answer
                const newBox = success
                    ? Math.min(item.box + 1, MAX_BOX)
                    : 1; // Reset to box 1 on failure

                // Calculate next review time
                const interval = BOX_INTERVALS[newBox] ?? BOX_INTERVALS[MAX_BOX];
                const nextReview = Date.now() + interval;

                return { ...item, box: newBox, nextReview };
            })
        );
    }, []);

    return { queue, currentItem, recordAnswer };
}
