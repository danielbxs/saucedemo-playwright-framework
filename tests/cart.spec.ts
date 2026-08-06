import { test, expect } from "@playwright/test";
import { PageManager } from "../pages/PageManager";
import { test as checka11yTest } from "../fixtures/checka11y";

test.describe("Cart Functionality", () => {
  let pm: PageManager;
  test.beforeEach(async ({ page }) => {
    await page.goto("/inventory.html");
    pm = new PageManager(page);
    await pm.onInventoryPage().addProductToCartByName("Sauce Labs Backpack");
    await pm.onInventoryPage().addProductToCartByName("Sauce Labs Onesie");
    await pm.onInventoryPage().goToCart();
  });

  test("should contain the correct items added to the cart", async () => {
    await expect(pm.onCartPage().getCartItemByName("Sauce Labs Backpack")).toBeVisible();
    await expect(pm.onCartPage().getCartItemByName("Sauce Labs Onesie")).toBeVisible();
  });

  test("should remove item from cart when remove button is clicked", async () => {
    await pm.onCartPage().removeProductFromCartByName("Sauce Labs Onesie");
    await expect(pm.onCartPage().getCartItemByName("Sauce Labs Onesie")).not.toBeVisible();
  });

  test("should be empty when all items are removed", async () => {
    await pm.onCartPage().removeProductFromCartByName("Sauce Labs Backpack");
    await pm.onCartPage().removeProductFromCartByName("Sauce Labs Onesie");
    await expect(pm.onCartPage().getCartItems()).toHaveCount(0);
  });

  test.fixme("should not be able to checkout with an empty cart", async ({ page }) => {
    await pm.onCartPage().proceedToCheckout();
    await expect(pm.onCartPage().checkoutButton).toBeDisabled();
    await expect(page).toHaveURL("/cart.html");
  });

  checka11yTest.fixme("should meet semantics accessibility guidelines", async ({ axe }) => {
    const semanticsResults = await axe({ extraTags: ["cat.semantics"] }).analyze();
    expect(semanticsResults.violations).toEqual([]);
  });
});
