# 2026-10-26 SPA changes the URL before the new page is rendered
- Type: TIMING
- Source: recon of examples/demo-shop (recon 2026-10-26, demo — https://www.saucedemo.com)
- Function / screen: every navigation of the demo shop (Login → Products → Your Cart → Checkout)
- Symptom: the first recon script took an aria snapshot right after each click: every snapshot showed the PREVIOUS screen (the "Products" snapshot was still the login form). The second script used waitForURL(/cart/) and then read the item list: it read the 6 products of the inventory page and the title was still 'Products'.
- Root cause: the shop is a React SPA; the router updates the URL first and renders the new screen a moment later. waitForURL resolves in that gap.
- Fix: every screen object has a landmark (the page title '[data-test="title"]' with the screen's exact text) and waitLoaded(); navigation helpers and the generated steps call it before reading anything. Recon v3 with title waits returned the correct content on every screen.
- Rule: R43 — after a click that navigates in an SPA, wait for the target page's landmark, not waitForURL.
- Applies to: every SPA (React / Vue / Angular router), recon scripts, screen objects.
