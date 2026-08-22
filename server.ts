import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { typeDefs } from "./src/schema/typeDefs";
import { resolvers } from "./src/resolvers/inventory";
import { fetchWarehouseInventory } from "./src/services/warehouseApi";
import { updateInventoryCache } from "./src/services/inventoryCache";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  const inventory = await fetchWarehouseInventory();
  updateInventoryCache(inventory);

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`GraphQL server ready at ${url}`);
}

startServer().catch((error) => {
  console.error("Failed to start GraphQL server:", error);
  process.exit(1);
});
