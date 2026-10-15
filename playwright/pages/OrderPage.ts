import { expect, Page } from "@playwright/test";
import { Car, CarColor, Optionals, WheelType } from "../support/data/car_config_data";
import { CheckoutForm } from "./components/CheckoutForm";

export class OrderPage {
    readonly checkoutForm: CheckoutForm;

    constructor(private page: Page) {
        this.checkoutForm = new CheckoutForm(page);
    }

    // ─── Navigation ────────────────────────────────────────────────────────────
    async open() {
        await this.page.goto('/order');
    }

    // ─── Checkpoints ───────────────────────────────────────────────────────────
    async checkPageLoaded() {
        await expect(this.page.getByRole('heading', { name: 'Dados Pessoais' })).toBeVisible();
        await expect(this.checkoutForm.submitButton).toBeVisible();
    }


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

    async assertStillOnOrderPage() {
        await expect(this.page).toHaveURL(/\/order/);
        await this.checkPageLoaded();
    }
}