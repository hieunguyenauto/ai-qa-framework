import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env'), quiet: true } as dotenv.DotenvConfigOptions);

export type Account = { loginId: string; displayName?: string; note?: string };

export type EnvConfig = {
  name: string;
  baseUrl: string;
  locale: string;
  timezoneId: string;
  actionTimeoutMs: number;
  navigationTimeoutMs: number;
  testTimeoutMs: number;
  /** Performance threshold when waiting for real API responses (common/wait.ts waitApiPerf; default 30s). Slower → PERFORMANCE warning, no failure. */
  apiPerfLimitMs: number;
  /** Max time to wait for an API (default 120s); longer → PERFORMANCE warning, then continue. */
  apiMaxWaitMs: number;
  /** Basic Auth of the environment (browser login dialog). Password: .env HTTP_AUTH_PASSWORD. */
  httpAuth?: { username: string };
  /** Computed from httpAuth + .env and passed to Playwright (undefined = no Basic Auth). */
  httpCredentials?: { username: string; password: string };
  /** Test accounts by role (no passwords). Passwords: .env SHOP_<ROLE>_PASSWORD or SHOP_PASSWORD. */
  accounts: Record<string, Account>;
};

function loadEnv(): EnvConfig {
  const list = fs.readdirSync(path.resolve(__dirname, '../env')).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, ''));
  const envName = process.env.ENV;
  // The environment must be chosen explicitly: no default, so a run never hits the wrong environment by accident.
  if (!envName) throw new Error(`No environment selected. Set ENV=<name> in .env or before the command, e.g. ENV=demo npm test. Available: ${list.join(', ')}`);
  const file = path.resolve(__dirname, `../env/${envName}.json`);
  if (!fs.existsSync(file)) throw new Error(`env/${envName}.json not found. Available: ${list.join(', ')} — or create a new file in env/.`);
  const cfg = JSON.parse(fs.readFileSync(file, 'utf-8')) as EnvConfig;
  if (process.env.BASE_URL) cfg.baseUrl = process.env.BASE_URL;
  cfg.apiPerfLimitMs ??= 30_000;
  cfg.apiMaxWaitMs ??= 120_000;
  if (cfg.httpAuth) {
    const username = (process.env.HTTP_AUTH_USER || cfg.httpAuth.username || '').trim();
    const password = (process.env.HTTP_AUTH_PASSWORD || '').trim();
    if (!password) throw new Error(`env/${envName}.json uses Basic Auth → HTTP_AUTH_PASSWORD is required in .env`);
    cfg.httpCredentials = { username, password };
  }
  return cfg;
}

export const env = loadEnv();
