import { products } from "../data/inventory";

interface ProductArgs {
  sku: string;
}

export const resolvers = {
  Query: {
    products: () => products,

    product: (_: unknown, args: ProductArgs) => {
      return products.find((product) => product.sku === args.sku);
    },
  },
};
