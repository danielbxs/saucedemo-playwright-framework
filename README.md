[![Playwright Tests](https://github.com/danielbxs/saucedemo-playwright-framework/actions/workflows/playwright.yml/badge.svg)](https://github.com/danielbxs/saucedemo-playwright-framework/actions/workflows/playwright.yml)

# Saucedemo Playwright Automation Framework (Playwright & TypeScript)

This is an automated end-to-end testing suite built with **Playwright** and **TypeScript** using the **Page Object Model (POM)** pattern. This repository validates all functionalities of the e-commerce process and checkout financial calculation accuracy on the [Swag Labs (Saucedemo)](https://www.saucedemo.com/) application.

---

## Technologies Used

- **Framework:** [Playwright Test](https://playwright.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **CI/CD:** GitHub Actions

---

## Test Coverage

This test suite covers the main user flows across the application lifecycle:

- **Authentication (`/`):** Validates login functionality, credential handling, and testing fields against invalid inputs, special characters, and script injection attempts.
- **Inventory (`/inventory.html`):** Exercises product selection, menu interactions, and application state resets.
- **Shopping Cart (`/cart.html`):** Tests cart persistence and edge cases like proceeding to checkout with an empty cart.
- **Checkout Workflows (`/checkout-step-one.html` & `/checkout-step-two.html`):**
  - Form validation and required field warnings.
  - Precise verification of subtotal, tax, and order totals.
- **Order Completion (`/checkout-complete.html`):** Verification of the checkout process completeness, state teardown and redirection to the store front.

---

## Known Issues

This project follows professional QA practices by writing tests against expected specifications. Identified application bugs are actively managed using Playwright's `test.fixme()` status to ensure continuous integration (CI) pipelines stay green while tracking broken features.

| Spec                | Known Issue / Description                                                                                                                                                                      | Status                    |
| :------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------ |
| `login.spec.ts`     | **Injection Strings:** Accepts injection scripts on inputs, does not sanitize inputs, and does not display an adequate error message                                                           | 🟡 `Skipped (test.fixme)` |
| `login.spec.ts`     | **Negative Tests:** Allows blank spaces, emojis, and unicodes to be used in login fields. Incorrect error message is shown                                                                     | 🟡 `Skipped (test.fixme)` |
| `login.spec.ts`     | **Boundary Tests:** Allows unlimited characters in login fields (observed behavior), no error message is shown                                                                                 | 🟡 `Skipped (test.fixme)` |
| `login.spec.ts`     | **Accessibility Best Practices:** Fails to meet accessbility best practices                                                                                                                    | 🟡 `Skipped (test.fixme)` |
| `inventory.spec.ts` | **Reset App State:** Clears cart badge storage state but fails to re-render "Remove" buttons back to "Add to cart" in the DOM                                                                  | 🟡 `Skipped (test.fixme)` |
| `cart.spec.ts`      | **Empty Cart Checkout:** Allows users to proceed to Checkout Step One with 0 items in the cart without disabling the checkout button or displaying an error message                            | 🟡 `Skipped (test.fixme)` |
| `cart.spec.ts`      | **Semantics Accessibility Guidelines:** Contains violations due to not using semantic HTML                                                                                                     | 🟡 `Skipped (test.fixme)` |
| `checkout.spec.ts`  | **Numbers in Checkout Fields:** Allows numbers to be provided in first and last name checkout inputs. No error message is shown                                                                | 🟡 `Skipped (test.fixme)` |
| `checkout.spec.ts`  | **Special Characters in Checkout Fields:** Allows special characters to be provided in first name, last name, and zipcode checkout fields. No error message is shown                           | 🟡 `Skipped (test.fixme)` |
| `checkout.spec.ts`  | **Direct Navigation to Step Two:** Allows the user to navigate directly to the second phase of checkout. No redirection or error page is triggered                                             | 🟡 `Skipped (test.fixme)` |
| `checkout.spec.ts`  | **Directly Completing Checkout With Empty Cart:** Allows the user to navigate directly to the checkout complete page, even when the cart is emptied. No redirection or error page is triggered | 🟡 `Skipped (test.fixme)` |
| `checkout.spec.ts`  | **Boundary Tests:** Allows unlimited characters in checkout fields (observed behavior), no error message is shown                                                                              | 🟡 `Skipped (test.fixme)` |

---

## How to run locally

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone this repository:

```bash
git clone https://github.com/danielbxs/saucedemo-playwright-framework.git
cd saucedemo-playwright-framework
```

2. Install dependencies

```bash
npm install
```

3. Install Playwright browsers

```bash
npx playwright install
```

## Running tests

### 1. Run all tests (headless)

```bash
npm run test
```

### 2. Run all tests in UI mode

```bash
npm run test-ui
```

### 3. Run specific test files

#### Login

```bash
npm run test-login
```

#### Inventory

```bash
npm run test-inventory
```

#### Cart

```bash
npm run test-cart
```

#### Checkout

```bash
npm run test-checkout
```

### 4. View the HTML report (after running tests)

```bash
npm run report
```
