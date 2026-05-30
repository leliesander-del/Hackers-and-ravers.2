import { useRef } from 'react'
import { getFloorplanType } from '../../data/floorplanTypes.js'
import FloorplanRenderer from './FloorplanRenderer.jsx'

function clientToSvg(svg, clientX, clientY) {
  const pt = svg.createSVGPoint()
  pt.x = clientX
  pt.y = clientY
  const ctm = svg.getScreenCTM()
  if (!ctm) return { x: 50, y: 50 }
  const svgPt = pt.matrixTransform(ctm.inverse())
  return {
    x: Math.max(4, Math.min(96, svgPt.x)),
    y: Math.max(4, Math.min(100, svgPt.y)),
  }
}

let idCounter = 0
function newElementId() {
  idCounter += 1
  return `el-${Date.now()}-${idCounter}`
}

const DRAG_THRESHOLD_PX = 4

export default function EditorCanvas({ elements, onChange, selectedId, onSelect, onRotate }) {
  const svgRef = useRef(null)

  function addElement(type, x, y) {
    if (!getFloorplanType(type)) return
    const el = { id: newElementId(), type, x, y, rotation: 0 }
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
    addElement(type, x, y)
  }

  function handleElementPointerDown(elId, e) {
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
      onChange((els) => els.map((el) => (el.id === elId ? { ...el, x, y } : el)))
    }

    function onUp() {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }

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
        <div className="rounded-2xl bg-white p-4 shadow-md">
          <FloorplanRenderer
            svgRef={svgRef}
            elements={elements}
            showShelves={false}
            selectedId={selectedId}
            onSelectElement={onSelect}
            onElementPointerDown={handleElementPointerDown}
            onElementDoubleClick={(elId) => onRotate?.(elId)}
            onSvgPointerDown={handleBackgroundPointerDown}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="w-full touch-none"
          />
        </div>
        <p className="mt-3 text-center text-xs text-slate-500">
          Sleep uit het palet · Klik om te selecteren · ↻ Draaien of dubbelklik · Versleep om te verplaatsen
        </p>
      </div>
    </main>
  )
}
