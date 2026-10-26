# Bug history — demo-shop
The demo shop has intentional defects for some accounts. They are recorded like real bugs so the pipeline can show how known bugs flow into viewpoints (group 8) and automation (R44).

| ID | Function / screen | Pattern | Description | Found by | Caught by a TC | Status |
|---|---|---|---|---|---|---|
| BUG-001 | Checkout: Your Information | Input goes to the wrong field | 'problem_user': typing in 'Last Name' replaces 'First Name'; 'Last Name' stays empty, so 'Continue' shows M07 | Recon 2026-10-26 | Yes — CHK-TC-034 | Open |
| BUG-002 | Checkout: Overview | Action does nothing | 'error_user': 'Finish' does not complete the order (stays on Overview) | Recon 2026-10-26 | Yes — CHK-TC-035 | Open |
| BUG-003 | Products | Sort ignored | 'problem_user' / 'error_user': 'Price (low to high)' does not change the order | Recon 2026-10-26 | No (sorting is out of scope of checkout) | Open |
