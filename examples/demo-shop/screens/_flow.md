# Screen flow — demo-shop

```mermaid
flowchart LR
    L[SHP01 Login] -->|Login| P[SHP02 Products]
    P -->|cart icon| C[SHP03 Your Cart]
    C -->|Continue Shopping| P
    C -->|Checkout| I[SHP04 Checkout: Your Information]
    I -->|Cancel| C
    I -->|Continue| O[SHP05 Checkout: Overview]
    O -->|Cancel| P
    O -->|Finish| D[SHP06 Checkout: Complete!]
    D -->|Back Home| P
    P -->|menu › Logout| L
```

- Every screen except SHP01 requires login. Opening one without a session → SHP01 with message M05 (spec/messages.md).
- The cart is kept per user after logout / login in the same browser (AC-08).
- Permission matrix: not applicable (no roles); user types are listed in README.md.
