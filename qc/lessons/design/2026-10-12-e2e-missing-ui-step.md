# 2026-10-12 E2E TC imported from an outside file misses a mandatory UI step
- Type: DESIGN_GAP
- Source: E2E TC-002 of a production project, converted from a hand-written CSV
- Function / screen: work request registration
- Symptom: the TC starts at the shop step and skips the "new request / continued request" choice → both manual runs and automation drift from the app.
- Root cause: the original file was written from memory and left out the default step; the format conversion did not compare against the screen.
- Fix: added the step as step 1 of TC-002 (rev 2).
- Rule: D14 — TCs imported from an outside file: compare every step with the catalog / real screen and add mandatory steps that were skipped.
- Applies to: every TC that did not come from the test-case skill.
