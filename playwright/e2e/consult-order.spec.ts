import { test, expect } from '@playwright/test';

test('Consult order', async ({ page }) => {
  const orderId = 'VLO-F3XGFQ';
  const clientName = 'Daniel Test'
  await page.goto('http://localhost:5173/');
  //Checkpoint 1: Check if the webapp is online
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
  //Arrange
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  //Checkpoint 2: Check if the order lookup page is loaded
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');
  //Act
  await page.getByTestId('search-order-id').fill(orderId, { timeout: 20000 });
  await page.getByRole('button', { name: 'Buscar Pedido' }).click();

  //Assertion
  // Utilizando xpath puro quando não há muitos locators bons:
  const clientLocator = page.locator(`//p[text()="Nome"]/following-sibling::p[text()="${clientName}"]`)
  await expect(clientLocator).toBeVisible;

  //Outro meio não usando xpath puro
  const orderIdLocator = page.getByRole("paragraph").filter({ hasText: /^Pedido$/ }) // Expressão regular obrigando que comece com Pedido e termine com Pedido, para assim não confundir com o "Consulte Pedido"
    .locator("..") // Sobe pro pai
  await expect(orderIdLocator).toContainText(orderId) 

  await expect(page.getByText('APROVADO')).toBeVisible();
});