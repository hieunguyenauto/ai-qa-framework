# Learned rules — automation (the AI reads this before writing / fixing test code)

R01–R42 were learned on a production Japanese B2B web app (CMS with roles, wizards, approval flows); R43–R45 on the public demo (examples/demo-shop). Detailed write-ups exist for the rules that link a file; client-specific details were removed.

## Web
- R01 Screen never run before: get the real element tree (error-context.md / aria snapshot / codegen / recon) before writing locators; never write them from a CSV or the catalog alone. Wizards / role-dependent screens often have hidden steps. (web/2026-10-12-create-wizard-hidden-step.md)
- R02 Screenshot / snapshot hooks always have a timeout ≤ 10s and a .catch(); a self-created context (serial E2E) attaches its own screenshot + aria snapshot. (web/2026-10-12-afterEach-screenshot-hang.md)
- R03 Screens whose data loads after navigation (detail pages…): wait for one key data cell to have a value before checking / clicking; the right URL or networkidle is not enough. (web/2026-10-12-detail-async-load.md)
- R04 Check "label = value" on the cell right after the label (common helper), not the whole row; take the label text exactly as in the DOM (trailing ':' etc.).
- R05 Lists / tables / status badges that load later may first show '0件' or an old status → wait for a loaded marker ('全 N 件中', the right badge value, ~15s) before concluding. (web/2026-10-12-list-zero-before-load.md)
- R06 Labels inside th with an extra badge (必須 / 任意) or a wrapping span: match the label on the child text node, not the whole th.
- R07 The value of a native dropdown is checked with option:checked, not with the row text.
- R08 A modal × button with aria-label '閉じる' clashes with a text button '閉じる' → find the text button inside its own area; the × goes through a closeModal() helper.
- R09 Nested modals: filter a modal by text / elements only it has, not by its title text.
- R10 Toggle buttons (menu expand, accordion): check whether it is already open before clicking, then expect the new state.
- R11 Card grids with images: wait for images to load, click with dispatchEvent (not by coordinates), then CHECK the selected value; reselect if wrong.
- R12 Log says "intercepts pointer events" (popover / chat / overlay over the button): use dispatchEvent('click') + check the resulting state; never force:true. (web/2026-10-12-overlay-intercepts-click.md)
- R13 Serial scenario on one shared context: turn off automatic trace / video in the config, record the trace in chunks per TC; every hook command has a time limit. (web/2026-10-12-shared-context-trace-hang.md)
- R14 Data created for later TCs (record number, id…) is recorded IMMEDIATELY after creation, before any side action.
- R15 Nested modals that close by only removing a 'show' class (still in the DOM): check "closed" on the element you acted on (elementHandle) or exclude the parent by text only it has; never re-find with .last() filtered by text.
- R16 File uploads (S3) run asynchronously after 'Done' and the app ignores the next upload: wait for the upload response (PUT) to succeed before continuing; never waitForTimeout.
- R17 Result dialogs after a save (OK / 完了) appear when the server is done: wait with a long timeout (~30s), not the default 5s, never waitForTimeout.
- R18 After login / opening a page with a heavy API: wait for the real API response; slower than the env threshold (apiPerfLimitMs) → write a 'PERFORMANCE' warning to check later and continue. App dialogs caused by a slow environment ("表示に時間がかかっております"): only click OK + write an 'env-warning'; the code NEVER reloads / retries on its own (only when the TC says F5). (web/2026-10-13-heavy-api-after-login.md)
- R19 Slide-in drawers / panels sit off-screen when closed (inputs still "visible", buttons not clickable): check the open state (class 'show') before acting; the drawer's buttons may sit outside its inner form.
- R20 Pick a row / card by name: match the exact cell (td + exact), never hasText on the whole row — hasText matches substrings ('Test' ⊂ 'EnterTest'). (web/2026-10-13-hastext-substring.md)
- R21 Tables inside a form table: the outer tr also contains the inner rows → take the innermost tr (hasNot tr) or address the tbody by its own attribute.
- R22 An action may already have submitted the form (Enter, double click): wait for the form to close first; only if it is still open after a few seconds click submit — never an instant isVisible check then click. (web/2026-10-13-enter-submit-race.md)
- R23 Cards with thumbnail + caption: the clickable part is the role=button thumbnail, inspect it first; filter the preview modal by its own class, not by file name (the parent form contains the name too).
- R24 Serial scenarios: a TC that ends on an unsaved form gets a 'Cleanup' step (not part of the TC) that leaves the form, so the discard dialog does not block the next TC; never a global discard handler.
- R25 Cells the app computes / formats (unit price, totals…): wait until the app has finished computing (temporary '0' gone) before typing; after typing CHECK the value and the total again.
- R26 A full-page loader blocks clicks on large lists: wait for the loader to disappear (common/wait.ts waitForAppIdle) before acting.
- R27 After a search: wait for the response of THIS search (with its parameters) before reading the table — '全 N 件' / rows already on screen belong to the default list. (web/2026-10-13-search-stale-result.md)
- R28 Search boxes may auto-search after typing: wait a few seconds for the URL / response, click Search only if nothing happened; close a panel / drawer still open after searching before using the table.
- R29 Multi-step statuses (approval chains…): never assume the badge changes after each step; loop to the final status and check at the end.
- R30 Never use count() right after opening a screen / modal whose data loads async (count() does not wait): wait for the expected element first; count() = 0 must never be a reason to skip an action of the TC. (web/2026-10-14-count-before-async-load.md)
- R31 Wizards / screens with role-dependent steps: wait for "optional step OR next step", never a fixed number of steps; record the inspected roles in the screen file.
- R32 Read displayed codes / numbers with their full real format (e.g. '223470066_2' → `\d+(?:_\d+)?`) and assert the full value.
- R33 Ant Design select inside an iframe: open with repeated mousedown until options appear, filter the dropdown by the aria-controls of the right field, check .ant-select-selection-item after choosing.
- R34 The same modal reachable by several paths with role-dependent permissions (read-only in the header, editable through 'quick actions'): inspect the path that has the action buttons for each role; never assume two paths behave the same.
- R35 Sidebar menu names differ by role: call the menu by the role's own name, or open the URL directly when the TC does not test the menu.
- R36 Every spec in a suite must understand the dry-run flag (cannot dry-run → skip the whole file when DRY). Checks / recon always run DRY, real runs never DRY. (web/2026-10-15-dry-run-all-specs.md)
- R37 Waiting for API idle: a request hanging past the threshold is logged once as perf and dropped from the list; it must not block every later wait. (web/2026-10-16-api-stuck-request.md)
- R38 Modals whose data comes from their own API: wait for that response before checking the content; a visible modal ≠ data loaded.
- R39 Data attached to a record (assets, reports): inspect whether it is shown inline or in a modal; a modal opened for a check is closed within the same step (serial scenario).
- R40 Header buttons that exist only in some states (e.g. only while a submitted quote exists): check the state with a role that always sees it.
- R41 Records created by a test: take the id / code from the API response of the creating action itself (or the text the app shows right after creation); never "the newest row" of a list — someone else creating at the same time / old data gets picked. (web/2026-10-16-created-id-from-response.md)
- R42 Generated specs are changed only through the generator (bulk script edits included); after regenerating, review the git diff — any change outside the template you touched → stop and move it into the generator first. (web/2026-10-16-generated-spec-hand-edit-lost.md)
- R43 SPA navigation: the URL changes before the new page renders — after a click that navigates, wait for the target page's landmark (page title / unique heading), not waitForURL; screen objects expose waitLoaded() for this. (web/2026-10-26-spa-url-before-render.md)
- R44 A TC fails because of a known product bug: keep the expect exactly as the TC says and mark the test as an expected failure with the bug ID from bug-history (the generator does it from the BUG-… in the TC Function); when the bug is fixed the test turns red and the mark is removed. (web/2026-10-26-known-bug-expected-failure.md)

- R45 Cards whose image / title are links with role=button: getByRole('button') inside the card is not unique — target the action by its name, or by the native <button> element when its text toggles. (web/2026-10-26-card-links-role-button.md)

## Mobile
<!-- M01 <rule> (mobile/<file>.md) -->
