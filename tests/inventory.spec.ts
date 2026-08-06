import { test, expect } from "@playwright/test";
import { PageManager } from "../pages/PageManager";
import { test as checka11yTest } from "../fixtures/checka11y";

test.describe("Inventory Functionality", () => {
  let pm: PageManager;
  test.beforeEach(async ({ page }) => {
    pm = new PageManager(page);
    await page.goto("/inventory.html");
  });

  test("should display products sorted by price in ascending order", async () => {
    await pm.onInventoryPage().selectFilterOption("lohi");
    const firstProductPrice = await pm.onInventoryPage().getProductPriceFromPosition(0);
    await expect(firstProductPrice).toHaveText("$7.99");
  });
  test("should display products sorted by price in descending order", async () => {
    await pm.onInventoryPage().selectFilterOption("hilo");
    const firstProductPrice = await pm.onInventoryPage().getProductPriceFromPosition(0);
    await expect(firstProductPrice).toHaveText("$49.99");
  });

  test("should update the cart badge after adding a product", async () => {
    await pm.onInventoryPage().addProductToCartByName("Sauce Labs Backpack");
    await expect(pm.onInventoryPage().shoppingCartBadge).toBeVisible();
    await expect(pm.onInventoryPage().shoppingCartBadge).toHaveText("1");
  });

  test("should update the cart badge after removing a product", async () => {
    await pm.onInventoryPage().addProductToCartByName("Sauce Labs Backpack");
    await pm.onInventoryPage().addProductToCartByName("Sauce Labs Onesie");
    await pm.onInventoryPage().removeProductFromCartByName("Sauce Labs Backpack");
    await expect(pm.onInventoryPage().shoppingCartBadge).toHaveText("1");
  });

  test("should remove the cart badge after cart is empty", async () => {
    await pm.onInventoryPage().addProductToCartByName("Sauce Labs Backpack");
    await pm.onInventoryPage().removeProductFromCartByName("Sauce Labs Backpack");
    await expect(pm.onInventoryPage().shoppingCartBadge).not.toBeVisible();
  });

  test("should be redirected to new website when clicking about link on menu", async ({ page }) => {
    await pm.onInventoryPage().clickMenuOption("About");
    await expect(page).toHaveURL(/.*saucelabs\.com.*/);
  });

  test.fixme("should open side menu and reset app state", async () => {
    await pm.onInventoryPage().addProductToCartByName("Sauce Labs Bike Light");
    await pm.onInventoryPage().addProductToCartByName("Sauce Labs Fleece Jacket");
    await pm.onInventoryPage().clickMenuOption("Reset App State");
    await expect(pm.onInventoryPage().shoppingCartBadge).not.toBeVisible();
    await expect(pm.onInventoryPage().getAddToCartButton("Sauce Labs Bike Light")).toHaveText("Add to cart");
    await expect(pm.onInventoryPage().getAddToCartButton("Sauce Labs Fleece Jacket")).toHaveText("Add to cart");
  });

  checka11yTest("should meet color accessibility guidelines", async ({ axe }) => {
    const colorResults = await axe({ extraTags: ["cat.color"] }).analyze();
    expect(colorResults.violations).toEqual([]);
  });
});
