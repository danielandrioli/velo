import { expect, Page } from '@playwright/test';

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
