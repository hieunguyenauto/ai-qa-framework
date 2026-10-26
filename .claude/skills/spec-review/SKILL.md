---
name: spec-review
description: Q&A step before test design - read the spec, the project knowledge and the lessons, then find gaps, log Open Questions, decide the Design Gate and write a Context pack for the viewpoint / test case steps. Use when the user says "review spec", "find gaps", "spec Q&A", "/spec-review".
---
# Input
- <P> = active project (CLAUDE.md). Exact spec path <P>/spec/<scope-key>.md + approval status / revision. Missing → stop, return BLOCKED_INPUT. Spec only exists as xlsx / pdf → run skill source-import first.

# Process (in this order)
1. Read the spec. Propose scope-key (= spec file name), sheet prefix and OQ code. Wait for confirmation.
2. Read knowledge (relevant parts only, grep by function / screen):
   - <P>/README.md, <P>/sources.md (which source is authoritative)
   - <P>/glossary.md, <P>/screens/_flow.md + related screens (permission matrix, state transitions)
   - <P>/qc/test-viewpoints/, test-cases/ LOCKED files of the related function
3. Read lessons: qc/lessons/INDEX.md section "Test design"; <P>/bug-history.md only rows with the same function / field type / pattern.
4. Check scope: which roles the ticket covers, which release phase, parent / child tickets (lesson D11).
5. Q&A: list the test items (function, input, trigger, observable result, rule / data). For each item check: missing · ambiguous · conflicting sources · not verifiable · repeats a pattern that caused bugs → FND-<CODE>-NNN. Conflict → record which source wins per sources.md. Anything a human must decide → OQ-<CODE>-NNN in <P>/qc/open-questions.md (Status: OPEN).
6. Decide the Design Gate: READY · PARTIAL (state exactly what is blocked) · STOP.
7. Write the Context pack at the end of the Gap Report (date + revision of qc/lessons/INDEX.md), one sentence per row, with the source:
   | Type (Term / Screen / Permission / Old VP-TC / Lesson / Bug / Scope) | Source (file#section or ID) | Short content |
8. Follow qc/templates/gap-report.md exactly. Draft in chat → wait for approval → write <P>/qc/gap-reports/<scope-key>-gap-report.md (State: DRAFT); user approves → LOCKED.
9. Move to [Done] when all 3 hold: Gap Report LOCKED · every OQ of the scope in <P>/qc/open-questions.md is ANSWERED / RESOLVED (none OPEN) · the user confirms "Done". One condition missing → keep LOCKED and list the OPEN OQs.
10. On [Done]: call kb-update to update the project knowledge — only facts that are certain (approved spec + OQ answers):
    | Type | Target file |
    |---|---|
    | New term | <P>/glossary.md |
    | Screen, permission, state transition | <P>/screens/ |
    | Business rule, convention shared by many tickets | <P>/README.md |
    | New source document | <P>/sources.md |
    Draft a before/after table → user approves → write. Then: OQs moved into knowledge → RESOLVED; list the updated files in section 7 of the Gap Report.

# Forbidden
- Updating project knowledge before the Gap Report is [Done] · writing something true for only one ticket into shared project knowledge.
- Editing the spec · answering OQs yourself · treating silence as approval · reading whole folders instead of the relevant part.
