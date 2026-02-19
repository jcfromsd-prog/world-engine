import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

// Mock window.scrollTo
window.scrollTo = vi.fn();

describe('SageFlow User Journey', () => {
    it('should guide user from Landing to Calibration successfully', async () => {
        // 1. Render App inside Router
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );

        // 2. Verify Landing Page Button
        const startBtn = await screen.findByRole('button', { name: /start your engine/i });
        expect(startBtn).toBeInTheDocument();

        // 3. Click "START YOUR ENGINE"
        fireEvent.click(startBtn);

        // 4. Verify Onboarding Transition
        // The NAME step heading is "Type your Name" (with Name in a styled span)
        await waitFor(() => {
            expect(screen.getByText(/Type your/i)).toBeInTheDocument();
        }, { timeout: 2000 });

        // 5. Simulate Typing Name
        const input = screen.getByPlaceholderText(/Your Name/i);
        fireEvent.change(input, { target: { value: 'Auto-Test-User' } });

        // 6. Simulate Pressing ENTER
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

        // 7. Verify Transition to Graduation/Calibration
        // Match "Calibrate Your Engine" (might be split across elements, so match unique word)
        await waitFor(() => {
            expect(screen.getByText(/Calibrate/i)).toBeInTheDocument();
        }, { timeout: 2000 });

        // Test Passed if we reach here
    });
});
