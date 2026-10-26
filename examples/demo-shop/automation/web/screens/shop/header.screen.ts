import type { Locator, Page } from '@playwright/test';

/**
 * Header shared by SHP02–SHP06: burger menu, cart icon + badge. Not a screen of its own (no route).
 * Source: recon 2026-10-26, demo. The menu slides in: wait for 'Logout' to be visible before clicking (R19).
 */
export class HeaderScreen {
  readonly menuButton: Locator;
  readonly logoutLink: Locator;
  readonly cartLink: Locator;
  /** Number of items in the cart; not rendered at all when the cart is empty. */
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  async openCart(): Promise<void> { await this.cartLink.click(); }

  async logout(): Promise<void> {
    await this.menuButton.click();
    await this.logoutLink.waitFor({ state: 'visible' });
    await this.logoutLink.click();
  }
}
