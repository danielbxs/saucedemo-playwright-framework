import { mergeTests } from "@playwright/test";
import { test as pageTest, expect } from "../fixtures/PageFixtures";
import { test as a11yTest } from "../fixtures/checka11y";
import { singleCheckout } from "../test-data/checkoutData.json";
import {
  missing,
  numeric,
  special,
  boundary,
} from "../test-data/invalidCheckoutData.json";
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

const test = mergeTests(pageTest, a11yTest);

test.describe("Checkout Functionality", () => {
  test.beforeEach(async ({ page, inventoryPage, cartPage }) => {
    await page.goto(inventoryUrl);
    await inventoryPage.addProductToCartByName("Sauce Labs Fleece Jacket");
    await inventoryPage.addProductToCartByName("Sauce Labs Onesie");
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
  });

  test(`should complete the checkout flow successfully`, async ({
    page,
    checkoutPage,
  }) => {
    await expect(page).toHaveURL(checkoutStepOneRegExp);
    await expect(checkoutPage.checkoutTitle).toHaveText("Checkout: Your Information");
    await checkoutPage.fillInformation(
      singleCheckout.firstName,
      singleCheckout.lastName,
      singleCheckout.zipCode,
    );
    await expect(page).toHaveURL(checkoutStepTwoRegExp);
    await expect(checkoutPage.checkoutTitle).toHaveText("Checkout: Overview");
    await expect(checkoutPage.summaryContainer).toBeVisible();
    await expect(checkoutPage.finishButton).toBeEnabled();
    await checkoutPage.finishCheckout();
    await expect(page).toHaveURL(checkoutCompleteRegExp);
    await expect(checkoutPage.checkoutTitle).toHaveText("Checkout: Complete!");
    await expect(checkoutPage.confirmationImage).toBeVisible();
    await expect(checkoutPage.confirmationHeading).toBeVisible();
    await expect(checkoutPage.generatePdfButton).toBeEnabled();
    await expect(checkoutPage.backHomeButton).toBeEnabled();
    await checkoutPage.completeCheckout();
    await expect(page).toHaveURL(inventoryRegExp);
  });

  test("should accurately calculate subtotal, tax, and total", async ({
    page,
    checkoutPage,
  }) => {
    await expect(page).toHaveURL(checkoutStepOneRegExp);
    await expect(checkoutPage.checkoutTitle).toHaveText("Checkout: Your Information");
    await checkoutPage.fillInformation(
      singleCheckout.firstName,
      singleCheckout.lastName,
      singleCheckout.zipCode,
    );
    await expect(page).toHaveURL(checkoutStepTwoRegExp);
    const subtotalText = await checkoutPage.subtotalLabel.textContent();
    const subtotal = parseFloat(subtotalText?.split("$")[1] || "0");
    const taxText = await checkoutPage.taxLabel.textContent();
    const tax = parseFloat(taxText?.split("$")[1] || "0");
    const totalText = await checkoutPage.totalLabel.textContent();
    const total = parseFloat(totalText?.split("$")[1] || "0");
    expect(+(subtotal + tax).toFixed(2)).toBe(total);
  });

  missing.forEach(({ field, firstName, lastName, zipCode, errorMessage }) => {
    test(`should display an error when ${field} is empty`, async ({
      page,
      checkoutPage,
    }) => {
      await expect(page).toHaveURL(checkoutStepOneRegExp);
      await expect(checkoutPage.checkoutTitle).toHaveText("Checkout: Your Information");
      await checkoutPage.fillInformation(firstName, lastName, zipCode);
      await expect(checkoutPage.errorMessage).toBeVisible();
      await expect(checkoutPage.errorMessage).toHaveText(errorMessage);
    });
  });

  numeric.forEach(({ field, firstName, lastName, zipCode, errorMessage }) => {
    test.skip(`should display an error when ${field} contains numbers`, async ({
      page,
      checkoutPage,
    }) => {
      await expect(page).toHaveURL(checkoutStepOneRegExp);
      await expect(checkoutPage.checkoutTitle).toHaveText("Checkout: Your Information");
      await checkoutPage.fillInformation(firstName, lastName, zipCode);
      await expect(checkoutPage.errorMessage).toBeVisible();
      await expect(checkoutPage.errorMessage).toHaveText(errorMessage);
    });
  });

  special.forEach(({ field, firstName, lastName, zipCode, errorMessage }) => {
    test.skip(`should display an error when ${field} contains special characters`, async ({
      page,
      checkoutPage,
    }) => {
      await expect(page).toHaveURL(checkoutStepOneRegExp);
      await expect(checkoutPage.checkoutTitle).toHaveText("Checkout: Your Information");
      await checkoutPage.fillInformation(firstName, lastName, zipCode);
      await expect(checkoutPage.errorMessage).toBeVisible();
      await expect(checkoutPage.errorMessage).toHaveText(errorMessage);
    });
  });

  test("should stay on the same page when refreshing during checkout", async ({
    page,
    checkoutPage,
  }) => {
    await expect(page).toHaveURL(checkoutStepOneRegExp);
    await expect(checkoutPage.checkoutTitle).toHaveText("Checkout: Your Information");
    await page.reload();
    await expect(page).toHaveURL(checkoutStepOneRegExp);
    await expect(checkoutPage.checkoutTitle).toHaveText("Checkout: Your Information");
  });

  test("should go back to cart when canceling on step one", async ({
    page,
    checkoutPage,
  }) => {
    await expect(page).toHaveURL(checkoutStepOneRegExp);
    await expect(checkoutPage.checkoutTitle).toHaveText("Checkout: Your Information");
    await checkoutPage.cancelCheckout();
    await expect(page).toHaveURL(cartRegExp);
  });

  test("should go back to inventory page when canceling on step two", async ({
    page,
    checkoutPage,
  }) => {
    await expect(page).toHaveURL(checkoutStepOneRegExp);
    await expect(checkoutPage.checkoutTitle).toHaveText("Checkout: Your Information");
    await checkoutPage.fillInformation(
      singleCheckout.firstName,
      singleCheckout.lastName,
      singleCheckout.zipCode,
    );
    await expect(page).toHaveURL(checkoutStepTwoRegExp);
    await checkoutPage.cancelCheckout();
    await expect(page).toHaveURL(inventoryRegExp);
  });

  test("should go back to cart when navigating back in browser on step one", async ({
    page,
    checkoutPage,
  }) => {
    await expect(page).toHaveURL(checkoutStepOneRegExp);
    await expect(checkoutPage.checkoutTitle).toHaveText("Checkout: Your Information");
    await page.goBack();
    await expect(page).toHaveURL(cartRegExp);
  });

  test("should go back to step one when navigating back in browser on step two", async ({
    page,
    checkoutPage,
  }) => {
    await expect(page).toHaveURL(checkoutStepOneRegExp);
    await expect(checkoutPage.checkoutTitle).toHaveText("Checkout: Your Information");
    await checkoutPage.fillInformation(
      singleCheckout.firstName,
      singleCheckout.lastName,
      singleCheckout.zipCode,
    );
    await expect(page).toHaveURL(checkoutStepTwoRegExp);
    await page.goBack();
    await expect(page).toHaveURL(checkoutStepOneRegExp);
  });

  test.skip("should be redirected back to step one when navigating directly to step two", async ({
    page,
  }) => {
    await page.goto(checkoutStepTwoUrl);
    await expect(page).toHaveURL(checkoutStepOneRegExp);
  });

  test.skip("should be redirected back to inventory when navigating directly to checkout complete page with an empty cart", async ({
    page,
    checkoutPage,
    cartPage,
  }) => {
    await checkoutPage.cancelCheckout();
    await cartPage.removeProductFromCartByName("Sauce Labs Fleece Jacket");
    await cartPage.removeProductFromCartByName("Sauce Labs Onesie");
    await page.goto(checkoutCompleteUrl);
    await expect(page).toHaveURL(inventoryRegExp);
  });

  boundary.forEach(({ field, firstName, lastName, zipCode, errorMessage }) => {
    test.skip(`should validate field length for ${field}`, async ({
      page,
      checkoutPage,
    }) => {
      await expect(page).toHaveURL(checkoutStepOneRegExp);
      await expect(checkoutPage.checkoutTitle).toHaveText("Checkout: Your Information");
      await checkoutPage.fillInformation(firstName, lastName, zipCode);
      await expect(checkoutPage.errorMessage).toBeVisible();
      await expect(checkoutPage.errorMessage).toHaveText(errorMessage);
    });
  });

  test("should meet forms accessibility guidelines", async ({ page, axe }) => {
    await expect(page).toHaveURL(checkoutStepOneRegExp);
    const pageOneResults = await axe({ extraTags: ["cat.forms"] }).analyze();
    expect(pageOneResults.violations).toEqual([]);
  });
});
