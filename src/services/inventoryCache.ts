import type { WarehouseProduct } from "./warehouseApi";

let cachedInventory: WarehouseProduct[] = [];

let lastUpdatedAt: Date | null = null;

export function updateInventoryCache(
  inventory: WarehouseProduct[]
): void {
  cachedInventory = [...inventory];
  lastUpdatedAt = new Date();
}

export function getCachedInventory(): WarehouseProduct[] {
  return cachedInventory;
}

export function getCachedProduct(
  sku: string
): WarehouseProduct | undefined {
  return cachedInventory.find((product) => product.sku === sku);
}

export function getCacheLastUpdated(): Date | null {
  return lastUpdatedAt;
}
