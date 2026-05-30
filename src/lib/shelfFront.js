import { elementSize, localToWorld } from './floorplanGeometry.js'
import { getDefaultStyleForType } from './floorplanElementStyle.js'
import { RACK_H, RACK_W } from './floorplanLayout.js'

export const SHELF_APPROACH_MARGIN = 1.2
export const SHELF_PRE_APPROACH_STANDOFF = 5

/**
 * In rek-lokale coördinaten: labelbalk bovenaan (y = -h/2).
 * Voorkant = onderrand (y = +h/2) — daar staan klanten.
 */
export function shelfFrontApproachWorld(el, margin = SHELF_APPROACH_MARGIN) {
  const { h } = elementSize(el)
  return localToWorld(0, h / 2 + margin, el)
}

export function shelfFrontEdgeWorld(el) {
  const { h } = elementSize(el)
  return localToWorld(0, h / 2, el)
}

/** Eenheidsvector van rekcentrum naar voorkant (buitenwaarts). */
export function shelfFrontNormalWorld(el) {
  const edge = shelfFrontEdgeWorld(el)
  const nx = edge.x - el.x
  const ny = edge.y - el.y
  const len = Math.hypot(nx, ny) || 1
  return { nx: nx / len, ny: ny / len }
}

/** Punt vóór de voorkant — route eindigt hier via A*, daarna rechtdoor naar voorkant. */
export function shelfPreApproachWorld(el, standoff = SHELF_PRE_APPROACH_STANDOFF) {
  const approach = shelfFrontApproachWorld(el)
  const { nx, ny } = shelfFrontNormalWorld(el)
  return {
    x: approach.x + nx * standoff,
    y: approach.y + ny * standoff,
  }
}

/** Aanloop aan de binnenkant van een deur (uitgang/ingang) — vanuit de winkel. */
export function doorInwardApproachWorld(el, margin = 1) {
  const { h } = elementSize(el)
  return localToWorld(0, -h / 2 - margin, el)
}

/** Fallback: aanloopkant richting winkelcentrum. */
export function approachTowardStoreCenter(el, margin = 1, storeCenter = { x: 50, y: 52 }) {
  const { w, h } = elementSize(el)
  const dx = storeCenter.x - el.x
  const dy = storeCenter.y - el.y
  const len = Math.hypot(dx, dy) || 1
  const off = Math.max(w, h) / 2 + margin
  return { x: el.x + (dx / len) * off, y: el.y + (dy / len) * off }
}

/** Demo-rek: roteer zodat voorkant naar het gangpad wijst (side -1 = links van gang). */
export function demoRackAsElement(rack) {
  const def = getDefaultStyleForType('vast-rek')
  return {
    type: 'vast-rek',
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

/** Rotatie (graden) voor SVG-weergave demo-rekken. */
export function demoRackRotation(side) {
  return side === -1 ? 270 : 90
}
