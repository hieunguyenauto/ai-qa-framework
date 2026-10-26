# Messages — demo-shop
<!-- Source: real app (recon 2026-10-26, demo). Highest priority for message text (sources.md). -->

| ID | Screen | Trigger | Message |
|---|---|---|---|
| M01 | SHP01 Login | 'Username' blank | Epic sadface: Username is required |
| M02 | SHP01 Login | 'Password' blank | Epic sadface: Password is required |
| M03 | SHP01 Login | Wrong username / password | Epic sadface: Username and password do not match any user in this service |
| M04 | SHP01 Login | Locked account | Epic sadface: Sorry, this user has been locked out. |
| M05 | SHP01 Login | Protected page opened without a session | Epic sadface: You can only access '<path>' when you are logged in. |
| M06 | SHP04 Checkout: Your Information | 'First Name' blank | Error: First Name is required |
| M07 | SHP04 Checkout: Your Information | 'Last Name' blank | Error: Last Name is required |
| M08 | SHP04 Checkout: Your Information | 'Zip/Postal Code' blank | Error: Postal Code is required |
| M09 | SHP06 Checkout: Complete! | Order completed | Thank you for your order! |
