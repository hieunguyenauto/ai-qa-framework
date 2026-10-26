# 2026-10-13 Save shows a completion dialog, the TC does not write the 'OK' step
- Type: DESIGN_GAP
- Source: a regression TC imported from a CSV (production project, rev 4)
- Function / screen: list screen › save search conditions
- Symptom: the TC says "Press Enter 5 times in the filter-name field", then checks a header link; the app shows the dialog '確認 · 検索条件の保存が完了しました。' + 'OK' over the screen → automation timed out on the link and the next 59 TCs did not run.
- Root cause: the original file skipped closing the completion dialog (manual testers click OK by reflex, so nobody wrote it down).
- Fix: added "→ Verify: dialog '<message>' → 'OK'" to step 4 (rev 4); the message was not in spec/messages.md yet → marked [to confirm].
- Rule: D16 — a save that shows a completion dialog: Steps must say "Verify: dialog '<message>' → 'OK'" before the next step.
- Applies to: every save / register / delete with a completion message (…が完了しました。 + OK), especially TCs imported from outside files.
