import { products } from "../data/inventory";

export interface WarehouseProduct {
  sku: string;
  name: string;
  quantity: number;
  inStock: boolean;
}

/**
 * Simulates the external warehouse API.
 *
 * This service boundary allows the data source to be replaced later
 * without changing the GraphQL resolvers.
 */
export async function fetchWarehouseInventory(): Promise<WarehouseProduct[]> {
  return products;
}

/**
 * Fetch a single product from the warehouse API by SKU.
 */
export async function fetchWarehouseProduct(
  sku: string
): Promise<WarehouseProduct | undefined> {
  const inventory = await fetchWarehouseInventory();

  return inventory.find((product) => product.sku === sku);
}
