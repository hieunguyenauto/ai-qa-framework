import type { Locator, Page } from '@playwright/test';
import type { BaseScreen } from '../base.screen';
import { LoginScreen } from './login.screen';
import { HeaderScreen } from './header.screen';
import { ProductsScreen } from './products.screen';
import { CartScreen } from './cart.screen';
import { CheckoutInfoScreen } from './checkout-info.screen';
import { CheckoutOverviewScreen } from './checkout-overview.screen';
import { CheckoutCompleteScreen } from './checkout-complete.screen';

/** Every screen of the shop on one page object — injected into tests as the `shop` fixture. */
export class Shop {
  readonly login: LoginScreen;
  readonly header: HeaderScreen;
  readonly products: ProductsScreen;
  readonly cart: CartScreen;
  readonly info: CheckoutInfoScreen;
  readonly overview: CheckoutOverviewScreen;
  readonly complete: CheckoutCompleteScreen;

  constructor(private readonly page: Page) {
    this.login = new LoginScreen(page);
    this.header = new HeaderScreen(page);
    this.products = new ProductsScreen(page);
    this.cart = new CartScreen(page);
    this.info = new CheckoutInfoScreen(page);
    this.overview = new CheckoutOverviewScreen(page);
    this.complete = new CheckoutCompleteScreen(page);
  }

  /** Screen by the page title written in the TC ('Products', 'Your Cart', …). */
  screen(title: string): BaseScreen {
    const all: [string, BaseScreen][] = [
      ['Products', this.products], ['Your Cart', this.cart], ['Checkout: Your Information', this.info],
      ['Checkout: Overview', this.overview], ['Checkout: Complete!', this.complete],
    ];
    const hit = all.find(([t]) => t === title);
    if (!hit) throw new Error(`No screen with title '${title}' — add it to screens/shop/index.ts`);
    return hit[1];
  }

  /** Error area of Login and Checkout: Your Information (same data-test on both screens). */
  get error(): Locator { return this.page.locator('[data-test="error"]'); }

  /** A button by its exact visible name. Use only for names that are unique on the current screen. */
  button(name: string): Locator { return this.page.getByRole('button', { name, exact: true }); }
}
