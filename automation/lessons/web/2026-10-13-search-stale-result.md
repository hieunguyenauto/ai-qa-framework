# 2026-10-13 Search: the default result was read before the search result arrived
- Type: TIMING
- Source: two regression TCs on a production CMS (dev environment)
- Function / screen: task list (/admin/tasks)
- Symptom: the first task was '未着手' (expected '完了'); the failure screenshot showed '該当データが0件でした。'.
- Root cause: after Search the test waited for '全 N 件' — that text already existed for the default list → it read old rows. Also, the default task scope of the admin did not include the task type → QC added "scope '全て'" to the TC (new revision).
- Fix: search() waits for the GET /tasks response whose query contains the searched value, then waitApisIdle.
- Rule: R27
- Applies to: every search screen that shows a default list before searching.
