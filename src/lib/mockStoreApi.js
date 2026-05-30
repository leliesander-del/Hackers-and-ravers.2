// Simulated store database. Returns a store's stock in the shape a real
// ERP/POS-system API would (a list of rows with a SKU and the warehouse/shelf
// stock). inventorySync uses this as the source when a connection is marked as
// a "demo data source", so the full sync flow works without an external server.
//
// The values come from products.js — the source of truth — so a sync resets the
// live (drifted) stock to what the store database says.

import { products } from '../data/products.js'

// Builds the API payload for a single store.
export function mockStoreDatabaseResponse(storeId) {
  const inventory = products
    .filter((p) => p.storeId === storeId)
    .map((p) => ({
      sku: p.id,
      name: p.name,
      warehouse: p.warehouseStock ?? 0,
      shelves: p.shelfStock ?? 0,
    }))

  return {
    store: storeId,
    source: 'demo-database',
    fetchedAt: new Date().toISOString(),
    count: inventory.length,
    inventory,
  }
}

// Simulates a network call with a small delay so the UI can show a real loading
// state.
export function fetchMockStoreDatabase(storeId) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockStoreDatabaseResponse(storeId)), 400)
  })
}
