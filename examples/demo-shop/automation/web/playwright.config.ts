import { defineConfig, devices } from '@playwright/test';
import { env } from './common/env';

/**
 * Reports (common/qc-reporter.ts), every name = [test case / suite]_[dd-mm-yyyy_HH-mm-ss]_[ENV]:
 *   reports/Passed/<run>/  ·  reports/Failed/<TC ID>_<TC name>_<date>_<ENV>/  ·  reports/Runs/<run>/ (SUMMARY.md + Playwright html, json, junit)
 *   reports/HISTORY.md  ·  reports/PERFORMANCE.md
 * RUN_ID is set once in the main process; workers inherit it through the environment.
 */
function suiteName(): string {
  const args = process.argv.slice(2);
  // Run name = files / folders / filters passed on the command line (tests/shop/checkout.spec.ts → checkout).
  const withValue = new Set(['-g', '--grep', '--grep-invert', '--project', '-c', '--config', '-j', '--workers', '--retries', '--repeat-each', '--timeout', '--reporter', '--shard']);
  const specs = args.filter((a, i) => a !== 'test' && !a.startsWith('-') && !withValue.has(args[i - 1]))
    .map((a) => a.replace(/\/+$/, '').split('/').pop()!.replace(/\.spec\.ts$/, '')).filter(Boolean);
  if (specs.length) return specs.join('+');
  const grep = args[args.findIndex((a) => a === '-g' || a === '--grep') + 1];
  if (args.some((a) => a === '-g' || a === '--grep') && grep) return grep.replace(/[^\w-]+/g, '_').slice(0, 40);
  const project = args.find((a) => a.startsWith('--project='))?.split('=')[1]
    ?? (args.includes('--project') ? args[args.indexOf('--project') + 1] : undefined);
  return project ?? 'all';
}
if (!process.env.RUN_ID) {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  const stamp = `${p(d.getDate())}-${p(d.getMonth() + 1)}-${d.getFullYear()}_${p(d.getHours())}-${p(d.getMinutes())}-${p(d.getSeconds())}`;
  process.env.RUN_STAMP = stamp;
  process.env.RUN_ID = `${suiteName()}_${stamp}_${env.name}`;
}
// --list never writes into Runs/ (no empty folders).
const LIST_ONLY = process.argv.includes('--list');
const runDir = LIST_ONLY ? `reports/_tmp_chk/${process.env.RUN_ID}` : `reports/Runs/${process.env.RUN_ID}`;
const channel = process.env.BROWSER_CHANNEL && process.env.BROWSER_CHANNEL !== 'chromium' ? process.env.BROWSER_CHANNEL : undefined;

export default defineConfig({
  testDir: '.',
  outputDir: `${runDir}/artifacts`,
  timeout: env.testTimeoutMs,
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: 0,
  forbidOnly: true,
  reporter: [
    ['list'],
    ['html', { outputFolder: `${runDir}/html`, open: 'never' }],
    ['json', { outputFile: `${runDir}/results.json` }],
    ['junit', { outputFile: `${runDir}/junit.xml` }],
    ['./common/qc-reporter.ts', { reportsRoot: 'reports', runDir, stamp: process.env.RUN_STAMP, envName: env.name, baseUrl: env.baseUrl }],
  ],
  use: {
    channel,
    baseURL: env.baseUrl,
    httpCredentials: env.httpCredentials,
    locale: env.locale,
    timezoneId: env.timezoneId,
    actionTimeout: env.actionTimeoutMs,
    navigationTimeout: env.navigationTimeoutMs,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      // Generated from LOCKED test cases: independent tests, one new browser context each.
      name: 'shop',
      testMatch: /tests\/shop\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], channel },
    },
    {
      // npm run recon: walk the screens without saving data, write aria snapshots → reports/_tmp_chk/recon/ (temporary, overwritten).
      name: 'recon',
      testMatch: /tests\/tools\/recon\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], channel },
    },
  ],
});
