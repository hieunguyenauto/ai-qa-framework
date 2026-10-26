#!/usr/bin/env node
/**
 * Generate tests/shop/<scope-key>.spec.ts from LOCKED test cases: examples/demo-shop/qc/test-cases/<scope-key>-test-cases.md
 * 1 TC (Automation Eligibility UI-AUTO / BOTH) = 1 test(), 1 TC step = 1 test.step() with the original step text,
 * each action of the step (split on ' → ') = code from scripts/step-patterns.mjs. The Expected Result is the last step.
 * TC Function names a BUG-NNN that is Open in bug-history.md → test.fail(true, …) (R44).
 * Messages in Expected must exist in spec/messages.md (CLAUDE.md › Automation).
 *
 * Run:   node scripts/gen-specs.mjs            (regenerate everything — after a TC revision)
 *        node scripts/gen-specs.mjs --check    (write nothing: exit 1 if a spec differs from its TC — use before regenerating, R42)
 * Generated specs are never edited by hand.
 */
import fs from 'fs';
import path from 'path';
import { ACTIONS, EXPECTS, USERS } from './step-patterns.mjs';

const WEB = path.resolve(import.meta.dirname, '..');
const PROJECT = path.resolve(WEB, '../..');
const TC_DIR = path.join(PROJECT, 'qc/test-cases');
const OUT_DIR = path.join(WEB, 'tests/shop');
const rel = (p) => path.relative(PROJECT, p).split(path.sep).join('/');

// ---------- inputs ----------
/** Cells of a Markdown table row (cells never contain '|'; empty cells are kept). */
function cells(line) { return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((x) => x.trim()); }

function loadTcFile(file) {
  const text = fs.readFileSync(file, 'utf8');
  const st = text.match(/State: (\w+) · Revision: (\d+)/);
  if (st?.[1] !== 'LOCKED') throw new Error(`${rel(file)}: State ≠ LOCKED — automation only uses LOCKED test cases`);
  const title = text.match(/^# Test case — (.*)$/m)?.[1] ?? path.basename(file);
  const header = text.split('\n').find((l) => l.startsWith('| TC ID |'));
  if (!header) throw new Error(`${rel(file)}: TC table header not found`);
  const cols = cells(header);
  const at = (name) => { const i = cols.indexOf(name); if (i < 0) throw new Error(`${rel(file)}: column '${name}' missing`); return i; };
  const idx = { id: at('TC ID'), func: at('Function'), steps: at('Steps'), exp: at('Expected Results'), role: at('Role'), elig: at('Automation Eligibility') };
  const rows = text.split('\n').filter((l) => /^\| [A-Z][A-Z0-9]*-TC-\d+ \|/.test(l)).map((l) => {
    const c = cells(l);
    if (c.length !== cols.length) throw new Error(`${rel(file)}: ${c[0]} has ${c.length} cells, header has ${cols.length}`);
    return { id: c[idx.id], func: c[idx.func], steps: c[idx.steps].split('<br>'), exp: c[idx.exp], role: c[idx.role], elig: c[idx.elig] };
  });
  return { file, scope: path.basename(file).replace(/-test-cases\.md$/, ''), rev: Number(st[2]), title, rows };
}

function loadBugs() {
  const file = path.join(PROJECT, 'bug-history.md');
  if (!fs.existsSync(file)) return {};
  const bugs = {};
  for (const l of fs.readFileSync(file, 'utf8').split('\n').filter((x) => /^\| BUG-\d+ \|/.test(x))) {
    const c = cells(l);
    bugs[c[0]] = { description: c[3], status: c[c.length - 1] };
  }
  return bugs;
}

function loadMessages() {
  const file = path.join(PROJECT, 'spec/messages.md');
  return fs.readFileSync(file, 'utf8').split('\n').filter((l) => /^\| M\d+ \|/.test(l)).map((l) => {
    const text = cells(l).at(-1);
    const re = new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/<[a-z]+>/g, '.+')}$`);
    return { id: cells(l)[0], re };
  });
}

// ---------- code ----------
/** TypeScript string literal: single quotes; text with ' and no " → double quotes for readability. */
const q = (s) => {
  const v = String(s).replace(/\\/g, '\\\\');
  return v.includes("'") && !v.includes('"') ? `"${v}"` : `'${v.replace(/'/g, "\\'")}'`;
};

function compile(text, table, ctx, where) {
  for (const [re, fn, opts] of table) {
    const m = text.match(re);
    if (!m) continue;
    if (opts?.message) {
      const hit = ctx.messages.find((x) => x.re.test(m[opts.message]));
      if (!hit) throw new Error(`${where}: message '${m[opts.message]}' is not in spec/messages.md — ask QC, do not guess`);
    }
    return fn(m, ctx);
  }
  throw new Error(`${where}: no pattern for "${text}" — add one to scripts/step-patterns.mjs (do not edit the TC)`);
}

function generate(tcs, bugs, messages) {
  const auto = tcs.rows.filter((r) => /^(UI-AUTO|BOTH)$/.test(r.elig));
  const skipped = tcs.rows.filter((r) => !auto.includes(r)).map((r) => `${r.id} (${r.elig})`);
  const imports = new Set();
  const body = [];
  for (const r of auto) {
    const ctx = {
      q, messages, screen: undefined,
      role: (id) => { const k = USERS[id]; if (!k) throw new Error(`${r.id}: unknown user '${id}' — add it to USERS in step-patterns.mjs`); return k; },
      use: (name) => { imports.add(name); return name; },
    };
    const roles = r.role.split(',').map((s) => ctx.role(s.trim()));
    const tags = [`@${r.id}`, ...roles.map((x) => `@role-${x}`)].map(q).join(', ');
    body.push('', `test(${q(`${r.id} ${r.func}`)}, { tag: [${tags}] }, async ({ page, shop }) => {`);
    const bugIds = r.func.match(/BUG-\d+/g) ?? [];
    for (const id of bugIds) {
      const bug = bugs[id];
      if (!bug) throw new Error(`${r.id}: ${id} is not in bug-history.md`);
      if (bug.status === 'Open') body.push(`  test.fail(true, ${q(`${id} (bug-history.md, Open): ${bug.description}`)});`);
    }
    for (const step of r.steps) {
      const lines = step.replace(/^\d+\.\s*/, '').split(' → ').flatMap((a) => compile(a.trim(), ACTIONS, ctx, `${r.id} "${step}"`));
      body.push(`  await test.step(${q(step)}, async () => {`, ...lines.map((l) => `    ${l}`), '  });');
    }
    const exp = compile(r.exp, EXPECTS, ctx, `${r.id} Expected`);
    body.push(`  await test.step(${q(`Expected: ${r.exp}`)}, async () => {`, ...exp.map((l) => `    ${l}`), '  });', '});');
  }
  const sessionImport = imports.size ? [`import { ${[...imports].sort().join(', ')} } from '../../common/session';`] : [];
  return [
    '/**',
    ` * ${tcs.title} — TC: ${rel(tcs.file)} (LOCKED rev ${tcs.rev}, ${auto.length} of ${tcs.rows.length} TC automated).`,
    ' * GENERATED by scripts/gen-specs.mjs — do not edit. TC changed → npm run gen; new kind of step → scripts/step-patterns.mjs (R42).',
    ' * 1 test() = 1 TC, 1 test.step() = 1 TC step (original text). Each test starts from a new browser context (empty cart).',
    ` * Not automated: ${skipped.length ? skipped.join(', ') : '-'}.`,
    ` * Run: npm test -- tests/shop/${tcs.scope}.spec.ts · one TC: npm test -- --grep @${tcs.rows[0]?.id ?? '<TC ID>'}`,
    ' */',
    "import { expect, test } from '../../common/fixtures';",
    "import { assertTcRevision } from '../../common/tc';",
    ...sessionImport,
    '',
    `test.beforeAll(() => assertTcRevision(${q(rel(tcs.file))}, ${tcs.rev}));`,
    ...body,
    '',
  ].join('\n');
}

// ---------- main ----------
const check = process.argv.includes('--check');
const bugs = loadBugs();
const messages = loadMessages();
const files = fs.readdirSync(TC_DIR).filter((f) => f.endsWith('-test-cases.md')).map((f) => path.join(TC_DIR, f));
let drift = 0;
fs.mkdirSync(OUT_DIR, { recursive: true });
for (const f of files) {
  const tcs = loadTcFile(f);
  const out = path.join(OUT_DIR, `${tcs.scope}.spec.ts`);
  const code = generate(tcs, bugs, messages);
  const old = fs.existsSync(out) ? fs.readFileSync(out, 'utf8') : null;
  if (check) {
    const ok = old === code;
    if (!ok) drift++;
    console.log(`${ok ? '✔' : '✘'} ${path.relative(WEB, out)} ${ok ? 'matches' : 'differs from'} ${rel(f)} (rev ${tcs.rev})`);
  } else {
    fs.writeFileSync(out, code);
    console.log(`${old === code ? '=' : '✎'} ${path.relative(WEB, out)} ← ${rel(f)} (rev ${tcs.rev})`);
  }
}
if (check && drift) { console.error(`\n${drift} spec(s) out of date. Run: npm run gen — then review the git diff (R42).`); process.exit(1); }
