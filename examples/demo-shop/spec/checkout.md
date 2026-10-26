# Checkout (purchase flow) — Swag Labs
- Source: written by QA from the public behaviour of https://www.saucedemo.com (demo project, no ticket)
- Status: Approved · Revision: 1 · Approved by: Nguyen Thanh Hieu · Date: 2026-10-26

## Description / Requirements
A logged-in user adds products to the cart, enters shipping information, reviews the order with tax and completes the purchase.

## Acceptance criteria
| ID | Criterion |
|---|---|
| AC-01 | Login requires 'Username' and 'Password'. Missing / wrong input or a locked account shows the matching message (M01–M04) and stays on Login. Valid credentials open 'Products'. |
| AC-02 | Every screen except Login requires a session. Opening one without a session shows Login with M05 (the message names the requested path). |
| AC-03 | 'Add to cart' adds the product to the cart; the button changes to 'Remove'; the cart badge shows the number of items. 'Remove' takes it out again. The badge is hidden when the cart is empty. |
| AC-04 | 'Your Cart' lists each item with QTY (always 1), name and price. 'Remove' removes the item from the list. 'Continue Shopping' opens 'Products'. 'Checkout' opens 'Checkout: Your Information'. |
| AC-05 | 'First Name', 'Last Name' and 'Zip/Postal Code' are required. On 'Continue' they are checked in this order and the first missing one shows its message (M06–M08); the screen does not change. 'Cancel' opens 'Your Cart'. |
| AC-06 | 'Checkout: Overview' lists the cart items. 'Item total' = sum of the item prices; 'Tax' = 8% of Item total; 'Total' = Item total + Tax. 'Cancel' opens 'Products' and keeps the cart. 'Finish' completes the order. |
| AC-07 | 'Checkout: Complete!' shows M09 and the cart becomes empty. 'Back Home' opens 'Products'. |
| AC-08 | The cart content is kept after logout and a new login of the same user in the same browser. |

## Affected screens
SHP01–SHP06 (screens/catalog/shop.md).

## Business rules, limits, error messages
- Messages: spec/messages.md (M01–M09).
- No maximum length and no character-type restriction is defined for the checkout fields.
- Prices are in USD with 2 decimals.

## Notes from dev / PM
- Test accounts and their built-in behaviour: README.md › Roles.
