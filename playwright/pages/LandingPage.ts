import { expect, Page } from '@playwright/test';
import { Header } from './components/Header';

export class LandingPage {
    readonly header: Header;

    constructor(private page: Page) {
        this.header = new Header(page);
    }

    async open() {
        await this.page.goto('/');
    }

    async checkPageLoaded() {
        await expect(this.page.getByTestId('landing-page')).toBeVisible();
        await expect(this.page.getByTestId('hero-section')).toBeVisible();
    }
}
