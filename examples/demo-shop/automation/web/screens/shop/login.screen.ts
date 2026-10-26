import { BaseScreen } from '../base.screen';

/**
 * Login — catalog: shop.md › SHP01. Roles: everyone (no session).
 * Source: recon 2026-10-26, demo. Error area '[data-test="error"]' is shared with Checkout: Your Information.
 */
export class LoginScreen extends BaseScreen {
  readonly id = 'SHP01';
  readonly path = '/';
  readonly roles = ['standard', 'locked', 'problem', 'performance', 'error', 'visual'] as const;
  readonly landmark = this.page.getByRole('button', { name: 'Login', exact: true });

  readonly username = this.page.getByRole('textbox', { name: 'Username' });
  readonly password = this.page.getByRole('textbox', { name: 'Password' });
  readonly loginButton = this.landmark;
  readonly error = this.page.locator('[data-test="error"]');

  async login(loginId: string, password: string): Promise<void> {
    await this.username.fill(loginId);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}
