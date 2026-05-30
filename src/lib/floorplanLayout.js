/** Raster en layout voor de interactieve demo-plattegrond. */

export const FULL = { x: 0, y: 0, w: 100, h: 104 }
export const MIN_W = 26
export const DEFAULT_START = { x: 50, y: 88 }
export const ENTRANCE_CORRIDOR_Y = 85
export const EXIT = { x: 50, y: 14, label: 'Uitgang' }

export const AISLE_HALF = 2
export const RACK_W = 7
export const RACK_H = 5.5
export const SIDE_OFF = AISLE_HALF + RACK_W / 2

export function clampView(v) {
  let { x, y, w, h } = v
  w = Math.min(w, FULL.w)
  h = Math.min(h, FULL.h)
  x = Math.min(Math.max(x, 0), FULL.w - w)
  y = Math.min(Math.max(y, 0), FULL.h - h)
  return { x, y, w, h }
}

export function kort(naam, max) {
  return naam.length > max ? `${naam.slice(0, max - 1)}…` : naam
}

export function buildLayout(products) {
  const gangen = new Map()
  for (const p of products) {
    if (!p.rekkenlocatie) continue
    const key = p.rekkenlocatie.label
    if (!gangen.has(key)) {
      gangen.set(key, { label: key, cx: p.rekkenlocatie.x, cy: p.rekkenlocatie.y, items: [] })
    }
    gangen.get(key).items.push(p)
  }

  const racks = []
  const headers = []
  for (const g of gangen.values()) {
    const links = g.items.filter((_, i) => i % 2 === 0)
    const rechts = g.items.filter((_, i) => i % 2 === 1)

    const plaats = (lijst, side) => {
      const top = g.cy - (lijst.length * RACK_H) / 2
      lijst.forEach((p, j) => {
        racks.push({
          productId: p.id,
          naam: p.naam,
          categorie: p.categorie,
          label: g.label,
          rowY: g.cy,
          side,
          gangX: g.cx,
          cx: g.cx + side * SIDE_OFF,
          cy: top + RACK_H / 2 + j * RACK_H,
        })
      })
    }
    plaats(links, -1)
    plaats(rechts, 1)

    const maxRijen = Math.max(links.length, rechts.length)
    headers.push({
      label: g.label,
      cx: g.cx,
      gangTop: g.cy - (maxRijen * RACK_H) / 2,
    })
  }
  return { racks, headers }
}

export function rackEdgeX(rack) {
  return rack.cx - rack.side * (RACK_W / 2)
}

/** SVG-coördinaten uit een klik op het canvas. */
export function clientToSvgCoords(svg, clientX, clientY) {
  const pt = svg.createSVGPoint()
  pt.x = clientX
  pt.y = clientY
  const ctm = svg.getScreenCTM()
  if (!ctm) return { x: 50, y: 50 }
  const svgPt = pt.matrixTransform(ctm.inverse())
  return {
    x: Math.max(6, Math.min(94, svgPt.x)),
    y: Math.max(10, Math.min(99, svgPt.y)),
  }
}
