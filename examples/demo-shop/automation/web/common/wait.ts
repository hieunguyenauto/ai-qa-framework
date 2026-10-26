import { test, type Page, type Request, type Response } from '@playwright/test';
import { env } from './env';

/** Like waitForApi but never fails the test if the API is not called (e.g. the page uses a cache). */
export function waitForApiSafe(page: Page, urlPart: string, timeout = 15_000): Promise<Response | null> {
  return page.waitForResponse((r) => r.url().includes(urlPart) && r.status() < 400, { timeout }).catch(() => null);
}

/** Wait for one API response (e.g. 'items?') before asserting table data. */
export function waitForApi(page: Page, urlPart: string, method = 'GET'): Promise<Response> {
  return page.waitForResponse(
    (res) => res.url().includes(urlPart) && res.request().method() === method && res.status() < 400,
  );
}

/** Wait until the app's full-page loader is gone (R26). Max 60s; longer → let the next step report the error. */
const LOADER = '#loader-container, .app-loader, .ant-spin-spinning';
export async function waitForAppIdle(page: Page, timeout = 60_000): Promise<void> {
  await page.locator(LOADER).first().waitFor({ state: 'hidden', timeout }).catch(() => undefined);
}

/**
 * Wait for the REAL API response (R18) — call BEFORE the action that triggers the request, await after.
 * Measured from the call. Slower than env.apiPerfLimitMs / no response within env.apiMaxWaitMs / HTTP error
 * → annotation 'perf' (SUMMARY + reports/PERFORMANCE.md) to check later, NO failure. Returns true on an OK response.
 * Request aborted by the app (ERR_ABORTED) → onAbort (close the error dialog like a user would), then keep waiting; never reload.
 */
export function waitApiPerf(page: Page, match: (url: URL, method: string) => boolean, label: string, onAbort?: () => Promise<unknown>): Promise<boolean> {
  const { apiPerfLimitMs: limit, apiMaxWaitMs: max } = env;
  const t0 = Date.now();
  let aborted = 0;
  const perf = (description: string) => {
    try { test.info().annotations.push({ type: 'perf', description }); } catch { /* outside a test */ }
  };
  const onFail = (r: Request) => {
    if (!match(new URL(r.url()), r.method())) return;
    aborted += 1;
    if (onAbort) void onAbort().catch(() => {});
  };
  page.on('requestfailed', onFail);
  const note = () => (aborted ? `, aborted by the app ${aborted}× (ERR_ABORTED)` : '');
  return page.waitForResponse((r) => match(new URL(r.url()), r.request().method()), { timeout: max })
    .then((r) => {
      const ms = Date.now() - t0;
      if (!r.ok()) { perf(`${label}: HTTP ${r.status()} after ${(ms / 1000).toFixed(1)}s${note()}`); return false; }
      if (ms > limit || aborted) perf(`${label}: returned after ${(ms / 1000).toFixed(1)}s (threshold ${limit / 1000}s)${note()}`);
      return true;
    }, () => { perf(`${label}: no response within ${max / 1000}s (threshold ${limit / 1000}s)${note()}`); return false; })
    .finally(() => page.off('requestfailed', onFail));
}

// ---------------- Wait until every API call has finished ----------------
/** Long-lived connections (WebChannel / long-poll) never "finish" — ignored. */
const LONG_LIVED = /\/channel(\?|$)|\/Listen\/|\/Write\/|backtrace\.io/;
const inflight = new WeakMap<Page, Map<Request, number>>();

/** Start tracking running XHR / fetch of the page (call once when the page is created; calling again is harmless). */
export function trackApis(page: Page): void {
  if (inflight.has(page)) return;
  const m = new Map<Request, number>();
  inflight.set(page, m);
  page.on('request', (r) => {
    if (['xhr', 'fetch'].includes(r.resourceType()) && !LONG_LIVED.test(r.url())) m.set(r, Date.now());
  });
  const done = (r: Request) => { m.delete(r); };
  page.on('requestfinished', done);
  page.on('requestfailed', done);
  page.on('framenavigated', (f) => { if (f === page.mainFrame()) m.clear(); }); // requests of the previous page are gone
}

/**
 * Wait until NO API call is running and it stays quiet for quietMs (default 1s) — like a user waiting for the page to finish.
 * Longer than env.apiPerfLimitMs → 'perf' (with the calls still running); longer than env.apiMaxWaitMs → 'perf' and continue. Never fails, never reloads.
 */
export async function waitApisIdle(page: Page, label: string, quietMs = 1_000): Promise<void> {
  trackApis(page);
  const m = inflight.get(page)!;
  const { apiPerfLimitMs: limit, apiMaxWaitMs: max } = env;
  const t0 = Date.now();
  let quietSince = m.size ? 0 : Date.now();
  while (Date.now() - t0 < max) {
    if (page.isClosed()) return;
    // A request hanging longer than max (the server never answers): log perf once and drop it, so it does not block later waits (R37).
    for (const [r, start] of m) {
      if (Date.now() - start < max) continue;
      m.delete(r);
      const description = `${label}: stopped waiting for ${r.method()} ${new URL(r.url()).pathname} (hung > ${max / 1000}s)`;
      try { test.info().annotations.push({ type: 'perf', description }); } catch { /* outside a test */ }
    }
    if (m.size) quietSince = 0;
    else if (!quietSince) quietSince = Date.now();
    else if (Date.now() - quietSince >= quietMs) break;
    await new Promise((r) => setTimeout(r, 100));
  }
  const ms = Date.now() - t0 - (m.size ? 0 : quietMs);
  if (m.size || ms > limit) {
    const left = [...m.keys()].map((r) => `${r.method()} ${new URL(r.url()).pathname}`).slice(0, 5).join(', ');
    const description = m.size
      ? `${label}: API still running after ${max / 1000}s (${left})`
      : `${label}: APIs finished after ${(ms / 1000).toFixed(1)}s (threshold ${limit / 1000}s)`;
    try { test.info().annotations.push({ type: 'perf', description }); } catch { /* outside a test */ }
  }
}
