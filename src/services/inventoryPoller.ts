import { fetchWarehouseInventory } from "./warehouseApi";
import { updateInventoryCache } from "./inventoryCache";

const POLL_INTERVAL_MS =
  Number(process.env.POLL_INTERVAL_MS) || 5 * 60 * 1000;

let pollingTimer: ReturnType<typeof setInterval> | null = null;

export async function pollWarehouse(): Promise<void> {
  try {
    const inventory = await fetchWarehouseInventory();

    updateInventoryCache(inventory);

    console.log(
      `[Poller] Inventory cache refreshed at ${new Date().toISOString()}`
    );
  } catch (error) {
    console.error("[Poller] Failed to refresh inventory:", error);
  }
}

export async function startInventoryPolling(): Promise<void> {
  if (pollingTimer) {
    return;
  }

  // Perform an immediate synchronization.
  await pollWarehouse();

  pollingTimer = setInterval(() => {
    void pollWarehouse();
  }, POLL_INTERVAL_MS);

  console.log(
    `[Poller] Warehouse polling started. Interval: ${POLL_INTERVAL_MS}ms`
  );
}

export function stopInventoryPolling(): void {
  if (!pollingTimer) {
    return;
  }

  clearInterval(pollingTimer);
  pollingTimer = null;

  console.log("[Poller] Warehouse polling stopped.");
}

