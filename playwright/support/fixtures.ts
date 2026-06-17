import { test as base } from '@playwright/test';
import { LandingPage } from '../pages/LandingPage';
import { OrderLookupPage } from '../pages/OrderLookupPage';
import { ConfigurePage } from '../pages/ConfigurePage';
import { OrderPage } from '../pages/OrderPage';

// 1. Extend the base test with individual page fixtures
type MyFixtures = {
  landingPage: LandingPage;
  orderLookupPage: OrderLookupPage;
  configurePage: ConfigurePage;
  orderPage: OrderPage
};

export const test = base.extend<MyFixtures>({
  landingPage: async ({ page }, use) => {
    await use(new LandingPage(page));
  },
  orderLookupPage: async ({ page }, use) => {
    await use(new OrderLookupPage(page));
  },
  configurePage: async ({ page }, use) => {
    await use(new ConfigurePage(page));
  },
  orderPage: async ({ page }, use) => {
    await use(new OrderPage(page));
  }
});

export { expect } from '@playwright/test';

/*
And using it in our own tests:
import { test, expect } from './fixture';

test('should add item to cart', async ({ loginPage, cartPage }) => {
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password');
  
  await cartPage.addItemToCart('Playwright T-Shirt');
  await expect(cartPage.cartCount).toHaveText('1');
});
*/
