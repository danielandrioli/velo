import { test, expect } from '@playwright/test';

test('Consult order', async ({ page }) => {
  const orderId = 'VLO-F3XGFQ';
  await page.goto('http://localhost:5173/');
  //Checkpoint 1: Check if the webapp is online
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
  //Arrange
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  //Checkpoint 2: Check if the order lookup page is loaded
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');
  //Act
  await page.getByTestId('search-order-id').fill(orderId, {timeout: 20000}); // timeout explicito para 20 segundos
  await page.getByRole('button', { name: 'Buscar Pedido' }).click();

  //Assertion
  await expect(page.getByText(orderId)).toBeVisible(); // (antigo) await expect(page.getByTestId('order-result-id')).toContainText('VLO-F3XGFQ');
  await expect(page.getByText('APROVADO')).toBeVisible(); // (antigo) await expect(page.getByTestId('order-result-status')).toContainText('APROVADO'); 
});