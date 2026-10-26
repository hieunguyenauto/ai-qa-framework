# 2026-10-26 Product card: image and title links also have role=button
- Type: LOCATOR
- Source: @CHK-TC-010 — file: examples/demo-shop/automation/web/screens/shop/products.screen.ts (first run of the generated suite, demo, 2026-10-26)
- Function / screen: Products (SHP02) › product card › 'Add to cart' / 'Remove'
- Symptom: expect(button).toHaveText('Remove') failed with "strict mode violation … resolved to 3 elements": the image link and the title link (aria-label 'View details for Sauce Labs Backpack') plus the real button.
- Root cause: button(name) used item.getByRole('button'); the card's links are `<a role="button">`, so the role query is not unique. The recon looked at the card text, not at the roles of every element inside it.
- Fix: button(name) uses the native element `item.locator('button')` (its text toggles 'Add to cart' ↔ 'Remove', so it cannot be found by a fixed name); addToCart / remove keep getByRole with the exact name. Re-run: 35/35 as expected.
- Rule: R45 — inside cards with clickable images / titles, getByRole('button') is not unique: target the action by its name, or the native <button> when its text toggles.
- Applies to: product / item cards, list rows with link-buttons (also see R11, R23).
