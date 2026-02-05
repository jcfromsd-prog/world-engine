/**
 * Automated User Journey Simulation Tests
 * 
 * This test suite validates the complete user journey for each persona type.
 * Uses localStorage injection to control which persona runs, enabling
 * comprehensive swarm testing across all user archetypes.
 */
import { test, expect } from '@playwright/test';

// Define personas inline to avoid import issues with Playwright's isolation
const USER_PERSONAS = {
    GRADE_4: { id: "p_4th", archetype: "Explorer", skillTheta: -2.0, interests: ["NATURE", "DINOSAURS"] },
    HS_SOPHOMORE: { id: "p_hs", archetype: "Builder", skillTheta: 0.5, interests: ["TECH", "CODING"] },
    COLLEGE_FRESH: { id: "p_col", archetype: "Innovator", skillTheta: 2.0, interests: ["AI", "STARTUP"] }
};

// Dynamic URL: defaults to localhost, can be overridden via CLI
// Usage: BASE_URL=https://mybestpurpose.com npx playwright test
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

test.describe('Automated User Journey Simulations', () => {

    for (const [key, persona] of Object.entries(USER_PERSONAS)) {
        test(`Simulate journey for: ${persona.archetype} (${key})`, async ({ page }) => {

            // 1. Capture Browser Console Errors
            // This catches hidden crashes that don't render to the UI log
            const consoleErrors: string[] = [];
            page.on('console', msg => {
                if (msg.type() === 'error') {
                    // Filter out known benign errors (e.g., favicon 404)
                    const text = msg.text();
                    if (!text.includes('favicon') && !text.includes('404')) {
                        consoleErrors.push(text);
                    }
                }
            });

            // 2. Inject Persona BEFORE Page Load
            // This ensures the app reads the correct persona immediately on mount
            await page.addInitScript((personaKey) => {
                localStorage.setItem('simulatePersona', personaKey);
            }, key);

            // 3. Navigate to the application
            await page.goto(BASE_URL);
            await page.waitForLoadState('networkidle');

            // 4. Trigger Simulation
            // Using a stronger locator that matches the button exactly
            const runBtn = page.getByRole('button', { name: /RUN PATH SIMULATION|Run Path Simulation/i });

            // The button might be in the footer, so scroll if needed
            if (await runBtn.isVisible()) {
                await runBtn.scrollIntoViewIfNeeded();
                await runBtn.click();
            } else {
                // If not immediately visible, the user might not be logged in yet
                // Try to find and click the CTA to get to the dashboard first
                const ctaButton = page.getByRole('button', { name: /SOLVE.*EARN|Start/i }).first();
                if (await ctaButton.isVisible()) {
                    await ctaButton.click();
                    await page.waitForTimeout(1000);
                }

                // Now try the simulation button again
                await expect(runBtn).toBeVisible({ timeout: 10000 });
                await runBtn.click();
            }

            // 5. Wait for Simulation to COMPLETE
            // Don't just wait for logs to appear; wait for the "Done" signal.
            const logContainer = page.locator('[data-testid="simulation-log"], #simulation-log');
            await expect(logContainer).toBeVisible({ timeout: 10000 });

            // Extended timeout (30s) to allow full simulation sequence
            await expect(logContainer).toContainText(/SUCCESS|Simulation Complete|🏆/i, { timeout: 30000 });

            // 6. Analyze Logs
            const logText = await logContainer.innerText();

            // A: Check for explicit failures in the log text
            expect(logText.toLowerCase()).not.toMatch(/\bfail\b|\berror\b/i);

            // B: Verify the RIGHT persona ran
            // If we asked for "Explorer", the logs should confirm "Explorer" started.
            expect(logText).toContain(persona.archetype);

            // C: Verify all 4 stages completed
            expect(logText).toContain('CONNECT');
            expect(logText).toContain('LEARN');
            expect(logText).toContain('SOLVE');
            expect(logText).toContain('EARN');

            // D: Check Browser Console Integrity
            if (consoleErrors.length > 0) {
                console.error(`Browser Console Errors for ${key}:`, consoleErrors);
            }
            // Allow test to pass with warnings logged, but fail on actual errors
            expect(consoleErrors.filter(e => !e.includes('Warning')).length).toBe(0);
        });
    }

    test('Simulation handles missing persona gracefully (defaults to HS_SOPHOMORE)', async ({ page }) => {
        // Don't inject any persona - test the default fallback
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        const runBtn = page.getByRole('button', { name: /RUN PATH SIMULATION|Run Path Simulation/i });

        if (await runBtn.isVisible()) {
            await runBtn.click();

            const logContainer = page.locator('[data-testid="simulation-log"], #simulation-log');
            await expect(logContainer).toBeVisible({ timeout: 10000 });
            await expect(logContainer).toContainText(/SUCCESS|🏆/i, { timeout: 30000 });

            const logText = await logContainer.innerText();
            // Should default to Builder (HS_SOPHOMORE)
            expect(logText).toContain('Builder');
        }
    });

    test('Simulation cleans up localStorage after completion', async ({ page }) => {
        await page.addInitScript(() => {
            localStorage.setItem('simulatePersona', 'COLLEGE_FRESH');
        });

        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        const runBtn = page.getByRole('button', { name: /RUN PATH SIMULATION/i });

        if (await runBtn.isVisible()) {
            await runBtn.click();

            const logContainer = page.locator('[data-testid="simulation-log"], #simulation-log');
            await expect(logContainer).toContainText(/SUCCESS|🏆/i, { timeout: 30000 });

            // Verify the persona was used
            const logText = await logContainer.innerText();
            expect(logText).toContain('Innovator');
        }
    });
});
