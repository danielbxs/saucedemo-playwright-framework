import { ProductName } from "./types";

/**
 * Formats a product name into a slug that matches the data-test attribute.
 * @param productName Full product display name e.g., "Sauce Labs Backpack"
 * @returns Formatted slug e.g., "sauce-labs-backpack"
 */

export function formatProductName(productName: ProductName): string {
  return productName.toLowerCase().split(" ").join("-");
}
