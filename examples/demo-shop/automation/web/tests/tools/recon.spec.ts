import fs from 'fs';
import path from 'path';
import { test } from '../../common/fixtures';
import { maskSecrets } from '../../common/qc-reporter';
import { loginAs } from '../../common/session';
import type { BaseScreen } from '../../screens/base.screen';

/**
 * Recon (R01): walk every screen of the purchase flow WITHOUT finishing an order, wait for each landmark (R43)
 * and write its aria snapshot + screenshot to reports/_tmp_chk/recon/ (temporary, overwritten every run).
 * Keep only what matters: locators → screens/, lessons → automation/lessons/. Cite as 'recon <date>, <env>'.
 * Run: npm run recon   (RECON_ROLE=problem npm run recon — another account)
 */
const OUT = path.resolve(__dirname, '../../reports/_tmp_chk/recon');

test('recon purchase flow', async ({ page, shop }) => {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  let n = 0;
  const dump = async (name: string, screen?: BaseScreen) => {
    if (screen) await screen.waitLoaded();
    const file = `${String(++n).padStart(2, '0')}-${name}`;
    fs.writeFileSync(path.join(OUT, `${file}.yml`), `# ${page.url()}\n${maskSecrets(await page.locator('body').ariaSnapshot())}`);
    await page.screenshot({ path: path.join(OUT, `${file}.png`), timeout: 10_000 }).catch(() => {});
  };

  await shop.login.goto();
  await dump('login', shop.login);
  await loginAs(page, (process.env.RECON_ROLE as 'standard') || 'standard');
  await dump('products', shop.products);
  await shop.products.addToCart('Sauce Labs Backpack');
  await shop.header.openCart();
  await dump('cart', shop.cart);
  await shop.button('Checkout').click();
  await dump('checkout-info', shop.info);
  await shop.button('Continue').click();
  await dump('checkout-info-error');
  await shop.info.field('First Name').fill('Taro');
  await shop.info.field('Last Name').fill('Yamada');
  await shop.info.field('Zip/Postal Code').fill('100-0001');
  await shop.button('Continue').click();
  await dump('checkout-overview', shop.overview);
  // Stop before 'Finish': recon never completes an order.
  await shop.button('Cancel').click();
  await dump('products-after-cancel', shop.products);
  console.log(`recon: ${n} screens → ${path.relative(process.cwd(), OUT)}`);
});
