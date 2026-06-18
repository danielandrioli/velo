import { expect, Page } from "@playwright/test";
import { Car, CarColor, Optionals, WheelType } from "../support/data/car_config_data";

export class OrderPage {
    constructor(private page: Page) {}

    // ─── Assertions ────────────────────────────────────────────────────────────
    async assertResumeContainsConfiguredDetails(car: Car) {
        const resumeContainer = this.page.getByText('Resumo').locator('..')

        await expect(resumeContainer.getByText('Cor').locator('..')).toContainText(car.color.valueOf())
        await expect(resumeContainer.getByText('Rodas').locator('..')).toContainText(car.wheels.valueOf())
        if(car.optional1) { // If the optional is not undefined, then the assertion is made
            await expect(resumeContainer.getByText(car.optional1.valueOf())).toBeVisible()
        }
        if(car.optional2) {
            await expect(resumeContainer.getByText(car.optional2.valueOf())).toBeVisible()
        }
    }
}