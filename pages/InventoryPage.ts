import { Page, Locator } from "@playwright/test";
import { MenuItem, ProductName, FilterOption, ProductPosition } from "../lib/types";
import { formatProductName } from "../lib/utils";

export class InventoryPage {
  readonly page: Page;
  readonly openMenu: Locator;
  readonly closeMenu: Locator;
  readonly shoppingCart: Locator;
  readonly shoppingCartBadge: Locator;
  readonly filterSelect: Locator;
  readonly activeFilter: Locator;
  readonly productList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.openMenu = page.getByRole("button", { name: "Open Menu" });
    this.closeMenu = page.getByRole("button", { name: "Close Menu" });
    this.shoppingCart = page.getByTestId("shopping-cart-link");
    this.shoppingCartBadge = page.getByTestId("shopping-cart-badge");
    this.filterSelect = page.getByTestId("product-sort-container");
    this.activeFilter = page.getByTestId("active-option");
    this.productList = page.getByTestId("inventory-list");
  }

  /**
   * Helper function that opens the side menu if it is closed
   */

  private async ensureMenuIsOpen() {
    if (!(await this.closeMenu.isVisible())) {
      await this.openMenu.click();
    }
  }

  /**
   * Private helper that generates a locator for a side menu link.
   * @param menuItemName The text of the menu item link to target
   * @returns Locator pointing to the menu item
   */
  private selectMenuItem(menuItemName: MenuItem) {
    return this.page.getByRole("link", { name: menuItemName });
  }

  /**
   * Opens the side menu and clicks an option.
   * @param menuItem The menu item option to click (e.g., "Logout", "Reset App State")
   */
  async clickMenuOption(menuItem: MenuItem) {
    await this.ensureMenuIsOpen();
    const item = this.selectMenuItem(menuItem);
    await item.click();
  }

  /**
   * Selects the "Add to cart" button of a specific product
   * @param productName Full product display name e.g., "Sauce Labs Backpack"
   * @returns A locator pointing to the specific product's add to cart button
   */
  getAddToCartButton(productName: ProductName) {
    const product = formatProductName(productName);
    return this.page.getByTestId(`add-to-cart-${product}`);
  }

  /**
   * Adds a specific item to the shopping cart by its product name.
   * @param productName Name of the product to add to the cart
   */
  async addProductToCartByName(productName: ProductName) {
    const productToBeAdded = formatProductName(productName);
    await this.page.getByTestId(`add-to-cart-${productToBeAdded}`).click();
  }

  /**
   * Removes a specific item from the shopping cart by its product name.
   * @param productName Name of the product to remove from the cart
   */
  async removeProductFromCartByName(productName: ProductName) {
    const productToBeRemoved = formatProductName(productName);
    await this.page.getByTestId(`remove-${productToBeRemoved}`).click();
  }

  /**
   * Selects a filter option from the product filter dropdown.
   * @param filterOption Option code: 'az' (Name A-Z), 'za' (Name Z-A), 'lohi' (Price Low-High), or 'hilo' (Price High-Low)
   */
  async selectFilterOption(filterOption: FilterOption) {
    await this.filterSelect.selectOption(filterOption);
  }

  /**
   * Gets all the product prices.
   * @returns an array with all the item prices e.g. ["$7.99", "$9.99", "$15.99"]
   */

  async getProductPrices(): Promise<string[]> {
    return this.productList.getByTestId("inventory-item").getByTestId("inventory-item-price").allTextContents();
  }

  /**
   * Clicks the shopping cart icon to navigate to the Cart page.
   */
  async goToCart() {
    await this.shoppingCart.click();
  }
}
