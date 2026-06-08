import { expect, Page } from '@playwright/test';

export class Header {
    constructor(private page: Page) { }

    async assertVisible() {
        await expect(this.page.getByTestId('header-logo')).toBeVisible();
        await expect(
            this.page.getByTestId('header-nav').getByRole('link', { name: 'Consultar Pedido' })
        ).toBeVisible();
        await expect(this.page.getByTestId('header-cta')).toBeVisible();
    }

    async goToHome() {
        await this.page.getByTestId('header-logo').click();
    }

    async goToOrderLookup() {
        await this.page
            .getByTestId('header-nav')
            .getByRole('link', { name: 'Consultar Pedido' })
            .click();
    }

    async goToConfigure() {
        await this.page.getByTestId('header-cta').click();
    }
}
