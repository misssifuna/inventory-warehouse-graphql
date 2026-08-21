const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

// GraphQL schema
const typeDefs = `#graphql
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

// Temporary warehouse data
const products = [
  {
    sku: "SKU-001",
    name: "Wireless Mouse",
    quantity: 42,
    inStock: true,
  },
  {
    sku: "SKU-002",
    name: "USB Keyboard",
    quantity: 0,
    inStock: false,
  },
  {
    sku: "SKU-003",
    name: "HDMI Cable",
    quantity: 15,
    inStock: true,
  },
];

// GraphQL resolvers
const resolvers = {
  Query: {
    products: () => products,

    product: (_, args) => {
      return products.find((product) => product.sku === args.sku);
    },
  },
};

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the server
startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`🚀 GraphQL server ready at ${url}`);
});

