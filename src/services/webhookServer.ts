import { createServer, IncomingMessage, ServerResponse } from "node:http";
import {
  processPrintWebhook,
  PrintWebhookEvent,
} from "./webhookService";

const WEBHOOK_PORT = 4001;

function sendJson(
  response: ServerResponse,
  statusCode: number,
  data: unknown
) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json",
  });

  response.end(JSON.stringify(data));
}

const webhookServer = createServer(
  (request: IncomingMessage, response: ServerResponse) => {
    if (
      request.method !== "POST" ||
      request.url !== "/webhooks/print-completed"
    ) {
      sendJson(response, 404, {
        error: "Not found",
      });

      return;
    }

    let body = "";

    request.on("data", (chunk) => {
      body += chunk.toString();
    });

    request.on("end", () => {
      try {
        const event = JSON.parse(body) as PrintWebhookEvent;

        const result = processPrintWebhook(event);

        sendJson(response, 200, result);
      } catch (error) {
        console.error("[Webhook] Failed to process event:", error);

        sendJson(response, 400, {
          error: "Invalid webhook request.",
        });
      }
    });
  }
);

export function startWebhookServer(): void {
  webhookServer.listen(WEBHOOK_PORT, () => {
    console.log(
      `[Webhook] Print completion endpoint listening on http://localhost:${WEBHOOK_PORT}/webhooks/print-completed`
    );
  });
}

