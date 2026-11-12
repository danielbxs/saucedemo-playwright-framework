import { mergeTests } from "@playwright/test";
import { test as pageTest, expect } from "../fixtures/PageFixtures";
import { test as a11yCheck } from "../fixtures/checka11y";
import { inventoryUrl } from "../lib/constants";

const test = mergeTests(pageTest, a11yCheck);

test.describe("Cart Functionality", () => {
  test.beforeEach(async ({ page, inventoryPage }) => {
    await page.goto(inventoryUrl);
    await inventoryPage.addProductToCartByName("Sauce Labs Backpack");
    await inventoryPage.addProductToCartByName("Sauce Labs Onesie");
    await inventoryPage.goToCart();
  });

  test("should contain the correct items added to the cart", async ({ cartPage }) => {
    await expect(cartPage.getCartItemByName("Sauce Labs Backpack")).toBeVisible();
    await expect(cartPage.getCartItemByName("Sauce Labs Onesie")).toBeVisible();
  });

  test("should remove item from cart when remove button is clicked", async ({
    cartPage,
  }) => {
    await cartPage.removeProductFromCartByName("Sauce Labs Onesie");
    await expect(cartPage.getCartItemByName("Sauce Labs Onesie")).not.toBeVisible();
  });

  test("should be empty when all items are removed", async ({ cartPage }) => {
    await cartPage.removeProductFromCartByName("Sauce Labs Backpack");
    await cartPage.removeProductFromCartByName("Sauce Labs Onesie");
    await expect(cartPage.getCartItems()).toHaveCount(0);
  });

  test.skip("should not be able to checkout with an empty cart", async ({
    page,
    cartPage,
  }) => {
    await cartPage.proceedToCheckout();
    await expect(cartPage.checkoutButton).toBeDisabled();
    await expect(page).toHaveURL("/cart.html");
  });

  test.fail("should meet semantics accessibility guidelines", async ({ axe }) => {
    const semanticsResults = await axe({ extraTags: ["cat.semantics"] }).analyze();
    expect(semanticsResults.violations).toEqual([]);
  });
});
