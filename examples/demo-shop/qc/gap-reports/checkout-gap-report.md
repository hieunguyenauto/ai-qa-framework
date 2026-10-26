# Gap Report — checkout
- Project: demo-shop · Scope Key: checkout · Sheet prefix: CHK
- Source: examples/demo-shop/spec/checkout.md (rev 1)
- State: DONE · Revision: 1 · Approved by / at: Nguyen Thanh Hieu · 2026-10-26

## 1. Scope
| Item | Value |
|---|---|
| Ticket / CR | Demo — purchase flow |
| Sheet prefix / Code | CHK / CHK |
| Roles in scope | standard_user (main), locked_out_user, problem_user, error_user, performance_glitch_user, visual_user |
| Site / OS | Web (desktop Chrome) |
| Release phase | Rev 1 |
| Parent / child tickets | - |
| Out of scope | Product sorting, 'About', 'Reset App State', product detail page, empty-cart checkout (OQ-CHK-002) |

## 2. Test items
| # | Test item | Source |
|---|---|---|
| 1 | Login with valid / invalid input and account states → message or Products | spec/checkout.md#AC-01, messages.md M01–M04 |
| 2 | Protected screens without a session → Login + M05 | AC-02, M05 |
| 3 | Add to cart / Remove → button text, cart badge | AC-03 |
| 4 | Cart list (QTY, name, price), Remove, Continue Shopping, Checkout | AC-04 |
| 5 | Required fields of Checkout: Your Information, order of checks, Cancel | AC-05, M06–M08 |
| 6 | Overview amounts: Item total, Tax 8%, Total; Cancel keeps the cart | AC-06, OQ-CHK-004 |
| 7 | Complete: M09, empty cart, Back Home | AC-07, M09 |
| 8 | Cart kept after logout / login | AC-08 |

## 3. Findings
| ID | Test item | Type | Description | Winning source | OQ |
|---|---|---|---|---|---|
| FND-CHK-001 | 5 | Ambiguous | Whitespace-only input is accepted by the app; the spec has no trim rule | spec (no rule) | OQ-CHK-001 |
| FND-CHK-002 | 4 | Missing | Behaviour of 'Checkout' with an empty cart is not defined | - | OQ-CHK-002 |
| FND-CHK-003 | 1 | Missing | No response-time threshold for login | - | OQ-CHK-003 |
| FND-CHK-004 | 6 | Ambiguous | Tax rate / rounding not written in the draft | OQ answer → spec rev 1 | OQ-CHK-004 |
| FND-CHK-005 | 5 | Missing | No max length / character rules for the checkout fields | - | OQ-CHK-005 |
| FND-CHK-006 | 7 | Not verifiable | D01 double click on 'Finish': the demo has no order list, duplicates cannot be observed | - | - (not designed) |
| FND-CHK-007 | 5, 7 | Repeats a past bug | BUG-001 (problem_user, wrong field) and BUG-002 (error_user, Finish does nothing) touch this flow | bug-history.md | - (group 8 VP) |

## 4. Open Questions (logged in examples/demo-shop/qc/open-questions.md)
| ID | Question | Impact | Status |
|---|---|---|---|
| OQ-CHK-001 | Whitespace-only input valid? | CHK-04 | RESOLVED |
| OQ-CHK-002 | Empty-cart checkout blocked? | Out of scope | RESOLVED |
| OQ-CHK-003 | Login response-time threshold? | CHK-09 | ANSWERED (no threshold → NEEDS_SPEC) |
| OQ-CHK-004 | Tax rate / rounding? | CHK-05 | RESOLVED |
| OQ-CHK-005 | Field limits / character types? | CHK-04 | RESOLVED |

## 5. Design Gate
**READY** — every OQ is answered; the performance viewpoint is designed with a NEEDS_SPEC test case until a threshold exists.

## 6. Context pack
<!-- Date: 2026-10-26 · qc/lessons/INDEX.md revision: initial public version -->
| Type | Source | Short content |
|---|---|---|
| Term | glossary.md#Tax | Tax = 8% of Item total, 2 decimals. |
| Screen | screens/_flow.md | Login → Products → Your Cart → Your Information → Overview → Complete; Cancel on Overview returns to Products. |
| Screen | screens/catalog/shop.md | Every screen except Login has a page title used as landmark. |
| Permission | README.md#Roles | No permission matrix; user types have built-in behaviours. |
| Lesson | qc/lessons/INDEX.md D01 | Double submit — not verifiable on the demo (FND-CHK-006). |
| Lesson | qc/lessons/INDEX.md D07 | UI state after actions: badge / button text must follow add / remove / finish. |
| Lesson | qc/lessons/INDEX.md D12 | Trace VP ↔ TC both ways before LOCK. |
| Bug | bug-history.md BUG-001 | problem_user: 'Last Name' input lands in 'First Name'. |
| Bug | bug-history.md BUG-002 | error_user: 'Finish' does nothing. |
| Scope | OQ-CHK-002 | Empty-cart checkout is out of scope. |

## 7. Knowledge updates (when DONE)
| File | Change | From |
|---|---|---|
| examples/demo-shop/glossary.md | Added 'Tax' (8%, 2 decimals) | OQ-CHK-004 |
| examples/demo-shop/spec/checkout.md | AC-06 tax rule written (rev 1) | OQ-CHK-004 |
| examples/demo-shop/bug-history.md | BUG-001…003 from recon | FND-CHK-007 |
