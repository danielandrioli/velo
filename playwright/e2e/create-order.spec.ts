import { test, expect, Page } from '@playwright/test';
import { cpf } from 'cpf-cnpj-validator';
import { faker } from '@faker-js/faker';
import { log } from 'console';

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