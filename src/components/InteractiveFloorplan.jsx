import { useEffect, useMemo, useRef, useState } from 'react'
import {
  buildLayout,
  clampView,
  clientToSvgCoords,
  EXIT,
  FULL,
  KASSA,
  truncate,
  MIN_W,
} from '../lib/floorplanLayout.js'
import {
  buildStoreNetwork,
  collectRackStops,
  computeRemainingShoppingPath,
  computeShoppingRoute,
  corridorBands,
  rackSlotsForStop,
} from '../lib/floorplanRoute.js'
import RouteOverviewPanel from './RouteOverviewPanel.jsx'
import ShelfVisual from './floorplan/ShelfVisual.jsx'
import { demoRackElement, demoRackSize } from '../lib/demoRackElement.js'
import { demoRackFrontApproach, demoRackRotation } from '../lib/shelfFront.js'

const TAP_THRESHOLD_PX = 6
export default function InteractiveFloorplan({ products, highlightId, routeIds }) {
  const { racks, headers } = useMemo(() => buildLayout(products), [products])
  const network = useMemo(() => buildStoreNetwork(products, racks), [products, racks])
  const corridors = useMemo(() => corridorBands(network), [network])

  const hasRouteList = routeIds?.length > 0
  const singleHighlight = !hasRouteList && highlightId

  const [startPos, setStartPos] = useState(null)
  const [userPos, setUserPos] = useState(null)
  const [routeActive, setRouteActive] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visitedIds, setVisitedIds] = useState(() => new Set())

  const route = useMemo(() => {
    if (!routeActive || !hasRouteList || !startPos) return null
    return computeShoppingRoute(products, routeIds, startPos, racks)
  }, [routeActive, routeIds, products, startPos, racks, hasRouteList])

  const orderedStops = route?.ordered ?? []
  const activePos = userPos ?? startPos

  const remainingStops = useMemo(
    () => orderedStops.filter((s) => !visitedIds.has(s.rackId)),
    [orderedStops, visitedIds],
  )

  const routeD = useMemo(() => {
    if (!routeActive || !activePos || !orderedStops.length) return null
    const allRacksDone = remainingStops.length === 0
    const includeCheckout = allRacksDone || visitedIds.size === 0
    return computeRemainingShoppingPath(activePos, remainingStops, network, racks, { includeCheckout })
  }, [routeActive, activePos, remainingStops, orderedStops.length, visitedIds.size, network, racks])

  const endLabel = route?.end?.label ?? EXIT.label
  const kassaLabel = route?.kassa?.label ?? KASSA.label

  const highlightRack = useMemo(() => {
    if (!singleHighlight) return null
    return racks.find((r) => r.productId === highlightId) ?? null
  }, [singleHighlight, highlightId, racks])

  const currentStop = orderedStops[currentIndex] ?? null
  const currentRackIds = useMemo(() => {
    if (!currentStop) return new Set()
    return new Set(rackSlotsForStop(currentStop, racks).map((r) => r.productId))
  }, [currentStop, racks])

  const routeRackIds = useMemo(() => {
    if (!routeActive && !singleHighlight) return new Set()
    const ids = new Set()
    if (singleHighlight && highlightRack) {
      ids.add(highlightRack.productId)
    }
    for (const stop of orderedStops) {
      for (const p of stop.products) ids.add(p.id)
    }
    return ids
  }, [routeActive, orderedStops, singleHighlight, highlightRack])

  const visitedRackProductIds = useMemo(() => {
    const ids = new Set()
    for (const stop of orderedStops) {
      if (visitedIds.has(stop.rackId)) {
        for (const p of stop.products) ids.add(p.id)
      }
    }
    return ids
  }, [orderedStops, visitedIds])

  useEffect(() => {
    setStartPos(null)
    setUserPos(null)
    setRouteActive(false)
    setCurrentIndex(0)
    setVisitedIds(new Set())
  }, [routeIds?.join(',')])

  const [vb, setVb] = useState(FULL)
  const svgRef = useRef(null)
  const panRef = useRef(null)

  useEffect(() => {
    if (routeD) setVb(FULL)
  }, [routeD])

  function placeStartAndRoute(svgX, svgY) {
    if (!hasRouteList) return
    setStartPos({ x: svgX, y: svgY })
    setUserPos(null)
    setRouteActive(true)
    setCurrentIndex(0)
    setVisitedIds(new Set())
  }

  function markVisited() {
    const stop = orderedStops[currentIndex]
    if (!stop || visitedIds.has(stop.rackId)) return

    const slots = rackSlotsForStop(stop, racks)
    const anchor = slots[0] ? demoRackFrontApproach(slots[0]) : { x: stop.aisleX, y: stop.cy }
    setUserPos({ x: anchor.x, y: anchor.y })

    const newVisited = new Set([...visitedIds, stop.rackId])
    setVisitedIds(newVisited)

    let next = currentIndex + 1
    while (next < orderedStops.length && newVisited.has(orderedStops[next].rackId)) next++
    setCurrentIndex(next)
  }

  function resetProgress() {
    setUserPos(null)
    setCurrentIndex(0)
    setVisitedIds(new Set())
  }

  function zoomBy(factor) {
    setVb((v) => {
      const cx = v.x + v.w / 2
      const cy = v.y + v.h / 2
      const w = Math.min(Math.max(v.w * factor, MIN_W), FULL.w)
      const h = (w * FULL.h) / FULL.w
      return clampView({ x: cx - w / 2, y: cy - h / 2, w, h })
    })
  }

  function zoomToRoute() {
    const points = activePos
      ? [activePos, ...remainingStops.map((s) => ({ x: s.aisleX, y: s.cy })), KASSA, EXIT]
      : highlightRack
        ? [highlightRack]
        : []
    if (!points.length) return
    const xs = points.map((p) => p.x)
    const ys = points.map((p) => p.y)
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)
    const ratio = FULL.h / FULL.w
    const w = Math.max(maxX - minX + 20, (maxY - minY + 20) / ratio, 32)
    const h = w * ratio
    setVb(clampView({ x: (minX + maxX) / 2 - w / 2, y: (minY + maxY) / 2 - h / 2, w, h }))
  }

  function onSvgPointerDown(e) {
    const onRack = e.target.closest?.('[data-rack]')
    panRef.current = {
      px: e.clientX,
      py: e.clientY,
      vb,
      moved: false,
      onRack: !!onRack,
    }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  function onSvgPointerMove(e) {
    if (!panRef.current || !svgRef.current) return
    const dx = e.clientX - panRef.current.px
    const dy = e.clientY - panRef.current.py
    if (Math.hypot(dx, dy) > TAP_THRESHOLD_PX) panRef.current.moved = true
    if (!panRef.current.moved) return

    const rect = svgRef.current.getBoundingClientRect()
    const sx = panRef.current.vb.w / rect.width
    const sy = panRef.current.vb.h / rect.height
    const nx = panRef.current.vb.x - dx * sx
    const ny = panRef.current.vb.y - dy * sy
    setVb(clampView({ ...panRef.current.vb, x: nx, y: ny }))
  }

  function onSvgPointerUp(e) {
    const ref = panRef.current
    panRef.current = null
    if (!ref || !svgRef.current) return

    if (!ref.moved && !ref.onRack && hasRouteList) {
      const { x, y } = clientToSvgCoords(svgRef.current, e.clientX, e.clientY)
      placeStartAndRoute(x, y)
    }
  }

  const isZoomedIn = vb.w < FULL.w - 0.5
  const waitingForTap = hasRouteList && !startPos
  const previewStops = hasRouteList ? collectRackStops(products, routeIds) : []

  return (
    <div className="flex flex-col gap-3">
      {waitingForTap && (
        <p className="rounded-xl bg-violet-50 px-3 py-2 text-center text-xs font-medium text-violet-700">
          Tap the map (not a shelf) to choose your starting point. Then along your products, checkout and exit.
        </p>
      )}

      {/* Map always full-width — the app shell is max-w-md, so no side-by-side with a wide panel */}
      <div className="relative w-full">
        <svg
          ref={svgRef}
          viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
          className={`aspect-[100/104] w-full touch-none rounded-2xl bg-white shadow-sm ${
            hasRouteList ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'
          }`}
          role="img"
          aria-label="Store floor plan"
          onPointerDown={onSvgPointerDown}
          onPointerMove={onSvgPointerMove}
          onPointerUp={onSvgPointerUp}
          onPointerLeave={onSvgPointerUp}
        >
          <defs>
            <linearGradient id="demoVloerGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#faf5ff" />
              <stop offset="100%" stopColor="#f8fafc" />
            </linearGradient>
          </defs>

          <rect
            data-floor="true"
            x="2"
            y="2"
            width="96"
            height="100"
            fill="url(#demoVloerGrad)"
            stroke="#0f172a"
            strokeWidth="1.2"
          />

          <g aria-hidden="true" pointerEvents="none">
            {corridors.horizontal.map((b, i) => (
              <rect key={`h-${i}`} x={b.x} y={b.y} width={b.w} height={b.h} fill="#ede9fe" />
            ))}
            {corridors.vertical.map((b, i) => (
              <rect key={`v-${i}`} x={b.x} y={b.y} width={b.w} height={b.h} fill="#e9d5ff" />
            ))}
          </g>

          {headers.map((h) => (
            <text
              key={h.label}
              x={h.cx}
              y={h.aisleTop - 1.6}
              textAnchor="middle"
              fontSize="2.4"
              fontWeight="700"
              fill="#64748b"
              pointerEvents="none"
            >
              {h.label}
            </text>
          ))}

          {racks.map((r) => {
            const inRoute = routeRackIds.has(r.productId)
            const visited = visitedRackProductIds.has(r.productId)
            const current = currentRackIds.has(r.productId)
            const highlighted = singleHighlight && r.productId === highlightId

            let rackState = null
            if (visited) rackState = 'visited'
            else if (current || highlighted) rackState = 'current'
            else if (inRoute) rackState = 'route'

            const { w, h } = demoRackSize()
            const el = demoRackElement(r.label)

            return (
              <g
                key={r.productId}
                transform={`translate(${r.cx} ${r.cy}) rotate(${demoRackRotation(r.side)})`}
                data-rack="true"
              >
                <ShelfVisual el={el} w={w} h={h} rackState={rackState} />
              </g>
            )
          })}

          {isZoomedIn &&
            racks
              .filter((r) => routeRackIds.has(r.productId))
              .map((r) => (
                <text
                  key={`lbl-${r.productId}`}
                  x={r.cx + r.side * (demoRackSize().w / 2 + 0.6)}
                  y={r.cy + 0.5}
                  textAnchor={r.side === -1 ? 'end' : 'start'}
                  fontSize="1.5"
                  fill={currentRackIds.has(r.productId) ? '#6d28d9' : '#64748b'}
                  fontWeight={currentRackIds.has(r.productId) ? '700' : '400'}
                  pointerEvents="none"
                >
                  {truncate(r.name, 18)}
                </text>
              ))}

          {routeD && (
            <>
              <path
                d={routeD}
                fill="none"
                stroke="#7c3aed"
                strokeWidth="1.4"
                strokeLinecap="square"
                strokeLinejoin="miter"
                pointerEvents="none"
              />
              <circle r="1.4" fill="#7c3aed" pointerEvents="none">
                <animateMotion path={routeD} dur={`${Math.max(5, orderedStops.length * 2.5)}s`} repeatCount="indefinite" />
              </circle>
            </>
          )}

          {routeActive &&
            orderedStops.map((stop, k) => {
              const done = visitedIds.has(stop.rackId)
              const current = k === currentIndex && !done
              if (done) return null
              const slots = rackSlotsForStop(stop, racks)
              const anchor = slots[0] ? demoRackFrontApproach(slots[0]) : { x: stop.aisleX, y: stop.cy }
              return (
                <g key={`stop-${stop.rackId}`} pointerEvents="none">
                  <circle cx={anchor.x} cy={anchor.y} r={current ? 2.8 : 2.2} fill={current ? '#7c3aed' : '#a78bfa'} stroke="#fff" strokeWidth="0.4" />
                  <text x={anchor.x} y={anchor.y + 0.85} textAnchor="middle" fontSize="2.6" fontWeight="700" fill="#fff">
                    {k + 1}
                  </text>
                </g>
              )
            })}

          {singleHighlight && highlightRack && (
            <g pointerEvents="none">
              <circle cx={highlightRack.cx} cy={highlightRack.cy} r="2.2" fill="none" stroke="#7c3aed" strokeWidth="0.6">
                <animate attributeName="r" values="2.2;3.2;2.2" dur="1.2s" repeatCount="indefinite" />
              </circle>
            </g>
          )}

          <g pointerEvents="none">
            <rect x={EXIT.x - 6} y={EXIT.y - 2.8} width="12" height="5.6" fill="#fee2e2" stroke="#dc2626" strokeWidth="0.45" />
            <text x={EXIT.x} y={EXIT.y + 0.7} textAnchor="middle" fontSize="2.2" fontWeight="700" fill="#b91c1c">
              {EXIT.label}
            </text>
          </g>

          {routeActive && activePos && (
            <g pointerEvents="none">
              <circle cx={activePos.x} cy={activePos.y} r="2.8" fill="#2563eb" stroke="#fff" strokeWidth="0.8" />
              <circle cx={activePos.x} cy={activePos.y} r="4.2" fill="none" stroke="#2563eb" strokeWidth="0.35" opacity="0.5">
                <animate attributeName="r" values="4.2;5.5;4.2" dur="2s" repeatCount="indefinite" />
              </circle>
            </g>
          )}
        </svg>

        <div className="absolute right-2 top-2 flex flex-col gap-1.5">
          <button type="button" onClick={() => zoomBy(0.7)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg font-bold text-slate-700 shadow-md" aria-label="Zoom in">
            +
          </button>
          <button type="button" onClick={() => zoomBy(1 / 0.7)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg font-bold text-slate-700 shadow-md" aria-label="Zoom out">
            −
          </button>
          {(routeActive || highlightRack) && (
            <button type="button" onClick={zoomToRoute} className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-sm shadow-md" aria-label="Zoom to route">
              🎯
            </button>
          )}
          {isZoomedIn && (
            <button type="button" onClick={() => setVb(FULL)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm shadow-md" aria-label="Full overview">
              ⤢
            </button>
          )}
        </div>
      </div>

      {hasRouteList && (
        <RouteOverviewPanel
          compact
          orderedStops={routeActive ? orderedStops : previewStops}
          currentIndex={currentIndex}
          visitedIds={visitedIds}
          kassaLabel={kassaLabel}
          endLabel={endLabel}
          onSelectStop={setCurrentIndex}
          onMarkVisited={markVisited}
          onResetProgress={resetProgress}
        />
      )}

      {hasRouteList && !routeActive && previewStops.length > 0 && (
        <p className="text-center text-[11px] text-slate-400">
          {previewStops.length} shelves · tap the map to start
        </p>
      )}
    </div>
  )
}
