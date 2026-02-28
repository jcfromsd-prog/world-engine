import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { AuthProvider } from '../context/AuthProvider';

// Mock window.scrollTo
window.scrollTo = vi.fn();

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

// Mock speechSynthesis
Object.defineProperty(window, 'speechSynthesis', {
    value: {
        getVoices: () => [],
        speak: vi.fn(),
        cancel: vi.fn()
    }
});

// Mock SpeechSynthesisUtterance
global.SpeechSynthesisUtterance = class SpeechSynthesisUtterance {
    constructor() { }
};

describe('SageFlow User Journey', () => {
    it('should guide user from Landing to Calibration successfully', async () => {
        // 1. Render App inside Router
        render(
            <AuthProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </AuthProvider>
        );

        // 2. Verify Landing Page Button
        const startBtn = await screen.findByRole('button', { name: /start your engine/i });
        expect(startBtn).toBeInTheDocument();

        // 3. Click "START YOUR ENGINE"
        fireEvent.click(startBtn);

        // 4. Verify Onboarding Transition
        // The NAME step heading is "Type your Name" (with Name in a styled span)
        await waitFor(() => {
            expect(screen.getByText(/What is 12 x 12\?/i)).toBeInTheDocument();
        }, { timeout: 2000 });

        // 5. Simulate Answering Math
        fireEvent.click(screen.getByText(/144/i));

        await waitFor(() => {
            expect(screen.getByText(/DOMAIN: ELA • LEVEL 4/i)).toBeInTheDocument();
        }, { timeout: 2000 });

        // 6. Simulate Answering ELA
        fireEvent.click(screen.getByText(/Quick/i));

        // 7. Verify Transition to Graduation/Calibration
        // Match "Calibrate Your Engine" (might be split across elements, so match unique word)
        await waitFor(() => {
            expect(screen.getByText(/DOMAIN: LOGIC • LEVEL 4/i)).toBeInTheDocument();
        }, { timeout: 2000 });

        // Test Passed if we reach here
    });
});
