import { expect, Page } from '@playwright/test';

type OrderStatus = 'APROVADO' | 'REPROVADO' | 'EM_ANALISE';
const STATUS_CONFIG: Record<OrderStatus, { bgClass: string; textClass: string; iconClass: string }> = {
    APROVADO: {
      bgClass: 'bg-green-100',
      textClass: 'text-green-700',
      iconClass: 'lucide-circle-check-big',
    },
    REPROVADO: {
      bgClass: 'bg-red-100',
      textClass: 'text-red-700',
      iconClass: 'lucide-circle-x',
    },
    EM_ANALISE: {
      bgClass: 'bg-amber-100',
      textClass: 'text-amber-700',
      iconClass: 'lucide-clock-icon',
    },
  };

export class OrderLookupPage {
    constructor(private page: Page) { }

    // ─── Navigation ────────────────────────────────────────────────────────────
    async open() {
        await this.page.goto('/lookup')
    }

    async openFromHomepage() {
        await this.page.getByRole('link', { name: 'Consultar Pedido' }).click();
    }

    // ─── Checkpoints ───────────────────────────────────────────────────────────
    async checkPageLoaded() {
        await expect(this.page.getByRole('heading')).toContainText('Consultar Pedido');
    }

    // ─── Actions ───────────────────────────────────────────────────────────────
    async searchOrder(orderId: string) {
        await this.page.getByTestId('search-order-id').fill(orderId);
        await this.page.getByRole('button', { name: 'Buscar Pedido' }).click();
    }

    getStatusBadge(status: string) {
        return this.page.getByRole('status').filter({ hasText: status });
    }

    getClientLocator(clientName: string) {
        return this.page.locator('p', { hasText: 'Nome' }).locator('..').filter({ hasText: clientName });
    }

    // ─── Assertions ────────────────────────────────────────────────────────────
    async assertOrderResult(orderId: string, clientName: string) {
        await expect(this.getClientLocator(clientName)).toBeVisible();
        await expect(this.page
            .getByRole('paragraph')
            .filter({ hasText: /^Pedido$/ })
            .locator('..')).toContainText(orderId);
      }

    async assertStatusBadge(status: OrderStatus) {
        const { bgClass, textClass, iconClass } = STATUS_CONFIG[status];
        const badge = this.getStatusBadge(status);
        const icon = badge.locator('svg');
     
        await expect(this.page.getByText(status)).toBeVisible();
        await expect(badge).toHaveClass(new RegExp(bgClass));
        await expect(badge).toHaveClass(new RegExp(textClass));
        await expect(icon).toHaveClass(new RegExp(iconClass));
      }

      async assertOrderNotFound() {
        await expect(this.page.getByRole('heading', { name: 'Pedido não encontrado' })).toBeVisible();
        await expect(this.page.locator('p', { hasText: 'Verifique o número do pedido e tente novamente' })).toBeVisible();
        await expect(this.page.locator('#root')).toMatchAriaSnapshot(
          `- heading "Pedido não encontrado" [level=3]`
        );
      }
}