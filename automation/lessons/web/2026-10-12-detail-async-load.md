# 2026-10-12 Detail screen loads its data after navigation
- Type: TIMING
- Source: recon of the record detail screen (production CMS, dev environment)
- Function / screen: record detail (/admin/records/:id/detail)
- Symptom: right after navigation every table cell is empty and the 'quick actions' button is disabled; checking values now fails or matches the wrong thing.
- Root cause: the data (GET /records/:id …) loads asynchronously after the route changes; the right URL does not mean the data is there.
- Fix: the screen's expectOpened() waits for the value cell of the record number to contain digits (timeout 20s) before checking / clicking.
- Rule: R03 — screens whose data loads later: wait for one key data cell to have a value before checking or acting; do not rely on the URL / networkidle.
- Applies to: every detail / list screen, recon scripts.
