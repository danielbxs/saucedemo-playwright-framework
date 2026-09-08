[![Playwright Tests](https://github.com/danielbxs/saucedemo-playwright-framework/actions/workflows/playwright.yml/badge.svg)](https://github.com/danielbxs/saucedemo-playwright-framework/actions/workflows/playwright.yml)

# Saucedemo Playwright Automation Framework (Playwright & TypeScript)

This is an automated end-to-end testing suite built with **Playwright** and **TypeScript** using the **Page Object Model (POM)** pattern. This repository validates critical e-commerce workflows, including authentication, inventory management, cart operations, checkout, order totals, and accessibility checks on the [Swag Labs (Saucedemo)](https://www.saucedemo.com/) application.

---

## Technologies Used

- **Testing Framework:** [Playwright Test](https://playwright.dev/)
- **Accessibility:** [axe-core](https://github.com/dequelabs/axe-core)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Linter:** [ESLint](https://eslint.org/)
- **CI/CD:** [GitHub Actions](https://github.com/features/actions)

---

## Test Coverage

This test suite covers the main user flows across the application lifecycle:

- **Authentication (`/`):** Validates successful and unsuccessful login attempts, locked-user behavior, required fields, unusual credential inputs, boundary inputs, and script-like input handling.
- **Inventory (`/inventory.html`):** Exercises product selection, menu interactions, and application state resets.
- **Shopping Cart (`/cart.html`):** Validates cart contents, product removal, empty-cart behavior, and the checkout entry point.
- **Checkout Workflows (`/checkout-step-one.html` & `/checkout-step-two.html`):**
  - Form validation and required field warnings.
  - Precise verification of subtotal, tax, and order totals.
- **Order Completion (`/checkout-complete.html`):** Verifies order confirmation and navigation back to the inventory page.

---

## Framework design

| Component             | Responsibility                                                          |
| --------------------- | ----------------------------------------------------------------------- |
| Page Objects          | Encapsulate page locators and reusable user actions                     |
| Page Manager          | Provides centralized access to the page objects                         |
| JSON test data        | Separates credential and checkout variations from test logic            |
| Authentication setup  | Creates reusable browser storage state for authenticated tests          |
| Accessibility fixture | Configures reusable Axe checks for WCAG 2.1 AA                          |
| Playwright projects   | Separate logged-out and authenticated tests across Chromium and Firefox |

Authenticated projects depend on a setup project that logs in once and saves the storage state. Login tests use an empty storage state so authentication behavior is tested independently.

---

## Known failures and scope decisions

The suite uses Playwright annotations according to the reason a scenario cannot pass normally:

- `test.fail()` identifies a reproducible known failure. The test still executes, collects evidence, and reports an unexpected pass if the behavior is fixed.
- `test.skip()` identifies a scenario that is not currently enforceable because the expected behavior is not documented.
- `test.fixme()` is reserved for tests that cannot execute because the test implementation or supporting framework requires repair. No current tests use this annotation.

### Expected failures

| Area                | Finding                                                                                          | Treatment     |
| ------------------- | ------------------------------------------------------------------------------------------------ | ------------- |
| Login accessibility | Automated analysis identifies accessibility best-practice violations                             | `test.fail()` |
| Inventory reset     | Reset App State clears the cart badge but does not update the product buttons in the current DOM | `test.fail()` |
| Cart accessibility  | Automated analysis identifies semantic HTML violations                                           | `test.fail()` |

### Skipped requirement-dependent scenarios

| Area                       | Scenarios                                                  | Reason                                         |
| -------------------------- | ---------------------------------------------------------- | ---------------------------------------------- |
| Empty-cart checkout        | Preventing checkout when the cart contains no products     | Expected behavior is not documented            |
| Checkout field validation  | Numeric, special-character, and field-length restrictions  | Accepted formats and limits are not documented |
| Direct checkout navigation | Redirecting users who access later checkout pages directly | Navigation restrictions are not documented     |

These scenarios are preserved as potential requirements and are not presented as confirmed application defects.

---

## CI pipeline

GitHub Actions runs the workflow on every push and pull request targeting `main`.

The pipeline:

1. Installs dependencies using `npm ci`.
2. Runs strict TypeScript type checking.
3. Runs ESLint.
4. Executes the tests in separate Chromium and Firefox matrix jobs.
5. Uploads a browser-specific HTML report for 30 days, including available failure diagnostics.

In CI, failed tests are retried twice with one worker for more stable execution. Playwright retains a trace on the first retry, screenshots on failure, and videos for failed tests.

---

## How to run locally

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v20 or higher)
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
