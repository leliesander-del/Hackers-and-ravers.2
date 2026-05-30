import { useEffect, useMemo, useRef, useState } from 'react'

// Interactieve 2D-plattegrond.
// - Elke "gang" heeft een looppad in het midden met rekken (rechthoeken) links en
//   rechts ernaast; één rek per product in die gang.
// - Een figuurtje toont waar jij staat (ingang) en een gestippelde route loopt
//   langs de gangen naar het gemarkeerde rek (highlightId = product-id).
// - In-/uitzoomen met de knoppen of slepen om te pannen; "Zoom naar rek" gaat tot
//   bij de geschatte plek in het rek.

const FULL = { x: 0, y: 0, w: 100, h: 104 }
const MIN_W = 26
const PERSON = { x: 50, y: 93 }
const LOOP_AISLE_Y = 85 // horizontale hoofdgang onderaan

// Rek-afmetingen
const RACK_W = 10
const RACK_H = 4.4
const ROW_SPACING = RACK_H + 1.4
const SIDE_OFFSET = 3 + RACK_W / 2 // afstand van het looppad tot het midden van een rek

function clampView(v) {
  let { x, y, w, h } = v
  w = Math.min(w, FULL.w)
  h = Math.min(h, FULL.h)
  x = Math.min(Math.max(x, 0), FULL.w - w)
  y = Math.min(Math.max(y, 0), FULL.h - h)
  return { x, y, w, h }
}

// Bouwt de rekken op basis van de schaplocaties van de producten.
function buildLayout(products) {
  const gangen = new Map()
  for (const p of products) {
    if (!p.schaplocatie) continue
    const key = p.schaplocatie.label
    if (!gangen.has(key)) {
      gangen.set(key, { label: key, cx: p.schaplocatie.x, cy: p.schaplocatie.y, items: [] })
    }
    gangen.get(key).items.push(p)
  }

  const racks = []
  const labels = []
  for (const g of gangen.values()) {
    const rows = Math.ceil(g.items.length / 2)
    g.items.forEach((p, i) => {
      const side = i % 2 === 0 ? -1 : 1 // even -> links, oneven -> rechts
      const row = Math.floor(i / 2)
      const cx = g.cx + side * SIDE_OFFSET
      const cy = g.cy - ((rows - 1) / 2) * ROW_SPACING + row * ROW_SPACING
      racks.push({ productId: p.id, naam: p.naam, label: g.label, cx, cy, side, gangX: g.cx })
    })
    const topY = g.cy - ((rows - 1) / 2) * ROW_SPACING - RACK_H / 2
    labels.push({ label: g.label, cx: g.cx, y: topY - 1.3 })
  }
  return { racks, labels }
}

// Orthogonale route: van de persoon, omhoog naar de hoofdgang, horizontaal naar
// het juiste looppad, omhoog langs de gang en een korte stap naar het rek.
function buildRoute(rack) {
  const tx = rack.gangX
  const innerEdgeX = rack.cx - rack.side * (RACK_W / 2)
  const pts = [
    [PERSON.x, PERSON.y],
    [PERSON.x, LOOP_AISLE_Y],
    [tx, LOOP_AISLE_Y],
    [tx, rack.cy],
    [innerEdgeX, rack.cy],
  ]
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ')
}

export default function Floorplan({ products, highlightId, highlight }) {
  const { racks, labels } = useMemo(() => buildLayout(products), [products])

  const doelRek = useMemo(() => {
    if (highlightId) return racks.find((r) => r.productId === highlightId) || null
    // Terugval: oude API met een schaplocatie -> pak het eerste rek van die gang.
    if (highlight) return racks.find((r) => r.label === highlight.label) || null
    return null
  }, [racks, highlightId, highlight])

  const routeD = useMemo(() => (doelRek ? buildRoute(doelRek) : null), [doelRek])

  const [vb, setVb] = useState(FULL)
  const svgRef = useRef(null)
  const sleep = useRef(null)

  // Bij een nieuw doelproduct terug naar het volledige overzicht (route zichtbaar).
  useEffect(() => {
    setVb(FULL)
  }, [doelRek])

  function zoomBy(factor) {
    setVb((v) => {
      const cx = v.x + v.w / 2
      const cy = v.y + v.h / 2
      const w = Math.min(Math.max(v.w * factor, MIN_W), FULL.w)
      const h = (w * FULL.h) / FULL.w
      return clampView({ x: cx - w / 2, y: cy - h / 2, w, h })
    })
  }

  function zoomNaarRek() {
    if (!doelRek) return
    const w = 34
    const h = (w * FULL.h) / FULL.w
    setVb(clampView({ x: doelRek.cx - w / 2, y: doelRek.cy - h / 2, w, h }))
  }

  // Slepen om te pannen.
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

        {/* Gang-labels */}
        {labels.map((l) => (
          <text key={l.label} x={l.cx} y={l.y} textAnchor="middle" fontSize="2.8" fill="#94a3b8">
            {l.label}
          </text>
        ))}

        {/* Rekken (rechthoeken) links/rechts van elk looppad */}
        {racks.map((r) => {
          const actief = doelRek && r.productId === doelRek.productId
          return (
            <rect
              key={r.productId}
              x={r.cx - RACK_W / 2}
              y={r.cy - RACK_H / 2}
              width={RACK_W}
              height={RACK_H}
              rx="1"
              fill={actief ? '#ddd6fe' : '#e2e8f0'}
              stroke={actief ? '#7c3aed' : '#cbd5e1'}
              strokeWidth={actief ? 0.7 : 0.4}
            />
          )
        })}

        {/* Route + bewegend stipje */}
        {routeD && (
          <>
            <path d={routeD} fill="none" stroke="#7c3aed" strokeWidth="1" strokeDasharray="2 2" strokeLinecap="round" strokeLinejoin="round" />
            <circle r="1.3" fill="#7c3aed">
              <animateMotion path={routeD} dur="3s" repeatCount="indefinite" />
            </circle>
          </>
        )}

        {/* Markering op het doelrek */}
        {doelRek && (
          <>
            <circle cx={doelRek.cx} cy={doelRek.cy} r="2.4" fill="#7c3aed">
              <animate attributeName="r" values="2.4;3.4;2.4" dur="1.2s" repeatCount="indefinite" />
            </circle>
            {ingezoomd && (
              <text x={doelRek.cx} y={doelRek.cy - 4} textAnchor="middle" fontSize="2.6" fill="#6d28d9" fontWeight="600">
                {doelRek.naam}
              </text>
            )}
          </>
        )}

        {/* Jij + ingang */}
        <text x={PERSON.x} y={PERSON.y + 1.5} textAnchor="middle" fontSize="6">🧍</text>
        <text x={PERSON.x} y={PERSON.y + 6} textAnchor="middle" fontSize="3" fill="#16a34a" fontWeight="600">
          Jij staat hier
        </text>
        <circle cx={PERSON.x} cy={100} r="1.8" fill="#16a34a" />
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
          −
        </button>
        {doelRek && (
          <button
            onClick={zoomNaarRek}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-sm shadow-md"
            aria-label="Zoom naar het rek"
            title="Zoom naar het rek"
          >
            🎯
          </button>
        )}
        {ingezoomd && (
          <button
            onClick={() => setVb(FULL)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm shadow-md"
            aria-label="Volledig overzicht"
            title="Volledig overzicht"
          >
            ⤢
          </button>
        )}
      </div>
    </div>
  )
}
