import { test } from '../support/fixtures';

test.describe('CT04 - Preenchimento do Checkout com validação de campos obrigatórios', () => {
    test.beforeEach(async ({ configurePage, orderPage }) => {
        await configurePage.open();
        await configurePage.checkPageLoaded();
        await configurePage.clickCheckoutButton();
        await orderPage.checkPageLoaded();
        await orderPage.checkoutForm.clearPersonalFields();
    });

    test('Should block submit and show validation errors for empty and invalid fields', async ({ orderPage }) => {
        // Passo 1-2: campos vazios e tentativa de envio
        await orderPage.checkoutForm.submit();
        await orderPage.checkoutForm.assertRequiredFieldErrors();
        await orderPage.assertStillOnOrderPage();

        // Passo 3: email com formato inválido
        await orderPage.checkoutForm.fillEmail('nome@dominio');
        await orderPage.checkoutForm.submit();
        await orderPage.checkoutForm.assertEmailInvalidError();
        await orderPage.assertStillOnOrderPage();
    });
});
