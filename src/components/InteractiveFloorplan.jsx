import { useEffect, useMemo, useRef, useState } from 'react'

// Interactieve 2D-plattegrond.
// - Elke "gang" heeft een looppad in het midden met aaneengesloten vierkante rekken
//   links en rechts ervan; ├®├®n vierkant per product in die gang.
// - Boven elke gang staat een lijstje met welke producten er precies in zitten.
// - Bij inzoomen verschijnen de productnamen naast de rekken (meer detail).
// - Een blauw bolletje ("me") toont waar jij staat. Een gestippelde route loopt
//   langs de gangen naar het rek; met `routeIds` loopt hij in de snelste volgorde
//   langs meerdere producten (genummerde stops).
// - In-/uitzoomen met de knoppen of slepen om te pannen.

const FULL = { x: 0, y: 0, w: 100, h: 104 }
const MIN_W = 26
const PERSON = { x: 50, y: 93 }
const LOOP_AISLE_Y = 85 // horizontale hoofdgang onderaan

const AISLE_HALF = 2 // halve breedte van het looppad (ruimte voor de route)
const RACK_W = 7 // breedte van een rek
const RACK_H = 5.5 // lengte van een rek (langs de gang)
const SIDE_OFF = AISLE_HALF + RACK_W / 2 // afstand looppad-midden -> rek-midden

function clampView(v) {
  let { x, y, w, h } = v
  w = Math.min(w, FULL.w)
  h = Math.min(h, FULL.h)
  x = Math.min(Math.max(x, 0), FULL.w - w)
  y = Math.min(Math.max(y, 0), FULL.h - h)
  return { x, y, w, h }
}

function kort(naam, max) {
  return naam.length > max ? naam.slice(0, max - 1) + 'ÔÇª' : naam
}

function buildLayout(products) {
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
          label: g.label,
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

function edgeX(rack) {
  return rack.cx - rack.side * (RACK_W / 2)
}

// E├®n product: rechte route naar het rek toe.
function buildRoute(rack) {
  const pts = [
    [PERSON.x, PERSON.y],
    [PERSON.x, LOOP_AISLE_Y],
    [rack.gangX, LOOP_AISLE_Y],
    [rack.gangX, rack.cy],
    [edgeX(rack), rack.cy],
  ]
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ')
}

// Snelste volgorde: gangen van links naar rechts, binnen een gang alle rekken in
// ├®├®n keer meepakken (van onder naar boven).
function orderRacks(racks) {
  return [...racks].sort((a, b) => a.gangX - b.gangX || b.cy - a.cy)
}

// Meerdere producten: via de hoofdgang elke gang in en weer uit.
function buildMultiRoute(ordered) {
  const pts = [
    [PERSON.x, PERSON.y],
    [PERSON.x, LOOP_AISLE_Y],
  ]
  let i = 0
  while (i < ordered.length) {
    const gx = ordered[i].gangX
    pts.push([gx, LOOP_AISLE_Y])
    while (i < ordered.length && ordered[i].gangX === gx) {
      const r = ordered[i]
      pts.push([gx, r.cy])
      pts.push([edgeX(r), r.cy])
      pts.push([gx, r.cy])
      i++
    }
    pts.push([gx, LOOP_AISLE_Y])
  }
  return pts.map((p, k) => `${k === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ')
}

export default function InteractiveFloorplan({ products, highlightId, routeIds }) {
  const { racks, headers } = useMemo(() => buildLayout(products), [products])

  // Doelen: meerdere (routeIds) of ├®├®n (highlightId).
  const targets = useMemo(() => {
    if (routeIds?.length) {
      const gevonden = routeIds.map((id) => racks.find((r) => r.productId === id)).filter(Boolean)
      return orderRacks(gevonden)
    }
    if (highlightId) {
      const r = racks.find((x) => x.productId === highlightId)
      return r ? [r] : []
    }
    return []
  }, [racks, routeIds, highlightId])

  const multi = targets.length > 1
  const actieveIds = useMemo(() => new Set(targets.map((t) => t.productId)), [targets])
  const routeD = useMemo(() => {
    if (!targets.length) return null
    return multi ? buildMultiRoute(targets) : buildRoute(targets[0])
  }, [targets, multi])

  const [vb, setVb] = useState(FULL)
  const svgRef = useRef(null)
  const sleep = useRef(null)

  useEffect(() => {
    setVb(FULL)
  }, [routeD])

  function zoomBy(factor) {
    setVb((v) => {
      const cx = v.x + v.w / 2
      const cy = v.y + v.h / 2
      const w = Math.min(Math.max(v.w * factor, MIN_W), FULL.w)
      const h = (w * FULL.h) / FULL.w
      return clampView({ x: cx - w / 2, y: cy - h / 2, w, h })
    })
  }

  function zoomNaarDoel() {
    if (!targets.length) return
    const xs = targets.map((t) => t.cx)
    const ys = targets.map((t) => t.cy)
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)
    const ratio = FULL.h / FULL.w
    const w = Math.max(maxX - minX + 18, (maxY - minY + 18) / ratio, 30)
    const h = w * ratio
    setVb(clampView({ x: (minX + maxX) / 2 - w / 2, y: (minY + maxY) / 2 - h / 2, w, h }))
  }

  function onPointerDown(e) {
    sleep.current = { px: e.clientX, py: e.clientY, vb }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  function onPointerMove(e) {
    if (!sleep.current || !svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const sx = sleep.current.vb.w / rect.width
    const sy = sleep.current.vb.h / rect.height
    const nx = sleep.current.vb.x - (e.clientX - sleep.current.px) * sx
    const ny = sleep.current.vb.y - (e.clientY - sleep.current.py) * sy
    setVb(clampView({ ...sleep.current.vb, x: nx, y: ny }))
  }
  function onPointerUp() {
    sleep.current = null
  }

  const ingezoomd = vb.w < FULL.w - 0.5

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
        className="w-full cursor-grab touch-none rounded-2xl bg-white shadow-sm active:cursor-grabbing"
        role="img"
        aria-label="Plattegrond van de winkel"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <rect x="2" y="2" width="96" height="100" rx="4" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="0.6" />

        {/* Per gang enkel de aanduiding van de gang zelf */}
        {headers.map((h) => (
          <text key={h.label} x={h.cx} y={h.gangTop - 1.6} textAnchor="middle" fontSize="2.4" fontWeight="700" fill="#64748b">
            {h.label}
          </text>
        ))}

        {/* Rekken */}
        {racks.map((r) => {
          const actief = actieveIds.has(r.productId)
          return (
            <rect
              key={r.productId}
              x={r.cx - RACK_W / 2}
              y={r.cy - RACK_H / 2}
              width={RACK_W}
              height={RACK_H}
              fill={actief ? '#ddd6fe' : '#e2e8f0'}
              stroke={actief ? '#7c3aed' : '#cbd5e1'}
              strokeWidth={actief ? 0.6 : 0.3}
            />
          )
        })}

        {/* Productnamen naast de rekken bij inzoomen */}
        {ingezoomd &&
          racks.map((r) => (
            <text
              key={`lbl-${r.productId}`}
              x={r.cx + r.side * (RACK_W / 2 + 0.6)}
              y={r.cy + 0.5}
              textAnchor={r.side === -1 ? 'end' : 'start'}
              fontSize="1.5"
              fill={actieveIds.has(r.productId) ? '#6d28d9' : '#64748b'}
              fontWeight={actieveIds.has(r.productId) ? '700' : '400'}
            >
              {kort(r.naam, 18)}
            </text>
          ))}

        {/* Route + bewegend stipje */}
        {routeD && (
          <>
            <path d={routeD} fill="none" stroke="#7c3aed" strokeWidth="1" strokeDasharray="2 2" strokeLinecap="round" strokeLinejoin="round" />
            <circle r="1.3" fill="#7c3aed">
              <animateMotion path={routeD} dur={`${Math.max(3, targets.length * 1.5)}s`} repeatCount="indefinite" />
            </circle>
          </>
        )}

        {/* Markering(en) op de doelrekken */}
        {multi
          ? targets.map((t, k) => (
              <g key={`stop-${t.productId}`}>
                <circle cx={t.cx} cy={t.cy} r="2.2" fill="#7c3aed" />
                <text x={t.cx} y={t.cy + 0.8} textAnchor="middle" fontSize="2.6" fontWeight="700" fill="#fff">
                  {k + 1}
                </text>
              </g>
            ))
          : targets.map((t) => (
              <circle key={`mark-${t.productId}`} cx={t.cx} cy={t.cy} r="2.2" fill="none" stroke="#7c3aed" strokeWidth="0.6">
                <animate attributeName="r" values="2.2;3.2;2.2" dur="1.2s" repeatCount="indefinite" />
              </circle>
            ))}

        {/* Jij ÔÇö blauw bolletje */}
        <circle cx={PERSON.x} cy={PERSON.y} r="2.4" fill="#2563eb" stroke="#fff" strokeWidth="0.6" />
        <text x={PERSON.x} y={PERSON.y + 6} textAnchor="middle" fontSize="3.4" fill="#2563eb" fontWeight="600">
          me
        </text>
      </svg>

      {/* Zoom-bediening */}
      <div className="absolute right-2 top-2 flex flex-col gap-1.5">
        <button
          onClick={() => zoomBy(0.7)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg font-bold text-slate-700 shadow-md"
          aria-label="Inzoomen"
        >
          +
        </button>
        <button
          onClick={() => zoomBy(1 / 0.7)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg font-bold text-slate-700 shadow-md"
          aria-label="Uitzoomen"
        >
          ÔêÆ
        </button>
        {targets.length > 0 && (
          <button
            onClick={zoomNaarDoel}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-sm shadow-md"
            aria-label="Zoom naar de producten"
            title="Zoom naar de producten"
          >
            ­ƒÄ»
          </button>
        )}
        {ingezoomd && (
          <button
            onClick={() => setVb(FULL)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm shadow-md"
            aria-label="Volledig overzicht"
            title="Volledig overzicht"
          >
            Ôñó
          </button>
        )}
      </div>
    </div>
  )
}
