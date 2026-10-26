---
name: kb-update-automation
description: Update the AUTOMATION knowledge (locator / timing / data / env lessons, screen descriptions for automation, automation templates, test-code rules). Use when an automation failure has a known root cause, when a locator / Page Object changes, or when the user says "record automation lesson", "update automation knowledge", "/kb-update-automation".
---
# Principles
- Automation relies only on LOCKED test cases. Automation knowledge is separate from QC knowledge: this skill never edits the spec, Gap Report, viewpoints, test cases, qc/lessons, glossary or <P>/screens/ (business screens).

# Automation knowledge map — each kind has 1 source file
| Kind | Source file |
|---|---|
| Learned rules (shared) | automation/lessons/INDEX.md (Web R.., Mobile M..) |
| Detailed lesson | automation/lessons/<web\|mobile>/<YYYY-MM-DD>-<slug>.md per manager/templates/lesson.md |
| Automation templates | automation/templates/*.md |
| Screens for automation (screen ID, route, role, locators, actions) | <P>/automation/web/screens/<app>/<screen>.screen.ts per automation/templates/screen.md. Do NOT copy the screen description: it lives in <P>/screens/catalog/ |
| Environments, role ↔ account, test data | <P>/automation/web/env/*.json · data/roles.ts · data/<scope-key>.json (passwords only in .env) |
| Shared code (login, waits, asserts) | <P>/automation/web/common/ |
| Step → code patterns of the generator | <P>/automation/web/scripts/step-patterns.mjs |
| Notes on environments / data / test accounts (no passwords) | <P>/automation/README.md |
| Rules for writing test code | CLAUDE.md section Automation |

# Classifying a failure
| Lesson type | Who handles it | File |
|---|---|---|
| LOCATOR · TIMING · DATA | This skill | lesson + <P>/automation/web/screens/ or common/ |
| ENV | This skill (note only, no code change) | <P>/automation/README.md |
| PRODUCT_BUG | Do NOT change the test. Draft the bug → hand over to kb-update (QC) for <P>/bug-history.md; the generator then marks the TC as a known failure (test.fail + bug ID) | — |
| TC wrong / missing / contradicts the app | Do NOT edit the TC. Tell the user → QC fixes the TC (new revision) through test-case / kb-update | — |

# Process
1. Classify with the table above. Not automation → stop, point to the right skill.
2. Draft the change (before / after) in chat → wait for approval.
3. Edit the source file. Write a lesson for LOCATOR / TIMING / DATA.
4. The same lesson type happens 2+ times → propose 1 rule for automation/lessons/INDEX.md.
5. A change to automation rules / way of working → add 1 row to manager/decisions.md; always add 1 line to manager/CHANGELOG.md (tag [auto]).
6. Run python3 manager/scripts/build_guide.py. Report changed files + commit "[auto] <summary>".

# Forbidden
- Changing an expect to match the app when the TC says otherwise · editing files in <P>/qc/ · writing passwords / tokens into the repo · editing manager/GUIDE.md by hand.
