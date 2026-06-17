import { expect, Page } from "@playwright/test";
import { CarColor, Optionals, WheelType } from "../support/car_config_data";

export class ConfigurePage {
    constructor(private page: Page) { }

    get carExteriorImage() {
        return this.page.getByTestId('car-exterior-image');
    }

    // ─── Navigation ────────────────────────────────────────────────────────────
    async open() {
        await this.page.goto('/configure')
    }
    // ─── Checkpoints ───────────────────────────────────────────────────────────
    async checkPageLoaded() {
        await expect(this.page.getByText('Configure seu')).toBeVisible();
    }

    // ─── Actions ───────────────────────────────────────────────────────────────
    async selectColor(color: CarColor) {
        await this.page.getByTestId('section-cores').getByRole('button').filter({ hasText: color.valueOf() }).click()
    }

    async selectWheels(wheels: WheelType) {
        await this.page.getByTestId(`wheel-option-${wheels}`).click();
    }

    async selectOptionals(optional1: Optionals, optional2?: Optionals) {
        console.log('optional1: ' + optional1.valueOf(), 'optional2: ' + optional2?.valueOf())
        await this.page.getByTestId('section-opcionais').getByText(optional1.valueOf()).click()

        if (optional2) {
            await this.page.getByTestId('section-opcionais').getByText(optional2.valueOf()).click()
        }
    }

    async clickCheckoutButton() {
        await this.page.getByRole("button", { name: 'Monte o seu' }).click()
    }

    // ─── Assertions ────────────────────────────────────────────────────────────
    async carImageShouldReflectSelectedColorAndWheels(color: CarColor, wheels: WheelType) {
        const COLOR_SLUG: Record<CarColor, string> = {
            [CarColor.GlacierBlue]: 'glacier-blue',
            [CarColor.MidnightBlack]: 'midnight-black',
            [CarColor.LunarWhite]: 'lunar-white',
        };

        const expectedAlt = `Velô Sprint - ${COLOR_SLUG[color]} with ${wheels} wheels`;
        await expect(this.carExteriorImage).toHaveAttribute('alt', expectedAlt);
    }
}
