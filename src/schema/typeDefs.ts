export const typeDefs = `#graphql
  type Product {
    sku: ID!
    name: String!
    quantity: Int!
    inStock: Boolean!
  }

  type Query {
    products: [Product!]!
    product(sku: ID!): Product
  }
`;
