---
name: kb-update
description: Update the QC + management knowledge of the repo (rules, skills, templates, test-design lessons, project knowledge, process); automation knowledge uses kb-update-automation. Also writes the paperwork (decision, CHANGELOG, GUIDE.md). Use when the user says "add a rule", "change the skill", "update the template", "record this lesson", "from now on…", "/kb-update".
---
# Knowledge map — each kind has exactly 1 source file
| Kind | Source file |
|---|---|
| General rules for the AI | CLAUDE.md |
| How each step works | .claude/skills/<skill>/SKILL.md (+ references/) |
| Output formats | qc/templates/*.md (design) · automation/templates/*.md (automation) · manager/templates/*.md (lesson) |
| Shared lessons | qc/lessons/design/*.md + qc/lessons/INDEX.md · automation/lessons/<web\|mobile>/*.md + automation/lessons/INDEX.md (a rule true for only one project → <P>/README.md section Project rules) |
| Project knowledge | <P>/: README.md, sources.md, glossary.md, bug-history.md, screens/, spec/, raw/ |
| Human guide (narrative) | manager/handbook.md |
| Why a decision was made | manager/decisions.md (1 row per decision) |
| Combined guide | manager/GUIDE.md — GENERATED, never edit by hand |

# Scope
- Do not edit automation knowledge (automation/, <P>/automation/, test-code rules) → use kb-update-automation.
- Hand-offs from kb-update-automation: PRODUCT_BUG → <P>/bug-history.md; wrong TC → propose a TC revision.

# Process
0. Common trigger: a Gap Report moves to [Done] (spec-review step 10) → only edit knowledge in <P>/, no decision / handbook needed.
1. Decide which kind the change is → pick the right source file. Never copy skill / template content into another file.
2. Draft the change (before / after) in chat → wait for approval.
3. Edit the source file.
4. A change to a rule or the way of working → add 1 row at the top of manager/decisions.md (next ID Dnn).
5. Add 1 line to manager/CHANGELOG.md, section [Unreleased], group Added / Changed / Removed, with the Dnn ID if any.
6. The change affects how humans read the repo → update the narrative in manager/handbook.md.
7. Run: python3 manager/scripts/build_guide.py
8. Report: list of changed files + suggested commit message "[kb] <summary>".

# Release
- The user says "release": rename [Unreleased] to [x.y.z] - YYYY-MM-DD, bump manager/VERSION (rule / skill behaviour change → y; wording → z), re-run build_guide.py.

# Forbidden
- Editing manager/GUIDE.md by hand · skipping the CHANGELOG · editing LOCKED files in qc/ · writing the same content into 2 source files.
