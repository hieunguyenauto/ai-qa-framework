# AI QA Framework — Handbook

How a human works with this repository. The AI's rules are in CLAUDE.md and the skills; this file explains the why and the daily routine.

## Principles
- **The repo is the only source of knowledge.** Rules, skills, templates, lessons and project knowledge live in files; chat is never the source of truth.
- **One kind of knowledge = one source file** (map in .claude/skills/kb-update/SKILL.md). manager/GUIDE.md is generated from those files.
- **Every artifact is reviewed.** Gap Report, viewpoints and test cases go DRAFT → human review → LOCKED. A LOCKED file changes only through a new revision.
- **The AI never guesses.** No spec path → BLOCKED_INPUT. Unclear spec → Open Question. Message text → spec/messages.md or [to confirm].
- **Every fixed mistake becomes a lesson** that the AI reads before the next task (qc/lessons for design, automation/lessons for code).
- **Automation reads only LOCKED test cases.** Code is generated from them, so test cases and code cannot drift silently.

## Setup
1. Install [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) and open the repository folder.
2. Node.js 20+ and Python 3 (for build_guide.py).
3. Enable the commit hook once: `git config core.hooksPath .githooks` (checks GUIDE.md and runs the public-safety scan).
4. For the demo automation: see examples/demo-shop/automation/web/README.md.

## Adding a project
1. Create `examples/<project>/` (or any folder) with README.md (roles, OS, ID conventions, result columns), sources.md (source priority), glossary.md, bug-history.md, screens/_flow.md, screens/catalog/, spec/, raw/ (gitignored originals), qc/.
2. Point CLAUDE.md at it: `Active project: <name> → <P> = <folder>`.
3. Copy examples/demo-shop/automation/web as a starting point; replace env/, data/roles.ts, screens/ and scripts/step-patterns.mjs.

## Daily flow for one ticket
| Step | You say | The AI does | You do |
|---|---|---|---|
| 0 | "import spec <file>" | source-import: xlsx / pdf / docx → spec/<scope-key>.md, row reconciliation, list of lost content | Check the lost-content list |
| 1 | "/spec-review <P>/spec/<scope-key>.md" | Reads spec + knowledge + lessons, writes Gap Report, Findings, OQs, Design Gate, Context pack | Answer OQs, approve → LOCKED → "Done" |
| 2 | "/test-viewpoint <scope-key>" | Viewpoints by the 8 groups, each with an axis, traced to the spec | Review merges / axes → LOCKED |
| 3 | "/test-case <scope-key>" | One TC per axis value, 1 expected result each, Automation Eligibility, 3-source reconciliation, VP ↔ TC trace | Review → LOCKED; export Excel if needed |
| 4 | "generate specs for <scope-key> and run them" | `npm run gen`, recon for new screens, `npm test`, reads FAIL.md | Approve proposed lessons; route PRODUCT_BUG / wrong TC to QC |

## The lessons loop
1. A test fails or a reviewer finds a missed case.
2. The AI classifies it: LOCATOR / TIMING / DATA / ENV (automation) · DESIGN_GAP (QC) · PRODUCT_BUG (bug-history) · wrong TC (new TC revision).
3. The AI drafts the lesson (symptom, root cause, fix, rule) in chat; you approve.
4. The lesson file is written, the rule goes into the INDEX, decisions / CHANGELOG are updated, GUIDE.md is regenerated.
5. Next time the AI reads the INDEX before designing or coding, so the same mistake does not repeat.

## Known bugs in automation
A TC that fails because of a confirmed product bug keeps its expected result. The bug goes into bug-history.md with status Open, the TC Function names the bug ID, and the generator marks the test as an expected failure. Reports list it under "Known bugs"; when the bug is fixed the test passes unexpectedly and CI turns red, which is the signal to close the bug and regenerate.

## Reports
Each run writes reports/Runs/<run>/SUMMARY.md (totals, failed step per TC, known bugs), reports/Failed/<TC>/FAIL.md (one field per row, screenshot, video, trace), reports/HISTORY.md (trend) and reports/PERFORMANCE.md (slow APIs, never a failure). `npm run summary` prints the latest summary, `npm run report` opens Playwright's HTML report.

## Changing the rules
Say what should change ("from now on…", "add a rule…"). kb-update picks the one source file, drafts before / after, and after approval writes the file, a decision row, a CHANGELOG line and regenerates GUIDE.md. Release: "release" → version bump + dated CHANGELOG section.

## Publishing safely
Before pushing to a public remote run `bash scripts/check-before-push.sh`. It scans tracked files and history for `.env`, session files, videos, reports, token / password patterns and client words. Client words are kept in a local, gitignored `.client-words` file (one regex per line) so the list itself is never published.
