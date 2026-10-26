# Test Viewpoint — <Sheet / Function>
- Project: <project> · Scope Key: <scope-key> · Sheet prefix: <PREFIX>
- Source: <P>/spec/<scope-key>.md (rev N)
- State: DRAFT · Revision: 1 · Approved by / at:

| ID | Screen | Test Level/Test Type | Function | Test Viewpoint | Expected Result | Role | Site | Note |
|---|---|---|---|---|---|---|---|---|
| ABC-01 | Member registration | System / Validation | '氏名' input | Verify that '氏名' is validated in case of invalid input | Invalid input shows the error message defined in the spec and the member is not saved | Member | Web | Axis: data — D01–D14 (data-test.md) · Spec §Registration |
| ABC-02 | Request detail | System / Function | Submit request | Verify that the submit button works correctly by request status | Submit is enabled only at the statuses allowed by the spec; other statuses disable it | Member | Web | Axis: status — Draft / Pending / Approved · Spec §State change |

<!-- Test Level/Test Type: System / UAT / Regression × Function / UI / Validation / Transition / Data / API / Security / Performance -->
<!-- ID: <PREFIX>-NN. Written in English, Japanese labels kept inside ''. Note must contain "Axis: …" + source. -->
