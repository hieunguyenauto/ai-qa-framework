# Repository map
| Path | Group | Content | The AI reads it when |
|---|---|---|---|
| CLAUDE.md | Root | General rules, reading order, active project | Every session |
| .claude/skills/ | Skills | kb-update (QC + manager) · kb-update-automation (automation) · source-import, spec-review, test-viewpoint, test-case, export-excel (QC) | A skill is invoked |
| manager/ | Manager | GUIDE.md (generated), handbook.md, decisions.md, CHANGELOG.md, VERSION, scripts/, templates/lesson.md | Only when the user asks / kb-update runs |
| qc/ | QC (shared) | templates/ (spec, gap-report, viewpoint, testcase, data-test), lessons/ (test design, Excel) | Test design flow |
| automation/ | Automation (shared) | templates/screen.md, lessons/ (web, mobile) — changed through kb-update-automation | Writing / fixing test code |
| examples/<project>/ | Project | README, sources, glossary, bug-history, spec/, raw/, screens/, qc/ (design output), automation/web | Following the flow, only the relevant parts |
| scripts/ | Tools | check-before-push.sh (public-safety scan) | Before pushing |
| reports/ | Temporary output | Excel / PDF exports (gitignored) | Never |
