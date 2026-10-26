# 2026-10-13 Master-edit screen saves in two levels, the TC only writes the modal '保存'
- Type: DESIGN_GAP
- Source: a regression TC imported from a CSV (production project, rev 3)
- Function / screen: master item edit (list of configurable columns)
- Symptom: the TC says "Click '保存' → '決定'", but '保存' of the add-row modal only adds a temporary row to the table: no '決定' dialog, no save request → automation waited for '決定' and failed.
- Root cause: the screen saves in two levels (row modal → page '保存' → '決定'); the original file only wrote the modal level.
- Fix: added step 3a "Click '保存' of the page → '決定' (→ 'OK')" (rev 3); the sibling TCs follow it.
- Rule: D15 — master-edit screens with two save levels: the TC writes both levels and checks the data after reload.
- Applies to: every list / master edit screen with a shared page-level '保存' button.
