// Helper functions for the warehouse/shelves stock model.

import { targetShelfStock } from './staffStock.js'

export function buildInitialInventory(products) {
  const inv = {}
  for (const p of products) {
    inv[p.id] = {
      warehouse: p.warehouseStock ?? 0,
      shelves: p.shelfStock ?? 0,
    }
  }
  return inv
}

export function enrichProduct(product, stock) {
  if (!product) return null
  const warehouse = stock?.warehouse ?? product.warehouseStock ?? 0
  const shelves = stock?.shelves ?? product.shelfStock ?? 0
  const onShelf = shelves > 0
  const inWarehouse = warehouse > 0
  let stockStatus = 'shelf'
  if (!onShelf && inWarehouse) stockStatus = 'warehouse'
  if (!onShelf && !inWarehouse) stockStatus = 'out'

  const targetShelves = targetShelfStock(product)

  return {
    ...product,
    warehouseStock: warehouse,
    shelfStock: shelves,
    targetShelfStock: targetShelves,
    inStock: onShelf,
    onShelf,
    inWarehouse,
    stockStatus,
  }
}

// QR or manual input -> product id (e.g. storenav://product/p-koffiebonen).
export function parseProductQr(input) {
  const raw = input.trim()
  if (!raw) return null

  const urlMatch = raw.match(/product[/:]([a-z0-9-]+)/i)
  if (urlMatch) return urlMatch[1]

  const idMatch = raw.match(/^(p-[a-z0-9-]+)$/i)
  if (idMatch) return idMatch[1]

  return null
}
