
import { test, expect } from '@playwright/test';

test.describe('Blueprint Mode - Architect Tier', () => {

    // Pre-condition: User must be logged in and navigating
    test.beforeEach(async ({ page }) => {
        // Note: In real scenarios we might mock auth or login.
        // Assuming /architect/blueprint route is accessible.
        await page.goto('http://localhost:5173/architect/blueprint');
    });

    test('should create valid logic chain and validate successfully', async ({ page }) => {
        // The canvas should be visible
        const canvas = page.locator('.react-flow');
        await expect(canvas).toBeVisible();

        // 1. Add Nodes using the UI buttons (easier to test than Drag-n-Drop for now)
        await page.click('button:has-text("Add GOAL")');
        await page.click('button:has-text("Add PAYOFF")');

        // 2. Locate the nodes (React Flow renders them with specific classes/attributes)
        // We might need to select based on text content since IDs are dynamic
        const goalNode = page.locator('.react-flow__node', { hasText: 'GOAL' }).first();
        const payoffNode = page.locator('.react-flow__node', { hasText: 'PAYOFF' }).first();

        await expect(goalNode).toBeVisible();
        await expect(payoffNode).toBeVisible();

        // 3. Connect them (Simulating a connection might require lower-level mouse events)
        // For this "Guardrail" test, we'll assume the user can connect them manually or we simulate the state update
        // But sticking to the requested flow:

        // Simulate Dragging a Connection (This is tricky in Playwright/Canvas)
        // Strategy: Get handles and drag.

        const sourceHandle = goalNode.locator('.react-flow__handle-bottom');
        const targetHandle = payoffNode.locator('.react-flow__handle-top');

        // Perform Drag and Drop for Connection
        const sourceBox = await sourceHandle.boundingBox();
        const targetBox = await targetHandle.boundingBox();

        if (sourceBox && targetBox) {
            await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
            await page.mouse.down();
            await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2);
            await page.mouse.up();
        }

        // 4. Trigger Validation
        await page.click('button:has-text("COMPILE")');

        // 5. Assert "Success" State (Green Border)
        // Note: The validity depends on having exactly 1 Goal and at least 1 Payoff AND a connection?
        // Our LogicSieve requires 1 Goal and 1 Payoff. The connection check is "future".
        // So just adding nodes might pass if we don't enforce connectivity yet.
        // But let's verify the "Success" UI feedback.

        // The container div has class that changes based on logic validity.
        // .border-green-500/50 
        const container = page.locator('.border-green-500\\/50');
        // Escape the slash in selector or use partial class matcher

        // Checking for the dynamic class applied on validity
        await expect(page.locator('div').filter({ has: canvas })).toHaveClass(/border-green-500/);
    });

    test('should fail validation with missing payoff', async ({ page }) => {
        // 1. Add only GOAL
        await page.click('button:has-text("Add GOAL")');

        // 2. Trigger Validation
        await page.click('button:has-text("COMPILE")');

        // 3. Assert "Failure" State (Red Border)
        await expect(page.locator('div').filter({ has: page.locator('.react-flow') })).toHaveClass(/border-red-500/);
    });
});
