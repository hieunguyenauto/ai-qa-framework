# 2026-10-12 Create wizard has a hidden step before the first documented step
- Type: LOCATOR (wrong screen flow)
- Source: E2E TC-002 of a production CMS (dev environment)
- Function / screen: request creation wizard, admin role
- Symptom: step 1 waited for the shop selector, but the screen only showed "new request / continued request + 次へ".
- Root cause: the code was generated from the CSV and the screen catalog only; neither mentioned the request-type radio + 次へ that admin roles see first.
- Fix: added startNew() to the screen object (choose new request → 次へ, skip the optional mode step if present); the TC step 1 was updated by QC.
- Rule: R01 — screen never run before: get the real element tree (error-context.md / aria snapshot / codegen) before writing locators.
- Applies to: every multi-step wizard, every screen whose content differs by role.
