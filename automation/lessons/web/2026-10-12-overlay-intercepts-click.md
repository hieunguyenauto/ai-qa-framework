# 2026-10-12 An open chat popover covers its own minimise trigger
- Type: LOCATOR (overlay)
- Source: E2E TC-002 step 32 (production CMS, dev environment)
- Function / screen: record detail — chat popover
- Symptom: locator.click timed out after 15s; the log said "<form class='chat-input'> … subtree intercepts pointer events".
- Root cause: the popover content lies over the trigger; a real click is blocked.
- Fix: a shared minimizeChat() helper: trigger.dispatchEvent('click'), then expect the chat content toBeHidden. No force:true (it still clicks by coordinates).
- Rule: R12 — "intercepts pointer events": use dispatchEvent('click') + check the resulting state; never force:true.
- Applies to: floating popovers / chats / toasts / overlays.
