import { Locator, Page } from "@playwright/test";

export class MexamplePage {
    private btnLocator: Locator;

    constructor(private page: Page) {
        this.btnLocator = this.page.getByTestId('btn-id');
    }


    async open() {
        await this.page.goto('/examples')
    }

    async clickExampleButton() {
        await this.page.getByText("Click Example").click()
    }
}