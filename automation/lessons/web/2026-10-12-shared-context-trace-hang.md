# 2026-10-12 Automatic trace on a shared context hangs 120s and corrupts trace.zip
- Type: FRAMEWORK
- Source: two E2E runs on a production CMS (both failed at ~50s but ran 2–3 minutes, "Test timeout of 120000ms exceeded", trace.zip could not be unzipped)
- Function / screen: serial E2E spec with a context created in beforeAll
- Symptom: after a failure the teardown hung until the timeout; trace.zip was cut off.
- Root cause: config trace 'retain-on-failure' applied to the self-created context and recorded across many TCs → saving took very long on failure and was killed half-way.
- Fix: playwright.config.ts project e2e: trace / video 'off'. The scenario records itself: tracing.start in beforeAll, startChunk in beforeEach, stopChunk({ path }) + attach on failure (dropped on pass), every hook command wrapped in within(…, ms); afterAll tracing.stop + close ≤ 15s each. Implemented in common/scenario.ts.
- Rule: R13 (extends R02)
- Applies to: every serial scenario that shares one BrowserContext.
