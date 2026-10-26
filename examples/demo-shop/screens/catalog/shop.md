# Screen catalog — Swag Labs web shop
Source: recon 2026-10-26, demo (https://www.saucedemo.com). Locators live in automation/web/screens/shop/, not here.

| ID | Screen (page title) | Route | Main elements |
|---|---|---|---|
| SHP01 | Login (no title, logo 'Swag Labs') | / | 'Username', 'Password', 'Login', error area with 'Dismiss error' (×) |
| SHP02 | Products | /inventory.html | Sort 'Name (A to Z)' / 'Name (Z to A)' / 'Price (low to high)' / 'Price (high to low)'; per product: name, description, price, 'Add to cart' / 'Remove' |
| SHP03 | Your Cart | /cart.html | Rows: QTY, name, description, price, 'Remove'; 'Continue Shopping', 'Checkout' |
| SHP04 | Checkout: Your Information | /checkout-step-one.html | 'First Name', 'Last Name', 'Zip/Postal Code'; 'Cancel', 'Continue'; error area |
| SHP05 | Checkout: Overview | /checkout-step-two.html | Item rows; 'Payment Information:', 'Shipping Information:', 'Item total: $…', 'Tax: $…', 'Total: $…'; 'Cancel', 'Finish' |
| SHP06 | Checkout: Complete! | /checkout-complete.html | Heading 'Thank you for your order!', text, 'Back Home' |

Header (SHP02–SHP06): burger menu ('All Items', 'About', 'Logout', 'Reset App State'), cart icon with badge.
