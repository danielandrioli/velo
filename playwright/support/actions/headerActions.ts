import { expect, Page } from '@playwright/test';

export function createHeaderActions(page: Page) {
  return {
    async assertVisible() {
      await expect(page.getByTestId('header-logo')).toBeVisible();
      await expect(
        page.getByTestId('header-nav').getByRole('link', { name: 'Consultar Pedido' })
      ).toBeVisible();
      await expect(page.getByTestId('header-cta')).toBeVisible();
    },

    async goToHome() {
      await page.getByTestId('header-logo').click();
    },

    async goToOrderLookup() {
      await page
        .getByTestId('header-nav')
        .getByRole('link', { name: 'Consultar Pedido' })
        .click();
    },

    async goToConfigure() {
      await page.getByTestId('header-cta').click();
    },
  };
}
