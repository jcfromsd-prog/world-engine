import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { GradeSelector, GradeBands } from '../components/onboarding/GradeSelector';
import '@testing-library/jest-dom';

// Mock dependencies
vi.mock('../components/SimplifiedLanding/SproutsLanding', () => ({
    default: ({ onStart }: { onStart: () => void }) => (
        <div>
            <h1>Welcome, Legend!</h1>
            <button onClick={onStart}>LET'S GO!</button>
        </div>
    ),
}));

describe('GradeSelector Neural Identity Gate', () => {
    it('renders all 5 archetype bands', () => {
        render(<GradeSelector onSubmit={() => { }} />);

        expect(screen.getByText(/Sprouts \(K-2\)/i)).toBeInTheDocument();
        expect(screen.getByText(/Builders \(3-5\)/i)).toBeInTheDocument();
        expect(screen.getByText(/Trailblazers \(6-8\)/i)).toBeInTheDocument();
        expect(screen.getByText(/Explorers \(9-12\)/i)).toBeInTheDocument();
        expect(screen.getByText(/Voyagers \(College\+\)/i)).toBeInTheDocument();
    });

    it('shows SproutsLanding when Sprouts are selected and initialized', () => {
        const handleSubmit = vi.fn();
        render(<GradeSelector onSubmit={handleSubmit} />);

        const select = screen.getByLabelText(/Select Your Archetype Level/i);
        fireEvent.change(select, { target: { value: GradeBands.SPROUTS.toString() } });

        fireEvent.click(screen.getByText(/Initialize Identity/i));

        // Should switch to SproutsLanding
        expect(screen.getByText(/Welcome, Legend!/i)).toBeInTheDocument();
        expect(handleSubmit).not.toHaveBeenCalled();

        // Start from landing
        fireEvent.click(screen.getByText(/LET'S GO!/i));
        expect(handleSubmit).toHaveBeenCalledWith(GradeBands.SPROUTS);
    });

    it('calls onSubmit directly for non-sprouts', () => {
        const handleSubmit = vi.fn();
        render(<GradeSelector onSubmit={handleSubmit} />);

        const select = screen.getByLabelText(/Select Your Archetype Level/i);
        fireEvent.change(select, { target: { value: GradeBands.EXPLORERS.toString() } });

        fireEvent.click(screen.getByText(/Initialize Identity/i));

        expect(handleSubmit).toHaveBeenCalledWith(GradeBands.EXPLORERS);
    });
});
