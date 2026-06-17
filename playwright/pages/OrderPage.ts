import { expect, Page } from "@playwright/test";
import { CarColor, Optionals, WheelType } from "../support/car_config_data";

export class OrderPage {
    constructor(private page: Page) {}

    // ─── Assertions ────────────────────────────────────────────────────────────
    async assertResumeContainsConfiguredDetails(cor: CarColor, wheels: WheelType, optional1?: Optionals, optional2?: Optionals) {
        const resumeContainer = this.page.getByText('Resumo').locator('..')

        await expect(resumeContainer.getByText('Cor').locator('..')).toContainText(cor.valueOf())
        await expect(resumeContainer.getByText('Rodas').locator('..')).toContainText(wheels.valueOf())
        if(optional1) { // If the optional is not undefined, then the assertion is made
            await expect(resumeContainer.getByText(optional1.valueOf())).toBeVisible()
        }
        if(optional2) {
            await expect(resumeContainer.getByText(optional2.valueOf())).toBeVisible()
        }
    }
}