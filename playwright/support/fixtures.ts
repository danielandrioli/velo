import { test as base, expect } from '@playwright/test';
import { LandingPage } from '../pages/LandingPage';
import { OrderLookupPage } from '../pages/OrderLookupPage';
import { ConfigurePage } from '../pages/ConfigurePage';
import { OrderPage } from '../pages/OrderPage';
import { closeDb } from './db/client';
import { createOrder, deleteOrder, OrderLookupTestData, OrderOverrides } from './db/order_factory';

// 1. Extend the base test with individual page fixtures
type MyFixtures = {
  landingPage: LandingPage;
  orderLookupPage: OrderLookupPage;
  configurePage: ConfigurePage;
  orderPage: OrderPage;
  // Cria pedidos no banco e os remove no fim do teste
  createOrder: (overrides?: OrderOverrides) => Promise<OrderLookupTestData>;
};

type WorkerFixtures = {
  dbCleanup: void;
};

export const test = base.extend<MyFixtures, WorkerFixtures>({
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
  },
  createOrder: async ({}, use) => {
    const created: string[] = [];    // 1. SETUP: lista vazia, criada por teste

    await use(async (overrides) => { // 2. entrega a função ao teste
      const order = await createOrder(overrides);
      created.push(order.id);       //  3. cada pedido criado é anotado
      return order;
    });
    for (const id of created) {     // 4. TEARDOWN: roda depois do teste, mesmo que ele falhe
      await deleteOrder(id);
    }
  },
  // Fecha o pool de conexões quando o worker termina
  dbCleanup: [async ({}, use) => {
    await use();
    await closeDb();
  }, { scope: 'worker', auto: true }],
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
