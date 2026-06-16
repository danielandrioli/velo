import { test } from '../support/fixtures';
import { getApprovedOrder } from '../support/order-lookup-test-data';

test.beforeEach(async ({ app }) => {
  await app.orderLookup.open();
  await app.orderLookup.checkPageLoaded();
});

test('Consult existing order - approved', async ({ app }) => {
  const order = getApprovedOrder();

  await app.orderLookup.searchOrder(order.id);
  await app.orderLookup.assertOrderResult(order.id, order.customer.name);
  await app.orderLookup.assertStatusBadge(order.status);
});

test('Consult existing order - reproved', async ({ app }) => {
  const orderId = 'VLO-3UWWDQ';
  const clientName = 'Jatoba Cicero';

  await app.orderLookup.searchOrder(orderId);
  await app.orderLookup.assertOrderResult(orderId, clientName);
  await app.orderLookup.assertStatusBadge('REPROVADO');
});

test('Consult existing order - Analyzing', async ({ app }) => {
  const orderId = 'VLO-2DBUR5';
  const clientName = 'Elenor Morissette';

  await app.orderLookup.searchOrder(orderId);
  await app.orderLookup.assertOrderResult(orderId, clientName);
  await app.orderLookup.assertStatusBadge('EM_ANALISE');
});

test('Should show message when the order is not found', async ({ app }) => {
  await app.orderLookup.searchOrder('VLO-abcde');
  await app.orderLookup.assertOrderNotFound();
});

test('Correct informations should be shown - using snapshot', async ({ app }) => {
  const order = getApprovedOrder();

  await app.orderLookup.searchOrder(order.id);
  await app.orderLookup.assertOrderResultAriaSnapshot(order);
});

test('Search button should be disabled if no text is present in text field', async ({ app }) => {
  await app.orderLookup.assertSearchButtonDisabled()
})

test('Search button should be disabled if just space is present in text field', async ({ app }) => {
  await app.orderLookup.elements.searchTextField.fill("    ")
  await app.orderLookup.assertSearchButtonDisabled()
})

