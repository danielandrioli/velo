import { expect, Page } from '@playwright/test';
import { Client } from '../../support/data/client_data';

export class CheckoutForm {
    constructor(private page: Page) { }

    // ─── Locators ──────────────────────────────────────────────────────────────
    get nameInput() {
        return this.page.getByTestId('checkout-name');
    }

    get surnameInput() {
        return this.page.getByTestId('checkout-surname');
    }

    get emailInput() {
        return this.page.getByTestId('checkout-email');
    }

    get cpfInput() {
        return this.page.getByTestId('checkout-cpf');
    }

    get phoneInput() {
        return this.page.getByTestId('checkout-phone');
    }

    get storeSelect() {
        return this.page.getByTestId('checkout-store');
    }

    get cashPaymentTab() {
        return this.page.getByTestId('payment-avista');
    }
    
    get financingPaymentTab() {
        return this.page.getByTestId('payment-financiamento');
    }

    get financingEntryValueInput() {
        return this.page.getByTestId('input-entry-value');
    }

    get termsCheckbox() {
        return this.page.getByTestId('checkout-terms');
    }

    get submitButton() {
        return this.page.getByTestId('checkout-submit');
    }

    fieldError(field: 'name' | 'surname' | 'email' | 'phone' | 'cpf' | 'store' | 'terms') {
        const fieldContainer = {
            name: this.nameInput.locator('..'),
            surname: this.surnameInput.locator('..'),
            email: this.emailInput.locator('..'),
            phone: this.page.getByTestId('checkout-phone').locator('..'),
            cpf: this.cpfInput.locator('..'),
            store: this.page.getByTestId('checkout-store').locator('..'),
            terms: this.page.getByTestId('checkout-terms').locator('../..'),
        }[field];

        return fieldContainer.locator('p.text-sm.text-destructive');
    }

    // ─── Actions ───────────────────────────────────────────────────────────────
    async fillName(value: string) {
        await this.nameInput.fill(value);
    }

    async fillSurname(value: string) {
        await this.surnameInput.fill(value);
    }

    async fillEmail(value: string) {
        await this.emailInput.fill(value);
    }

    async fillCpf(value: string) {
        await this.cpfInput.fill(value);
    }

    async fillPhone(value: string) {
        await this.phoneInput.fill(value);
    }
    
    async selectStore(store: string) {
        await this.storeSelect.click();
        await this.page.getByLabel(store).getByText(store).click();
    }

    async fillfinancingEntryValue(value: string) {
        await this.financingEntryValueInput.fill(value);
    }

    async fillPersonalData(client: Client) {
        await this.fillName(client.name);
        await this.fillSurname(client.surname);
        await this.fillEmail(client.email);
        await this.fillPhone(client.phone);
        await this.fillCpf(client.cpf);
        await this.selectStore(client.store);
    }

    async selectCashPayment() {
        await this.cashPaymentTab.click();
    }

    async selectfinancingPayment() {
        await this.financingPaymentTab.click();
    }

    async acceptTerms() {
        await this.termsCheckbox.click();
    }

    async clearPersonalFields() {
        await this.nameInput.fill('');
        await this.surnameInput.fill('');
        await this.emailInput.fill('');
        await this.cpfInput.fill('');
    }

    async submit() {
        await this.submitButton.click();
    }

    // ─── Assertions ────────────────────────────────────────────────────────────
    async assertFieldError(field: 'name' | 'surname' | 'email' | 'cpf', message: string) {
        await expect(this.fieldError(field)).toHaveText(message);
    }

    async assertNoFieldErrors() {
        for (const field of ['name', 'surname', 'email', 'phone', 'cpf', 'store', 'terms'] as const) {
            await expect(this.fieldError(field)).toHaveCount(0);
        }
    }

    async assertRequiredFieldErrors() {
        await this.assertFieldError('name', 'Nome deve ter pelo menos 2 caracteres');
        await this.assertFieldError('surname', 'Sobrenome deve ter pelo menos 2 caracteres');
        await this.assertFieldError('email', 'Email inválido');
        await this.assertFieldError('cpf', 'CPF inválido');
    }

    async assertEmailInvalidError() {
        await this.assertFieldError('email', 'Email inválido');
    }

    async assertCpfInvalidError() {
        await this.assertFieldError('cpf', 'CPF inválido');
    }
}
