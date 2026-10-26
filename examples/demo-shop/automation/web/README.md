# Demo shop — Playwright automation

Automated tests for the Swag Labs demo shop (https://www.saucedemo.com).
- **Only input:** LOCKED test cases in `examples/demo-shop/qc/test-cases/` with Automation Eligibility UI-AUTO / BOTH.
- **Specs are generated** from those test cases by `scripts/gen-specs.mjs` and never edited by hand.

## 1. Requirements

| Need | Check |
|---|---|
| Node.js 20+ (22 LTS recommended) | `node -v` |
| Internet access to saucedemo.com | Open it in a browser |
| ffmpeg (optional) | Only to cut failure clips out of serial-scenario videos |

## 2. Install (once)

```bash
cd examples/demo-shop/automation/web
npm ci
npx playwright install chromium
cp .env.example .env      # set SHOP_PASSWORD to the password shown on the demo login page
```

## 3. Run

| Goal | Command |
|---|---|
| Whole suite | `npm test` |
| One TC | `npm test -- --grep @CHK-TC-015` |
| One account | `npm test -- --grep @role-problem` |
| See the browser | `npm run test:headed -- --grep @CHK-TC-031` |
| UI mode (step by step) | `npm run test:ui` |
| Regenerate specs after a TC revision | `npm run gen` → then review `git diff` (R42) |
| Check specs ↔ TCs (no browser, < 1 s) | `npm run gen:check` |
| Recon: walk the screens, write aria snapshots | `npm run recon` → `reports/_tmp_chk/recon/` (temporary) |
| Type check | `npm run typecheck` |
| Latest summary / HTML report | `npm run summary` · `npm run report` |

## 4. Report
Every name follows **[test case]_[dd-mm-yyyy_HH-mm-ss]_[ENV]** (`common/qc-reporter.ts`).

| Folder / file | Content |
|---|---|
| `reports/Runs/<run>/SUMMARY.md` | Totals (pass / fail / known bug / skip), failed TCs with the failed step, known bugs with their bug ID, passed TCs; Playwright's `html/`, `results.json`, `junit.xml` next to it |
| `reports/Failed/<TC ID>_<name>_<date>_<ENV>/` | `FAIL.md` (one field per row: TC, environment, account, failed step, error, locator, expected / received, code location…) + screenshot, video, `error-context.md`, `trace.zip` |
| `reports/Passed/<run>/` | `PASSED.md` (+ full video for serial scenarios) |
| `reports/HISTORY.md` · `reports/PERFORMANCE.md` | One row per run · slow APIs to check later (never fails a TC) |

## 5. Structure

| Path | Content | Changed by |
|---|---|---|
| `env/<ENV>.json` | Base URL, locale, timeouts, accounts (login IDs only) | Lead |
| `.env` | ENV + passwords (never committed) | Whoever runs the tests |
| `data/roles.ts` | Role key ↔ label, credentials lookup | kb-update-automation |
| `common/` | `env.ts`, `session.ts` (the only login), `wait.ts` (API / loader waits), `scenario.ts` (serial E2E frame with trace chunks + video), `qc-reporter.ts`, `tc.ts` (TC revision guard), `fixtures.ts` | kb-update-automation |
| `screens/shop/*.screen.ts` | **Screen knowledge**: screen ID, route, landmark, locators, short actions | kb-update-automation |
| `scripts/gen-specs.mjs` | TC → spec generator (`--check` for drift) | When the TC format changes |
| `scripts/step-patterns.mjs` | Step vocabulary: TC action text → code | When a TC uses a new kind of step |
| `tests/shop/<scope-key>.spec.ts` | **Generated** — do not edit | Generator |
| `tests/tools/recon.spec.ts` | Recon tool (not a test) | When needed |

## 6. TC → code conventions

| TC | Code |
|---|---|
| TC ID | Test name starts with the TC ID + tag `@<TC ID>` |
| Role | Tag `@role-<key>`; `Login as <user>` → `loginAs(page, '<key>')` |
| Steps | One `test.step('<original step text>')` per step; actions inside a step are split on ` → ` |
| Expected Result (1 per TC) | Last step `Expected: …` with one main `expect` |
| Labels / messages in `''` | Used verbatim; messages must exist in `spec/messages.md` (the generator stops otherwise) |
| Function contains `BUG-NNN` that is Open in bug-history.md | `test.fail(true, 'BUG-NNN …')` — expected failure, expect unchanged (R44) |
| MANUAL / NEEDS_SPEC / API-AUTO | No code (listed in the spec header as "Not automated") |

Rules:
- Locators only in `screens/`; specs never contain selectors.
- After every navigation wait for the target screen's landmark, not the URL (R43).
- No `waitForTimeout`, no `test.only`.
- Never change an `expect` to match the app when the TC says otherwise → tell QC (wrong TC) or record a bug (PRODUCT_BUG).
