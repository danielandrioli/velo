import { test, expect } from '@playwright/test';
import { OrderLookupPage } from '../pages/OrderLookupPage';

test.describe('Consulta de pedido', () => { // Exemplo de suíte de testes
  // Armazene aqui todos seus tests
  // test('Exemplo de test', async ({ page }) => { })
  test.beforeEach('Enter webpage', async ({ page }) =>
    await page.goto('https://www.tibia.com')
  )
  // ..
})

let orderLookupPage: OrderLookupPage;
test.beforeEach('Enter webpage', async ({ page }) => {
  orderLookupPage = new OrderLookupPage(page)
  await orderLookupPage.open();
})

test('Consult existing order - approved', async ({ page }) => {
  const orderId = 'VLO-F3XGFQ';
  const clientName = 'Daniel Test'

  await orderLookupPage.checkPageLoaded();
  await orderLookupPage.searchOrder(orderId);
  await orderLookupPage.assertOrderResult(orderId, clientName);
  await orderLookupPage.assertStatusBadge('APROVADO');
})


test('Consult existing order - reproved', async ({ page }) => {
  const orderId = 'VLO-3UWWDQ';
  const clientName = 'Jatoba Cicero'
  
  await orderLookupPage.checkPageLoaded();
  await orderLookupPage.searchOrder(orderId);
  await orderLookupPage.assertOrderResult(orderId, clientName);
  await orderLookupPage.assertStatusBadge('REPROVADO');
})

test('Consult existing order - Analyzing', async ({ page }) => {
  const orderId = 'VLO-2DBUR5';
  const clientName = 'Elenor Morissette'
  
  await orderLookupPage.checkPageLoaded();
  await orderLookupPage.searchOrder(orderId);
  await orderLookupPage.assertOrderResult(orderId, clientName);
  await orderLookupPage.assertStatusBadge('EM_ANALISE');
})


test('Should show message when the order is not found', async ({ page }) => {
  await orderLookupPage.searchOrder('VLO-abcde');
  await orderLookupPage.assertOrderNotFound();
})


test('Correct informations should be shown - using snapshot', async ({ page }) => {
  const orderId = 'VLO-F3XGFQ';
  const clientName = 'Daniel Test'
  orderLookupPage.searchOrder(orderId)

  await expect(page.getByTestId('order-result-VLO-F3XGFQ')).toMatchAriaSnapshot(`
    - img
    - paragraph: Pedido
    - paragraph: ${orderId}
    - status:
      - img
      - text: APROVADO
    - img "Velô Sprint"
    - paragraph: Modelo
    - paragraph: Velô Sprint
    - paragraph: Cor
    - paragraph: Glacier Blue
    - paragraph: Interior
    - paragraph: cream
    - paragraph: Rodas
    - paragraph: aero Wheels
    - heading "Dados do Cliente" [level=4]
    - paragraph: Nome
    - paragraph: ${clientName}
    - paragraph: Email
    - paragraph: test@gmail.com
    - paragraph: Loja de Retirada
    - paragraph
    - paragraph: Data do Pedido
    - paragraph: /\\d+\\/\\d+\\/\\d+/
    - heading "Pagamento" [level=4]
    - paragraph: À Vista
    - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
  `);
  /*
  const statusBadge = page.getByRole('status').filter({ hasText: "REPROVADO" })
    const statusIcon = statusBadge.locator('svg')
    await expect(statusBadge).toHaveClass(/bg-red-100/) // A barra '/' representa um "contains". Tô usando ela porque esse elemento contém várias outras classes além da bg-green-100
    await expect(statusBadge).toHaveClass(/text-red-700/)
    await expect(statusIcon).toHaveClass(/lucide-circle-check-big/)
  */


})

/*
test('Consult existing order - approved', async ({ page }) => {
  const orderId = 'VLO-F3XGFQ';
  const clientName = 'Daniel Test'
  const orderLookupPage = new OrderLookupPage(page)


  //Checkpoint 2: Check if the order lookup page is loaded
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');
  //Act
  orderLookupPage.searchOrder(orderId)

  //Assertion
  //Utilizando xpath puro quando não há muitos locators bons:
  const clientLocator = page.locator(`//p[text()="Nome"]/following-sibling::p[text()="${clientName}"]`)
  await expect(clientLocator).toBeVisible;

  //Outro meio não usando xpath puro
  const orderIdLocator = page.getByRole("paragraph").filter({ hasText: /^Pedido$/ }) // Expressão regular obrigando que comece com Pedido e termine com Pedido, para assim não confundir com o "Consulte Pedido"
    .locator("..") // Sobe pro pai
  await expect(orderIdLocator).toContainText(orderId) // (antigo) await expect(page.getByTestId('order-result-id')).toContainText('VLO-F3XGFQ');

  await expect(page.getByText('APROVADO')).toBeVisible();
  const statusBadge = page.getByRole('status').filter({ hasText: "APROVADO" })
  const statusIcon = statusBadge.locator('svg')
  await expect(statusBadge).toHaveClass(/bg-green-100/) // A barra '/' representa um "contains". Tô usando ela porque esse elemento contém várias outras classes além da bg-green-100
  await expect(statusBadge).toHaveClass(/text-green-700/)
  await expect(statusIcon).toHaveClass(/lucide-circle-check-big/)
})
  */