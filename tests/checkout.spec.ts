import { test, expect } from "@playwright/test";
import { PageManager } from "../pages/PageManager";
import { test as checka11yTest } from "../fixtures/checka11y";
import checkoutData from "../test-data/checkoutData.json";
import invalidCheckoutData from "../test-data/invalidCheckoutData.json";

test.describe("Checkout Functionality", () => {
  let pm: PageManager;
  test.beforeEach(async ({ page }) => {
    await page.goto("/inventory.html");
    pm = new PageManager(page);
    await pm.onInventoryPage().addProductToCartByName("Sauce Labs Fleece Jacket");
    await pm.onInventoryPage().addProductToCartByName("Sauce Labs Onesie");
    await pm.onInventoryPage().goToCart();
    await pm.onCartPage().proceedToCheckout();
  });

  checkoutData.validCheckout.forEach(({ firstName, lastName, zipCode }) => {
    test(`should complete the checkout flow successfully for ${firstName} ${lastName} ${zipCode}`, async ({ page }) => {
      await expect(page).toHaveURL(/.*checkout-step-one.html$/);
      await expect(pm.onCheckoutPage().checkoutTitle).toHaveText("Checkout: Your Information");
      await pm.onCheckoutPage().fillInformation(firstName, lastName, zipCode);
      await expect(page).toHaveURL(/.*checkout-step-two.html$/);
      await expect(pm.onCheckoutPage().checkoutTitle).toHaveText("Checkout: Overview");
      await expect(pm.onCheckoutPage().summaryContainer).toBeVisible();
      await expect(pm.onCheckoutPage().finishButton).toBeEnabled();
      await pm.onCheckoutPage().finishCheckout();
      await expect(page).toHaveURL(/.*checkout-complete.html$/);
      await expect(pm.onCheckoutPage().checkoutTitle).toHaveText("Checkout: Complete!");
      await expect(pm.onCheckoutPage().confirmationImage).toBeVisible();
      await expect(pm.onCheckoutPage().confirmationHeading).toBeVisible();
      await expect(pm.onCheckoutPage().generatePdfButton).toBeEnabled();
      await expect(pm.onCheckoutPage().backHomeButton).toBeEnabled();
      await pm.onCheckoutPage().completeCheckout();
      await expect(page).toHaveURL(/.*inventory.html$/);
    });
  });

  invalidCheckoutData.forEach(({ firstName, lastName, zipCode, errorMessage }) => {
    test(`should display an ${errorMessage} when fillling form with missing data`, async ({ page }) => {
      await expect(page).toHaveURL(/.*checkout-step-one.html$/);
      await expect(pm.onCheckoutPage().checkoutTitle).toHaveText("Checkout: Your Information");
      await pm.onCheckoutPage().fillInformation(firstName, lastName, zipCode);
      await expect(pm.onCheckoutPage().errorMessage).toBeVisible();
      await expect(pm.onCheckoutPage().errorMessage).toHaveText(errorMessage);
      await expect(pm.onCheckoutPage().closeErrorButton).toBeVisible();
      await pm.onCheckoutPage().closeErrorMessage();
    });
  });

  test("should accurately calculate subtotal, tax, and total", async ({ page }) => {
    await expect(page).toHaveURL(/.*checkout-step-one.html$/);
    await expect(pm.onCheckoutPage().checkoutTitle).toHaveText("Checkout: Your Information");
    await pm
      .onCheckoutPage()
      .fillInformation(checkoutData.singleCheckout.firstName, checkoutData.singleCheckout.lastName, checkoutData.singleCheckout.zipCode);
    await expect(page).toHaveURL(/.*checkout-step-two.html$/);
    const subtotalText = await pm.onCheckoutPage().subtotalLabel.textContent();
    const subtotal = parseFloat(subtotalText?.split("$")[1] || "0");
    const taxText = await pm.onCheckoutPage().taxLabel.textContent();
    const tax = parseFloat(taxText?.split("$")[1] || "0");
    const totalText = await pm.onCheckoutPage().totalLabel.textContent();
    const total = parseFloat(totalText?.split("$")[1] || "0");
    expect(+(subtotal + tax).toFixed(2)).toBe(total);
  });

  checka11yTest("should meet forms accessibility guidelines", async ({ page, axe }) => {
    await expect(page).toHaveURL(/.*checkout-step-one.html$/);
    const pageOneResults = await axe({ extraTags: ["cat.forms"] }).analyze();
    expect(pageOneResults.violations).toEqual([]);
  });
});
