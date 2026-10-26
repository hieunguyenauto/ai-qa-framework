# Changelog

## [Unreleased]

## [1.0.0] - 2026-10-26
### Added
- Public release of the framework (D29): CLAUDE.md, 7 skills, QC templates, 19 test-design rules + 7 Excel rules, 45 automation rules with 18 detailed lessons.
- examples/demo-shop: full pipeline on a public practice shop — spec, messages, Gap Report (DONE, 5 OQs), 10 viewpoints, 37 test cases (LOCKED), generated Playwright spec (35 automated TCs, 2 known bugs as expected failures).
- Generic TC → spec generator (scripts/gen-specs.mjs + step-patterns.mjs) with `--check`, TC revision guard, message check against spec/messages.md, known-bug marking from bug-history.md.
- Automation lessons from the demo: R43 (SPA URL before render), R44 (known bug → expected failure), R45 (role=button links inside cards).
- CI: type check, generator drift check, GUIDE.md check, public-safety scan, demo suite.
- scripts/check-before-push.sh: scans tracked files and history for secrets, client words (local list) and large files.

### Changed
- Every rule, skill and template translated to English; client names, screens, URLs and accounts removed.

## [0.x] - 2026-10-09 … 2026-10-16
- Private production use on a Japanese B2B web app: 562 E2E test cases in 38 scenarios, 36 specs generated from test cases, 42 automation rules and 19 test-design rules learned (history not published).
