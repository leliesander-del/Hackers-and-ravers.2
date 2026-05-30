import { elementSize, localToWorld } from './floorplanGeometry.js'
import { getDefaultStyleForType } from './floorplanElementStyle.js'
import { RACK_H, RACK_W } from './floorplanLayout.js'

export const SHELF_APPROACH_MARGIN = 1.2
export const SHELF_PRE_APPROACH_STANDOFF = 5

/**
 * In shelf-local coordinates: label bar at the top (y = -h/2).
 * Front = bottom edge (y = +h/2) — where customers stand.
 */
export function shelfFrontApproachWorld(el, margin = SHELF_APPROACH_MARGIN) {
  const { h } = elementSize(el)
  return localToWorld(0, h / 2 + margin, el)
}

export function shelfFrontEdgeWorld(el) {
  const { h } = elementSize(el)
  return localToWorld(0, h / 2, el)
}

/** Unit vector from the shelf center to the front (outward). */
export function shelfFrontNormalWorld(el) {
  const edge = shelfFrontEdgeWorld(el)
  const nx = edge.x - el.x
  const ny = edge.y - el.y
  const len = Math.hypot(nx, ny) || 1
  return { nx: nx / len, ny: ny / len }
}

/** Point in front of the shelf — the route ends here via A*, then straight to the front. */
export function shelfPreApproachWorld(el, standoff = SHELF_PRE_APPROACH_STANDOFF) {
  const approach = shelfFrontApproachWorld(el)
  const { nx, ny } = shelfFrontNormalWorld(el)
  return {
    x: approach.x + nx * standoff,
    y: approach.y + ny * standoff,
  }
}

/** Approach on the inside of a door (exit/entrance) — from within the store. */
export function doorInwardApproachWorld(el, margin = 1) {
  const { h } = elementSize(el)
  return localToWorld(0, -h / 2 - margin, el)
}

/** Fallback: approach side toward store center. */
export function approachTowardStoreCenter(el, margin = 1, storeCenter = { x: 50, y: 52 }) {
  const { w, h } = elementSize(el)
  const dx = storeCenter.x - el.x
  const dy = storeCenter.y - el.y
  const len = Math.hypot(dx, dy) || 1
  const off = Math.max(w, h) / 2 + margin
  return { x: el.x + (dx / len) * off, y: el.y + (dy / len) * off }
}

/** Demo shelf: rotate so the front faces the aisle path (side -1 = left of aisle). */
export function demoRackAsElement(rack) {
  const def = getDefaultStyleForType('fixed-shelf')
  return {
    type: 'fixed-shelf',
    x: rack.cx,
    y: rack.cy,
    w: RACK_W,
    h: RACK_H,
    rotation: rack.side === -1 ? 270 : 90,
    label: rack.label || '',
    ...def,
  }
}

export function demoRackFrontApproach(rack, margin = SHELF_APPROACH_MARGIN) {
  return shelfFrontApproachWorld(demoRackAsElement(rack), margin)
}

/** Rotation (degrees) for SVG rendering of demo shelves. */
export function demoRackRotation(side) {
  return side === -1 ? 270 : 90
}
