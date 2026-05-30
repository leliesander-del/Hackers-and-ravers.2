// Stock classification for the shelf-stocker screen.

/** Product is physically on the shelves (checkout only shows these). */
export function isOnShelf(product) {
  return (product.shelfStock ?? 0) > 0
}

export function filterOnShelf(products) {
  return products.filter(isOnShelf)
}

export function targetShelfStock(product) {
  if (product.targetShelfStock != null) return product.targetShelfStock
  if (product.shelfStock > 0) return product.shelfStock
  return product.department === 'electronics' || product.department === 'sport' ? 4 : 10
}

export function classifyShelfStock(product) {
  const target = targetShelfStock(product)
  const shelves = product.shelfStock ?? 0
  const warehouse = product.warehouseStock ?? 0
  const halfThreshold = Math.ceil(target / 2)

  if (shelves === 0 && warehouse === 0) return 'out'
  if (shelves === 0 && warehouse > 0) return 'emptyShelves'
  if (shelves > 0 && shelves <= halfThreshold) return 'shelfLow'
  return 'wellStocked'
}

export function groupStockByShelf(products) {
  const out = []
  const emptyShelves = []
  const shelfLow = []
  const wellStocked = []

  for (const p of products) {
    const status = classifyShelfStock(p)
    if (status === 'out') out.push(p)
    else if (status === 'emptyShelves') emptyShelves.push(p)
    else if (status === 'shelfLow') shelfLow.push(p)
    else wellStocked.push(p)
  }

  const sortByName = (a, b) => a.name.localeCompare(b.name)
  const sortByShelfAsc = (a, b) => a.shelfStock - b.shelfStock

  out.sort(sortByName)
  emptyShelves.sort(sortByName)
  shelfLow.sort(sortByShelfAsc)
  wellStocked.sort((a, b) => b.shelfStock - a.shelfStock)

  return { out, emptyShelves, shelfLow, wellStocked }
}
