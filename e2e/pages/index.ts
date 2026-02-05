import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Base Page Object with common functionality
 */
export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto(path: string = '/') {
        await this.page.goto(path);
        await this.waitForPageLoad();
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }

    async getByTestId(testId: string): Promise<Locator> {
        return this.page.getByTestId(testId);
    }

    async clickAndWait(locator: Locator) {
        await locator.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async isVisible(locator: Locator, timeout = 5000): Promise<boolean> {
        try {
            await locator.waitFor({ state: 'visible', timeout });
            return true;
        } catch {
            return false;
        }
    }
}

/**
 * Landing Page - Hero section and navigation
 */
export class LandingPage extends BasePage {
    readonly heroSection: Locator;
    readonly navLinks: Locator;
    readonly ctaButton: Locator;
    readonly manifestoItems: Locator;

    constructor(page: Page) {
        super(page);
        this.heroSection = page.locator('section').first();
        this.navLinks = page.locator('nav a, nav button');
        this.ctaButton = page.getByRole('button', { name: /solve|earn|start|join/i });
        this.manifestoItems = page.locator('[data-testid="manifesto-item"]');
    }

    async verifyManifestoVisible() {
        const keywords = ['CONNECT', 'LEARN', 'SOLVE', 'EARN'];
        for (const keyword of keywords) {
            await expect(this.page.getByText(keyword, { exact: false })).toBeVisible();
        }
    }

    async clickCTA() {
        const button = this.page.getByRole('button', { name: /solve.*earn|start|join/i }).first();
        if (await this.isVisible(button)) {
            await this.clickAndWait(button);
        }
    }
}

/**
 * Dashboard Page - Main user interface after login
 */
export class DashboardPage extends BasePage {
    readonly progressionDashboard: Locator;
    readonly dailyReviewSection: Locator;
    readonly missionGrid: Locator;
    readonly squadSidebar: Locator;
    readonly userStats: Locator;

    constructor(page: Page) {
        super(page);
        this.progressionDashboard = page.locator('[data-testid="progression-dashboard"]');
        this.dailyReviewSection = page.locator('section:has-text("Daily Review")');
        this.missionGrid = page.locator('[data-testid="mission-grid"]');
        this.squadSidebar = page.locator('[data-testid="squad-sidebar"]');
        this.userStats = page.locator('[data-testid="user-stats"]');
    }

    async verifyDashboardLoaded() {
        await this.page.waitForLoadState('networkidle');
        // At least one main section should be visible
        const sections = [this.dailyReviewSection, this.missionGrid];
        let found = false;
        for (const section of sections) {
            if (await this.isVisible(section, 3000)) {
                found = true;
                break;
            }
        }
        return found;
    }
}

/**
 * Flashcard Deck Component
 */
export class FlashcardPage extends BasePage {
    readonly flashcardContainer: Locator;
    readonly questionText: Locator;
    readonly answerText: Locator;
    readonly showAnswerButton: Locator;
    readonly gotItButton: Locator;
    readonly needReviewButton: Locator;
    readonly boxLevel: Locator;

    constructor(page: Page) {
        super(page);
        this.flashcardContainer = page.locator('[data-testid="flashcard-deck"]');
        this.questionText = page.getByText(/Q:/);
        this.answerText = page.getByText(/A:/);
        this.showAnswerButton = page.getByRole('button', { name: /show answer/i });
        this.gotItButton = page.getByRole('button', { name: /got it/i });
        this.needReviewButton = page.getByRole('button', { name: /need review/i });
        this.boxLevel = page.getByText(/box/i);
    }

    async showAnswer() {
        await this.showAnswerButton.click();
        await expect(this.answerText).toBeVisible();
    }

    async answerCorrect() {
        await this.gotItButton.click();
    }

    async answerIncorrect() {
        await this.needReviewButton.click();
    }

    async getBoxLevel(): Promise<number> {
        const text = await this.boxLevel.textContent();
        const match = text?.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
    }
}

/**
 * Squad Roster Component
 */
export class SquadPage extends BasePage {
    readonly squadSection: Locator;
    readonly matchedSquads: Locator;
    readonly unmatchedUsers: Locator;
    readonly compatibilityScore: Locator;

    constructor(page: Page) {
        super(page);
        this.squadSection = page.locator('[data-testid="squad-roster"]');
        this.matchedSquads = page.getByText(/matched squads/i);
        this.unmatchedUsers = page.getByText(/unmatched|seeking squad/i);
        this.compatibilityScore = page.getByText(/%\s*match/i);
    }

    async getSquadCount(): Promise<number> {
        const squads = this.page.locator('[data-testid="squad-item"]');
        return squads.count();
    }
}

/**
 * User Stats Component
 */
export class UserStatsPage extends BasePage {
    readonly statsContainer: Locator;
    readonly cardsReviewed: Locator;
    readonly totalPoints: Locator;
    readonly streakDays: Locator;

    constructor(page: Page) {
        super(page);
        this.statsContainer = page.locator('[data-testid="user-stats"]');
        this.cardsReviewed = page.getByText(/cards/i);
        this.totalPoints = page.getByText(/points/i);
        this.streakDays = page.getByText(/streak/i);
    }

    async getPoints(): Promise<number> {
        const container = this.page.locator('[data-testid="user-stats"]');
        const text = await container.textContent();
        const match = text?.match(/(\d+)\s*points/i);
        return match ? parseInt(match[1], 10) : 0;
    }

    async getStreak(): Promise<number> {
        const container = this.page.locator('[data-testid="user-stats"]');
        const text = await container.textContent();
        const match = text?.match(/(\d+).*streak/i);
        return match ? parseInt(match[1], 10) : 0;
    }
}
