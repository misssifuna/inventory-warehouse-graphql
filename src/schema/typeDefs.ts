const typeDefs = `#graphql
  type Product {
    sku: ID!
    name: String!
    quantity: Int!
    inStock: Boolean!
  }

  type InventoryStatus {
    lastUpdatedAt: String
    productCount: Int!
  }

  type Query {
    products: [Product!]!
    product(sku: ID!): Product
    inventoryStatus: InventoryStatus!
  }
`;

export { typeDefs };

