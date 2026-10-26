# 2026-10-16 Generated specs edited by hand → lost on the next generation
- Type: DATA
- Source: regenerating an E2E suite after changing one template (production project)
- Function / screen: every scenario generated from TCs
- Symptom: regenerating to change 2 lines produced a ~50-line diff per file: the environment-dependent name wrappers added by an earlier commit disappeared. (`--check` compares the full content and would have reported ✘ — run it before regenerating.)
- Root cause: that commit wrapped strings directly in the generated specs instead of changing the generator → generator and specs drifted; the next generation overwrote them.
- Fix: restored the specs from HEAD, applied only the lines the new template produces; then moved the wrappers into the generator — verified: generator + patch reproduces all 36 committed specs byte for byte.
- Rule: R42 — generated specs are changed only through the generator (bulk script edits included); before regenerating: generate, review the git diff — any change outside the template you touched → stop and move it into the generator first.
- Applies to: scripts/gen-specs.mjs and every file marked "GENERATED — do not edit".
