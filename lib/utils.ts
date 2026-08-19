import { ProductName } from "./types";

/**
 * Formats a product name into a slug that matches the data-test attribute.
 * @param productName Full product display name e.g., "Sauce Labs Backpack"
 * @returns Formatted slug e.g., "sauce-labs-backpack"
 */

export function formatProductName(productName: ProductName): string {
  return productName.toLowerCase().split(" ").join("-");
}

/**
 * Formats a price array into numeric values
 * @param prices an array of prices e.g. ["$1.99", "$2.99"]
 * @returns an array with prices with numeric formatting ["1.99", "2.99"]
 */

export function formatPrices(prices: string[]) {
  return prices.map((price) => Number(price.replace("$", "")));
}
