# AI QA Framework — Rules for the AI

## Context
- Built for Japanese-market products: the UI is in Japanese, the team works in English (or the team's own language).
- Viewpoints and test cases are written in ENGLISH. UI labels / messages keep their original text inside '' (never translate them).
- Active project: demo-shop → <P> = examples/demo-shop. Project profile: <P>/README.md, source priority: <P>/sources.md.
- Questions about the project (roles, screens, terms, flows, bugs…): read / grep in <P>/ (README.md, glossary.md, screens/_flow.md, screens/catalog/, bug-history.md, spec/) and answer with the source — no need to ask first. Say "I don't know" only after searching <P>/.

## Reading order when designing tests (mandatory)
0. Spec is xlsx / pdf / docx → skill source-import (original in <P>/raw/, Markdown in <P>/spec/)
1. Spec: <P>/spec/<scope-key>.md (the exact path the user gives)
2. Knowledge: <P>/README.md, <P>/sources.md, <P>/glossary.md, <P>/screens/_flow.md + related screens, LOCKED files in <P>/qc/ for the related function
3. Lessons: qc/lessons/INDEX.md (Test design section), <P>/bug-history.md (only rows with the same function / pattern)
4. Q&A: skill spec-review → Gap Report + Context pack + Open Questions. No OPEN OQ left + user confirms → [Done] → kb-update writes the knowledge into <P>/
5. Viewpoints: skill test-viewpoint (Context pack first, then knowledge + lessons of that function / screen)
6. Test cases: skill test-case (LOCKED viewpoints + Context pack + knowledge + lessons of that function)
   Every message in '' in Expected Results must be looked up in <P>/spec/messages.md (exact text or ID); missing / different → write [to confirm], never guess.
Reading / writing Excel: qc/lessons/INDEX.md section Excel / tools.

## Automation (separate flow: Spec → Test case → Automation)
- Only input: LOCKED test cases in <P>/qc/test-cases/ with Automation Eligibility UI-AUTO / BOTH. Do not read the spec, Gap Report, viewpoints, qc/lessons or bug-history (exception: the generator reads bug-history.md only to mark known bugs).
- Also read: automation/lessons/INDEX.md, <P>/automation/README.md, <P>/automation/web/README.md (TC → code conventions), <P>/automation/web/screens/ for the related screens; screen descriptions live in <P>/screens/catalog/.
- TC missing / contradicting the app → stop and tell the user; never edit the TC, never change an expect to match the app.
- Automation knowledge is updated with skill kb-update-automation (not kb-update).
- Login in tests: ONLY through <P>/automation/web/common/session.ts (loginAs(page, 'standard'), logout). Never write a login helper, never put login IDs / passwords in a spec. Accounts: env/<ENV>.json › accounts + .env.
- Messages used in expects must match <P>/spec/messages.md; not in the file → note the source (LOCKED TC / real app) and tell the user.
- New / never-run screen: MUST inspect the real screen before writing locators (R01) — `npm run recon` or the browser. Recon output goes only to the temporary folder reports/_tmp_chk/recon/ (overwritten each run); what must be kept goes to screens/ (locators) and automation/lessons/ (lessons). Cite the source as 'recon <date>, <env>', never a reports/ path.
- Generated specs are edited ONLY through the generator (scripts/gen-specs.mjs + scripts/step-patterns.mjs). After regenerating, review the git diff (R42).
- Writing / fixing test code: read automation/lessons/INDEX.md FIRST; locators live only in screens/. After fixing a failing test → always propose a lesson (draft: type, root cause, rule) for the user to approve, then write it to automation/lessons/ + INDEX; failures caused by a wrong TC → QC lesson (qc/lessons).

## Skills in this repo
- Test design: source-import, spec-review, test-viewpoint, test-case, export-excel (only when the user agrees); knowledge changes: kb-update.
- Each step (Gap Report, viewpoints, test cases) is: draft → user review → LOCKED. Never skip the review.

## Saving tokens
- During QC tasks do NOT read manager/ (GUIDE.md, handbook.md, decisions.md, CHANGELOG.md). Read them only when the user asks about decisions / history / guides.
- Read only the relevant part of a file (grep by function / ID), never a whole folder.

## General QC rules
- These rules apply only to QC tasks (viewpoint / test case design, automation). Other questions, lookups and repo changes requested by the user: work normally.
- When designing tests: the only input is the spec whose exact path the user gives. Missing → stop and return BLOCKED_INPUT. (Does NOT apply to lookup questions.)
- Never invent requirements. Unclear spec → write an Open Question in <P>/qc/open-questions.md.
- Draft in chat first, wait for approval of both content and path before writing files. Silence is not approval.
- Never edit a file with State = LOCKED. A change needs a new Revision and a new review.
- IDs: OQ-<CODE>-NNN · viewpoint <PREFIX>-NN · test case <PREFIX>-TC-NNN (PREFIX = sheet prefix; project conventions in <P>/README.md).
- Conflicting sources → follow the priority in <P>/sources.md; the permission matrix of the authoritative source overrides anything inferred from the UI.
- One sheet / function per task, exactly as requested; never widen the scope. Create new viewpoints only when asked.
- Deliverables for reviewers: export a new file, never edit the original.
- Every file the AI writes to <P>/qc/test-viewpoints/, test-cases/, gap-reports/ starts with the header: Project · Scope Key · Sheet prefix / Source (path + rev) / State (DRAFT | LOCKED) · Revision / Approved by / at.

## Knowledge
- Every change to rules, skills, templates, lessons or process → skill kb-update (edit exactly 1 source file, log decision + CHANGELOG, run manager/scripts/build_guide.py).
- manager/GUIDE.md is generated. Never edit it by hand.
