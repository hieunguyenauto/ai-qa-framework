# 2026-10-16 Status-driven TCs assume buttons / auto-approval rules never checked on the app
- Type: DESIGN_GAP
- Source: an E2E suite rev 7 → rev 12 (production project), automation run against the test environment
- Function / screen: record detail › quote (reject, withdraw, submit / auto-approve)
- Symptom: TCs failed while the app was right (confirmed by the product owner): (1) after "reject" the TC says "re-edit" but the app only offers 'Copy'; (2) "deny withdrawal" opens a reason dialog the TC does not write, and the original becomes 'Expired', not 'Withdrawal denied'; (3) one approval type auto-approves when the tax-excluded amount is below the level-1 minimum (the TC compared the tax-included amount); (4) urgent + below limit still auto-approves; (5) a continued request inherits the urgent flag; (6) after withdrawal one role loses the button the TC asks it to check.
- Root cause: the generator inferred buttons / statuses / auto-approval rules from the CSV + Q&A, without inspecting each status and each approval type on the real screen before LOCK.
- Fix: TC rev 8–12 (five Q&A rounds).
- Rule: D18 — status / approval-type driven TCs: before LOCK inspect (or ask) the buttons at every status, the status after every action and the full auto-approval conditions; put each Verify at the role that can see it.
- Applies to: approval / quote TCs, TCs generated in bulk by scripts.
