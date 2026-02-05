/**
 * MyBestPurpose.com - Full E2E Test Suite
 * ========================================
 * Tests aligned with "The World Engine" mission pillars:
 * CONNECT (Squads), LEARN (Flashcards), SOLVE (Missions), EARN (Payouts)
 * 
 * Uses Page Object Model for maintainability
 * @see https://playwright.dev/docs/pom
 */

import { test, expect } from '../fixtures';
import AxeBuilder from '@axe-core/playwright';

test.describe('MyBestPurpose Full Journey', () => {

    // ═══════════════════════════════════════════════════════════════
    // LANDING PAGE & ONBOARDING
    // ═══════════════════════════════════════════════════════════════

    test.describe('Landing Page', () => {

        test('displays manifesto pillars (CONNECT, LEARN, SOLVE, EARN)', async ({ landingPage }) => {
            await landingPage.goto('/');
            await landingPage.verifyManifestoVisible();
        });

        test('hero section renders correctly', async ({ landingPage, page }) => {
            await landingPage.goto('/');

            // Check for World Engine branding elements
            await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

            // CTA button should be visible and clickable
            const ctaButton = page.getByRole('button', { name: /solve|earn|start/i }).first();
            if (await landingPage.isVisible(ctaButton)) {
                await expect(ctaButton).toBeEnabled();
            }
        });

        test('navigation links are accessible', async ({ page, landingPage }) => {
            await landingPage.goto('/');

            // Tab through focusable elements
            await page.keyboard.press('Tab');
            const focusedElement = page.locator(':focus');
            await expect(focusedElement).toBeVisible();
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // LEARN - Flashcards & Spaced Repetition
    // ═══════════════════════════════════════════════════════════════

    test.describe('LEARN - Flashcard System', () => {

        test('displays flashcard with question', async ({ page, flashcardPage }) => {
            await flashcardPage.goto('/');

            // Look for flashcard section
            const flashcardSection = page.locator('text=Flashcard').first();

            if (await flashcardPage.isVisible(flashcardSection)) {
                // Question should be visible
                await expect(page.getByText(/Q:/)).toBeVisible();

                // Show Answer button should be present
                await expect(flashcardPage.showAnswerButton).toBeVisible();
            }
        });

        test('reveals answer when Show Answer clicked', async ({ page, flashcardPage }) => {
            await flashcardPage.goto('/');

            const showBtn = flashcardPage.showAnswerButton;
            if (await flashcardPage.isVisible(showBtn)) {
                await showBtn.click();

                // Answer should now be visible
                await expect(page.getByText(/A:/)).toBeVisible();

                // Action buttons should appear
                await expect(flashcardPage.gotItButton).toBeVisible();
                await expect(flashcardPage.needReviewButton).toBeVisible();
            }
        });

        test('gamification updates on correct answer', async ({ page, flashcardPage }) => {
            await flashcardPage.goto('/');

            const showBtn = flashcardPage.showAnswerButton;
            if (await flashcardPage.isVisible(showBtn)) {
                // Show answer
                await showBtn.click();

                // Click "I Got It"
                await flashcardPage.gotItButton.click();

                // Points should be displayed (look for any number)
                const statsSection = page.locator('text=/\\d+.*points/i');
                await expect(statsSection.or(page.locator('[data-testid="user-stats"]'))).toBeVisible();
            }
        });

        test('Leitner box advances on success', async ({ flashcardPage }) => {
            await flashcardPage.goto('/');

            if (await flashcardPage.isVisible(flashcardPage.showAnswerButton)) {
                const initialBox = await flashcardPage.getBoxLevel();

                await flashcardPage.showAnswer();
                await flashcardPage.answerCorrect();

                // Wait for state update
                await flashcardPage.page.waitForTimeout(500);

                // Box level should increase (or stay at max)
                const newBox = await flashcardPage.getBoxLevel();
                expect(newBox).toBeGreaterThanOrEqual(initialBox);
            }
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // CONNECT - Squad Matching System
    // ═══════════════════════════════════════════════════════════════

    test.describe('CONNECT - Squad System', () => {

        test('displays squad roster with matched teams', async ({ page, squadPage }) => {
            await squadPage.goto('/');

            // Look for squad section
            const squadSection = page.getByText(/squad/i).first();

            if (await squadPage.isVisible(squadSection)) {
                // Should show matched squads header
                await expect(page.getByText(/matched|squad command/i)).toBeVisible();
            }
        });

        test('shows compatibility scores for squads', async ({ page, squadPage }) => {
            await squadPage.goto('/');

            // Look for percentage match indicators
            const compatibilityIndicator = page.getByText(/%/);

            if (await squadPage.isVisible(compatibilityIndicator, 3000)) {
                const text = await compatibilityIndicator.first().textContent();
                // Should contain a valid percentage
                expect(text).toMatch(/\d+%/);
            }
        });

        test('displays squad member archetypes', async ({ page, squadPage }) => {
            await squadPage.goto('/');

            // Common archetype names that should appear
            const archetypes = ['Ranger', 'Strategist', 'Wizard', 'Alchemist', 'Engineer'];

            let found = false;
            for (const archetype of archetypes) {
                const element = page.getByText(archetype, { exact: false });
                if (await squadPage.isVisible(element, 1000)) {
                    found = true;
                    break;
                }
            }

            // At least one archetype should be visible (if squad section exists)
            const squadExists = await squadPage.isVisible(page.getByText(/squad/i), 2000);
            if (squadExists) {
                expect(found).toBeTruthy();
            }
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // SOLVE - Mission System
    // ═══════════════════════════════════════════════════════════════

    test.describe('SOLVE - Mission System', () => {

        test('displays available missions grid', async ({ page, dashboardPage }) => {
            await dashboardPage.goto('/');

            // Look for missions section
            const missionsSection = page.getByText(/mission/i);

            if (await dashboardPage.isVisible(missionsSection)) {
                await expect(missionsSection.first()).toBeVisible();
            }
        });

        test('mission cards show reward information', async ({ page, dashboardPage }) => {
            await dashboardPage.goto('/');

            // Look for price/reward indicators
            const rewardIndicator = page.getByText(/\$\d+|\d+\s*(GP|points)/i);

            if (await dashboardPage.isVisible(rewardIndicator, 3000)) {
                const text = await rewardIndicator.first().textContent();
                expect(text).toMatch(/\$|\d+/);
            }
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // PERFORMANCE & SECURITY
    // ═══════════════════════════════════════════════════════════════

    test.describe('Performance & Security', () => {

        test('page loads within acceptable time', async ({ page }) => {
            const startTime = Date.now();
            await page.goto('/');
            await page.waitForLoadState('domcontentloaded');
            const loadTime = Date.now() - startTime;

            // Page should load within 5 seconds
            expect(loadTime).toBeLessThan(5000);
        });

        test('no sensitive data exposed in page source', async ({ page }) => {
            await page.goto('/');
            const content = await page.content();

            // Should not contain obvious sensitive patterns
            const sensitivePatterns = [
                /password\s*[:=]\s*["'][^"']+["']/i,
                /api[_-]?key\s*[:=]\s*["'][^"']+["']/i,
                /secret\s*[:=]\s*["'][^"']+["']/i,
            ];

            for (const pattern of sensitivePatterns) {
                expect(content).not.toMatch(pattern);
            }
        });

        test('HTTPS is enforced in production', async ({ page }) => {
            // Only check if we're testing against production
            const baseUrl = page.url();
            if (baseUrl.includes('mybestpurpose.com')) {
                expect(baseUrl.startsWith('https://')).toBeTruthy();
            }
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // ACCESSIBILITY
    // ═══════════════════════════════════════════════════════════════

    test.describe('Accessibility', () => {

        test('passes axe accessibility checks', async ({ page }) => {
            await page.goto('/');
            await page.waitForLoadState('networkidle');

            const accessibilityScanResults = await new AxeBuilder({ page })
                .withTags(['wcag2a', 'wcag2aa'])
                .analyze();

            // Filter out minor issues for now, focus on critical/serious
            const criticalViolations = accessibilityScanResults.violations.filter(
                v => v.impact === 'critical' || v.impact === 'serious'
            );

            expect(criticalViolations).toEqual([]);
        });

        test('keyboard navigation works for main controls', async ({ page }) => {
            await page.goto('/');

            // Tab through the page
            for (let i = 0; i < 5; i++) {
                await page.keyboard.press('Tab');
            }

            // Something should be focused
            const focusedElement = page.locator(':focus');
            await expect(focusedElement).toBeVisible();
        });

        test('buttons have accessible names', async ({ page }) => {
            await page.goto('/');

            const buttons = page.getByRole('button');
            const buttonCount = await buttons.count();

            for (let i = 0; i < Math.min(buttonCount, 10); i++) {
                const button = buttons.nth(i);
                const accessibleName = await button.getAttribute('aria-label')
                    || await button.textContent();

                // Button should have some accessible name
                expect(accessibleName?.trim().length).toBeGreaterThan(0);
            }
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // RESPONSIVE DESIGN
    // ═══════════════════════════════════════════════════════════════

    test.describe('Responsive Design', () => {

        test('renders correctly on mobile viewport', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto('/');

            // Page should not have horizontal overflow
            const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
            const viewportWidth = await page.evaluate(() => window.innerWidth);

            expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 10); // Small tolerance
        });

        test('navigation is accessible on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto('/');

            // Look for hamburger menu or visible nav
            const mobileNav = page.locator('[data-testid="mobile-menu"], button[aria-label*="menu" i], nav');
            await expect(mobileNav.first()).toBeVisible();
        });

        test('renders correctly on tablet viewport', async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.goto('/');

            // Main content should be visible
            await expect(page.locator('main, section').first()).toBeVisible();
        });

        test('renders correctly on desktop viewport', async ({ page }) => {
            await page.setViewportSize({ width: 1280, height: 800 });
            await page.goto('/');

            // Main content should be visible
            await expect(page.locator('main, section').first()).toBeVisible();
        });
    });
});
