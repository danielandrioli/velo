import { expect, Page } from '@playwright/test';

export function createConfiguratorActions(page: Page) {
  const totalPrice = page.getByTestId('total-price');
  const sportWheelsButton = page.getByRole('button', { name: /Sport Wheels/ });
  const aeroWheelsButton = page.getByRole('button', { name: /Aero Wheels/ });
  const precisionParkCheckbox = page.getByRole('checkbox', { name: /Precision Park/ });
  const fluxCapacitorCheckbox = page.getByRole('checkbox', { name: /Flux Capacitor/ });

  return {
    elements: {
      totalPrice,
      sportWheelsButton,
      aeroWheelsButton,
      precisionParkCheckbox,
      fluxCapacitorCheckbox,
    },

    async open(): Promise<void> {
      await page.goto('/configure');
    },

    async checkPageLoaded(): Promise<void> {
      await expect(page).toHaveURL(/\/configure/);
      await expect(page.getByRole('heading', { name: 'Velô Sprint' })).toBeVisible();
      await expect(page.getByTestId('section-rodas')).toBeVisible();
      await expect(page.getByText('Preço de Venda')).toBeVisible();
    },

    async assertTotalPrice(price: string): Promise<void> {
      await expect(totalPrice).toHaveText(price);
    },

    async selectSportWheels(): Promise<void> {
      await expect(sportWheelsButton).toBeVisible();
      await sportWheelsButton.click();
    },

    async selectAeroWheels(): Promise<void> {
      await expect(aeroWheelsButton).toBeVisible();
      await aeroWheelsButton.click();
    },

    async selectPrecisionPark(): Promise<void> {
      await expect(precisionParkCheckbox).toBeVisible();
      await precisionParkCheckbox.click();
      await expect(precisionParkCheckbox).toBeChecked();
    },

    async selectFluxCapacitor(): Promise<void> {
      await expect(fluxCapacitorCheckbox).toBeVisible();
      await fluxCapacitorCheckbox.click();
      await expect(fluxCapacitorCheckbox).toBeChecked();
    },
  };
}
