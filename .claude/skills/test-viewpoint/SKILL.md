---
name: test-viewpoint
description: Design Test Viewpoints in the Viewpoint sheet format (ID, Screen, Test Level/Test Type, Function, Test Viewpoint, Expected Result, Role, Site, Note). Each viewpoint is one test angle with a variation axis that produces several test cases, traced to the spec, then locked. Use when the user says "make viewpoints", "test angles", "/test-viewpoint".
---
# Input
- Approved <P>/spec/<scope-key>.md + LOCKED <P>/qc/gap-reports/<scope-key>-gap-report.md with Design Gate READY/PARTIAL and a Context pack.
- Knowledge + lessons (selective reading, grep by function / screen of the sheet, never whole folders):
  | Read | Why |
  |---|---|
  | Context pack (mandatory, read first) | Summary already filtered by spec-review |
  | qc/lessons/INDEX.md section Test design | Viewpoint rules that are often missed (group 8) |
  | <P>/bug-history.md — rows with the same function / pattern | Group 8 viewpoints; prioritise rows where "Caught by a TC" = No |
  | <P>/screens/ — related screens | Permission matrix, state transitions → role / status axes |
  | <P>/qc/test-viewpoints/ LOCKED files of the same function | No duplicates, nothing old missed |
  | <P>/glossary.md — only for unknown terms | Correct object names |
- New information not in the Context pack → add "Source: <file#section>" to the Note of the related VP.
- references/viewpoint-groups.md, qc/templates/viewpoint.md, qc/templates/data-test.md.

# What a viewpoint is (read carefully before writing)
- Viewpoint = 1 OBJECT × 1 ASPECT to verify, with 1 VARIATION AXIS. A test case = 1 value on that axis.
- 3 kinds of axis: data (data-test rows, input values) · state (status, data / no data, role) · combination of conditions.
- Test Viewpoint (English): "Verify that <object> <aspect> in case/when <GROUP of conditions>". The condition is a group, not a single value.

| Wrong (case by case) | Right (viewpoint) |
|---|---|
| Verify that an error is shown when '氏名' is blank | Verify that '氏名' is validated in case of invalid input (Note: Axis: data — D01–D14) |
| Verify that an error is shown when '氏名' exceeds 30 chars | (merged into the row above) |
| Verify that Submit is enabled at status 'Approved' | Verify that the submit button works correctly by record status (Note: Axis: status — Draft / Pending / Approved) |
| Verify that the Approve button is hidden for a Viewer | Verify that action buttons are displayed by role and status (Note: Axis: permission matrix — role × status) |

# Process
1. List the screens / functions in the spec, only for the requested sheet. One prefix per sheet (e.g. CHK).
2. Run every function through the 8 groups in viewpoint-groups.md; group 8 comes from the Context pack + qc/lessons/INDEX.md + bug-history (same function).
3. Inside each group, group by object (field / screen area / button / API / rule): each object × aspect = 1 VP. Each input field = exactly 1 validation VP, the data-test rows are its axis. Buttons by role → the axis is the permission matrix of the authoritative source.
4. One row per VP: ID = <PREFIX>-NN · Expected Result at a general level · Role, Site per spec · Note: "Axis: <kind> — <expected values>" + source (doc §section) / OQ.
5. Self-check before review — print a table ID | Axis | Expected TC count:
   - VP expected to have < 3 TCs → merge into a VP with the same object / aspect (exception: a rule with only one case — give the reason in Note).
   - Two VPs that differ only by one condition value → merge.
   - Every acceptance criterion has ≥ 1 VP; VPs contain no concrete steps or data.
6. Draft → review → write <P>/qc/test-viewpoints/<scope-key>-viewpoints.md per qc/templates/viewpoint.md → State = LOCKED when approved.

# Forbidden
- One VP per value / per condition (that is a test case) · splitting VPs per data-test row.
- Renaming / reordering columns · writing test cases at this step · translating Japanese text.
- Inventing functions / fields / messages outside the spec → write [to confirm] and create an OQ.
