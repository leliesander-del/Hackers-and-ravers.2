import { getBounds, isShelf } from './floorplanGeometry.js'
import { resolveElementLabel } from './floorplanElementStyle.js'
import { formatCategoryLabel } from './productCategories.js'
import {
  approachTowardStoreCenter,
  doorInwardApproachWorld,
  SHELF_PRE_APPROACH_STANDOFF,
  shelfFrontApproachWorld,
  shelfFrontNormalWorld,
  shelfPreApproachWorld,
} from './shelfFront.js'

const W = 100
const H = 104

/** Minimale afstand van de route tot muren, rekken en rand. */
const FLOOR_MARGIN = 2.5
const OBSTACLE_PAD = {
  muur: 2.2,
  kassa: 2,
  'vast-rek': 2,
  'tijdelijk-rek': 2,
  ingang: 1.2,
  uitgang: 1.2,
}
const WALK_CLEARANCE = 1.5

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
  const raw = new Uint8Array(W * H).fill(1)

  for (let x = 0; x < W; x++) {
    for (let y = 0; y < H; y++) {
      if (x < FLOOR_MARGIN || x >= W - FLOOR_MARGIN || y < FLOOR_MARGIN || y >= H - FLOOR_MARGIN) {
        raw[idx(x, y)] = 0
      }
    }
  }

  for (const el of elements) {
    if (!['muur', 'kassa', 'vast-rek', 'tijdelijk-rek', 'ingang', 'uitgang'].includes(el.type)) continue
    const b = getBounds(el)
    const pad = OBSTACLE_PAD[el.type] ?? 1.8
    const x0 = Math.max(0, Math.floor(b.left - pad))
    const x1 = Math.min(W - 1, Math.ceil(b.right + pad))
    const y0 = Math.max(0, Math.floor(b.top - pad))
    const y1 = Math.min(H - 1, Math.ceil(b.bottom + pad))
    for (let x = x0; x <= x1; x++) {
      for (let y = y0; y <= y1; y++) raw[y * W + x] = 0
    }
  }

  return applyWalkClearance(raw, WALK_CLEARANCE)
}

/** Houd loopgebied weg van obstakels — route loopt midden in gangen. */
function applyWalkClearance(grid, clearance) {
  const result = new Uint8Array(W * H)
  const r = Math.ceil(clearance)

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!grid[idx(x, y)]) continue
      let ok = true
      for (let dy = -r; dy <= r && ok; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          if (dx * dx + dy * dy > clearance * clearance) continue
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || nx >= W || ny < 0 || ny >= H || !grid[idx(nx, ny)]) {
            ok = false
          }
        }
      }
      if (ok) result[idx(x, y)] = 1
    }
  }

  return result
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

  return [[s.x, s.y]]
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
  const steps = Math.max(4, Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 4))
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const x = x0 + (x1 - x0) * t
    const y = y0 + (y1 - y0) * t
    if (!grid[idx(Math.round(x), Math.round(y))]) return true
  }
  return false
}

function lastPt(pts) {
  const p = pts[pts.length - 1]
  return { x: p[0], y: p[1] }
}

/** Alleen via A* — nooit rechte diagonalen tekenen. */
function routeSegment(pts, grid, from, to) {
  const landing = gridWithApproachLanding(grid, to.x, to.y)
  const dest = nearestWalkable(landing, to.x, to.y)
  appendPath(pts, astar(landing, from, dest))
  const pos = lastPt(pts)
  const manhattan = Math.abs(pos.x - to.x) + Math.abs(pos.y - to.y)
  if (manhattan === 1 && !segmentBlocked(grid, pos.x, pos.y, to.x, to.y)) {
    pushPt(pts, to.x, to.y)
  }
  return { x: to.x, y: to.y }
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
 * Naar rek/kassa/uitgang: uitsluitend A*-segmenten (horizontaal/verticaal), geen diagonalen.
 */
function appendShelfVisit(pts, grid, _cur, el) {
  const approach = shelfFrontApproachWorld(el)
  const { nx, ny } = shelfFrontNormalWorld(el)
  const tangX = -ny
  const tangY = nx

  const { point: pre, grid: visitGrid } = resolvePreApproach(grid, el)
  let pos = lastPt(pts)
  routeSegment(pts, visitGrid, pos, pre)

  const tangentDelta = (approach.x - pre.x) * tangX + (approach.y - pre.y) * tangY
  const aligned = { x: pre.x + tangX * tangentDelta, y: pre.y + tangY * tangentDelta }

  pos = lastPt(pts)
  if (Math.hypot(aligned.x - pos.x, aligned.y - pos.y) > 0.08) {
    routeSegment(pts, grid, pos, aligned)
  }

  pos = lastPt(pts)
  routeSegment(pts, gridWithApproachLanding(grid, approach.x, approach.y), pos, approach)

  return approach
}

/** Grid voor laatste stuk naar uitgang: deurgebied tijdelijk begaanbaar. */
function gridForExitLeg(baseGrid, el, approach) {
  const g = cloneGrid(baseGrid)
  markDiskWalkable(g, approach.x, approach.y, 2.5)
  markDiskWalkable(g, el.x, el.y, 2)
  const b = getBounds(el)
  for (let x = Math.floor(b.left - 1.5); x <= Math.ceil(b.right + 1.5); x++) {
    for (let y = Math.floor(b.top - 2); y <= Math.ceil(b.bottom + 1.5); y++) {
      if (x >= 0 && x < W && y >= 0 && y < H) g[idx(x, y)] = 1
    }
  }
  return g
}

/** Uitgang: vanuit winkel naar binnenkant van de deur, daarna naar de uitgang. */
function appendExitVisit(pts, grid, el) {
  const center = { x: el.x, y: el.y }
  const candidates = [doorInwardApproachWorld(el, 1.2), approachTowardStoreCenter(el, 1.2)]
  let pos = lastPt(pts)
  const startLen = pts.length

  for (const approach of candidates) {
    const exitGrid = gridForExitLeg(grid, el, approach)
    routeSegment(pts, exitGrid, pos, approach)
    if (pts.length > startLen) {
      pos = lastPt(pts)
      break
    }
  }

  const exitGrid = gridForExitLeg(grid, el, pos)
  routeSegment(pts, exitGrid, pos, center)

  return center
}

function approachPoint(el) {
  return shelfFrontApproachWorld(el)
}

function findShelfForProduct(shelves, product) {
  const catKey = normLabel(product.categorie)
  if (catKey) {
    const matches = shelves.filter((s) => normLabel(rackLabel(s)) === catKey)
    if (matches.length === 1) return matches[0]
    if (matches.length > 1) {
      return matches.find((s) => s.type === 'vast-rek') || matches[0]
    }
  }

  if (product.rekkenlocatie?.label) {
    const locKey = normLabel(product.rekkenlocatie.label)
    const byLoc = shelves.find((s) => normLabel(rackLabel(s)) === locKey)
    if (byLoc) return byLoc
  }

  return null
}

function makeStop(el) {
  const slug = normLabel(rackLabel(el)) || el.id
  const label = formatCategoryLabel(slug)
  return {
    rackId: slug,
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

  function getOrCreateStop(el) {
    if (!byElementId.has(el.id)) byElementId.set(el.id, makeStop(el))
    return byElementId.get(el.id)
  }

  // Koppeling via rek-categorie (= product.categorie), vast én tijdelijk rek
  for (const p of products) {
    if (!idSet.has(p.id)) continue
    const el = findShelfForProduct(shelves, p)
    if (!el) continue
    const stop = getOrCreateStop(el)
    stop.categorieën.add(p.categorie)
    stop.products.push(p)
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

function buildCustomPolyline(start, orderedStops, elements, checkout, exit, { includeExit = true } = {}) {
  const pts = []
  const grid = buildWalkGrid(elements)
  const startWalk = nearestWalkable(grid, start.x, start.y)
  pushPt(pts, start.x, start.y)
  if (Math.hypot(startWalk.x - start.x, startWalk.y - start.y) > 0.1) {
    routeSegment(pts, grid, { x: start.x, y: start.y }, startWalk)
  }
  let cur = startWalk

  for (const stop of orderedStops) {
    cur = appendShelfVisit(pts, grid, cur, stop.element)
  }

  if (checkout?.element) {
    appendShelfVisit(pts, grid, cur, checkout.element)
  }

  if (includeExit) {
    const uitgangEl = elements.find((el) => el.type === 'uitgang')
    if (uitgangEl) {
      appendExitVisit(pts, grid, uitgangEl)
    } else if (exit) {
      routeSegment(pts, grid, lastPt(pts), { x: exit.x, y: exit.y })
    }
  }

  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ')
}

/** Herberekent het routepad vanaf huidige positie, zonder afgevinkte rekken. */
export function computeCustomRoutePath(fromPos, remainingStops, elements, { includeCheckout = false } = {}) {
  const kassa = getKassaFromElements(elements)
  const end = getExitFromElements(elements)
  const grid = buildWalkGrid(elements)
  const ordered = remainingStops.length ? optimizeStopOrder(fromPos, remainingStops, grid) : []
  const pathD = buildCustomPolyline(fromPos, ordered, elements, includeCheckout ? kassa : null, end, {
    includeExit: includeCheckout,
  })
  return { ordered, pathD }
}

export function getKassaFromElements(elements) {
  const kassa = elements.find((el) => el.type === 'kassa')
  if (!kassa) return null
  return {
    element: kassa,
    x: kassa.x,
    y: kassa.y,
    label: resolveElementLabel(kassa),
  }
}

export function getExitFromElements(elements) {
  const uitgang = elements.find((el) => el.type === 'uitgang')
  if (uitgang) return { x: uitgang.x, y: uitgang.y, label: resolveElementLabel(uitgang) }
  return { x: 50, y: 14, label: 'Uitgang' }
}

export function computeCustomShoppingRoute(elements, products, routeProductIds, startPos) {
  const stops = collectCustomStops(products, routeProductIds, elements)
  const kassa = getKassaFromElements(elements)
  const end = getExitFromElements(elements)
  const grid = buildWalkGrid(elements)

  const ordered = stops.length ? optimizeStopOrder(startPos, stops, grid) : []
  const pathD = buildCustomPolyline(startPos, ordered, elements, kassa, end)

  return { stops, ordered, pathD, kassa, end }
}
