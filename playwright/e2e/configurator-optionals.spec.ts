import { test } from '../support/fixtures';

test('CT02 - Adição de opcionais e validação do preço base', async ({ app }) => {
  await app.configurator.open();
  await app.configurator.checkPageLoaded();
  await app.configurator.assertTotalPrice('R$ 40.000,00');

  await app.configurator.selectSportWheels();
  await app.configurator.assertTotalPrice('R$ 42.000,00');

  await app.configurator.selectPrecisionPark();
  await app.configurator.assertTotalPrice('R$ 47.500,00');

  await app.configurator.selectFluxCapacitor();
  await app.configurator.assertTotalPrice('R$ 52.500,00');

  await app.configurator.selectAeroWheels();
  await app.configurator.assertTotalPrice('R$ 50.500,00');
});
