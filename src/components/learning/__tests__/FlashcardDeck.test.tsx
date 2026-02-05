import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { FlashcardDeck } from "../FlashcardDeck";

describe("FlashcardDeck", () => {
    const mockOnAnswer = vi.fn();
    const mockOnEarnPoints = vi.fn();
    const mockOnUpdateStreak = vi.fn();

    const queue = [
        { id: "fc1", question: "Q1?", answer: "A1", box: 1, nextReview: 0 },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("shows question and toggles answer", () => {
        render(
            <FlashcardDeck
                queue={queue}
                currentItem={queue[0]}
                onAnswer={mockOnAnswer}
                onEarnPoints={mockOnEarnPoints}
                onUpdateStreak={mockOnUpdateStreak}
            />
        );

        // Question should be visible
        expect(screen.getByText(/Q1\?/i)).toBeInTheDocument();

        // Answer should be hidden initially
        expect(screen.queryByText(/A1/i)).not.toBeInTheDocument();

        // Click "Show Answer"
        fireEvent.click(screen.getByText(/Show Answer/i));

        // Answer should now be visible
        expect(screen.getByText(/A1/i)).toBeInTheDocument();
    });

    test("calls callbacks when answer is correct", () => {
        render(
            <FlashcardDeck
                queue={queue}
                currentItem={queue[0]}
                onAnswer={mockOnAnswer}
                onEarnPoints={mockOnEarnPoints}
                onUpdateStreak={mockOnUpdateStreak}
            />
        );

        // Show answer first
        fireEvent.click(screen.getByText(/Show Answer/i));

        // Click "I Got It"
        fireEvent.click(screen.getByText(/I Got It/i));

        // Verify callbacks were called
        expect(mockOnAnswer).toHaveBeenCalledWith("fc1", true);
        expect(mockOnEarnPoints).toHaveBeenCalledWith(5);
        expect(mockOnUpdateStreak).toHaveBeenCalled();
    });

    test("calls onAnswer with false when need review", () => {
        render(
            <FlashcardDeck
                queue={queue}
                currentItem={queue[0]}
                onAnswer={mockOnAnswer}
                onEarnPoints={mockOnEarnPoints}
                onUpdateStreak={mockOnUpdateStreak}
            />
        );

        fireEvent.click(screen.getByText(/Show Answer/i));
        fireEvent.click(screen.getByText(/Need Review/i));

        expect(mockOnAnswer).toHaveBeenCalledWith("fc1", false);
        // Points and streak should NOT be called on failure
        expect(mockOnEarnPoints).not.toHaveBeenCalled();
        expect(mockOnUpdateStreak).not.toHaveBeenCalled();
    });

    test("shows empty state when no cards due", () => {
        render(
            <FlashcardDeck
                queue={[]}
                currentItem={null}
                onAnswer={mockOnAnswer}
                onEarnPoints={mockOnEarnPoints}
                onUpdateStreak={mockOnUpdateStreak}
            />
        );

        expect(screen.getByText(/No cards due for review/i)).toBeInTheDocument();
        expect(screen.getByText(/crushing it/i)).toBeInTheDocument();
    });
});
