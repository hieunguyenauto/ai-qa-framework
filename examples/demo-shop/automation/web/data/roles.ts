import { env } from '../common/env';

/**
 * Role key ↔ label used in test names and the Excel result column.
 * The demo shop has no permission roles; each account has a built-in behaviour (examples/demo-shop/README.md › Roles).
 */
export const ROLES = {
  standard: { label: 'standard_user' },
  locked: { label: 'locked_out_user' },
  problem: { label: 'problem_user' },
  performance: { label: 'performance_glitch_user' },
  error: { label: 'error_user' },
  visual: { label: 'visual_user' },
} as const;

export type Role = keyof typeof ROLES;

/** Login ID from env/<ENV>.json › accounts, password from .env (SHOP_<ROLE>_PASSWORD, else SHOP_PASSWORD). Missing → undefined. */
export function credentials(role: Role): { loginId: string; password: string } | undefined {
  const loginId = env.accounts[role]?.loginId;
  const password = process.env[`SHOP_${role.toUpperCase()}_PASSWORD`] || process.env.SHOP_PASSWORD;
  return loginId && password ? { loginId, password } : undefined;
}
