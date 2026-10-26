# Screen template for automation (web, Playwright)
1 file = 1 screen: `<P>/automation/web/screens/<app>/<screen>.screen.ts`. The full screen description lives in `<P>/screens/catalog/` — only write the screen ID to look it up, never copy the description.

```ts
import { BaseScreen } from '../base.screen';

/**
 * <Screen name as shown in the UI> — catalog: <file>.md › "<section>"
 * Roles: <per permission matrix / catalog>. Wait: <API / landmark to wait for before asserting>.
 * Source: recon <date>, <env>. [to verify on the real app] <locators not verified yet>
 */
export class XxxScreen extends BaseScreen {
  readonly id = '<screen ID, e.g. SHP03>';
  readonly path = '<route>';
  readonly roles = ['standard'] as const;
  /** Landmark that proves THIS screen is rendered (R43) — not the URL. */
  readonly landmark = this.page.getByText('<exact page title>', { exact: true });

  // Locator priority: getByRole / getByLabel / getByText (UI label) → data-test / #id → CSS
  readonly saveButton = this.page.getByRole('button', { name: '保存' });

  async save(): Promise<void> { await this.saveButton.click(); }
}
```

Rules: locators only in screen files · no waitForTimeout · short actions, no asserts inside (except waitLoaded).
