import { type Page } from '@playwright/test';
import { env } from './env';
import { ROLES, credentials, type Role } from '../data/roles';
import { LoginScreen } from '../screens/shop/login.screen';
import { HeaderScreen } from '../screens/shop/header.screen';
import { ProductsScreen } from '../screens/shop/products.screen';

/**
 * SHARED LOGIN — every spec uses this file, never its own login helper.
 *   await loginAs(page, 'standard');   // already logged in as another account → logs out first; same account → no-op
 *   await logout(page);
 * Login ID from env/<ENV>.json › accounts, password from .env. Basic Auth (if the environment has it) is handled by Playwright.
 */
export function credentialsOf(role: Role): { loginId: string; password: string } {
  if (!(role in ROLES)) throw new Error(`Unknown role: ${role}`);
  const c = credentials(role);
  if (!c) throw new Error(`Missing account ${role} (ENV=${env.name}): login ID in env/${env.name}.json › accounts, password SHOP_${role.toUpperCase()}_PASSWORD or SHOP_PASSWORD in .env`);
  return c;
}

/** Password only — for TCs that test the login form itself ("Enter Password of <user>"). */
export const passwordOf = (role: Role) => credentialsOf(role).password;

// Account currently logged in on each page (so loginAs can skip).
const current = new WeakMap<Page, Role>();
export const currentAccount = (page: Page) => current.get(page);
/** For specs that log in / out through the UI themselves (TCs about the login screen). */
export function markLoggedIn(page: Page, role: Role | null): void {
  if (role) current.set(page, role);
  else current.delete(page);
}

export async function logout(page: Page): Promise<void> {
  await new HeaderScreen(page).logout();
  await new LoginScreen(page).waitLoaded();
  current.delete(page);
}

/** Log in through the UI and wait until 'Products' is rendered (R43: landmark, not URL). */
export async function loginAs(page: Page, role: Role): Promise<void> {
  if (current.get(page) === role) return;
  if (current.get(page)) await logout(page);
  const c = credentialsOf(role);
  const login = new LoginScreen(page);
  await login.goto();
  await login.login(c.loginId, c.password);
  await new ProductsScreen(page).waitLoaded();
  current.set(page, role);
}
