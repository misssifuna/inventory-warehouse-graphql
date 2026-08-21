import {
  fetchWarehouseInventory,
  fetchWarehouseProduct,
} from "../services/warehouseApi";

const resolvers = {
  Query: {
    products: () => fetchWarehouseInventory(),

    product: (_: unknown, args: { sku: string }) =>
      fetchWarehouseProduct(args.sku),
  },
};

export { resolvers };
