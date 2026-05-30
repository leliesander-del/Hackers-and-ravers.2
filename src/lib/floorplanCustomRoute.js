import { getBounds, isShelf } from './floorplanGeometry.js'
import { resolveElementLabel } from './floorplanElementStyle.js'
import {
  SHELF_PRE_APPROACH_STANDOFF,
  shelfFrontApproachWorld,
  shelfFrontNormalWorld,
  shelfPreApproachWorld,
} from './shelfFront.js'

const W = 100
const H = 104

function normLabel(s) {
  return (s || '').trim().toLowerCase()
}

function pushPt(pts, x, y) {
  const last = pts[pts.length - 1]
  if (!last || Math.hypot(last[0] - x, last[1] - y) > 0.08) pts.push([x, y])
}

function idx(x, y) {
  const ix = Math.max(0, Math.min(W - 1, Math.round(x)))
  const iy = Math.max(0, Math.min(H - 1, Math.round(y)))
  return iy * W + ix
}

function buildWalkGrid(elements) {
  const grid = new Uint8Array(W * H).fill(1)

  for (const el of elements) {
    if (!['muur', 'kassa', 'vast-rek', 'tijdelijk-rek'].includes(el.type)) continue
    const b = getBounds(el)
    const pad = el.type === 'muur' ? 0.2 : 0.35
    const x0 = Math.max(0, Math.floor(b.left - pad))
    const x1 = Math.min(W - 1, Math.ceil(b.right + pad))
    const y0 = Math.max(0, Math.floor(b.top - pad))
    const y1 = Math.min(H - 1, Math.ceil(b.bottom + pad))
    for (let x = x0; x <= x1; x++) {
      for (let y = y0; y <= y1; y++) grid[y * W + x] = 0
    }
  }

  // Vrijmaken rond ingang/uitgang
  for (const el of elements) {
    if (el.type !== 'ingang' && el.type !== 'uitgang') continue
    const b = getBounds(el)
    for (let x = Math.floor(b.left - 2); x <= Math.ceil(b.right + 2); x++) {
      for (let y = Math.floor(b.top - 2); y <= Math.ceil(b.bottom + 2); y++) {
        if (x >= 0 && x < W && y >= 0 && y < H) grid[idx(x, y)] = 1
      }
    }
  }

  return grid
}

function nearestWalkable(grid, x, y) {
  const ix = Math.round(x)
  const iy = Math.round(y)
  if (grid[idx(ix, iy)]) return { x: ix, y: iy }
  for (let r = 1; r < 25; r++) {
    for (let dx = -r; dx <= r; dx++) {
      for (let dy = -r; dy <= r; dy++) {
        const nx = ix + dx
        const ny = iy + dy
        if (nx >= 0 && nx < W && ny >= 0 && ny < H && grid[idx(nx, ny)]) return { x: nx, y: ny }
      }
    }
  }
  return { x: ix, y: iy }
}

function astar(grid, start, end) {
  const s = nearestWalkable(grid, start.x, start.y)
  const e = nearestWalkable(grid, end.x, end.y)
  const si = idx(s.x, s.y)
  const ei = idx(e.x, e.y)
  if (si === ei) return [[s.x, s.y]]

  const open = [si]
  const cameFrom = new Map()
  const gScore = new Map([[si, 0]])
  const fScore = new Map([[si, Math.abs(s.x - e.x) + Math.abs(s.y - e.y)]])

  function lowestF() {
    let best = open[0]
    let bestF = fScore.get(best) ?? Infinity
    for (const n of open) {
      const f = fScore.get(n) ?? Infinity
      if (f < bestF) {
        best = n
        bestF = f
      }
    }
    return best
  }

  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]

  while (open.length) {
    const cur = lowestF()
    if (cur === ei) {
      const path = []
      let c = cur
      while (c != null) {
        path.push([c % W, Math.floor(c / W)])
        c = cameFrom.get(c)
      }
      path.reverse()
      return simplifyPath(path)
    }
    open.splice(open.indexOf(cur), 1)
    const cx = cur % W
    const cy = Math.floor(cur / W)
    for (const [dx, dy] of dirs) {
      const nx = cx + dx
      const ny = cy + dy
      if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue
      const ni = idx(nx, ny)
      if (!grid[ni]) continue
      const tg = (gScore.get(cur) ?? Infinity) + 1
      if (tg < (gScore.get(ni) ?? Infinity)) {
        cameFrom.set(ni, cur)
        gScore.set(ni, tg)
        fScore.set(ni, tg + Math.abs(nx - e.x) + Math.abs(ny - e.y))
        if (!open.includes(ni)) open.push(ni)
      }
    }
  }

  return [[s.x, s.y], [e.x, e.y]]
}

function simplifyPath(path) {
  if (path.length <= 2) return path
  const out = [path[0]]
  for (let i = 1; i < path.length - 1; i++) {
    const [x0, y0] = out[out.length - 1]
    const [x1, y1] = path[i]
    const [x2, y2] = path[i + 1]
    if (x1 - x0 !== x2 - x1 || y1 - y0 !== y2 - y1) out.push(path[i])
  }
  out.push(path[path.length - 1])
  return out
}

function appendPath(pts, segment) {
  for (const [x, y] of segment) pushPt(pts, x, y)
}

function cloneGrid(grid) {
  return new Uint8Array(grid)
}

function markDiskWalkable(grid, cx, cy, r) {
  const ir = Math.ceil(r)
  for (let dx = -ir; dx <= ir; dx++) {
    for (let dy = -ir; dy <= ir; dy++) {
      if (dx * dx + dy * dy > r * r) continue
      const x = Math.round(cx) + dx
      const y = Math.round(cy) + dy
      if (x >= 0 && x < W && y >= 0 && y < H) grid[idx(x, y)] = 1
    }
  }
}

function segmentBlocked(grid, x0, y0, x1, y1) {
  const steps = Math.max(2, Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 2))
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const x = x0 + (x1 - x0) * t
    const y = y0 + (y1 - y0) * t
    if (!grid[idx(Math.round(x), Math.round(y))]) return true
  }
  return false
}

function gridWithApproachLanding(baseGrid, x, y) {
  const g = cloneGrid(baseGrid)
  markDiskWalkable(g, x, y, 1.4)
  return g
}

/** Walkable punt vóór de voorkant — rek blijft geblokkeerd. */
function resolvePreApproach(grid, el) {
  const approach = shelfFrontApproachWorld(el)
  const { nx, ny } = shelfFrontNormalWorld(el)
  const standoffs = [
    SHELF_PRE_APPROACH_STANDOFF,
    SHELF_PRE_APPROACH_STANDOFF + 1,
    SHELF_PRE_APPROACH_STANDOFF + 2,
    SHELF_PRE_APPROACH_STANDOFF - 1,
    SHELF_PRE_APPROACH_STANDOFF + 3,
  ]

  for (const s of standoffs) {
    const ideal = { x: approach.x + nx * s, y: approach.y + ny * s }
    const g = gridWithApproachLanding(grid, ideal.x, ideal.y)
    const w = nearestWalkable(g, ideal.x, ideal.y)
    if (Math.hypot(w.x - ideal.x, w.y - ideal.y) < 2.2) return { point: w, grid: g }
  }

  const fallback = shelfPreApproachWorld(el)
  const g = gridWithApproachLanding(grid, fallback.x, fallback.y)
  return { point: nearestWalkable(g, fallback.x, fallback.y), grid: g }
}

/**
 * Naar rek: A* rond obstakels → langs voorkant (raaklijn) → korte stap loodrecht naar voorkant.
 * Het rek zelf blijft altijd onbegaanbaar (geen shortcut door zijkant/achterkant).
 */
function appendShelfVisit(pts, grid, cur, el) {
  const approach = shelfFrontApproachWorld(el)
  const { nx, ny } = shelfFrontNormalWorld(el)
  const tangX = -ny
  const tangY = nx

  const { point: pre, grid: visitGrid } = resolvePreApproach(grid, el)
  appendPath(pts, astar(visitGrid, cur, pre))

  const tangentDelta = (approach.x - pre.x) * tangX + (approach.y - pre.y) * tangY
  const aligned = { x: pre.x + tangX * tangentDelta, y: pre.y + tangY * tangentDelta }

  if (Math.hypot(aligned.x - pre.x, aligned.y - pre.y) > 0.08) {
    if (!segmentBlocked(grid, pre.x, pre.y, aligned.x, aligned.y)) {
      pushPt(pts, aligned.x, aligned.y)
    } else {
      const slideGrid = gridWithApproachLanding(grid, aligned.x, aligned.y)
      appendPath(pts, astar(slideGrid, pre, aligned))
    }
  }

  const from = pts.length ? { x: pts[pts.length - 1][0], y: pts[pts.length - 1][1] } : pre
  if (!segmentBlocked(grid, from.x, from.y, approach.x, approach.y)) {
    pushPt(pts, approach.x, approach.y)
  } else {
    const finalGrid = gridWithApproachLanding(grid, approach.x, approach.y)
    appendPath(pts, astar(finalGrid, from, approach))
  }

  return approach
}

function approachPoint(el) {
  return shelfFrontApproachWorld(el)
}

function nearestShelf(shelves, x, y) {
  let best = null
  let bestD = Infinity
  for (const el of shelves) {
    const d = Math.hypot(el.x - x, el.y - y)
    if (d < bestD) {
      bestD = d
      best = el
    }
  }
  return best
}

function makeStop(el) {
  const label = rackLabel(el)
  return {
    rackId: label,
    label,
    elementId: el.id,
    gangX: el.x,
    cy: el.y,
    rowY: el.y,
    element: el,
    categorieën: new Set(),
    products: [],
  }
}

export function shelfElements(elements) {
  return elements.filter((el) => isShelf(el.type))
}

export function rackLabel(el) {
  const raw = resolveElementLabel(el)
  return raw.trim() || el.id
}

export function collectCustomStops(products, routeProductIds, elements) {
  if (!routeProductIds?.length) return []

  const shelves = shelfElements(elements)
  if (!shelves.length) return []

  const idSet = new Set(routeProductIds)
  const byElementId = new Map()
  const matchedProductIds = new Set()

  function getOrCreateStop(el) {
    if (!byElementId.has(el.id)) byElementId.set(el.id, makeStop(el))
    return byElementId.get(el.id)
  }

  // 1) Koppeling via label (product schaplocatie.label = rek-label)
  for (const p of products) {
    if (!idSet.has(p.id) || !p.schaplocatie) continue
    const key = normLabel(p.schaplocatie.label)
    const el = shelves.find((s) => normLabel(rackLabel(s)) === key)
    if (!el) continue
    const stop = getOrCreateStop(el)
    stop.categorieën.add(p.categorie)
    stop.products.push(p)
    matchedProductIds.add(p.id)
  }

  // 2) Fallback: dichtstbijzijnd rek op coördinaat
  for (const p of products) {
    if (!idSet.has(p.id) || matchedProductIds.has(p.id) || !p.schaplocatie) continue
    const el = nearestShelf(shelves, p.schaplocatie.x, p.schaplocatie.y)
    if (!el) continue
    const stop = getOrCreateStop(el)
    stop.categorieën.add(p.categorie)
    stop.products.push(p)
    matchedProductIds.add(p.id)
  }

  return [...byElementId.values()]
    .filter((s) => s.products.length)
    .map((s) => ({ ...s, categorieën: [...s.categorieën] }))
}

function pathDistance(grid, a, el) {
  const approach = shelfFrontApproachWorld(el)
  const { point: pre, grid: visitGrid } = resolvePreApproach(grid, el)
  const path = astar(visitGrid, a, pre)
  let d = 0
  for (let i = 1; i < path.length; i++) {
    d += Math.abs(path[i][0] - path[i - 1][0]) + Math.abs(path[i][1] - path[i - 1][1])
  }
  d += Math.hypot(approach.x - pre.x, approach.y - pre.y)
  return d
}

function optimizeStopOrder(start, stops, grid) {
  const remaining = [...stops]
  const ordered = []
  let cur = { x: start.x, y: start.y }

  while (remaining.length) {
    let best = 0
    let bestD = Infinity
    for (let i = 0; i < remaining.length; i++) {
      const d = pathDistance(grid, cur, remaining[i].element)
      if (d < bestD) {
        bestD = d
        best = i
      }
    }
    const next = remaining.splice(best, 1)[0]
    ordered.push(next)
    cur = approachPoint(next.element)
  }

  return ordered
}

function buildCustomPolyline(start, orderedStops, elements, end) {
  const pts = []
  const grid = buildWalkGrid(elements)
  let cur = nearestWalkable(grid, start.x, start.y)
  pushPt(pts, start.x, start.y)
  if (Math.hypot(cur.x - start.x, cur.y - start.y) > 0.1) pushPt(pts, cur.x, cur.y)

  for (const stop of orderedStops) {
    cur = appendShelfVisit(pts, grid, cur, stop.element)
  }

  appendPath(pts, astar(grid, cur, { x: end.x, y: end.y }))
  pushPt(pts, end.x, end.y)

  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ')
}

export function getExitFromElements(elements) {
  const uitgang = elements.find((el) => el.type === 'uitgang')
  if (uitgang) return { x: uitgang.x, y: uitgang.y, label: resolveElementLabel(uitgang) }
  return { x: 50, y: 14, label: 'Uitgang' }
}

export function computeCustomShoppingRoute(elements, products, routeProductIds, startPos) {
  const stops = collectCustomStops(products, routeProductIds, elements)
  const end = getExitFromElements(elements)
  const grid = buildWalkGrid(elements)

  const ordered = stops.length ? optimizeStopOrder(startPos, stops, grid) : []
  const pathD = buildCustomPolyline(startPos, ordered, elements, end)

  return { stops, ordered, pathD, end }
}
