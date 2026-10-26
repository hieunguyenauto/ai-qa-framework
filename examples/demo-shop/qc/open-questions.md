# Open Questions — demo-shop

| ID | Scope | Question | Impact | Answer | Answered by / at | Status |
|---|---|---|---|---|---|---|
| OQ-CHK-001 | checkout | The checkout fields accept input made only of spaces (recon). Is whitespace-only valid, or must it be trimmed and rejected? | CHK-04 data axis (D02) | No trim rule in this release: whitespace-only is accepted. No TC asserts an error. | Nguyen Thanh Hieu · 2026-10-26 | RESOLVED |
| OQ-CHK-002 | checkout | Checkout is possible with an empty cart (Overview shows Total $0.00). Should it be blocked? | Negative case for 'Checkout' | Out of scope of rev 1; no TC until the rule is defined. | Nguyen Thanh Hieu · 2026-10-26 | RESOLVED |
| OQ-CHK-003 | checkout | What response time is acceptable after login (performance_glitch_user takes several seconds)? | Group 7 Performance | No threshold defined yet. The TC stays NEEDS_SPEC. | Nguyen Thanh Hieu · 2026-10-26 | ANSWERED |
| OQ-CHK-004 | checkout | Tax rate and rounding are not written in the spec draft. | CHK-05 amounts | 8% of Item total, rounded half up to 2 decimals (as displayed). Spec rev 1 updated; glossary 'Tax'. | Nguyen Thanh Hieu · 2026-10-26 | RESOLVED |
| OQ-CHK-005 | checkout | Max length / allowed character types of 'First Name', 'Last Name', 'Zip/Postal Code'? | CHK-04 boundary axis | No limit defined. One positive TC with full-width Japanese input (D04, D06, D08); no boundary TCs. | Nguyen Thanh Hieu · 2026-10-26 | RESOLVED |
