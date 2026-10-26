---
name: export-excel
description: Export LOCKED viewpoints + test cases to a new Excel file in reports/ using the project's workbook format. Run only when the user asks or agrees ("export excel", "/export-excel", or answers "Yes" when the test-case skill asks).
---
# When to run
- Only when the user asks, or answers "Yes" to the last question of skill test-case: "Test cases are LOCKED. Export to Excel?". Never export on your own.

# Input
- <P>/qc/test-viewpoints/<scope-key>-viewpoints.md and <P>/qc/test-cases/<scope-key>-test-cases.md, both State = LOCKED. Not LOCKED → stop.
- Result columns per role / platform: <P>/README.md (section result columns). Only the roles / OS in scope (Gap Report).
- Excel lessons: qc/lessons/INDEX.md section Excel / tools (T01–T07).

# Output
- A NEW file: reports/<scope-key>-<YYYYMMDD>.xlsx. Never open / edit the project's original workbook (T07). Name exists → add -v2, -v3.
- Sheet 1 `<PREFIX>_Viewpoint`: the 9 columns of qc/templates/viewpoint.md.
- Sheet 2 `<PREFIX>`: the 12 TC columns (TC ID · Viewpoint ID · Test Level · Main Screen · Function · Pre-condition · Steps · Expected Results · Role · OS · Priority · Status). Do NOT export Automation Eligibility (repo-internal only).
- After the 12 columns: result columns per role / platform (empty for testers; values Passed / Failed / Fixed / Pending / N/A).
- Sheet names ≤ 31 characters (T01). Text starting with "=" is written as text (T05). Steps with line breaks inside the cell, wrap text, freeze the header row.

# Process
1. Check both files are LOCKED, count VPs / TCs.
2. Build the workbook with openpyxl (or the xlsx skill if available).
3. Reconcile: VP / TC rows in Excel = rows in md; every Viewpoint ID in the TC sheet exists in the Viewpoint sheet (except valid empty cells).
4. Report: file path, table Sheet | Rows | Match?.

# Forbidden
- Editing the md files / original workbook · adding or reordering columns · pre-filling test results.
