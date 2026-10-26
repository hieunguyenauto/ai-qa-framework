Scan all 8 groups for every function, skip none:

| Group | Suggested Test Type | What to ask |
|---|---|---|
| 1. UI / Layout | UI | Matches the design, empty state, button / chip / badge states, responsive |
| 2. Positive | Function | The main flow works with valid data |
| 3. Negative | Validation | Wrong data, required fields blank, wrong order, no permission |
| 4. Boundary / Edge | Validation | Min / max length, min / max value, 0 / 1 / many / maximum, boundary dates |
| 5. Data / Business rule | Data | Data state, duplicates, relational constraints, calculations |
| 6. Cross-cutting | Transition / Security | Screen transitions, permission / role, Japanese messages, session / timeout, SQL injection, trim |
| 7. Performance | Performance | Screen / API response time, large data (lists of 1,000+ rows, export, large uploads), concurrent users, double submit. Set a threshold only when the spec gives a number; otherwise create an OQ asking for it |
| 8. Lessons / past bugs | Regression | From the Lesson / Bug rows of the Context pack (qc/lessons/INDEX.md D01–D19 + project bug-history). Any bug / lesson with the same function, field type or pattern → ≥ 1 VP; Note gives the bug ID or lesson file |

- Each group usually gives 1–a few VPs per function, NOT one VP per question in the "What to ask" column — those questions are values on the axis and become test cases.
- Each input field = 1 validation VP; the rows of qc/templates/data-test.md are its data axis.
- Test Viewpoint sentence (English): "Verify that <object> <aspect> in case/when <group of conditions>".
