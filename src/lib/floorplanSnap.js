import { clampCenter, getBounds, isSnappable, orientedSize } from './floorplanGeometry.js'

const SNAP_DIST = 0.55
const GRID = 0.5
const SNAP_STRENGTH = 0.38

function softSnap(value, target, threshold = SNAP_DIST) {
  const d = Math.abs(value - target)
  if (d >= threshold) return value
  const pull = (1 - d / threshold) * SNAP_STRENGTH
  return value + (target - value) * pull
}

function collectEdgeTargets(el, w, h, allElements) {
  const xTargets = []
  const yTargets = []

  for (const other of allElements) {
    if (other.id === el.id || !isSnappable(other.type)) continue
    const ob = getBounds(other)
    xTargets.push(ob.left, ob.right, ob.left + w / 2, ob.right - w / 2)
    yTargets.push(ob.top, ob.bottom, ob.top + h / 2, ob.bottom - h / 2)
    xTargets.push(ob.right + w / 2, ob.left - w / 2)
    yTargets.push(ob.bottom + h / 2, ob.top - h / 2)
  }

  return { xTargets, yTargets }
}

/** Soft alignment: subtle grid + light edge magnet. */
export function snapElement(el, x, y, allElements, enabled = true) {
  const { w, h } = orientedSize({ ...el, x, y })

  if (!enabled) {
    return clampCenter(x, y, w, h)
  }

  const gridX = Math.round(x / GRID) * GRID
  const gridY = Math.round(y / GRID) * GRID
  let nx = softSnap(x, gridX, GRID * 0.45)
  let ny = softSnap(y, gridY, GRID * 0.45)

  const { xTargets, yTargets } = collectEdgeTargets(el, w, h, allElements)
  for (const tx of xTargets) nx = softSnap(nx, tx, SNAP_DIST)
  for (const ty of yTargets) ny = softSnap(ny, ty, SNAP_DIST)

  const draft = { ...el, x: nx, y: ny }
  const b = getBounds(draft)

  for (const other of allElements) {
    if (other.id === el.id || !isSnappable(other.type)) continue
    const ob = getBounds(other)

    if (Math.abs(b.left - ob.right) < SNAP_DIST) {
      nx = softSnap(nx, nx + (ob.right - b.left), SNAP_DIST)
    }
    if (Math.abs(b.right - ob.left) < SNAP_DIST) {
      nx = softSnap(nx, nx + (ob.left - b.right), SNAP_DIST)
    }
    if (Math.abs(b.top - ob.bottom) < SNAP_DIST) {
      ny = softSnap(ny, ny + (ob.bottom - b.top), SNAP_DIST)
    }
    if (Math.abs(b.bottom - ob.top) < SNAP_DIST) {
      ny = softSnap(ny, ny + (ob.top - b.bottom), SNAP_DIST)
    }
  }

  return clampCenter(nx, ny, w, h)
}
