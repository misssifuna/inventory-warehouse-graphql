import {
  getCachedInventory,
  getCachedProduct,
} from "../services/inventoryCache";

const resolvers = {
  Query: {
    products: () => getCachedInventory(),

    product: (_: unknown, args: { sku: string }) =>
      getCachedProduct(args.sku),
  },
};

export { resolvers };
