import { expect, Page } from "@playwright/test";
import { Client } from "../support/data/client_data";

export class SuccessPage {
    constructor(private page: Page) { }

    // ─── Locators ──────────────────────────────────────────────────────────────
    get statusTitle() {
        return this.page.getByTestId('success-status');
    }

    get orderId() {
        return this.page.getByTestId('order-id');
    }

    get orderStatus() {
        return this.page.getByTestId('success-status');
    }

    // ─── Actions ───────────────────────────────────────────────────────────────
    async getOrderId(): Promise<string> {
        await expect(this.orderId).toBeVisible();
        return (await this.orderId.textContent()) as string;
    }

    // ─── Assertions ────────────────────────────────────────────────────────────
    async assertOrderApproved(client: Client) {
        await this.assertOrderOnPage(client)
        await expect(this.orderStatus).toHaveText('Pedido Aprovado!');
    }

    async assertOrderRejected(client: Client) {
        await this.assertOrderOnPage(client)
        await expect(this.orderStatus).toHaveText('Crédito Reprovado');
    }

    async assertOrderOnAnalysis(client: Client) {
        await this.assertOrderOnPage(client)
        await expect(this.orderStatus).toHaveText('Pedido em análise!');
    }

    private async assertOrderOnPage(client: Client) {
        await expect(this.page).toHaveURL(/\/success/);
        await expect(this.statusTitle).toBeVisible();
        await expect(this.orderId).toHaveText(/^VLO-[A-Z0-9]{6}$/);
        await expect(this.infoRow('Cliente')).toContainText(`${client.name} ${client.surname}`);
        await expect(this.infoRow('Email')).toContainText(client.email);
        await expect(this.infoRow('Loja de Retirada')).toContainText(client.store);
    }


    // Linha com rótulo (ex.: "Cliente") e valor, ambos <p> dentro do mesmo container
    private infoRow(label: string) {
        return this.page.getByText(label, { exact: true }).locator('..');
    }
}
