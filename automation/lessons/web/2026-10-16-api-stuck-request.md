# 2026-10-16 A hanging request must not block every later API wait
- Type: TIMING
- Source: an E2E TC on a production CMS (test environment) — file: common/wait.ts
- Function / screen: record detail › status change (confirm schedule → save → confirm)
- Symptom: the TC used its full 5 minutes although the "saved" dialog had appeared; perf said 'API not done after 120s (GET /api/records/<id>)'.
- Root cause: the server never answered one request; waitApisIdle kept it in the list until the page changed → every later call waited the full apiMaxWaitMs (120s) again, adding up past the TC timeout.
- Fix: waitApisIdle drops a request that has hung > apiMaxWaitMs and logs 'perf' once (no failure, no retry — R18).
- Rule: R37
- Applies to: common/wait.ts waitApisIdle and every "wait until no request is running" mechanism.
