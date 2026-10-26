# 2026-10-14 count() in a just-opened modal = 0 because the table had not loaded → the TC's action was skipped
- Type: TIMING
- Source: a regression TC on a production CMS (dev environment)
- Function / screen: record edit › store / person modal — asset table
- Symptom: the TC failed at Expected (validation message missing) and the app showed "saved"; the video had no click on '削除'. It was first mistaken for a product bug (marked test.fail); a manual run showed the app was right.
- Root cause: the modal appears immediately but the asset table loads later (first only a placeholder + spinner). The code counted '削除' buttons with count() — count() does not wait → 0 → the delete loop never ran → '保存' was clicked with the assets still there → the app saved correctly.
- Fix: wait for API idle when opening the modal; wait for the first asset row (the pre-condition guarantees ≥ 1) before counting / deleting; after deleting check the placeholder. Locators moved into screens/. The false bug mark was removed; both TCs pass.
- Rule: R30
- Applies to: every loop / condition based on count() right after opening a screen / modal / table with async data.
