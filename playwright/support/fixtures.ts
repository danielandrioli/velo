import { test as base } from '@playwright/test';
import { createHeaderActions } from './actions/headerActions';
import { createLandingActions } from './actions/landingActions';
import { createOrderLookupActions } from './actions/orderLookupActions';

type App = {
  header: ReturnType<typeof createHeaderActions>;
  landing: ReturnType<typeof createLandingActions>;
  orderLookup: ReturnType<typeof createOrderLookupActions>;
};

export const test = base.extend<{ app: App }>({
  app: async ({ page }, use) => {
    const app: App = {
      header: createHeaderActions(page),
      landing: createLandingActions(page),
      orderLookup: createOrderLookupActions(page),
    };
    await use(app);
  },
});

export { expect } from '@playwright/test';

/*
Fixtures with Page Object Model:
// fixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { CartPage } from './pages/CartPage';

// 1. Extend the base test with individual page fixtures
type MyFixtures = {
  loginPage: LoginPage;
  cartPage: CartPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
});

export { expect } from '@playwright/test';

----------------
And using it in our own tests:
import { test, expect } from './fixture';

test('should add item to cart', async ({ loginPage, cartPage }) => {
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password');
  
  await cartPage.addItemToCart('Playwright T-Shirt');
  await expect(cartPage.cartCount).toHaveText('1');
});
*/
