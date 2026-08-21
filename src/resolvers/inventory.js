const { products } = require("../data/inventory");

const resolvers = {
  Query: {
    products: () => products,

    product: (_, args) => {
      return products.find((product) => product.sku === args.sku);
    },
  },
};

module.exports = { resolvers };
