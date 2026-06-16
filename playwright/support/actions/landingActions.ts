import { expect, Page } from '@playwright/test';

export function createLandingActions(page: Page) {
  return {
    async open() {
      await page.goto('/');
    },

    async checkPageLoaded() {
      await expect(page.getByTestId('landing-page')).toBeVisible();
      await expect(page.getByTestId('hero-section')).toBeVisible();
    },
  };
}
