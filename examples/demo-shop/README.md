# Project profile — demo-shop

Public demo of the framework. The system under test is **Swag Labs** (https://www.saucedemo.com), a public practice shop published by Sauce Labs for test-automation training. This project is not affiliated with Sauce Labs; it only uses the public site so that the whole pipeline can be shown without client data.

| Item | Value |
|---|---|
| Product | Swag Labs web shop (React SPA) |
| Site / OS | Web (desktop Chrome / Chromium) |
| UI language | English (the framework is built for Japanese UIs; labels are quoted in '' exactly as in the UI either way) |
| Spec | spec/checkout.md (written by QA from the public behaviour of the site, approved rev 1) |
| Messages | spec/messages.md (authoritative text of every message) |
| Environments | `demo` only (automation/web/env/demo.json) |

## Roles (user types)
The shop has no permission roles; each test account has a built-in behaviour. They are used as "roles" in the Role column and in `loginAs(page, '<role>')`.

| Role key | Login ID | Behaviour | Used for |
|---|---|---|---|
| standard | standard_user | Normal user | Main flow |
| locked | locked_out_user | Cannot log in | Login validation |
| problem | problem_user | Built-in UI defects (BUG-001, BUG-003) | Regression of known bugs |
| performance | performance_glitch_user | Slow login | Performance (no threshold yet — OQ-CHK-003) |
| error | error_user | Built-in functional errors (BUG-002) | Regression of known bugs |
| visual | visual_user | Built-in visual differences | Manual UI check |

Password: the same public password for every account, shown on the login page. In automation it comes only from `.env` (`SHOP_PASSWORD`), never from code.

## ID conventions
| Kind | Format | Example |
|---|---|---|
| Sheet prefix / OQ code | CHK (scope checkout) | CHK |
| Viewpoint | CHK-NN | CHK-04 |
| Test case | CHK-TC-NNN | CHK-TC-015 |
| Open Question | OQ-CHK-NNN | OQ-CHK-001 |
| Bug | BUG-NNN (bug-history.md) | BUG-001 |
| Screen | SHPnn (screens/catalog/shop.md) | SHP04 |

## Result columns (Excel export)
| Column | Meaning |
|---|---|
| Web | Result on desktop Chrome |

## Project rules
- Item prices are read from the Products screen; never hard-code a price that is not in the spec or a LOCKED TC.
- Each automated TC starts from a new browser context (empty cart), so TCs do not depend on each other.
