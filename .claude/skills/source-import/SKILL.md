---
name: source-import
description: Convert client source documents (xlsx, csv, docx, pdf) to Markdown as input for test design. Originals stay in <P>/raw/, Markdown goes to <P>/spec/. Use when the user says "import spec", "convert excel to md", "add this excel to spec", "/source-import", or gives an .xlsx file as a spec.
---
# Input
- Original file in <P>/raw/ (the user gives the path). Not in raw/ yet → propose moving it there first. raw/*.xlsx|pdf|csv are gitignored: never commit confidential client documents.
- scope-key confirmed by the user.

# Process
1. List sheets / pages: name, number of data rows, whether they contain images / colours / comments / merged cells / formulas. Ask which sheets to import (default: every sheet with data).
2. Each sheet → 1 Markdown table. Find the header by its literal text (T03), never hard-code the row. Merged cells → repeat the value in every cell (T04). Formulas → take the computed value; cells that are "=..." text stay as text (T05). Japanese stays as is, never translated.
3. Write:
   - 1 file: <P>/spec/<scope-key>.md (main spec) or <P>/spec/<scope-key>/<sheet>.md when there are several large sheets.
   - At the top of each file: `<!-- Source: <P>/raw/<file> · Sheet: … · Imported: YYYY-MM-DD · Original revision: … -->`
4. Reconcile: table Sheet | Rows in original | Rows in md | Match?. Any mismatch → fix before reporting done.
5. Report what was LOST in the conversion (images, meaningful cell colours, comments, hyperlinks, data validation / dropdowns) with cell positions. Colours / comments that carry business meaning → copy them as text into an "Import note" column.
6. New source → propose 1 row for <P>/sources.md (the user decides the priority).

# Forbidden
- Editing the original in raw/ · summarising / dropping rows · translating Japanese · inferring the content of images.
