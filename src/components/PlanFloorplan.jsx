import { useEffect, useMemo, useRef, useState } from 'react'
import { clampView, clientToSvgCoords, FULL, MIN_W } from '../lib/floorplanLayout.js'
import {
  collectCustomStops,
  computeCustomRoutePath,
  computeCustomShoppingRoute,
  getExitFromElements,
  getKassaFromElements,
  rackLabel,
} from '../lib/floorplanCustomRoute.js'
import { shelfFrontApproachWorld } from '../lib/shelfFront.js'
import { isShelf } from '../lib/floorplanGeometry.js'
import FloorplanRenderer from './floorplan/FloorplanRenderer.jsx'
import RouteOverviewPanel from './RouteOverviewPanel.jsx'

const TAP_THRESHOLD_PX = 6

function normLabel(s) {
  return (s || '').trim().toLowerCase()
}

export default function PlanFloorplan({ elements, products, highlightId, routeIds }) {
  const hasRouteList = routeIds?.length > 0
  const end = useMemo(() => getExitFromElements(elements), [elements])
  const kassa = useMemo(() => getKassaFromElements(elements), [elements])

  const [startPos, setStartPos] = useState(null)
  const [userPos, setUserPos] = useState(null)
  const [routeActive, setRouteActive] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visitedIds, setVisitedIds] = useState(() => new Set())

  const route = useMemo(() => {
    if (!routeActive || !hasRouteList || !startPos) return null
    return computeCustomShoppingRoute(elements, products, routeIds, startPos)
  }, [routeActive, hasRouteList, routeIds, products, startPos, elements])

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
    return computeCustomRoutePath(activePos, remainingStops, elements, { includeCheckout }).pathD
  }, [routeActive, activePos, remainingStops, orderedStops.length, visitedIds.size, elements])

  const endLabel = route?.end?.label ?? end.label
  const kassaLabel = route?.kassa?.label ?? kassa?.label ?? null

  const previewStops = useMemo(
    () => (hasRouteList ? collectCustomStops(products, routeIds, elements) : []),
    [hasRouteList, products, routeIds, elements],
  )

  const rackStates = useMemo(() => {
    const states = new Map()
    for (const el of elements) {
      if (!isShelf(el.type)) continue
      const slug = normLabel(rackLabel(el))
      const visited = visitedIds.has(slug)
      const currentStop = orderedStops[currentIndex]
      const current = currentStop?.rackId === slug && !visited
      const inRoute = routeActive && orderedStops.some((s) => s.rackId === slug)

      if (visited) states.set(el.id, 'visited')
      else if (current) states.set(el.id, 'current')
      else if (inRoute) states.set(el.id, 'route')
      else if (highlightId) {
        const prod = products.find((p) => p.id === highlightId)
        if (prod && normLabel(prod.category) === slug) {
          states.set(el.id, 'current')
        }
      }
    }
    return states
  }, [elements, orderedStops, visitedIds, currentIndex, routeActive, highlightId, products])

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

    const front = shelfFrontApproachWorld(stop.element)
    setUserPos({ x: front.x, y: front.y })

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
      ? [activePos, ...remainingStops.map((s) => ({ x: s.element.x, y: s.element.y })), ...(kassa ? [kassa] : []), end]
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
    panRef.current = { px: e.clientX, py: e.clientY, vb, moved: false, onRack: !!onRack }
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
    setVb(
      clampView({
        ...panRef.current.vb,
        x: panRef.current.vb.x - dx * sx,
        y: panRef.current.vb.y - dy * sy,
      }),
    )
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

  return (
    <div className="flex flex-col gap-3">
      {waitingForTap && (
        <p className="rounded-xl bg-violet-50 px-3 py-2 text-center text-xs font-medium text-violet-700">
          Tap the map (not a shelf) to choose your starting point. Then along your products, checkout and exit.
        </p>
      )}

      <div className="relative w-full">
        <FloorplanRenderer
          svgRef={svgRef}
          elements={elements}
          showShelves={false}
          rackStates={rackStates}
          viewBox={vb}
          className={`aspect-[100/104] w-full touch-none rounded-2xl bg-white shadow-sm ${
            hasRouteList ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'
          }`}
          onSvgPointerDown={onSvgPointerDown}
          onSvgPointerMove={onSvgPointerMove}
          onSvgPointerUp={onSvgPointerUp}
          routePath={routeD}
          startPos={activePos}
          orderedStops={routeActive ? orderedStops : []}
          currentIndex={currentIndex}
          visitedIds={visitedIds}
        />

        <div className="absolute right-2 top-2 flex flex-col gap-1.5">
          <button type="button" onClick={() => zoomBy(0.7)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg font-bold text-slate-700 shadow-md" aria-label="Zoom in">
            +
          </button>
          <button type="button" onClick={() => zoomBy(1 / 0.7)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg font-bold text-slate-700 shadow-md" aria-label="Zoom out">
            −
          </button>
          {routeActive && (
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
        <p className="text-center text-[11px] text-slate-400">{previewStops.length} shelves · tap the map to start</p>
      )}

      {hasRouteList && !routeActive && previewStops.length === 0 && (
        <p className="rounded-xl bg-amber-50 px-3 py-2 text-center text-[11px] text-amber-800">
          No shelves on the floor plan — add fixed or temporary shelves in the editor.
        </p>
      )}
    </div>
  )
}
