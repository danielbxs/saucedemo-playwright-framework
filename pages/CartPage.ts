import { Page, Locator } from "@playwright/test";
import { ProductName } from "../lib/types";
import { formatProductName } from "../lib/utils";

export class CartPage {
  readonly page: Page;
  readonly productList: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productList = page.getByTestId("cart-list");
    this.checkoutButton = page.getByRole("button", { name: "Checkout" });
  }

  /**
   * Gets a Locator pointing to a specific cart item text node by its product name.
   * Useful for web-first assertions in spec files.
   * @param productName Full product display name
   * @returns Locator for the matching product text inside the cart list
   */
  getCartItemByName(productName: ProductName): Locator {
    return this.page.getByTestId("inventory-item").getByText(productName);
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
  * Returns a list of cart items.
   @returns a locator with the list of items in the cart
   */
  getCartItems() {
    return this.productList.getByTestId("inventory-item");
  }

  /**
   * Clicks the Checkout button to proceed to checkout.
   */
  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}
