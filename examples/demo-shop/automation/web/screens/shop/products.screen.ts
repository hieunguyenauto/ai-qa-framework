import type { Locator } from '@playwright/test';
import { BaseScreen, pageTitle } from '../base.screen';

/**
 * Products — catalog: shop.md › SHP02. Roles: every account that can log in.
 * Source: recon 2026-10-26, demo. Each product card: '[data-test="inventory-item"]' with name / price / one button
 * whose text toggles 'Add to cart' ↔ 'Remove'.
 */
export class ProductsScreen extends BaseScreen {
  readonly id = 'SHP02';
  readonly path = '/inventory.html';
  readonly roles = ['standard', 'problem', 'performance', 'error', 'visual'] as const;
  readonly landmark = pageTitle(this.page, 'Products');

  /** Card of one product, matched on the exact name cell (R20: hasText would match substrings). */
  item(name: string): Locator {
    return this.page.locator('[data-test="inventory-item"]')
      .filter({ has: this.page.locator('[data-test="inventory-item-name"]').getByText(name, { exact: true }) });
  }

  /**
   * The 'Add to cart' / 'Remove' toggle of a product card. Native <button> only: the image and title links of the card
   * also have role=button ('View details for …'), so getByRole('button') matches 3 elements (R45).
   */
  button(name: string): Locator { return this.item(name).locator('button'); }

  async addToCart(name: string): Promise<void> { await this.item(name).getByRole('button', { name: 'Add to cart' }).click(); }
  async remove(name: string): Promise<void> { await this.item(name).getByRole('button', { name: 'Remove' }).click(); }
}
