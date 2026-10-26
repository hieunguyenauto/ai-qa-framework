# 2026-10-12 Screenshot hook hangs after a failure
- Type: TIMING
- Source: E2E TC-002 (afterEach of a serial scenario with its own browser.newContext)
- Function / screen: afterEach hook of the E2E scenario
- Symptom: the test failed after 5 seconds but the run hung ~2 more minutes and reported 'Test timeout of 120000ms exceeded'.
- Root cause: page.screenshot({ fullPage: true }) had no timeout and hung on a page with a fixed layout.
- Fix: viewport screenshot (not fullPage), timeout 10s, .catch(); attach an aria snapshot of body as well.
- Rule: R02 — screenshot / snapshot hooks always have a timeout ≤ 10s and catch errors; a self-created context attaches its own screenshot + aria snapshot.
- Applies to: every afterEach / afterAll, especially serial scenarios with their own context.
