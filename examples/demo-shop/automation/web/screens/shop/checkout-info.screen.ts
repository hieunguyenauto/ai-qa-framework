import type { Locator } from '@playwright/test';
import { BaseScreen, pageTitle } from '../base.screen';

/**
 * Checkout: Your Information — catalog: shop.md › SHP04.
 * Source: recon 2026-10-26, demo. Fields are found by their accessible name ('First Name', 'Last Name', 'Zip/Postal Code').
 */
export class CheckoutInfoScreen extends BaseScreen {
  readonly id = 'SHP04';
  readonly path = '/checkout-step-one.html';
  readonly roles = ['standard', 'problem', 'performance', 'error', 'visual'] as const;
  readonly landmark = pageTitle(this.page, 'Checkout: Your Information');

  readonly error = this.page.locator('[data-test="error"]');

  field(label: 'First Name' | 'Last Name' | 'Zip/Postal Code' | string): Locator {
    return this.page.getByRole('textbox', { name: label, exact: true });
  }
}
