# 2026-10-16 Quote-creation TC does not say which default rows are deleted and which cell gets which price
- Type: DESIGN_GAP
- Source: review of an E2E TC against its automation code (production project, rev 13 → 14)
- Function / screen: record detail › quote form (add item, vendor unit price, customer unit price, totals)
- Symptom: the TC only said "add item 'Autotest' with a unit price so that total = LIMIT − 1". The code had to do things the TC never said: enter the vendor price, delete two default rows, then enter the customer price so that the tax-included total = LIMIT − 1. A reader could not reproduce it and the reviewer could not see what automation added.
- Root cause: the TC described the result (total) instead of the actions; the form has default rows and two kinds of unit price (one auto-computed from the other) but the TC did not say which cell gets which value.
- Fix: TC rev 14 writes every action: vendor price → confirm → delete the default rows → customer price so that the tax-included total = LIMIT − 1.
- Rule: D19 — TCs that create / edit forms with default rows or auto-computed cells: Steps say whether default rows are kept or deleted, which cell gets which value and whether totals are tax included or excluded.
- Applies to: quote / invoice / multi-row forms with defaults, TCs generated in bulk by scripts.
