# 2026-10-12 Lists show "0件" before they finish loading
- Type: TIMING
- Source: recon v2 + real browser (asset selection dialog, quote list) of a production CMS
- Function / screen: paginated dialogs / tables
- Symptom: "no rows" checks passed wrongly and row selection failed, because the table first shows '該当データが0件でした'.
- Root cause: the data loads through an API after the modal opens; the 0件 text is a temporary state.
- Fix: the dialog's selectRows() waits for '全 N 件中' (max 10s) before reading rows; row statuses wait up to 15s.
- Rule: R05 — lists / tables / status badges that load later: wait for a loaded marker before concluding.
- Applies to: every list / table / status badge after a save.
