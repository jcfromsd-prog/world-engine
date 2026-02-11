import { describe, it, expect, vi } from 'vitest';
import { GradeBands } from '../components/onboarding/GradeSelector';

// Mock dependencies to prevent import errors if they are the cause
vi.mock('../config/featureFlags', () => ({
    features: { simplifiedUi: false },
    setFeatureFlag: vi.fn(),
}));

vi.mock('../telemetry/events', () => ({
    TelemetryService: {
        logEvent: vi.fn(),
    }
}));

vi.mock('../components/SimplifiedLanding/SproutsLanding', () => ({
    default: () => null,
}));

describe('GradeSelector Constants', () => {
    it('exports correct GradeBands', () => {
        expect(GradeBands.SPROUTS).toBe(2);
        expect(GradeBands.VOYAGERS).toBe(16);
    });
});
