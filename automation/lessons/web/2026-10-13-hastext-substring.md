# 2026-10-13 hasText matches substrings: row 'Test' picked 'EnterTest'
- Type: LOCATOR
- Source: two regression TCs on a production CMS (dev environment)
- Function / screen: record detail › quote list table
- Symptom: expect row 'Test' = '承認待ち' received "1EnterTest…下書き…".
- Root cause: locator('tr', { hasText: 'Test' }) matches substrings, case-insensitively → the 'EnterTest' row created by an earlier TC sat above it and was taken by first().
- Fix: a row helper: tr with a td that matches exact(name). The screen object's row helpers use the same approach.
- Seen again: a card lookup for 'test.jpg' with getByText inside the PDF cell hit the error message 'test.jpg: ファイルの形式は正しくありません。' → switched to the card element with img[title].
- Rule: R20
- Applies to: picking rows / cards by names the test chose (short names are often substrings of other names).
