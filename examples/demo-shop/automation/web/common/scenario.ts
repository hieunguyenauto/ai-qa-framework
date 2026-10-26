import fs from 'fs';
import { test, type BrowserContext, type Page } from '@playwright/test';
import { env } from './env';
import { trackApis } from './wait';

/**
 * Frame for scenarios that run SERIALLY on one shared browser (every TC uses the same page) — long E2E flows.
 * Built in production from lessons:
 *  - R02 / R13: the trace is recorded per TC in chunks (set trace / video 'off' for the project), kept on failure; every hook command has a time limit.
 *  - Screenshot + aria snapshot + URL on failure (FAIL.md of common/qc-reporter.ts reads these attachments).
 *  - Video of the whole scenario → reports/Runs/<run>/video/<run>.webm, always kept (off: E2E_VIDEO=off); failed TCs also get video-fail.webm (cut by the reporter with ffmpeg).
 * Usage:
 *   test.describe.configure({ mode: 'serial' });
 *   const sc = serialScenario(() => [`order ${orderId}`]);   // notes written into the report
 *   test('...', async () => { const page = sc.page; ... });
 * The demo (tests/shop/) uses independent tests instead; this frame is kept for serial E2E suites.
 */
export const within = (p: Promise<unknown> | undefined, ms: number) =>
  Promise.race([(p ?? Promise.resolve()).catch(() => {}), new Promise((r) => setTimeout(r, ms))]);

export function serialScenario(notes: () => string[] = () => []) {
  let context: BrowserContext;
  let page: Page;
  const videoDir = process.env.E2E_VIDEO === 'off' || !process.env.RUN_ID ? undefined : `reports/Runs/${process.env.RUN_ID}/video`;

  test.beforeAll(async ({ browser }) => {
    if (videoDir) {
      fs.mkdirSync(videoDir, { recursive: true });
      fs.writeFileSync(`${videoDir}/start.txt`, String(Date.now()));
    }
    context = await browser.newContext({
      ...(videoDir ? { recordVideo: { dir: videoDir, size: { width: 1280, height: 800 } } } : {}),
      httpCredentials: env.httpCredentials,
      baseURL: env.baseUrl, locale: env.locale, timezoneId: env.timezoneId, viewport: { width: 1600, height: 1000 },
      acceptDownloads: true,
    });
    context.setDefaultTimeout(env.actionTimeoutMs);
    context.setDefaultNavigationTimeout(env.navigationTimeoutMs);
    await context.tracing.start({ screenshots: true, snapshots: true });
    page = await context.newPage();
    trackApis(page); // waitApisIdle must see APIs from the start
  });

  test.beforeEach(async ({}, testInfo) => {
    await within(context.tracing.startChunk({ title: testInfo.title }), 10_000);
  });

  test.afterEach(async ({}, testInfo) => {
    const n = notes().filter(Boolean);
    if (n.length) testInfo.annotations.push({ type: 'data', description: n.join(' · ') });
    // Failure (including known bugs marked with test.fail — expectedStatus 'failed') → keep screenshot / trace as evidence.
    if (testInfo.status !== testInfo.expectedStatus || testInfo.status === 'failed') {
      await testInfo.attach('url', { body: page.url(), contentType: 'text/plain' }).catch(() => {});
      const shot = await page.screenshot({ timeout: 10_000 }).catch(() => null);
      if (shot) await testInfo.attach('screenshot', { body: shot, contentType: 'image/png' });
      const aria = await page.locator('body').ariaSnapshot({ timeout: 10_000 }).catch(() => null);
      if (aria) await testInfo.attach('aria-snapshot', { body: aria, contentType: 'text/yaml' });
      const tracePath = testInfo.outputPath('trace.zip');
      await within(context.tracing.stopChunk({ path: tracePath }), 30_000);
      await testInfo.attach('trace', { path: tracePath, contentType: 'application/zip' }).catch(() => {});
    } else {
      await within(context.tracing.stopChunk(), 10_000);
    }
  });

  test.afterAll(async () => {
    test.setTimeout(60_000);
    await within(context?.tracing.stop(), 15_000);
    await within(context?.close(), 30_000);
  });

  return {
    get page() { return page; },
    get context() { return context; },
  };
}
