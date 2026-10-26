# 2026-10-26 TC fails on a known product bug: keep the expect, mark the expected failure
- Type: PRODUCT_BUG (handled per kb-update-automation)
- Source: CHK-TC-034 / CHK-TC-035 of examples/demo-shop (recon 2026-10-26, demo)
- Function / screen: Checkout: Your Information ('problem_user' — typing in 'Last Name' changes 'First Name'), Checkout: Overview ('error_user' — 'Finish' does nothing)
- Symptom: both TCs fail on the expected result written in the LOCKED TC.
- Root cause: real product defects of the demo app (BUG-001, BUG-002 in examples/demo-shop/bug-history.md), not automation errors.
- Fix: no change to the expect. The TC Function names the bug ID; the generator reads bug-history.md and wraps the test with test.fail(true, 'BUG-00x …') while the bug is Open. The report lists it as "Known bug" and CI stays green; when the bug is fixed the test passes unexpectedly → CI turns red → set the bug to Fixed and regenerate.
- Rule: R44
- Applies to: every TC that fails because of a confirmed product bug.
