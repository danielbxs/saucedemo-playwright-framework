import { mergeTests } from "@playwright/test";
import { test as pageTest, expect } from "../fixtures/PageFixtures";
import { test as a11yCheck } from "../fixtures/checka11y";
import { inventoryUrl } from "../lib/constants";
import { formatPrices } from "../lib/utils";

const test = mergeTests(pageTest, a11yCheck);

test.describe("Inventory Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(inventoryUrl);
  });

  test("should display products sorted by price in ascending order", async ({
    inventoryPage,
  }) => {
    await inventoryPage.selectFilterOption("lohi");

    const prices = await inventoryPage.getProductPrices();

    const numericPrices = formatPrices(prices);

    const sortedPrices = [...numericPrices].sort((a, b) => a - b);

    expect(numericPrices).toEqual(sortedPrices);
  });

  test("should display products sorted by price in descending order", async ({
    inventoryPage,
  }) => {
    await inventoryPage.selectFilterOption("hilo");

    const prices = await inventoryPage.getProductPrices();

    const numericPrices = formatPrices(prices);

    const sortedPrices = [...numericPrices].sort((a, b) => b - a);

    expect(numericPrices).toEqual(sortedPrices);
  });

  test("should update the cart badge after adding a product", async ({
    inventoryPage,
  }) => {
    await inventoryPage.addProductToCartByName("Sauce Labs Backpack");
    await expect(inventoryPage.shoppingCartBadge).toBeVisible();
    await expect(inventoryPage.shoppingCartBadge).toHaveText("1");
  });

  test("should update the cart badge after removing a product", async ({
    inventoryPage,
  }) => {
    await inventoryPage.addProductToCartByName("Sauce Labs Backpack");
    await inventoryPage.addProductToCartByName("Sauce Labs Onesie");
    await inventoryPage.removeProductFromCartByName("Sauce Labs Backpack");
    await expect(inventoryPage.shoppingCartBadge).toHaveText("1");
  });

  test("should remove the cart badge after cart is empty", async ({ inventoryPage }) => {
    await inventoryPage.addProductToCartByName("Sauce Labs Backpack");
    await inventoryPage.removeProductFromCartByName("Sauce Labs Backpack");
    await expect(inventoryPage.shoppingCartBadge).not.toBeVisible();
  });

  test("should be redirected to new website when clicking about link on menu", async ({
    page,
    inventoryPage,
  }) => {
    await inventoryPage.clickMenuOption("About");
    await expect(page).toHaveURL(/.*saucelabs\.com.*/);
  });

  test.fail("should open side menu and reset app state", async ({ inventoryPage }) => {
    await inventoryPage.addProductToCartByName("Sauce Labs Bike Light");
    await inventoryPage.addProductToCartByName("Sauce Labs Fleece Jacket");
    await inventoryPage.clickMenuOption("Reset App State");
    await expect(inventoryPage.shoppingCartBadge).not.toBeVisible();
    await expect(inventoryPage.getAddToCartButton("Sauce Labs Bike Light")).toHaveText(
      "Add to cart",
    );
    await expect(inventoryPage.getAddToCartButton("Sauce Labs Fleece Jacket")).toHaveText(
      "Add to cart",
    );
  });

  test("should meet color accessibility guidelines", async ({ axe }) => {
    const colorResults = await axe({ extraTags: ["cat.color"] }).analyze();
    expect(colorResults.violations).toEqual([]);
  });
});
