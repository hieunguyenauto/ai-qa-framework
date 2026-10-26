import { expect, type Locator, type Page } from '@playwright/test';
import type { Role } from '../data/roles';
import { trackApis, waitForAppIdle } from '../common/wait';

/**
 * Automation knowledge: 1 file = 1 screen.
 * - id: screen ID in examples/demo-shop/screens/catalog/shop.md (e.g. SHP03) to look up the description.
 * - path: route. roles: who can open it. landmark: element that proves THIS screen is rendered (R43).
 * - Locators are declared ONLY in screen files, never in specs.
 */
export abstract class BaseScreen {
  abstract readonly id: string;
  abstract readonly path: string;
  abstract readonly roles: readonly Role[];
  abstract readonly landmark: Locator;

  constructor(protected readonly page: Page) { trackApis(page); }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
    await this.waitLoaded();
  }

  /** SPA: the URL changes before the screen renders — wait for the landmark, not the URL (R43). */
  async waitLoaded(): Promise<void> {
    await waitForAppIdle(this.page);
    await expect(this.landmark, `${this.id} ${this.path} not rendered`).toBeVisible();
  }
}

/** Page title of the shop ('[data-test="title"]'), matched exactly so 'Checkout: Overview' never matches another title. */
export function pageTitle(page: Page, text: string): Locator {
  const exact = new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`);
  return page.locator('[data-test="title"]', { hasText: exact });
}
