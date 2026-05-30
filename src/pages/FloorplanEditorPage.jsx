import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { getStore } from '../data/stores.js'
import { getFloorplanType } from '../data/floorplanTypes.js'
import { loadFloorplan, saveFloorplan } from '../lib/floorplanStorage.js'
import { normalizeElement } from '../lib/floorplanGeometry.js'
import ElementPalette from '../components/floorplan/ElementPalette.jsx'
import EditorCanvas from '../components/floorplan/EditorCanvas.jsx'
import EditorPropertiesPanel from '../components/floorplan/EditorPropertiesPanel.jsx'
import FloorplanRenderer from '../components/floorplan/FloorplanRenderer.jsx'
import { productsByStore } from '../data/products.js'

export default function FloorplanEditorPage() {
  const { activeManager, isManagerIngelogd, managerLogout } = useStore()
  const navigate = useNavigate()
  const store = activeManager ? getStore(activeManager.storeId) : null

  const [elements, setElements] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [opgeslagen, setOpgeslagen] = useState(false)
  const [toonVoorbeeld, setToonVoorbeeld] = useState(false)
  const [snapEnabled, setSnapEnabled] = useState(true)
  const geladenRef = useRef(false)

  useEffect(() => {
    if (!store || geladenRef.current) return
    const saved = loadFloorplan(store.id)
    setElements((saved?.elements || []).map(normalizeElement))
    geladenRef.current = true
  }, [store])

  useEffect(() => {
    if (!store || !geladenRef.current) return
    const saved = saveFloorplan(store.id, elements)
    if (saved) {
      setOpgeslagen(true)
      const t = setTimeout(() => setOpgeslagen(false), 1500)
      return () => clearTimeout(t)
    }
  }, [store, elements])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'r' || e.key === 'R') {
        if (!selectedId) return
        setElements((els) =>
          els.map((el) => {
            if (el.id !== selectedId) return el
            const def = getFloorplanType(el.type)
            if (!def?.rotatable) return el
            const huidig = Number(el.rotation) || 0
            return normalizeElement({ ...el, rotation: (huidig + 90) % 360 })
          }),
        )
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId])

  if (!isManagerIngelogd) return <Navigate to="/beheer/login" replace />
  if (!store) return <Navigate to="/beheer/login" replace />

  const selected = elements.find((el) => el.id === selectedId)

  function roteerElement(elId) {
    setElements((els) =>
      els.map((el) => {
        if (el.id !== elId) return el
        const def = getFloorplanType(el.type)
        if (!def?.rotatable) return el
        const huidig = Number(el.rotation) || 0
        return normalizeElement({ ...el, rotation: (huidig + 90) % 360 })
      }),
    )
  }

  function verwijder() {
    if (!selectedId) return
    setElements((els) => els.filter((el) => el.id !== selectedId))
    setSelectedId(null)
  }

  function handleLabelChange(elId, label) {
    setElements((els) => els.map((el) => (el.id === elId ? { ...el, label } : el)))
  }

  function handleSizeChange(elId, { w, h }) {
    setElements((els) =>
      els.map((el) => (el.id === elId ? normalizeElement({ ...el, w, h }) : el)),
    )
  }

  function uitloggen() {
    saveFloorplan(store.id, elements)
    managerLogout()
    navigate('/beheer/login')
  }

  return (
    <div className="beheer-layout flex flex-col bg-[#f6f4fc]">
      <header className="relative z-20 shrink-0 border-b border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="text-2xl">{store.emoji}</span>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-slate-800">Plattegrond bewerken</h1>
              <p className="truncate text-sm text-slate-500">
                {store.naam}
                {opgeslagen && <span className="ml-2 text-emerald-600">· opgeslagen</span>}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selected && getFloorplanType(selected.type)?.rotatable && (
              <button
                type="button"
                onClick={() => roteerElement(selected.id)}
                className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-700 hover:bg-violet-100"
              >
                ↻ Draaien (90°)
              </button>
            )}
            {selected && (
              <button
                type="button"
                onClick={verwijder}
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
              >
                Verwijderen
              </button>
            )}
            <button
              type="button"
              onClick={() => setToonVoorbeeld(true)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Voorbeeld
            </button>
            <button
              type="button"
              onClick={uitloggen}
              className="rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100"
            >
              Uitloggen
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <ElementPalette />
        <EditorCanvas
          elements={elements}
          onChange={setElements}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onRotate={roteerElement}
          snapEnabled={snapEnabled}
        />
        <EditorPropertiesPanel
          selected={selected}
          snapEnabled={snapEnabled}
          onSnapToggle={setSnapEnabled}
          onLabelChange={handleLabelChange}
          onSizeChange={handleSizeChange}
        />
      </div>

      {toonVoorbeeld && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-8"
          onClick={() => setToonVoorbeeld(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-[#f6f4fc] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-3 text-center text-sm font-semibold text-slate-600">
              Zo zien klanten je plattegrond (mobiel)
            </p>
            <FloorplanRenderer elements={elements} products={productsByStore(store.id)} showShelves />
            <button
              type="button"
              onClick={() => setToonVoorbeeld(false)}
              className="mt-4 w-full rounded-full bg-violet-600 py-2.5 text-sm font-semibold text-white"
            >
              Sluiten
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
