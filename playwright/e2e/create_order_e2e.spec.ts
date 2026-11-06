import { test } from '../support/fixtures';
import { getRandomCarConfig, Car } from '../support/data/car_config_data';
import { getRandomClient } from '../support/data/client_data';
import { ConfigurePage } from '../pages/ConfigurePage';

test('Resume section should contain the correct car details', async ({ configurePage, orderPage }) => {
    const randomCar = getRandomCarConfig()
    await configurePage.open()
    await configureCarAndCheckout(configurePage, randomCar)

    await orderPage.assertResumeContainsConfiguredDetails(randomCar)
})

test('Pedido à vista deve ser aprovado e exibido na confirmação', async ({ configurePage, orderPage, successPage, registerOrderForCleanup }) => {
    const client = getRandomClient()
    // Anexa os dados ao relatório, para consulta mesmo que o pedido seja apagado no teardown
    await test.info().attach('dados-do-cliente', { body: JSON.stringify(client, null, 2), contentType: 'application/json' })

    await configurePage.open()
    await configurePage.clickCheckoutButton() // configuração padrão: R$ 40.000,00

    await orderPage.checkoutForm.fillPersonalData(client)
    await orderPage.checkoutForm.assertNoFieldErrors()

    await orderPage.checkoutForm.selectCashPayment()
    await orderPage.assertCashTotal('R$ 40.000,00')

    await orderPage.checkoutForm.acceptTerms()
    await orderPage.checkoutForm.submit()

    // Só ANOTA o id: a exclusão acontece no teardown. Fica antes dos asserts para o pedido ser apagado mesmo se eles falharem
    const orderId = await successPage.getOrderId()
    registerOrderForCleanup(orderId)
    await test.info().attach('id-do-pedido', { body: orderId, contentType: 'text/plain' })
    await successPage.assertOrderApproved(client)
})

async function configureCarAndCheckout(configurePage: ConfigurePage, car: Car) {
    console.log(car)
    await configurePage.selectColor(car.color)
    await configurePage.selectWheels(car.wheels)
    await configurePage.selectOptionals(car.optional1, car.optional2)
    await configurePage.clickCheckoutButton()
}

test('Pedido financiado com CPF contendo bom score (> 700) deve ser aprovado e exibido na confirmação', async ({ configurePage, orderPage, successPage, registerOrderForCleanup }) => {
    const client = getRandomClient()

    await configurePage.open()
    await configurePage.clickCheckoutButton() // configuração padrão: R$ 40.000,00
    await orderPage.interceptFinancingScoreRequest(750) // score > 700 é considerado um score bom

    await orderPage.checkoutForm.fillPersonalData(client)
    await orderPage.checkoutForm.assertNoFieldErrors()
    await orderPage.checkoutForm.selectfinancingPayment()
    await orderPage.checkoutForm.acceptTerms()
    await orderPage.checkoutForm.submit()

    const orderId = await successPage.getOrderId()
    registerOrderForCleanup(orderId)
    await test.info().attach('id-do-pedido', { body: orderId, contentType: 'text/plain' })
    await successPage.assertOrderApproved(client)
})

test('Pedido financiado com CPF contendo mal score (<= 500) deve ser reprovado e exibido na confirmação', async ({ configurePage, orderPage, successPage, registerOrderForCleanup }) => {
    const client = getRandomClient()

    await configurePage.open()
    await configurePage.clickCheckoutButton() // configuração padrão: R$ 40.000,00
    await orderPage.interceptFinancingScoreRequest(400) // score <= 500 é considerado um score ruim

    await orderPage.checkoutForm.fillPersonalData(client)
    await orderPage.checkoutForm.assertNoFieldErrors()
    await orderPage.checkoutForm.selectfinancingPayment()
    await orderPage.checkoutForm.acceptTerms()
    await orderPage.checkoutForm.submit()
    
    const orderId = await successPage.getOrderId()
    registerOrderForCleanup(orderId)
    await test.info().attach('id-do-pedido', { body: orderId, contentType: 'text/plain' })
    await successPage.assertOrderRejected(client)
})

test('Pedido financiado com CPF contendo score médio (> 500 e <= 700) deve ser levado para análise', async ({ configurePage, orderPage, successPage, registerOrderForCleanup }) => {
    const client = getRandomClient()

    await configurePage.open()
    await configurePage.clickCheckoutButton() // configuração padrão: R$ 40.000,00
    await orderPage.interceptFinancingScoreRequest(501)

    await orderPage.checkoutForm.fillPersonalData(client)
    await orderPage.checkoutForm.assertNoFieldErrors()
    await orderPage.checkoutForm.selectfinancingPayment()
    await orderPage.checkoutForm.acceptTerms()
    await orderPage.checkoutForm.submit()

    const orderId = await successPage.getOrderId()
    registerOrderForCleanup(orderId)
    await test.info().attach('id-do-pedido', { body: orderId, contentType: 'text/plain' })
    await successPage.assertOrderOnAnalysis(client)
})

/*
        // Regras de Decisão (Ordem de Avaliação)
        // 1️⃣ Regra da Entrada Alta: SE (Entrada >= 50% do Total) E (Score < 700) → APROVADO
        if (entryPercentage >= 0.5 && score < 700) {
          orderStatus = 'APROVADO';
        }
        // 2️⃣ Score Alto: SE Score > 700 → APROVADO
        else if (score > 700) {
          orderStatus = 'APROVADO';
        }
        // 3️⃣ Score Médio: SE Score entre 501 e 700 → EM_ANALISE
        else if (score >= 501 && score <= 700) {
          orderStatus = 'EM_ANALISE';
        }
        // 4️⃣ Score Baixo: SE Score <= 500 → REPROVADO
        else {
          orderStatus = 'REPROVADO';
        }
*/


/*
test('Create order with optionals', async ({ page }) => {
    const color = { name: 'Lunar White', locatorId: 'color-option-lunar-white' }
    const wheels = { name: 'Aero Wheels', locatorId: 'wheel-option-sport' }
    const store = 'Velô Morumbi - Av. Morumbi, 1500'
    const clientFirstName = faker.person.firstName()
    const clientSurname = faker.person.lastName()
    const clientEmail = faker.internet.email()

    await page.goto('/configure')
    await page.getByTestId(color.locatorId).click();
    await page.getByTestId(wheels.locatorId).click();
    await page.getByText('Precision Park').locator('../../..').getByRole('checkbox').click()
    await page.getByRole('button', { name: 'Monte o seu' }).click()
    // Filling form:
    await fillForm(clientFirstName, clientSurname, clientEmail, faker.phone.number(), cpf.generate(), store, page)
    await page.getByText('À vista').locator('..').click()
    await page.getByTestId('checkout-terms').click();
    await page.getByRole('button', { name: 'Confirmar Pedido' }).click()
    // Asserting info on the success page
    const clientNameSuccessPageElement = page.getByText('Cliente').locator('..').getByText(clientFirstName + ' ' + clientSurname)
    const storeNameSuccessPageElement = page.getByText('Loja de Retirada').locator('..').getByText(store)
    const clientEmailSuccessPageElement = page.getByText('Email').locator('..').getByText(clientEmail)
    await expect(page.getByTestId('success-status')).toBeVisible();
    await expect(clientNameSuccessPageElement).toBeVisible()
    await expect(storeNameSuccessPageElement).toBeVisible()
    await expect(clientEmailSuccessPageElement).toBeVisible()
    // Asserting info on the lookup page
    const orderId = await page.getByTestId('order-id').textContent() as string
    await page.getByRole('button', { name: 'Consultar Pedido' }).click()
    await page.getByTestId('search-order-id').fill(orderId)
    await page.getByRole('button', { name: 'Buscar Pedido' }).click()

    const orderIdLocator = page.getByRole("paragraph").filter({ hasText: /^Pedido$/ }) // Expressão regular obrigando que comece com Pedido e termine com Pedido, para assim não confundir com o "Consulte Pedido"
        .locator("..") // Sobe pro pai
    await expect(orderIdLocator).toContainText(orderId) // (antigo) await expect(page.getByTestId('order-result-id')).toContainText('VLO-F3XGFQ');
})

test('Create order with financing', async ({ page }) => {
    const color = { name: 'Lunar White', locatorId: 'color-option-lunar-white' }
    const wheels = { name: 'Aero Wheels', locatorId: 'wheel-option-sport' }
    const store = 'Velô Morumbi - Av. Morumbi, 1500'
    const clientFirstName = faker.person.firstName()
    const clientSurname = faker.person.lastName()
    const clientEmail = faker.internet.email()

    await page.goto('/configure')
    await page.getByTestId(color.locatorId).click();
    await page.getByTestId(wheels.locatorId).click();
    await page.getByText('Precision Park').locator('../../..').getByRole('checkbox').click()
    await page.getByRole('button', { name: 'Monte o seu' }).click()
    // Filling form:
    await fillForm(clientFirstName, clientSurname, clientEmail, faker.phone.number(), cpf.generate(), store, page)
    await page.getByText('Financiamento').locator('..').click()
    await page.getByTestId('input-entry-value').fill('12000');
    //assertions??
})

async function fillForm(clientFirstName: string, clientSurname: string, clientEmail: string, clientPhoneNumber: string, clientCPF: string, store: string, page: Page) {
    await page.getByTestId('checkout-name').fill(clientFirstName)
    await page.getByTestId('checkout-surname').fill(clientSurname)
    await page.getByTestId('checkout-email').fill(clientEmail)
    await page.getByTestId('checkout-phone').fill(clientPhoneNumber)
    await page.getByTestId('checkout-cpf').fill(clientCPF)
    await page.getByTestId('checkout-store').click()
    await page.getByLabel(store).getByText(store).click()
}
    */