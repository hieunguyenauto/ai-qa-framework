| Value | Use when | Next |
|---|---|---|
| UI-AUTO | The result can be checked reliably by UI automation | Playwright / Appium |
| API-AUTO | Method, endpoint, auth, payload and response are all known | Later |
| BOTH | The same goal can be checked through the UI and the API | Playwright first |
| MANUAL | Needs human eyes: layout, fonts, printing, real devices | Run by hand |
| NEEDS_SPEC | Missing expected result, data or contract | Back to spec-review |

- Never use MANUAL to hide a spec gap.
- UI-AUTO means "eligible for automation", not "already automated" or "already run".
- Every TC must be runnable by hand before it has code.
