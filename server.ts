import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { typeDefs } from "./src/schema/typeDefs";
import { resolvers } from "./src/resolvers/checkIn";
import {
  startInventoryPolling,
  stopInventoryPolling,
} from "./src/services/inventoryPoller";
import { startWebhookServer } from "./src/services/webhookServer";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  await startInventoryPolling();

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`GraphQL server ready at ${url}`);
  startWebhookServer();
}

startServer().catch((error) => {
  console.error("Failed to start GraphQL server:", error);
  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("\nShutting down...");
  stopInventoryPolling();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\nShutting down...");
  stopInventoryPolling();
  process.exit(0);
});

