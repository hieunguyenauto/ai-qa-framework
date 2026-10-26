# Test case — <Sheet / Function>
- Project: <project> · Scope Key: <scope-key> · Sheet prefix: <PREFIX>
- Viewpoint: <P>/qc/test-viewpoints/<scope-key>-viewpoints.md (rev N)
- State: DRAFT · Revision: 1 · Approved by / at:

| TC ID | Viewpoint ID | Test Level | Main Screen | Function | Pre-condition | Steps | Expected Results | Role | OS | Priority | Status | Automation Eligibility |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ABC-TC-001 | ABC-02 | System | Request detail | Submit request | Request status is 'Draft' | 1. Login as Member<br>2. Open the request detail<br>3. Click '提出' | Request status changes to '承認待ち' | Member | Web | High | | UI-AUTO |

| Column | Convention |
|---|---|
| TC ID | `<PREFIX>-TC-NNN` (CR: `TC-CR<n>-NNN`, enhancement: `EH-<ticket>-TC-NNN` — per <P>/README.md) |
| Viewpoint ID | ID from the viewpoint file. A TC added from another source that maps to no VP → LEAVE EMPTY, never a fake ID |
| Steps | Numbered `1. … 2. …`, step 1 is usually `Login as <Role>`. Several actions in one step are joined with ` → ` |
| Expected Results | 1 result per TC, in English, Japanese labels / messages kept inside '' |
| Role / OS | Applicable role · Web / iOS / Android (several values separated by commas) |
| Priority | High (main flow, UAT) · Medium (negative / main validation) · Low (UI, rare) |
| Status | Empty while designing. When run (Excel): Passed / Failed / Fixed / Pending / N/A; `-` = role / platform not applicable |
| Automation Eligibility | Extra column for automation, not in the original Excel |
