import { getFloorplanType } from '../data/floorplanTypes.js'
import { isStyleable, normalizeStyleFields, resolveElementLabel } from './floorplanElementStyle.js'

export function round2(n) {
  return Math.round(Number(n) * 100) / 100
}

export function format2(n) {
  return round2(n).toFixed(2)
}

export function rotationDegrees(el) {
  const r = Number(el.rotation) || 0
  return ((r % 360) + 360) % 360
}

export function elementSize(el) {
  const def = getFloorplanType(el.type)
  if (!def) return { w: 10, h: 10 }
  return {
    w: el.w ?? def.defaultW,
    h: el.h ?? def.defaultH,
  }
}

export function orientedSize(el) {
  const { w, h } = elementSize(el)
  const rot = rotationDegrees(el)
  const swap = rot === 90 || rot === 270
  return { w: swap ? h : w, h: swap ? w : h }
}

export function getBounds(el) {
  const { w, h } = orientedSize(el)
  return {
    left: el.x - w / 2,
    right: el.x + w / 2,
    top: el.y - h / 2,
    bottom: el.y + h / 2,
    w,
    h,
  }
}

export function isSnappable(type) {
  return ['wall', 'fixed-shelf', 'temp-shelf', 'checkout', 'entrance', 'exit'].includes(type)
}

export function isShelf(type) {
  return type === 'fixed-shelf' || type === 'temp-shelf'
}

export function isResizable(type) {
  return !!getFloorplanType(type)?.resizable
}

export function clampSize(type, w, h) {
  const def = getFloorplanType(type)
  if (!def) return { w: round2(w), h: round2(h) }
  return {
    w: round2(Math.max(def.minW, Math.min(def.maxW, w))),
    h: round2(Math.max(def.minH, Math.min(def.maxH, h))),
  }
}

export function clampCenter(x, y, w, h) {
  const pad = 3
  const cx = Math.max(pad + w / 2, Math.min(100 - pad - w / 2, x))
  const cy = Math.max(pad + h / 2, Math.min(102 - pad - h / 2, y))
  return { x: cx, y: cy }
}

export function worldToLocal(mx, my, el) {
  const rot = (rotationDegrees(el) * Math.PI) / 180
  const dx = mx - el.x
  const dy = my - el.y
  const cos = Math.cos(-rot)
  const sin = Math.sin(-rot)
  return { lx: dx * cos - dy * sin, ly: dx * sin + dy * cos }
}

export function localToWorld(lx, ly, el) {
  const rot = (rotationDegrees(el) * Math.PI) / 180
  const cos = Math.cos(rot)
  const sin = Math.sin(rot)
  return {
    x: el.x + lx * cos - ly * sin,
    y: el.y + lx * sin + ly * cos,
  }
}

/** Fixed corner (opposite the drag corner) in local coordinates. */
export function anchorLocalForCorner(corner, w, h) {
  const map = {
    se: { lx: -w / 2, ly: -h / 2 },
    nw: { lx: w / 2, ly: h / 2 },
    ne: { lx: -w / 2, ly: h / 2 },
    sw: { lx: w / 2, ly: -h / 2 },
  }
  return map[corner]
}

export function resizeElementFromCorner(el, corner, mx, my) {
  const def = getFloorplanType(el.type)
  if (!def) return null

  const { w: w0, h: h0 } = elementSize(el)
  const anchor = anchorLocalForCorner(corner, w0, h0)
  const { lx, ly } = worldToLocal(mx, my, el)

  let dragLx = lx
  let dragLy = ly

  if (corner.includes('e')) dragLx = Math.max(anchor.lx + def.minW, dragLx)
  if (corner.includes('w')) dragLx = Math.min(anchor.lx - def.minW, dragLx)
  if (corner.includes('s')) dragLy = Math.max(anchor.ly + def.minH, dragLy)
  if (corner.includes('n')) dragLy = Math.min(anchor.ly - def.minH, dragLy)

  const sized = clampSize(el.type, Math.abs(dragLx - anchor.lx), Math.abs(dragLy - anchor.ly))
  const centerLx = (dragLx + anchor.lx) / 2
  const centerLy = (dragLy + anchor.ly) / 2
  const world = localToWorld(centerLx, centerLy, el)
  const { w: ow, h: oh } = orientedSize({ ...el, w: sized.w, h: sized.h })
  const c = clampCenter(world.x, world.y, ow, oh)

  return { x: c.x, y: c.y, w: sized.w, h: sized.h }
}

export function normalizeElement(el) {
  const def = getFloorplanType(el.type)
  if (!def) return el
  let base = {
    ...el,
    rotation: rotationDegrees(el),
  }
  if (def.labelable) {
    base.label = isStyleable(el.type) ? resolveElementLabel(el) : typeof el.label === 'string' ? el.label : ''
  }
  if (isStyleable(el.type)) {
    base = normalizeStyleFields(base)
  }
  if (!def.resizable) {
    return base
  }
  const size = clampSize(el.type, el.w ?? def.defaultW, el.h ?? def.defaultH)
  return { ...base, w: size.w, h: size.h }
}
