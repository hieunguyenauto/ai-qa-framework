# 2026-10-13 Enter already submitted the form, the test still clicks the disabled confirm button
- Type: TIMING
- Source: a regression TC on a production CMS (dev environment)
- Function / screen: quote › register (name field, Enter ×5 — lesson D01)
- Symptom: click '決定' timed out: "element is not enabled", then "detached"; the app was right (one draft quote).
- Root cause: Enter submitted the form; while sending, the form was still visible (isVisible true) but '決定' was disabled, then the form closed. An instant isVisible check followed by a click is a race.
- Fix: wait for the form to close (5s); only if it is still open click '決定'; then expect the form hidden within 15s.
- Rule: R22
- Applies to: "press Enter several times / double click" TCs (D01) and every "if still open, click" step.
