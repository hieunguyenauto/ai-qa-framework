import { test as base } from '@playwright/test';
import { Shop } from '../screens/shop';

/** Screens attached to every test. New screen: add it to screens/shop/index.ts. */
export const test = base.extend<{ shop: Shop }>({
  shop: async ({ page }, use) => use(new Shop(page)),
});

export { expect } from '@playwright/test';
