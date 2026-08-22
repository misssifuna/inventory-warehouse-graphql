import {
  getCachedInventory,
  getCachedProduct,
  getCacheLastUpdated,
} from "../services/inventoryCache";

const resolvers = {
  Query: {
    products: () => getCachedInventory(),

    product: (_: unknown, args: { sku: string }) =>
      getCachedProduct(args.sku),

    inventoryStatus: () => ({
      lastUpdatedAt: getCacheLastUpdated()?.toISOString() ?? null,
      productCount: getCachedInventory().length,
    }),
  },
};

export { resolvers };

