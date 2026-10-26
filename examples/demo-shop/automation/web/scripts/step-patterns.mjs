/**
 * Step vocabulary of the demo project: TC text → code. Used by scripts/gen-specs.mjs.
 * Each entry: [regex on ONE action (a step is split on ' → '), (match, ctx) => code lines].
 * ctx.q(s) → TypeScript string literal · ctx.role(loginId) → role key · ctx.screen = page title last verified · ctx.use(name) → import from common/session.
 * A TC action that matches nothing stops the generator: add a pattern here (never edit the TC, never edit the generated spec).
 * Order matters: specific patterns before generic ones.
 */

/** Login ID written in the TC → role key of data/roles.ts. */
export const USERS = {
  standard_user: 'standard',
  locked_out_user: 'locked',
  problem_user: 'problem',
  performance_glitch_user: 'performance',
  error_user: 'error',
  visual_user: 'visual',
};

export const ACTIONS = [
  [/^Open Login page$/, () => ['await shop.login.goto();']],
  [/^Enter Username '(.*)'$/, (m, c) => [`await shop.login.username.fill(${c.q(m[1])});`]],
  [/^Enter Password of (\w+)$/, (m, c) => [`await shop.login.password.fill(${c.use('passwordOf')}(${c.q(c.role(m[1]))}));`]],
  [/^Enter Password '(.*)'$/, (m, c) => [`await shop.login.password.fill(${c.q(m[1])});`]],
  [/^Login as (\w+)$/, (m, c) => { c.screen = 'Products'; return [`await ${c.use('loginAs')}(page, ${c.q(c.role(m[1]))});`]; }],
  [/^Logout$/, (m, c) => { c.screen = 'Login'; return [`await ${c.use('logout')}(page);`]; }],
  [/^Press browser Back$/, () => ['await page.goBack();']],
  [/^Open URL '(.+)' without login$/, (m, c) => [`await page.goto(${c.q(m[1])});`]],
  [/^Click 'Add to cart' of '(.+)'$/, (m, c) => [`await shop.products.addToCart(${c.q(m[1])});`]],
  [/^Click 'Remove' of '(.+)'$/, (m, c) => [c.screen === 'Your Cart'
    ? `await shop.cart.remove(${c.q(m[1])});`
    : `await shop.products.remove(${c.q(m[1])});`]],
  [/^Open the cart$/, () => ['await shop.header.openCart();']],
  [/^Verify page '(.+)'$/, (m, c) => { c.screen = m[1]; return [`await shop.screen(${c.q(m[1])}).waitLoaded();`]; }],
  [/^Enter '(.+?)' '(.*)'$/, (m, c) => [`await shop.info.field(${c.q(m[1])}).fill(${c.q(m[2])});`]],
  [/^Click '(.+)'$/, (m, c) => [`await shop.button(${c.q(m[1])}).click();`]],
];

/** Expected Results (1 per TC). `message: true` → the quoted text must exist in spec/messages.md. */
export const EXPECTS = [
  [/^Error message '(.*)' is displayed$/, (m, c) => [`await expect(shop.error).toHaveText(${c.q(m[1])});`], { message: 1 }],
  [/^Message '(.*)' is displayed$/, (m, c) => [`await expect(shop.complete.header).toHaveText(${c.q(m[1])});`], { message: 1 }],
  [/^Page '(.+)' is displayed$/, (m, c) => [`await expect(shop.screen(${c.q(m[1])}).landmark).toBeVisible();`]],
  [/^Cart badge shows '(\d+)'$/, (m, c) => [`await expect(shop.header.cartBadge).toHaveText(${c.q(m[1])});`]],
  [/^Cart badge is not displayed$/, () => ['await expect(shop.header.cartBadge).toBeHidden();']],
  [/^Button of '(.+)' shows '(.+)'$/, (m, c) => [`await expect(shop.products.button(${c.q(m[1])})).toHaveText(${c.q(m[2])});`]],
  [/^Item '(.+)' is listed in the cart with price '(.+)'$/, (m, c) => [`await expect(shop.cart.price(${c.q(m[1])})).toHaveText(${c.q(m[2])});`]],
  [/^Item '(.+)' is not listed in the cart$/, (m, c) => [`await expect(shop.cart.row(${c.q(m[1])})).toHaveCount(0);`]],
  [/^Overview shows '((.+?:) .+)'$/, (m, c) => [`await expect(shop.overview.amount(${c.q(m[2])})).toHaveText(${c.q(m[1])});`]],
  [/^Field '(.+)' contains '(.*)'$/, (m, c) => [`await expect(shop.info.field(${c.q(m[1])})).toHaveValue(${c.q(m[2])});`]],
];
