import { test as base, expect } from '@playwright/test';
import {
    LandingPage,
    DashboardPage,
    FlashcardPage,
    SquadPage,
    UserStatsPage,
} from './pages';

/**
 * Extended test fixtures with Page Objects
 * This allows clean dependency injection of page objects into tests
 */
interface PageFixtures {
    landingPage: LandingPage;
    dashboardPage: DashboardPage;
    flashcardPage: FlashcardPage;
    squadPage: SquadPage;
    userStatsPage: UserStatsPage;
}

export const test = base.extend<PageFixtures>({
    landingPage: async ({ page }, use) => {
        const landingPage = new LandingPage(page);
        await use(landingPage);
    },
    dashboardPage: async ({ page }, use) => {
        const dashboardPage = new DashboardPage(page);
        await use(dashboardPage);
    },
    flashcardPage: async ({ page }, use) => {
        const flashcardPage = new FlashcardPage(page);
        await use(flashcardPage);
    },
    squadPage: async ({ page }, use) => {
        const squadPage = new SquadPage(page);
        await use(squadPage);
    },
    userStatsPage: async ({ page }, use) => {
        const userStatsPage = new UserStatsPage(page);
        await use(userStatsPage);
    },
});

export { expect };
