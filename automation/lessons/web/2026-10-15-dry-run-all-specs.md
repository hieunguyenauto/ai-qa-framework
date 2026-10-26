# 2026-10-15 Every spec of a suite must understand the dry-run flag
- Type: DATA
- Source: a TC ↔ code check run with E2E_DRY=1 over the whole suite folder (production CMS, test environment)
- Function / screen: E2E suite (40 scenarios)
- Symptom: the "dry run" (must not touch the app) really ran one scenario 15/15 and created records in the test environment; another scenario ran up to the login step.
- Root cause: only the generated specs understood E2E_DRY; the two hand-written specs did not check the flag.
- Fix: the hand-written specs got `test.skip(!!process.env.E2E_DRY, …)` at the top of the file → DRY over the folder: 545 pass + 17 skip in 8.5s, the app was never opened.
- Rule: R36 — every spec in a suite with a dry mode must understand it; a spec that cannot run dry skips the whole file when DRY. Checks / recon always run DRY, real runs never DRY.
- Applies to: every new spec added to a suite, every command that must not write data.
