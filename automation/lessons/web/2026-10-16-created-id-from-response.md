# 2026-10-16 Records created by the test: take the id from the creating response, not "the newest row"
- Type: DATA
- Source: review of an E2E scenario against its TC rev 13 (production CMS, test environment)
- Function / screen: request creation (embedded webview) › submit → back to top
- Symptom: the test passed, but the request number was taken by opening the list and picking the first row of the shop (marked [to verify on the real app]); nothing proved it was the record just created.
- Root cause: the webview does not return the id to the CMS → the code guessed from the list. Someone else creating a record for the same shop, or a different sort order, picks the wrong one → the whole serial scenario runs on the wrong record and may still pass.
- Fix: submit() waits for the POST /records response and takes id / number (no number → the text the app shows right after creation); the id is recorded immediately (R14); afterwards the scenario opens exactly that record and checks number + shop name. The "newest row" helper was removed from the hand-written spec, 23 generated specs and the generator template.
- Rule: R41
- Applies to: every step that creates data reused by later TCs.
