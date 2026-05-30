import { useRef } from 'react'
import { getFloorplanType } from '../../data/floorplanTypes.js'
import {
  isResizable,
  normalizeElement,
  resizeElementFromCorner,
} from '../../lib/floorplanGeometry.js'
import { snapElement } from '../../lib/floorplanSnap.js'
import FloorplanRenderer from './FloorplanRenderer.jsx'

function clientToSvg(svg, clientX, clientY) {
  const pt = svg.createSVGPoint()
  pt.x = clientX
  pt.y = clientY
  const ctm = svg.getScreenCTM()
  if (!ctm) return { x: 50, y: 50 }
  const svgPt = pt.matrixTransform(ctm.inverse())
  return { x: svgPt.x, y: svgPt.y }
}

let idCounter = 0
function newElementId() {
  idCounter += 1
  return `el-${Date.now()}-${idCounter}`
}

const DRAG_THRESHOLD_PX = 4

export default function EditorCanvas({
  elements,
  onChange,
  selectedId,
  onSelect,
  onRotate,
  snapEnabled,
}) {
  const svgRef = useRef(null)
  const resizingRef = useRef(false)

  function updateElement(elId, patch) {
    onChange((els) =>
      els.map((el) => (el.id === elId ? normalizeElement({ ...el, ...patch }) : el)),
    )
  }

  function placeElement(type, x, y) {
    if (!getFloorplanType(type)) return
    const def = getFloorplanType(type)
    const draft = normalizeElement({
      id: newElementId(),
      type,
      x,
      y,
      rotation: 0,
      w: def.defaultW,
      h: def.defaultH,
      label: type === 'vast-rek' || type === 'tijdelijk-rek' ? '' : undefined,
    })
    const snapped = snapElement(draft, x, y, elements, snapEnabled)
    const el = { ...draft, ...snapped }
    onChange((els) => [...els, el])
    onSelect(el.id)
  }

  function handleDragOver(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  function handleDrop(e) {
    e.preventDefault()
    const type = e.dataTransfer.getData('application/x-floorplan-type')
    if (!type || !svgRef.current) return
    const { x, y } = clientToSvg(svgRef.current, e.clientX, e.clientY)
    placeElement(type, x, y)
  }

  function handleElementPointerDown(elId, e) {
    if (resizingRef.current) return
    e.preventDefault()
    e.stopPropagation()
    onSelect(elId)

    const startX = e.clientX
    const startY = e.clientY
    let dragging = false

    function onMove(ev) {
      if (!svgRef.current) return
      if (!dragging) {
        const dx = ev.clientX - startX
        const dy = ev.clientY - startY
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return
        dragging = true
      }
      const { x, y } = clientToSvg(svgRef.current, ev.clientX, ev.clientY)
      onChange((els) =>
        els.map((el) => {
          if (el.id !== elId) return el
          const snapped = snapElement(el, x, y, els, snapEnabled)
          return { ...el, ...snapped }
        }),
      )
    }

    function onUp() {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  function handleResizePointerDown(elId, corner, e) {
    e.preventDefault()
    e.stopPropagation()
    onSelect(elId)
    if (!svgRef.current) return

    resizingRef.current = true

    function onMove(ev) {
      if (!svgRef.current) return
      onChange((els) => {
        const el = els.find((x) => x.id === elId)
        if (!el || !isResizable(el.type)) return els
        const { x, y } = clientToSvg(svgRef.current, ev.clientX, ev.clientY)
        const patch = resizeElementFromCorner(el, corner, x, y)
        if (!patch) return els
        return els.map((item) =>
          item.id === elId ? normalizeElement({ ...item, ...patch }) : item,
        )
      })
    }

    function onUp() {
      resizingRef.current = false
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }

    onMove(e)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  function handleBackgroundPointerDown(e) {
    if (e.target === svgRef.current || (e.target.tagName === 'rect' && e.target.getAttribute('x') === '2')) {
      onSelect(null)
    }
  }

  return (
    <main className="min-h-0 flex-1 overflow-y-auto bg-[#f6f4fc]">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-8 sm:py-8">
        <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-violet-100">
          <FloorplanRenderer
            svgRef={svgRef}
            elements={elements}
            showShelves={false}
            editorMode
            selectedId={selectedId}
            onSelectElement={onSelect}
            onElementPointerDown={handleElementPointerDown}
            onElementDoubleClick={(elId) => onRotate?.(elId)}
            onResizePointerDown={handleResizePointerDown}
            onSvgPointerDown={handleBackgroundPointerDown}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="w-full touch-none select-none"
          />
        </div>
        <p className="mt-3 text-center text-xs text-slate-500">
          Sleep · Zachte snap · Witte hoeken = uitrekken · Dubbelklik = draaien
        </p>
      </div>
    </main>
  )
}
