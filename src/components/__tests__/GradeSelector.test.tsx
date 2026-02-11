import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { GradeSelector, GradeBands } from '../onboarding/GradeSelector';

// Mock feature flags
vi.mock('../../config/featureFlags', () => ({
    features: { simplifiedUi: false },
    setFeatureFlag: vi.fn(),
}));

// Mock Telemetry directly
vi.mock('../../telemetry/events', () => ({
    TelemetryService: {
        logEvent: vi.fn(),
    }
}));

// Mock SproutsLanding to avoid complex rendering and import issues
vi.mock('../SimplifiedLanding/SproutsLanding', () => ({
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

    it('activates simplified UI for Sprouts selection', () => {
        const handleSubmit = vi.fn();
        render(<GradeSelector onSubmit={handleSubmit} />);

        const select = screen.getByLabelText(/Select Your Archetype Level/i);
        fireEvent.change(select, { target: { value: GradeBands.SPROUTS.toString() } });

        const button = screen.getByText(/Initialize Identity/i);
        fireEvent.click(button);

        // Should switch to SproutsLanding (Welcome, Legend!)
        expect(screen.getByText(/Welcome, Legend!/i)).toBeInTheDocument();

        // Should NOT call submit yet
        expect(handleSubmit).not.toHaveBeenCalled();

        // Click Let's Go
        const goButton = screen.getByText(/LET'S GO!/i);
        fireEvent.click(goButton);

        // Now it should submit with Sprouts grade
        expect(handleSubmit).toHaveBeenCalledWith(GradeBands.SPROUTS);
    });

    it('submits directly for non-Sprouts', () => {
        const handleSubmit = vi.fn();
        render(<GradeSelector onSubmit={handleSubmit} />);

        const select = screen.getByLabelText(/Select Your Archetype Level/i);
        fireEvent.change(select, { target: { value: GradeBands.EXPLORERS.toString() } });

        const button = screen.getByText(/Initialize Identity/i);
        fireEvent.click(button);

        expect(handleSubmit).toHaveBeenCalledWith(GradeBands.EXPLORERS);
        expect(screen.queryByText(/Welcome, Legend!/i)).not.toBeInTheDocument();
    });
});
