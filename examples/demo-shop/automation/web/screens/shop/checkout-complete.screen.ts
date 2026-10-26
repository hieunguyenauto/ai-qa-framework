import { BaseScreen, pageTitle } from '../base.screen';

/**
 * Checkout: Complete! — catalog: shop.md › SHP06.
 * Source: recon 2026-10-26, demo.
 */
export class CheckoutCompleteScreen extends BaseScreen {
  readonly id = 'SHP06';
  readonly path = '/checkout-complete.html';
  readonly roles = ['standard', 'problem', 'performance', 'error', 'visual'] as const;
  readonly landmark = pageTitle(this.page, 'Checkout: Complete!');

  readonly header = this.page.locator('[data-test="complete-header"]');
}
