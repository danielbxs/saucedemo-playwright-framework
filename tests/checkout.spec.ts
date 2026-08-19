import { test, expect } from "@playwright/test";
import { PageManager } from "../pages/PageManager";
import { test as checka11yTest } from "../fixtures/checka11y";
import { singleCheckout } from "../test-data/checkoutData.json";
import { missing, numeric, special, boundary } from "../test-data/invalidCheckoutData.json";
import {
  cartRegExp,
  checkoutCompleteRegExp,
  checkoutCompleteUrl,
  checkoutStepOneRegExp,
  checkoutStepTwoRegExp,
  checkoutStepTwoUrl,
  inventoryRegExp,
  inventoryUrl,
} from "../lib/constants";

test.describe("Checkout Functionality", () => {
  let pm: PageManager;

  test.beforeEach(async ({ page }) => {
    await page.goto(inventoryUrl);
    pm = new PageManager(page);
    await pm.onInventoryPage().addProductToCartByName("Sauce Labs Fleece Jacket");
    await pm.onInventoryPage().addProductToCartByName("Sauce Labs Onesie");
    await pm.onInventoryPage().goToCart();
    await pm.onCartPage().proceedToCheckout();
  });

  test(`should complete the checkout flow successfully`, async ({ page }) => {
    await expect(page).toHaveURL(checkoutStepOneRegExp);
    await expect(pm.onCheckoutPage().checkoutTitle).toHaveText("Checkout: Your Information");
    await pm.onCheckoutPage().fillInformation(singleCheckout.firstName, singleCheckout.lastName, singleCheckout.zipCode);
    await expect(page).toHaveURL(checkoutStepTwoRegExp);
    await expect(pm.onCheckoutPage().checkoutTitle).toHaveText("Checkout: Overview");
    await expect(pm.onCheckoutPage().summaryContainer).toBeVisible();
    await expect(pm.onCheckoutPage().finishButton).toBeEnabled();
    await pm.onCheckoutPage().finishCheckout();
    await expect(page).toHaveURL(checkoutCompleteRegExp);
    await expect(pm.onCheckoutPage().checkoutTitle).toHaveText("Checkout: Complete!");
    await expect(pm.onCheckoutPage().confirmationImage).toBeVisible();
    await expect(pm.onCheckoutPage().confirmationHeading).toBeVisible();
    await expect(pm.onCheckoutPage().generatePdfButton).toBeEnabled();
    await expect(pm.onCheckoutPage().backHomeButton).toBeEnabled();
    await pm.onCheckoutPage().completeCheckout();
    await expect(page).toHaveURL(inventoryRegExp);
  });

  test("should accurately calculate subtotal, tax, and total", async ({ page }) => {
    await expect(page).toHaveURL(checkoutStepOneRegExp);
    await expect(pm.onCheckoutPage().checkoutTitle).toHaveText("Checkout: Your Information");
    await pm.onCheckoutPage().fillInformation(singleCheckout.firstName, singleCheckout.lastName, singleCheckout.zipCode);
    await expect(page).toHaveURL(checkoutStepTwoRegExp);
    const subtotalText = await pm.onCheckoutPage().subtotalLabel.textContent();
    const subtotal = parseFloat(subtotalText?.split("$")[1] || "0");
    const taxText = await pm.onCheckoutPage().taxLabel.textContent();
    const tax = parseFloat(taxText?.split("$")[1] || "0");
    const totalText = await pm.onCheckoutPage().totalLabel.textContent();
    const total = parseFloat(totalText?.split("$")[1] || "0");
    expect(+(subtotal + tax).toFixed(2)).toBe(total);
  });

  missing.forEach(({ field, firstName, lastName, zipCode, errorMessage }) => {
    test(`should display an error when ${field} is empty`, async ({ page }) => {
      await expect(page).toHaveURL(checkoutStepOneRegExp);
      await expect(pm.onCheckoutPage().checkoutTitle).toHaveText("Checkout: Your Information");
      await pm.onCheckoutPage().fillInformation(firstName, lastName, zipCode);
      await expect(pm.onCheckoutPage().errorMessage).toBeVisible();
      await expect(pm.onCheckoutPage().errorMessage).toHaveText(errorMessage);
    });
  });

  numeric.forEach(({ field, firstName, lastName, zipCode, errorMessage }) => {
    test.fixme(`should display an error when ${field} contains numbers`, async ({ page }) => {
      await expect(page).toHaveURL(checkoutStepOneRegExp);
      await expect(pm.onCheckoutPage().checkoutTitle).toHaveText("Checkout: Your Information");
      await pm.onCheckoutPage().fillInformation(firstName, lastName, zipCode);
      await expect(pm.onCheckoutPage().errorMessage).toBeVisible();
      await expect(pm.onCheckoutPage().errorMessage).toHaveText(errorMessage);
    });
  });

  special.forEach(({ field, firstName, lastName, zipCode, errorMessage }) => {
    test.fixme(`should display an error when ${field} contains special characters`, async ({ page }) => {
      await expect(page).toHaveURL(checkoutStepOneRegExp);
      await expect(pm.onCheckoutPage().checkoutTitle).toHaveText("Checkout: Your Information");
      await pm.onCheckoutPage().fillInformation(firstName, lastName, zipCode);
      await expect(pm.onCheckoutPage().errorMessage).toBeVisible();
      await expect(pm.onCheckoutPage().errorMessage).toHaveText(errorMessage);
    });
  });

  test("should stay on the same page when refreshing during checkout", async ({ page }) => {
    await expect(page).toHaveURL(checkoutStepOneRegExp);
    await expect(pm.onCheckoutPage().checkoutTitle).toHaveText("Checkout: Your Information");
    await page.reload();
    await expect(page).toHaveURL(checkoutStepOneRegExp);
    await expect(pm.onCheckoutPage().checkoutTitle).toHaveText("Checkout: Your Information");
  });

  test("should go back to cart when canceling on step one", async ({ page }) => {
    await expect(page).toHaveURL(checkoutStepOneRegExp);
    await expect(pm.onCheckoutPage().checkoutTitle).toHaveText("Checkout: Your Information");
    await pm.onCheckoutPage().cancelCheckout();
    await expect(page).toHaveURL(cartRegExp);
  });

  test("should go back to inventory page when canceling on step two", async ({ page }) => {
    await expect(page).toHaveURL(checkoutStepOneRegExp);
    await expect(pm.onCheckoutPage().checkoutTitle).toHaveText("Checkout: Your Information");
    await pm.onCheckoutPage().fillInformation(singleCheckout.firstName, singleCheckout.lastName, singleCheckout.zipCode);
    await expect(page).toHaveURL(checkoutStepTwoRegExp);
    await pm.onCheckoutPage().cancelCheckout();
    await expect(page).toHaveURL(inventoryRegExp);
  });

  test("should go back to cart when navigating back in browser on step one", async ({ page }) => {
    await expect(page).toHaveURL(checkoutStepOneRegExp);
    await expect(pm.onCheckoutPage().checkoutTitle).toHaveText("Checkout: Your Information");
    await page.goBack();
    await expect(page).toHaveURL(cartRegExp);
  });

  test("should go back to step one when navigating back in browser on step two", async ({ page }) => {
    await expect(page).toHaveURL(checkoutStepOneRegExp);
    await expect(pm.onCheckoutPage().checkoutTitle).toHaveText("Checkout: Your Information");
    await pm.onCheckoutPage().fillInformation(singleCheckout.firstName, singleCheckout.lastName, singleCheckout.zipCode);
    await expect(page).toHaveURL(checkoutStepTwoRegExp);
    await page.goBack();
    await expect(page).toHaveURL(checkoutStepOneRegExp);
  });

  test.fixme("should be redirected back to step one when navigating directly to step two", async ({ page }) => {
    await page.goto(checkoutStepTwoUrl);
    await expect(page).toHaveURL(checkoutStepOneRegExp);
  });
  test.fixme("should be redirected back to inventory when navigating directly to checkout complete page", async ({ page }) => {
    await page.goto(checkoutCompleteUrl);
    await expect(page).toHaveURL(inventoryRegExp);
  });

  boundary.forEach(({ field, firstName, lastName, zipCode, errorMessage }) => {
    test.fixme(`should validate field length for ${field}`, async ({ page }) => {
      await expect(page).toHaveURL(checkoutStepOneRegExp);
      await expect(pm.onCheckoutPage().checkoutTitle).toHaveText("Checkout: Your Information");
      await pm.onCheckoutPage().fillInformation(firstName, lastName, zipCode);
      await expect(pm.onCheckoutPage().errorMessage).toBeVisible();
      await expect(pm.onCheckoutPage().errorMessage).toHaveText(errorMessage);
    });
  });

  checka11yTest("should meet forms accessibility guidelines", async ({ page, axe }) => {
    await expect(page).toHaveURL(checkoutStepOneRegExp);
    const pageOneResults = await axe({ extraTags: ["cat.forms"] }).analyze();
    expect(pageOneResults.violations).toEqual([]);
  });
});
