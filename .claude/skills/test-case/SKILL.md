---
name: test-case
description: Generate test cases from LOCKED viewpoints in the TC sheet format (TC ID, Viewpoint ID, Test Level, Main Screen, Function, Pre-condition, Steps, Expected Results, Role, OS, Priority, Status) plus Automation Eligibility, then reconcile against 3 sources. Use when the user says "write test cases", "generate TC", "/test-case".
---
# Input
- <P>/qc/test-viewpoints/<scope-key>-viewpoints.md with State = LOCKED. Not LOCKED → stop.
- Context pack in <P>/qc/gap-reports/<scope-key>-gap-report.md (read first).
- Knowledge + lessons (selective reading, grep by function / screen, never whole folders):
  | Read | Why |
  |---|---|
  | qc/lessons/INDEX.md section Test design | Cases that are often missed (month end, double submit…) |
  | <P>/bug-history.md — rows of the same function | Every bug with "Caught by a TC" = No → at least 1 TC, Priority High |
  | <P>/screens/ — related screens | Steps follow the real flow, permission per role, exact Japanese labels |
  | <P>/glossary.md | Correct labels / messages in '' |
  | <P>/qc/test-cases/ LOCKED files of the same function + old TCs per sources.md | 3-source reconciliation, no duplicates |
  | <P>/README.md sections roles / OS / ID conventions | Correct Role, OS, TC ID for the project |
- qc/templates/testcase.md, qc/templates/data-test.md, references/test-design-techniques.md, references/automation-eligibility.md.
- Only the one requested sheet.

# Process
1. For each VP: read the "Axis" in Note; each value on the axis → 1 TC. Pick the technique (EP, BVA, Decision Table…). Many TCs with the same Viewpoint ID is correct.
2. TC ID = <PREFIX>-TC-NNN (CR / enhancement conventions in <P>/README.md). Written in English, Japanese labels kept inside ''.
3. 1 TC = 1 behaviour = 1 Expected Result.
   - Never combine several results in one cell (no "and", no 1) 2) 3) lists, no "<br>" with several results).
   - Several things to check (message + field colour + not saved to DB…) → one TC each, same Viewpoint ID, same Steps.
4. No pre-condition → "-". Steps numbered "1. … 2. …", step 1 is usually "Login as <Role>". Role / OS per spec.
5. Priority: High (main flow, UAT) · Medium (negative / main validation) · Low (UI, rare). Group 8 VPs (lessons / past bugs) → High, put the bug ID in Function or the note. Leave Status empty.
6. Set Automation Eligibility per automation-eligibility.md.
7. Reconcile 3 sources before calling it done: (1) viewpoints, (2) old TCs of the function (if sources.md lists them), (3) basic design. Missing cases → add them; an added TC that maps to no viewpoint → LEAVE Viewpoint ID EMPTY and list it separately so a human decides whether to create a VP. Conflicts → per sources.md.
8. Check duplicates by CONTENT (not only by ID) and trace both ways: print a table Viewpoint ID | Technique | TC count; a VP with 0 TCs needs a reason; a TC pointing to a non-existent VP is an error.
9. Draft → review → write <P>/qc/test-cases/<scope-key>-test-cases.md per qc/templates/testcase.md → lock when approved.
10. After LOCKED: ask exactly one question "Test cases are LOCKED. Export to Excel?". Yes → skill export-excel. No → stop.

# Forbidden
- Combining several expected results / scenarios in one TC · fake Viewpoint IDs (e.g. CHK-NEW) · creating viewpoints yourself.
- Renaming / reordering columns · using MANUAL to hide a spec gap (use NEEDS_SPEC) · inventing fields / messages · inferring permissions from the UI instead of the permission matrix.
