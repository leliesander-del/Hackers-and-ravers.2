import { ENTRANCE_CORRIDOR_Y, EXIT, KASSA, RACK_H } from './floorplanLayout.js'
import { demoRackFrontApproach } from './shelfFront.js'

const AISLE_BAND = 4.5

/** Horizontale doorgangen alleen in vrije zones — nooit door rekblokken. */
function buildCorridorRowYs(racks) {
  const corridorYs = new Set([ENTRANCE_CORRIDOR_Y, EXIT.y])

  if (!racks.length) {
    corridorYs.add(25, 45, 65)
    return [...corridorYs].sort((a, b) => a - b)
  }

  const allMinY = Math.min(...racks.map((r) => r.cy - RACK_H / 2))
  const allMaxY = Math.max(...racks.map((r) => r.cy + RACK_H / 2))
  corridorYs.add(allMinY - AISLE_BAND)
  corridorYs.add(allMaxY + AISLE_BAND)

  return [...corridorYs].sort((a, b) => a - b)
}

/**
 * Winkel als raster: verticale gangen (aisleXs) × horizontale doorgangen (rowYs).
 * rowYs liggen tussen rekrijen, niet midden in rekken.
 */
export function buildStoreNetwork(products, racks = []) {
  const xs = new Set()

  for (const p of products) {
    if (!p.rekkenlocatie) continue
    xs.add(p.rekkenlocatie.x)
  }

  const aisleXs = [...xs].sort((a, b) => a - b)
  const rowYs = racks.length ? buildCorridorRowYs(racks) : [EXIT.y, 25, 45, 65, ENTRANCE_CORRIDOR_Y]

  if (!aisleXs.length) {
    aisleXs.push(18, 50, 82)
  }

  return { aisleXs, rowYs }
}

function nearest(list, val) {
  return list.reduce((best, v) => (Math.abs(v - val) < Math.abs(best - val) ? v : best), list[0])
}

function pushPt(pts, x, y) {
  const last = pts[pts.length - 1]
  if (!last || Math.abs(last[0] - x) > 0.05 || Math.abs(last[1] - y) > 0.05) {
    pts.push([x, y])
  }
}

/** Kies doorgang voor horizontaal stuk: voorkeur ingang/uitgang-hoofdgang. */
function corridorBetween(y1, y2, rowYs) {
  const lo = Math.min(y1, y2)
  const hi = Math.max(y1, y2)
  const inRange = rowYs.filter((y) => y >= lo - 0.5 && y <= hi + 0.5)
  if (inRange.length) return nearest(inRange, (lo + hi) / 2)

  const mid = (lo + hi) / 2
  if (mid >= 55) return nearest(rowYs, ENTRANCE_CORRIDOR_Y)
  if (mid <= 30) return nearest(rowYs, EXIT.y)
  return nearest(rowYs, mid)
}

/** Van willekeurig punt naar dichtstbijzijnde kruising (gang × doorgang). */
function toIntersection(pts, px, py, network) {
  const ix = nearest(network.aisleXs, px)
  const iy = nearest(network.rowYs, py)
  pushPt(pts, px, py)
  if (Math.abs(px - ix) > 0.05) pushPt(pts, ix, py)
  if (Math.abs(py - iy) > 0.05) pushPt(pts, ix, iy)
  return { x: ix, y: iy }
}

/** Tussen twee kruisingen: alleen langs gangen, horizontaal via doorgangen. */
function betweenIntersections(pts, a, b, network) {
  pushPt(pts, a.x, a.y)

  if (Math.abs(a.x - b.x) < 0.05 && Math.abs(a.y - b.y) < 0.05) return b

  if (Math.abs(a.x - b.x) < 0.05) {
    // Zelfde verticale gang — alleen verticaal lopen (tussen rekken links/rechts)
    pushPt(pts, b.x, b.y)
    return b
  }

  const corridorY = corridorBetween(a.y, b.y, network.rowYs)
  if (Math.abs(a.y - corridorY) > 0.05) pushPt(pts, a.x, corridorY)
  pushPt(pts, b.x, corridorY)
  if (Math.abs(b.y - corridorY) > 0.05) pushPt(pts, b.x, b.y)
  return b
}

function distViaNetwork(px, py, stop, network) {
  const ix = nearest(network.aisleXs, px)
  const iy = nearest(network.rowYs, py)
  const ty = corridorBetween(iy, nearest(network.rowYs, stop.rowY ?? stop.cy), network.rowYs)
  return Math.abs(px - ix) + Math.abs(py - iy) + Math.abs(ix - stop.gangX) + Math.abs(iy - ty)
}

export function collectRackStops(products, routeProductIds) {
  if (!routeProductIds?.length) return []

  const idSet = new Set(routeProductIds)
  const byRack = new Map()

  for (const p of products) {
    if (!idSet.has(p.id) || !p.rekkenlocatie) continue
    const rackId = p.rekkenlocatie.label
    if (!byRack.has(rackId)) {
      byRack.set(rackId, {
        rackId,
        label: rackId,
        gangX: p.rekkenlocatie.x,
        cy: p.rekkenlocatie.y,
        rowY: p.rekkenlocatie.y,
        categorieën: new Set(),
        products: [],
      })
    }
    const stop = byRack.get(rackId)
    stop.categorieën.add(p.categorie)
    stop.products.push(p)
  }

  return [...byRack.values()].map((s) => ({
    ...s,
    categorieën: [...s.categorieën],
  }))
}

export function optimizeStopOrder(start, stops, network) {
  if (!stops.length) return []

  const remaining = [...stops]
  const ordered = []
  let px = start.x
  let py = start.y

  while (remaining.length) {
    let best = 0
    let bestD = Infinity
    for (let i = 0; i < remaining.length; i++) {
      const d = distViaNetwork(px, py, remaining[i], network)
      if (d < bestD) {
        bestD = d
        best = i
      }
    }
    const next = remaining.splice(best, 1)[0]
    ordered.push(next)
    px = next.gangX
    py = corridorBetween(py, next.rowY ?? next.cy, network.rowYs)
  }

  return ordered
}

/** Loop naar rek: gang → langs gangpad → korte zijsprong naar rek-rand → terug naar gang. */
function visitStop(pts, cur, stop, network, racks) {
  const corridorY = corridorBetween(cur.y, stop.rowY ?? stop.cy, network.rowYs)
  const atAisle = { x: stop.gangX, y: corridorY }
  cur = betweenIntersections(pts, cur, atAisle, network)

  const slots = rackSlotsForStop(stop, racks)
  const byCy = new Map()
  for (const rack of slots) {
    if (!byCy.has(rack.cy)) byCy.set(rack.cy, rack)
  }

  for (const rack of [...byCy.values()].sort((a, b) => a.cy - b.cy)) {
    const front = demoRackFrontApproach(rack)

    // Langs gangpad (verticaal), dan korte horizontale stap naar voorkant — nooit door zijkant.
    if (Math.abs(cur.y - front.y) > 0.05) {
      pushPt(pts, stop.gangX, front.y)
      cur = { x: stop.gangX, y: front.y }
    }
    if (Math.abs(cur.x - front.x) > 0.05) {
      pushPt(pts, front.x, front.y)
      cur = { x: front.x, y: front.y }
    }
    pushPt(pts, stop.gangX, front.y)
    cur = { x: stop.gangX, y: front.y }
  }

  if (Math.abs(cur.y - corridorY) > 0.05) {
    pushPt(pts, stop.gangX, corridorY)
    cur = { x: stop.gangX, y: corridorY }
  }

  return cur
}

export function buildRoutePolyline(start, orderedStops, network, racks, checkout, end = EXIT) {
  const pts = []

  if (!orderedStops.length) {
    let cur = toIntersection(pts, start.x, start.y, network)
    if (checkout) {
      cur = betweenIntersections(
        pts,
        cur,
        { x: nearest(network.aisleXs, checkout.x), y: nearest(network.rowYs, checkout.y) },
        network,
      )
    }
    const endRow = nearest(network.rowYs, end.y)
    cur = betweenIntersections(pts, cur, { x: nearest(network.aisleXs, end.x), y: endRow }, network)
    pushPt(pts, end.x, end.y)
    return pointsToPath(pts)
  }

  let cur = toIntersection(pts, start.x, start.y, network)

  for (const stop of orderedStops) {
    cur = visitStop(pts, cur, stop, network, racks)
  }

  if (checkout) {
    cur = betweenIntersections(
      pts,
      cur,
      { x: nearest(network.aisleXs, checkout.x), y: nearest(network.rowYs, checkout.y) },
      network,
    )
  }

  const endIx = nearest(network.aisleXs, end.x)
  const endRow = nearest(network.rowYs, end.y)
  betweenIntersections(pts, cur, { x: endIx, y: endRow }, network)
  pushPt(pts, end.x, end.y)

  return pointsToPath(pts)
}

function pointsToPath(pts) {
  if (!pts.length) return null
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ')
}

export function computeShoppingRoute(products, routeProductIds, startPos, racks = []) {
  const network = buildStoreNetwork(products, racks)
  const stops = collectRackStops(products, routeProductIds)

  if (!stops.length) {
    return { stops: [], ordered: [], pathD: null, kassa: KASSA, end: EXIT, network }
  }

  const ordered = optimizeStopOrder(startPos, stops, network)
  const pathD = buildRoutePolyline(startPos, ordered, network, racks, KASSA, EXIT)

  return { stops, ordered, pathD, kassa: KASSA, end: EXIT, network }
}

export function rackSlotsForStop(stop, racks) {
  return racks.filter((r) => r.label === stop.rackId)
}

export function corridorBands(network) {
  const { aisleXs, rowYs } = network
  if (!aisleXs.length || !rowYs.length) return { vertical: [], horizontal: [] }

  const pad = 2
  const minX = aisleXs[0] - pad
  const maxX = aisleXs[aisleXs.length - 1] + pad
  const minY = rowYs[0] - pad
  const maxY = rowYs[rowYs.length - 1] + pad

  const vertical = aisleXs.map((x) => ({
    x: x - AISLE_BAND / 2,
    y: minY,
    w: AISLE_BAND,
    h: maxY - minY,
  }))

  const horizontal = rowYs.map((y) => ({
    x: minX,
    y: y - AISLE_BAND / 2,
    w: maxX - minX,
    h: AISLE_BAND,
  }))

  return { vertical, horizontal }
}
