import fs from 'fs';
import { execFileSync } from 'child_process';
import path from 'path';
import type { FullResult, Reporter, Suite, TestCase, TestResult, TestStep } from '@playwright/test/reporter';

/**
 * Report for QA — every name follows [test case]_[dd-mm-yyyy_HH-mm-ss]_[ENV]:
 *
 * reports/
 *   Passed/<run>_<date time>_<ENV>/            ← 1 folder per run (not per TC)
 *       PASSED.md                   ← passed TCs + timestamps in the video
 *       video-full.webm             ← FULL video of the run (serial scenarios, common/scenario.ts)
 *   Failed/<TC ID>_<TC name>_<date time>_<ENV>/
 *       FAIL.md                     ← one field per row: TC, date, environment, account, failed step, error, URL…
 *       video-fail.webm / video.webm← clip of the failed TC (cut from the run video with ffmpeg, or Playwright's own video)
 *       screenshot.png · aria-snapshot.yml · error-context.md · trace.zip
 *   Runs/<suite>_<date time>_<ENV>/
 *       SUMMARY.md                  ← overview: links to Passed / Failed, known bugs, skipped TCs
 *       html/ · results.json · junit.xml · artifacts/   ← Playwright's own reports
 *   HISTORY.md                      ← one row per run
 *   PERFORMANCE.md                  ← slow APIs / pages to check later (never fails a TC)
 */
type Row = { test: TestCase; result: TestResult };

const pad = (n: number) => String(n).padStart(2, '0');
const dmy = (d: Date) => `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
const stampOf = (d: Date) => `${dmy(d)}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
const dmyhm = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
const secs = (ms: number) => `${(ms / 1000).toFixed(1)}s`;
const strip = (s: string) => s.replace(/\u001b\[[0-9;]*m/g, '');
const cell = (s: string) => s.replace(/\|/g, '\\|').replace(/\n+/g, ' ');
const slug = (s: string) =>
  s.normalize('NFKC').replace(/[\\/:*?"<>|#%{}^~[\]`'.,()（）「」]+/g, ' ').trim().replace(/\s+/g, '-').slice(0, 50) || 'test';

function tcId(test: TestCase): string {
  const fromTitle = test.title.match(/[A-Z][A-Z0-9]*-TC-\d+/)?.[0];
  const fromTag = test.tags.map((t) => t.replace(/^@/, '')).find((t) => /-TC-\d+$/.test(t));
  return fromTitle ?? fromTag ?? 'NO-ID';
}
function tcName(test: TestCase): string {
  return test.title.replace(/^[A-Z][A-Z0-9]*-TC-\d+\s*/, '').trim() || test.title;
}
function role(test: TestCase): string {
  return test.tags.filter((t) => t.startsWith('@role-')).map((t) => t.replace('@role-', '')).join(', ') || '-';
}
/** Deepest test.step with an error, with the path of its parent steps. */
function failedStep(steps: TestStep[], trail: string[] = []): string | undefined {
  for (const s of steps) {
    if (!s.error) continue;
    const here = s.category === 'test.step' ? [...trail, s.title] : trail;
    return failedStep(s.steps, here) ?? (here.length ? here.join(' › ') : undefined);
  }
  return undefined;
}
/** Environment warnings (annotation 'env-warning', e.g. an app error dialog the test closed) — merged, deduplicated. */
function warnOf(test: TestCase): string {
  return [...new Set(test.annotations.filter((a) => a.type === 'env-warning').map((a) => a.description ?? ''))].join(' · ');
}
/** Performance warnings (annotation 'perf') — stored to check later, never fail the TC. */
function perfOf(test: TestCase): string {
  return test.annotations.filter((a) => a.type === 'perf').map((a) => a.description ?? '').join(' · ');
}
/** Known bug (test.fail with a bug ID, R44). */
function bugOf(test: TestCase): string | undefined {
  return test.annotations.find((a) => a.type === 'fail')?.description;
}
function firstLine(msg: string): string {
  return strip(msg).split('\n').map((l) => l.trim()).find(Boolean) ?? '';
}
function grab(msg: string, label: string): string | undefined {
  return strip(msg).match(new RegExp(`^\\s*${label}:\\s*(.+)$`, 'm'))?.[1]?.trim();
}

/** Mask password fields in snapshots: 'textbox "Password" [ref=e27]: xxx' → '…: ***'. */
export const maskSecrets = (text: string) =>
  text.replace(/(textbox "[^"]*(?:パスワード|[Pp]assword)[^"]*"(?: \[[^\]]*\])*): .+/g, '$1: ***');

export default class QcReporter implements Reporter {
  private rows: Row[] = [];
  private start = new Date();
  constructor(private opts: { reportsRoot: string; runDir: string; stamp?: string; envName?: string; baseUrl?: string }) {}

  onBegin(_config: unknown, _suite: Suite) {
    this.start = new Date();
  }
  onTestEnd(test: TestCase, result: TestResult) {
    // Only the last retry counts.
    this.rows = this.rows.filter((r) => r.test.id !== test.id);
    this.rows.push({ test, result });
  }

  async onEnd(full: FullResult) {
    // --list / nothing ran → no report, no HISTORY row.
    if (!this.rows.length) return;
    const root = path.resolve(this.opts.reportsRoot);
    const out = path.resolve(this.opts.runDir);
    fs.mkdirSync(out, { recursive: true });
    for (const d of ['Passed', 'Failed']) fs.mkdirSync(path.join(root, d), { recursive: true });
    // A known bug that fails as expected (test.fail) is "expected", not a pass and not a failure.
    const known = this.rows.filter((r) => r.test.expectedStatus === 'failed' && r.result.status === 'failed');
    const passed = this.rows.filter((r) => r.result.status === 'passed' && r.test.expectedStatus === 'passed');
    const failed = this.rows.filter((r) => !known.includes(r) && !passed.includes(r) && r.result.status !== 'skipped');
    const skipped = this.rows.filter((r) => r.result.status === 'skipped');
    const env = this.opts.envName ?? process.env.ENV ?? '-';
    const stamp = this.opts.stamp ?? stampOf(this.start);
    const nameOf = (t: TestCase) => `${tcId(t)}_${slug(tcName(t))}_${stamp}_${env}`;
    const rel = (p: string) => path.relative(out, p).split(path.sep).join('/');
    // Video of a serial scenario: reports/Runs/<run>/video/*.webm + start.txt (time 00:00).
    const videoDir = path.join(out, 'video');
    let video = fs.existsSync(videoDir) ? fs.readdirSync(videoDir).find((f) => f.endsWith('.webm')) : undefined;
    if (video && video !== `${path.basename(out)}.webm`) {
      try { fs.renameSync(path.join(videoDir, video), path.join(videoDir, `${path.basename(out)}.webm`)); video = `${path.basename(out)}.webm`; } catch { /* keep the old name */ }
    }
    const videoStart = video && fs.existsSync(path.join(videoDir, 'start.txt')) ? Number(fs.readFileSync(path.join(videoDir, 'start.txt'), 'utf8')) : undefined;
    const at = (d: Date) => {
      if (!videoStart) return '';
      const s = Math.max(0, Math.round((d.getTime() - videoStart) / 1000));
      return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
    };
    /** Cut [from, to] (ms from the start of the video) into a separate file. Needs ffmpeg on PATH or FFMPEG_PATH. */
    const ffmpeg = process.env.FFMPEG_PATH || 'ffmpeg';
    let ffmpegMissing = false;
    const clip = (fromMs: number, toMs: number, target: string): boolean => {
      if (!video || ffmpegMissing) return false;
      const src = path.join(videoDir, video);
      const ss = Math.max(0, fromMs / 1000).toFixed(1);
      const t = Math.max(1, (toMs - fromMs) / 1000).toFixed(1);
      const tries = [
        ['-y', '-ss', ss, '-i', src, '-t', t, '-an', '-c:v', 'libvpx', '-b:v', '1M', '-deadline', 'realtime', '-cpu-used', '8', target],
        ['-y', '-ss', ss, '-i', src, '-t', t, '-c', 'copy', target],
      ];
      for (const args of tries) {
        try { execFileSync(ffmpeg, args, { stdio: 'ignore', timeout: 120_000 }); if (fs.existsSync(target) && fs.statSync(target).size > 0) return true; }
        catch (e) { if ((e as NodeJS.ErrnoException).code === 'ENOENT') { ffmpegMissing = true; return false; } }
      }
      return false;
    };
    const when = dmyhm(this.start);
    const passDir = path.join(root, 'Passed', path.basename(out));
    const finalVideo = video ? (passed.length ? path.join(passDir, 'video-full.webm') : path.join(videoDir, video)) : undefined;
    const linkVideo = (from: string) => (finalVideo ? path.relative(from, finalVideo).split(path.sep).join('/') : '');
    const sortById = (a: Row, b: Row) => tcId(a.test).localeCompare(tcId(b.test), 'en', { numeric: true });

    // ---------- Failed/ ----------
    const failLinks: string[] = [];
    for (const { test, result } of failed.sort(sortById)) {
      const dir = path.join(root, 'Failed', nameOf(test));
      fs.mkdirSync(dir, { recursive: true });
      const files: string[] = [];
      let n = 0;
      for (const a of result.attachments) {
        const ext = a.contentType.includes('png') ? '.png' : a.contentType.includes('yaml') ? '.yml'
          : a.contentType.includes('zip') ? '.zip' : a.contentType.includes('markdown') ? '.md'
          : a.contentType.includes('webm') ? '.webm' : path.extname(a.path ?? '') || '.txt';
        const base = ['screenshot', 'aria-snapshot', 'trace', 'error-context', 'video'].includes(a.name) ? a.name : slug(a.name);
        let target = path.join(dir, base + ext);
        if (fs.existsSync(target)) target = path.join(dir, `${base}-${++n}${ext}`);
        try {
          if (/\.(yml|md|txt)$/.test(target)) {
            // Page snapshots (aria / error-context) contain field values → mask passwords before writing to reports/.
            const text = a.path && fs.existsSync(a.path) ? fs.readFileSync(a.path, 'utf8') : a.body?.toString();
            if (text == null) continue;
            fs.writeFileSync(target, maskSecrets(text));
          } else if (a.path && fs.existsSync(a.path)) fs.copyFileSync(a.path, target);
          else if (a.body) fs.writeFileSync(target, a.body);
          else continue;
          files.push(path.basename(target));
        } catch { /* skip broken attachments */ }
      }
      // Clip of the failed TC: 3s before it started → 3s after it failed.
      let failClip = false;
      if (video && videoStart) {
        const from = result.startTime.getTime() - videoStart - 3000;
        const to = result.startTime.getTime() + result.duration - videoStart + 3000;
        failClip = clip(from, to, path.join(dir, 'video-fail.webm'));
        if (failClip) files.push('video-fail.webm');
      }
      const err = result.errors[0];
      const msg = err?.message ?? err?.value ?? '';
      const loc = err?.location ? `${path.relative(process.cwd(), err.location.file)}:${err.location.line}` : '-';
      const data = test.annotations.find((a) => a.type === 'data')?.description;
      const url = result.attachments.find((a) => a.name === 'url')?.body?.toString();
      const fields: [string, string][] = [
        ['Test case', `${tcId(test)} — ${tcName(test)}`],
        ['Run at', dmyhm(result.startTime)],
        ['Environment', `${env}${this.opts.baseUrl ? ` (${this.opts.baseUrl})` : ''}`],
        ['Account / role', role(test)],
        ['Result', test.expectedStatus === 'failed' ? 'PASSED UNEXPECTEDLY (known bug fixed? update bug-history.md and regenerate)' : result.status === 'timedOut' ? 'FAILED (timeout)' : 'FAILED'],
        ['Known bug', bugOf(test) ?? '-'],
        ['Duration', secs(result.duration)],
        ['Failed step', failedStep(result.steps) ?? '-'],
        ['Error', firstLine(msg) || '-'],
        ['Locator', grab(msg, 'Locator') ?? '-'],
        ['Expected', grab(msg, 'Expected(?: substring| string| value| pattern)?') ?? '-'],
        ['Received', grab(msg, 'Received(?: string| value)?') ?? '-'],
        ['Code location', loc],
        ['URL at failure', url ?? '-'],
        ['Test data', data ?? '-'],
        ['Environment warnings', warnOf(test) || '-'],
        ['Performance', perfOf(test) || '-'],
        ['Failure clip', failClip ? 'video-fail.webm (3s before the TC started → 3s after it failed)' : files.includes('video.webm') ? 'video.webm' : video ? (ffmpegMissing ? '- (ffmpeg not installed — see the run video below)' : '- (could not cut — see the run video)') : '-'],
        ['Run video', video ? `${linkVideo(dir)} — seek to ${at(result.startTime)} (TC start) → ${at(new Date(result.startTime.getTime() + result.duration))} (failure)` : '-'],
        ['Trace (step by step)', files.includes('trace.zip') ? 'trace.zip — open: npx playwright show-trace trace.zip (or drop it on https://trace.playwright.dev)' : '-'],
        ['Attachments', files.length ? files.join(', ') : '-'],
        ['Spec file', `${path.relative(process.cwd(), test.location.file)}:${test.location.line}`],
      ];
      const md = [
        `# FAIL · ${tcId(test)} · ${dmyhm(result.startTime)} · ${env}`,
        '',
        '| Field | Value |',
        '|---|---|',
        ...fields.map(([k, v]) => `| ${k} | ${cell(v)} |`),
        '',
        '## Full error',
        '```',
        strip(msg).trim() || '(none)',
        '```',
        '',
        files.includes('trace.zip') ? 'Trace: `npx playwright show-trace "' + path.join(dir, 'trace.zip') + '"`' : '',
        '',
      ].join('\n');
      fs.writeFileSync(path.join(dir, 'FAIL.md'), md);
      failLinks.push(`| ${tcId(test)} | ${cell(tcName(test))} | ${cell(failedStep(result.steps) ?? '-')} | ${cell(firstLine(msg).slice(0, 120))} | [FAIL.md](${rel(path.join(dir, 'FAIL.md'))}) |`);
    }

    // ---------- Passed/<run>/ (1 folder, not per TC) ----------
    let passedMd = '';
    if (passed.length) {
      fs.mkdirSync(passDir, { recursive: true });
      if (video) {
        try { fs.renameSync(path.join(videoDir, video), path.join(passDir, 'video-full.webm')); fs.rmSync(videoDir, { recursive: true, force: true }); }
        catch { try { fs.copyFileSync(path.join(videoDir, video), path.join(passDir, 'video-full.webm')); } catch { /* ignore */ } }
      }
      passedMd = path.join(passDir, 'PASSED.md');
      fs.writeFileSync(passedMd, [
        `# PASSED · ${path.basename(out)}`, '',
        `Run at ${when} · environment ${env}${this.opts.baseUrl ? ` (${this.opts.baseUrl})` : ''} · Passed ${passed.length} / ${this.rows.length}`, '',
        video ? 'Full video: [video-full.webm](video-full.webm) — column "Video" gives the mm:ss of each TC.' : 'Video: - (only for serial scenarios, common/scenario.ts)', '',
        '| TC ID | Test case | Account / role | Duration | Video | Note |', '|---|---|---|---|---|---|',
        ...passed.sort(sortById).map(({ test, result }) => `| ${tcId(test)} | ${cell(tcName(test))} | ${role(test)} | ${secs(result.duration)} | ${video ? `${at(result.startTime)} → ${at(new Date(result.startTime.getTime() + result.duration))}` : '-'} | ${cell([perfOf(test), warnOf(test)].filter(Boolean).join(' · ')) || '-'} |`),
        '', `Full report: reports/Runs/${path.basename(out)}/SUMMARY.md`, '',
      ].join('\n'));
    }
    const passLinks = passed.sort(sortById).map(({ test, result }) =>
      `| ${tcId(test)} | ${cell(tcName(test))} | ${role(test)} | ${secs(result.duration)} | ${video ? at(result.startTime) : '-'} |`);
    const knownLinks = known.sort(sortById).map(({ test, result }) =>
      `| ${tcId(test)} | ${cell(tcName(test))} | ${cell(bugOf(test) ?? '-')} | ${cell(firstLine(result.errors[0]?.message ?? '').slice(0, 100))} |`);
    // ---------- Skipped: no own folder, listed in SUMMARY ----------
    const skipLinks = skipped.sort(sortById).map(({ test }) => {
      const why = test.annotations.find((a) => a.type === 'skip')?.description ?? 'Not run (an earlier TC of a serial scenario failed, or a pre-condition is missing)';
      return `| ${tcId(test)} | ${cell(tcName(test))} | ${cell(why)} |`;
    });
    // ---------- SUMMARY.md ----------
    const total = this.rows.length;
    const warnLinks = this.rows.filter(({ test }) => warnOf(test)).sort(sortById)
      .map(({ test }) => `| ${tcId(test)} | ${cell(tcName(test))} | ${cell(warnOf(test))} |`);
    const perfRows = this.rows.filter(({ test }) => perfOf(test)).sort(sortById);
    const perfLinks = perfRows.map(({ test }) => `| ${tcId(test)} | ${cell(tcName(test))} | ${cell(perfOf(test))} |`);
    if (perfRows.length) {
      const pf = path.join(root, 'PERFORMANCE.md');
      if (!fs.existsSync(pf)) fs.writeFileSync(pf, '# Performance to check (stored, never fails a TC)\n\n| Date | Environment | TC ID | Detail | Run |\n|---|---|---|---|---|\n');
      fs.appendFileSync(pf, perfRows.map(({ test }) => `| ${when} | ${env} | ${tcId(test)} | ${cell(perfOf(test))} | ${path.basename(out)} |`).join('\n') + '\n');
    }
    fs.writeFileSync(path.join(out, 'SUMMARY.md'), [
      `# ${path.basename(out)}`, '',
      `Run at ${when} · environment ${env}${this.opts.baseUrl ? ` (${this.opts.baseUrl})` : ''}`, '',
      '| Total | Pass | Fail | Known bug | Skip | Duration | Status |', '|---|---|---|---|---|---|---|',
      `| ${total} | ${passed.length} | ${failed.length} | ${known.length} | ${skipped.length} | ${secs(full.duration)} | ${full.status.toUpperCase()} |`, '',
      ...(warnLinks.length ? ['## Environment warnings (app showed an error dialog that the test closed — report to dev / watch)', '', '| TC ID | Test case | Warning |', '|---|---|---|', ...warnLinks, ''] : []),
      ...(perfLinks.length ? ['## Performance (stored to check later — never fails a TC; log: reports/PERFORMANCE.md)', '', '| TC ID | Test case | Detail |', '|---|---|---|', ...perfLinks, ''] : []),
      '## Failed', '', ...(failLinks.length ? ['| TC ID | Test case | Failed step | Error | Detail |', '|---|---|---|---|---|', ...failLinks] : ['None.']), '',
      '## Known bugs (failed as expected, bug-history.md)', '', ...(knownLinks.length ? ['| TC ID | Test case | Bug | Error |', '|---|---|---|---|', ...knownLinks] : ['None.']), '',
      '## Passed', '', ...(passLinks.length ? [`Details: [PASSED.md](${rel(passedMd)})`, '', '| TC ID | Test case | Account / role | Duration | Video |', '|---|---|---|---|---|', ...passLinks] : ['None.']), '',
      '## Skipped', '', ...(skipLinks.length ? ['| TC ID | Test case | Reason |', '|---|---|---|', ...skipLinks] : ['None.']), '',
      finalVideo ? `Run video: [${linkVideo(out)}](${linkVideo(out)}) — per-TC timestamps in PASSED.md / FAIL.md; failed TCs also get video-fail.webm.${ffmpegMissing ? ' (Install ffmpeg to cut failure clips.)' : ''}\n` : '',
      "Playwright's own report: `npm run report` (folder `html/` next to this file) — click a failed TC to see its trace / screenshot.", '',
    ].join('\n'));

    // ---------- reports/HISTORY.md ----------
    const hist = path.join(root, 'HISTORY.md');
    if (!fs.existsSync(hist)) fs.writeFileSync(hist, '# Run history\n\n| Date | Environment | Total | Pass | Fail | Known bug | Skip | Run (reports/Runs/) |\n|---|---|---|---|---|---|---|---|\n');
    fs.appendFileSync(hist, `| ${when} | ${env} | ${total} | ${passed.length} | ${failed.length} | ${known.length} | ${skipped.length} | ${path.basename(out)} |\n`);

    console.log(`\n[QC report] Pass ${passed.length} · Fail ${failed.length} · Known bug ${known.length} · Skip ${skipped.length}\n  → ${path.relative(process.cwd(), path.join(out, 'SUMMARY.md'))}`);
  }

  printsToStdio() {
    return false;
  }
}
