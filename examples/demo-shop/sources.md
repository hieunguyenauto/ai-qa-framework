# Source priority — demo-shop
Conflicting sources → the higher row wins.

| Priority | Source | Covers | Note |
|---|---|---|---|
| 1 | spec/messages.md | Exact text of every message | Checked against the real app (recon 2026-10-26, demo) |
| 2 | spec/checkout.md (rev 1, Approved) | Behaviour, acceptance criteria, calculations | Written by QA from the public site |
| 3 | qc/open-questions.md (ANSWERED / RESOLVED) | Decisions on gaps of the spec | |
| 4 | screens/catalog/shop.md | Screens, routes, buttons | Navigation reference, not requirements |
| 5 | Real app (recon) | Labels, locators | Never a source of requirements: app ≠ spec → finding / bug |
