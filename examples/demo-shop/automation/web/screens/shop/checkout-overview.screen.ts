import type { Locator } from '@playwright/test';
import { BaseScreen, pageTitle } from '../base.screen';

/**
 * Checkout: Overview — catalog: shop.md › SHP05.
 * Source: recon 2026-10-26, demo. Amount labels hold label + value in one element, e.g. 'Tax: $3.20'.
 */
export class CheckoutOverviewScreen extends BaseScreen {
  readonly id = 'SHP05';
  readonly path = '/checkout-step-two.html';
  readonly roles = ['standard', 'problem', 'performance', 'error', 'visual'] as const;
  readonly landmark = pageTitle(this.page, 'Checkout: Overview');

  private static readonly AMOUNTS: Record<string, string> = {
    'Item total:': 'subtotal-label',
    'Tax:': 'tax-label',
    'Total:': 'total-label',
  };

  /** Amount element by the label it starts with ('Item total:', 'Tax:', 'Total:'). */
  amount(label: string): Locator {
    const key = CheckoutOverviewScreen.AMOUNTS[label];
    if (!key) throw new Error(`Unknown amount label '${label}' — known: ${Object.keys(CheckoutOverviewScreen.AMOUNTS).join(', ')}`);
    return this.page.locator(`[data-test="${key}"]`);
  }
}
