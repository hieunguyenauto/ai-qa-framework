# Automation notes — demo-shop
Environment / data / account notes for automation (no passwords). Code: [web/](web/README.md).

| Topic | Note |
|---|---|
| Environment | `demo` = https://www.saucedemo.com (public, no Basic Auth, no VPN) |
| Accounts | env/demo.json › accounts (role key → login ID). Password: `.env` `SHOP_PASSWORD` (the demo site shows it on its login page; CI sets it as a workflow variable) |
| Data | The shop has no back end you can reset; every test starts from a new browser context, so the cart is empty and tests are independent |
| Known bugs | problem_user / error_user have built-in defects → bug-history.md BUG-001…003; their TCs run as expected failures (R44) |
| Performance | performance_glitch_user is slow on purpose; no threshold yet (OQ-CHK-003), so its TC is NEEDS_SPEC and not automated |
| Mobile | Not in the demo (roadmap: Appium) |
