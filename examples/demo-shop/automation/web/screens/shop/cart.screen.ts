import type { Locator } from '@playwright/test';
import { BaseScreen, pageTitle } from '../base.screen';

/**
 * Your Cart — catalog: shop.md › SHP03.
 * Source: recon 2026-10-26, demo. The cart rows reuse the product data-test names of SHP02, so actions here must
 * run only after waitLoaded() — otherwise they hit the Products card that is still rendered (R43).
 */
export class CartScreen extends BaseScreen {
  readonly id = 'SHP03';
  readonly path = '/cart.html';
  readonly roles = ['standard', 'problem', 'performance', 'error', 'visual'] as const;
  readonly landmark = pageTitle(this.page, 'Your Cart');

  row(name: string): Locator {
    return this.page.locator('[data-test="inventory-item"]')
      .filter({ has: this.page.locator('[data-test="inventory-item-name"]').getByText(name, { exact: true }) });
  }

  price(name: string): Locator { return this.row(name).locator('[data-test="inventory-item-price"]'); }

  async remove(name: string): Promise<void> { await this.row(name).getByRole('button', { name: 'Remove' }).click(); }
}
